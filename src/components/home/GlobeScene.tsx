"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── constants ────────────────────────────────────────────────────────────────
const COUNT_FULL = 1400;
const COUNT_LITE = 880;
const COUNT_AMBIENT = 680;
const ATTRACT_DIST_SQ = 0.88 * 0.88;
const RING_R = 0.9;
const RING_CORE = 0.30;       // more particles on the ring spine
const CORE_SPREAD = 0.008;      // tighter band on the circle
const HALO_MIN = 0.03;       // closest halo distance from ring
const HALO_MAX = 0.14;       // tighter halo — more concentrated
const SPRING_K = 0.065;
const DAMPING = 0.8;
const NOISE_SPEED = 0.00026;
const NOISE_AMP = 0.04;
const PULSE_SPEED = 2.1;
const PULSE_AMP = 0.02;
const TANGENT_SPREAD = 0.14;      // less scatter along ring
const JITTER_SPREAD = 0.06;     // tighter random scatter
const DRIFT_AMP = 0.012;

// ─── tiny fast simplex-like hash noise (no external dep) ─────────────────────
function hash(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}
function noise2(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57.0);
  const b = hash(ix + 1 + iy * 57.0);
  const c = hash(ix + (iy + 1) * 57.0);
  const d = hash(ix + 1 + (iy + 1) * 57.0);
  return a + (b - a) * ux + (c - a) * uy + (d - b + a - c) * ux * uy;
}

// ─── vertex shader ────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3  aColor;
  varying   float vAlpha;
  varying   vec3  vColor;

  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (640.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

// ─── fragment shader ──────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    vec2  uv   = gl_PointCoord * 2.0 - 1.0;
    float dist = dot(uv, uv);
    if (dist > 1.0) discard;
    float core = 1.0 - smoothstep(0.15, 1.0, dist);
    float alpha = vAlpha * core;
    gl_FragColor = vec4(vColor * 1.15, alpha);
  }
`;

// ─── main particle component ──────────────────────────────────────────────────
function Particles({
  count,
  tone = "warm",
  soft = false,
}: {
  count: number;
  tone?: "warm" | "blue" | "white";
  soft?: boolean;
}) {
  const meshRef = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseVec = useMemo(() => new THREE.Vector2(), []);
  const cursorWorld = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  // ── per-particle data ──────────────────────────────────────────────────────
  const data = useMemo(() => {
    const angles = new Float32Array(count);
    const baseRadii = new Float32Array(count);
    const noiseOffset = new Float32Array(count);   // seed per particle
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const ringCore = new Uint8Array(count);
    const haloSide = new Int8Array(count);
    const haloBaseX = new Float32Array(count);
    const haloBaseY = new Float32Array(count);
    const wavePhase = new Float32Array(count);
    const ringCount = Math.floor(count * RING_CORE);

    for (let i = 0; i < count; i++) {
      const onRing = i < ringCount;
      ringCore[i] = onRing ? 1 : 0;

      let angle: number;
      let r: number;

      if (onRing) {
        angle = (i / ringCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.06;
        r = RING_R + (Math.random() - 0.5) * CORE_SPREAD;
      } else {
        angle = Math.random() * Math.PI * 2;
        haloSide[i] = Math.random() < 0.5 ? -1 : 1;
        wavePhase[i] = Math.random() * Math.PI * 2;

        const ca = Math.cos(angle);
        const sa = Math.sin(angle);
        const radial = haloSide[i] * (HALO_MIN + Math.random() * (HALO_MAX - HALO_MIN));
        const tangent = (Math.random() - 0.5) * TANGENT_SPREAD;
        const jitterX = (Math.random() - 0.5) * JITTER_SPREAD;
        const jitterY = (Math.random() - 0.5) * JITTER_SPREAD;

        const bx = RING_R * ca + ca * radial - sa * tangent + jitterX;
        const by = RING_R * sa + sa * radial + ca * tangent + jitterY;
        haloBaseX[i] = bx;
        haloBaseY[i] = by;
        r = Math.sqrt(bx * bx + by * by);
      }

      angles[i] = angle;
      baseRadii[i] = r;
      noiseOffset[i] = Math.random() * 100;

      const x = onRing ? r * Math.cos(angle) : haloBaseX[i];
      const y = onRing ? r * Math.sin(angle) : haloBaseY[i];
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = 0;

      // Slightly smaller point sprites → “thinner” particles.
      sizes[i] = onRing
        ? (soft ? 0.058 : 0.068) + Math.random() * (soft ? 0.022 : 0.028)
        : (soft ? 0.048 : 0.056) + Math.random() * (soft ? 0.028 : 0.036);
      const alphaBase = onRing
        ? 0.92 + Math.random() * 0.08
        : 0.5 + Math.random() * 0.38;
      alphas[i] = soft ? alphaBase * 0.62 : alphaBase;

      const gradT = THREE.MathUtils.clamp((y / (RING_R + HALO_MAX) + 1) * 0.5, 0, 1);
      const warmTop = [1.0, 0.43, 0.71];
      const warmBottom = [0.63, 0.25, 0.82];
      const blueTop = [0.55, 0.62, 0.92];
      const blueBottom = [0.12, 0.18, 0.48];
      const whiteTop = [1.0, 1.0, 1.0];
      const whiteBottom = [0.82, 0.86, 0.95];
      const top = tone === "blue" ? blueTop : tone === "white" ? whiteTop : warmTop;
      const bottom = tone === "blue" ? blueBottom : tone === "white" ? whiteBottom : warmBottom;
      colors[i * 3] = bottom[0] + (top[0] - bottom[0]) * gradT;
      colors[i * 3 + 1] = bottom[1] + (top[1] - bottom[1]) * gradT;
      colors[i * 3 + 2] = bottom[2] + (top[2] - bottom[2]) * gradT;
    }

    return { angles, baseRadii, noiseOffset, positions, velocities, sizes, alphas, colors, ringCore, haloSide, haloBaseX, haloBaseY, wavePhase };
  }, [count, soft, tone]);

  // ── build geometry ─────────────────────────────────────────────────────────
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(data.sizes, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(data.alphas, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));
    return geo;
  }, [data]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  }), []);

  // ── mouse tracking (canvas-local so embedded cards work) ───────────────────
  useEffect(() => {
    const canvas = gl.domElement;

    const setPointer = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      mouse.current.active = true;
    };

    const onMove = (e: MouseEvent | TouchEvent): void => {
      if ("touches" in e) {
        setPointer(e.touches[0].clientX, e.touches[0].clientY);
      } else {
        setPointer(e.clientX, e.clientY);
      }
    };
    const onLeave = (): void => { mouse.current.active = false; };

    canvas.addEventListener("mousemove", onMove as EventListener);
    canvas.addEventListener("touchmove", onMove as EventListener, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove as EventListener);
      canvas.removeEventListener("touchmove", onMove as EventListener);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [gl]);

  // ── per-frame update ───────────────────────────────────────────────────────
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    const mouseActive = mouse.current.active;
    let cursorX = 0;
    let cursorY = 0;
    if (mouseActive) {
      mouseVec.set(mouse.current.x, mouse.current.y);
      raycaster.setFromCamera(mouseVec, camera);
      raycaster.ray.intersectPlane(plane, cursorWorld);
      cursorX = cursorWorld.x;
      cursorY = cursorWorld.y;
    }

    const { angles, noiseOffset, velocities, ringCore, haloSide, haloBaseX, haloBaseY, wavePhase, baseRadii } = data;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = angles[i];
      const onRing = ringCore[i] === 1;

      let tx: number;
      let ty: number;
      let springK = SPRING_K;
      let damp = DAMPING;

      if (onRing) {
        const r = baseRadii[i];
        tx = r * Math.cos(angle);
        ty = r * Math.sin(angle);
      } else {
        const anchorX = RING_R * Math.cos(angle);
        const anchorY = RING_R * Math.sin(angle);
        let nx = haloBaseX[i] - anchorX;
        let ny = haloBaseY[i] - anchorY;
        const nlen = Math.hypot(nx, ny) || 1;
        nx /= nlen;
        ny /= nlen;
        const tangX = -ny;
        const tangY = nx;

        const wobbleR = Math.sin(t * PULSE_SPEED + wavePhase[i]) * PULSE_AMP;
        const wobbleT = Math.sin(t * PULSE_SPEED * 0.82 + wavePhase[i] * 1.6) * PULSE_AMP * 0.5;
        const driftX = (noise2(noiseOffset[i] + t * 0.55, i * 0.02) - 0.5) * DRIFT_AMP * 2;
        const driftY = (noise2(i * 0.02, noiseOffset[i] + t * 0.55) - 0.5) * DRIFT_AMP * 2;

        tx = haloBaseX[i] + nx * wobbleR + tangX * wobbleT + driftX;
        ty = haloBaseY[i] + ny * wobbleR + tangY * wobbleT + driftY;
        springK = SPRING_K * 1.2;
        damp = 0.76;
      }

      if (mouseActive) {
        const cx = arr[i3];
        const cy = arr[i3 + 1];
        const dx = cursorX - cx;
        const dy = cursorY - cy;
        const d2 = dx * dx + dy * dy;

        if (d2 < ATTRACT_DIST_SQ) {
          const d = Math.sqrt(d2);
          const strength = Math.pow(1 - d / 0.88, 2);
          if (onRing) {
            const currentR = Math.sqrt(cx * cx + cy * cy);
            const pullR = currentR + (RING_R - currentR) * strength * 1.6;
            tx = pullR * Math.cos(angle);
            ty = pullR * Math.sin(angle);
          } else {
            const ringX = RING_R * Math.cos(angle);
            const ringY = RING_R * Math.sin(angle);
            const pull = Math.min(1, strength * 1.45);
            tx += (ringX - tx) * pull;
            ty += (ringY - ty) * pull;
          }
        }
      }

      velocities[i3] = (velocities[i3] + (tx - arr[i3]) * springK) * damp;
      velocities[i3 + 1] = (velocities[i3 + 1] + (ty - arr[i3 + 1]) * springK) * damp;
      velocities[i3 + 2] = 0;

      arr[i3] += velocities[i3];
      arr[i3 + 1] += velocities[i3 + 1];
    }

    pos.needsUpdate = true;
  });

  return <points ref={meshRef} geometry={geometry} material={material} />;
}

type GlobeSceneProps = {
  className?: string;
  interactive?: boolean;
  ambient?: boolean;
  tone?: "warm" | "blue" | "white";
  transparent?: boolean;
};

const RADIAL_BG =
  "radial-gradient(ellipse 95% 85% at 50% 50%, hsla(24, 92%, 70%, 0) 0%, rgba(249, 109, 149, 0.16) 32%, rgba(153, 61, 240, 0.1) 58%, rgba(125, 31, 255, 0.04) 78%, rgba(125, 31, 255, 0) 92%)";

export default function GlobeScene({
  className = "",
  interactive = false,
  ambient = false,
  tone = "warm",
  transparent = false,
}: GlobeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const lite = interactive || ambient;
  const count = ambient ? COUNT_AMBIENT : lite ? COUNT_LITE : COUNT_FULL;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${ambient || transparent ? "" : "bg-white"} ${interactive ? "pointer-events-auto" : ""} ${className}`}
    >
      {!ambient && !transparent ? (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: RADIAL_BG }}
          aria-hidden
        />
      ) : null}
      <Canvas
        orthographic
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 10], zoom: 185, near: 0.1, far: 100 }}
        className={`relative z-[1] ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ width: "100%", height: "100%", pointerEvents: interactive ? "auto" : "none" }}
        gl={{ antialias: !lite, alpha: true, powerPreference: lite ? "low-power" : "high-performance" }}
        dpr={lite ? [1, 1.25] : [1, 1.5]}
      >
        <Particles count={count} tone={tone} soft={ambient} />
      </Canvas>
    </div>
  );
}
