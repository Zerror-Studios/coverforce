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
const HALO_MAX = 0.14;       // tighter halo - more concentrated
const SPRING_K = 0.065;
const DAMPING = 0.8;
const NOISE_SPEED = 0.00026;
const NOISE_AMP = 0.04;
const PULSE_SPEED = 2.1;
const PULSE_AMP = 0.02;
const TANGENT_SPREAD = 0.14;      // less scatter along ring
const JITTER_SPREAD = 0.06;     // tighter random scatter
const DRIFT_AMP = 0.012;

/** Idle frame rate; full rate while the cursor is interacting. */
const IDLE_FPS = 30;

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
  running,
}: {
  count: number;
  tone?: "warm" | "blue" | "white";
  soft?: boolean;
  /** Drive frames only while on screen. */
  running: boolean;
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
    // Per-particle constants, precomputed once instead of every frame.
    const cosA = new Float32Array(count);
    const sinA = new Float32Array(count);
    const restX = new Float32Array(count);   // ring: point on ring; halo: base
    const restY = new Float32Array(count);
    const normX = new Float32Array(count);   // halo: unit offset from ring anchor
    const normY = new Float32Array(count);
    const driftFx = new Float32Array(count); // halo: drift frequencies
    const driftFy = new Float32Array(count);
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
      cosA[i] = Math.cos(angle);
      sinA[i] = Math.sin(angle);
      if (onRing) {
        restX[i] = r * cosA[i];
        restY[i] = r * sinA[i];
      } else {
        restX[i] = haloBaseX[i];
        restY[i] = haloBaseY[i];
        const nx = haloBaseX[i] - RING_R * cosA[i];
        const ny = haloBaseY[i] - RING_R * sinA[i];
        const nlen = Math.hypot(nx, ny) || 1;
        normX[i] = nx / nlen;
        normY[i] = ny / nlen;
        // Derived from the particle seed (already random) - no extra RNG.
        driftFx[i] = 0.35 + (noiseOffset[i] % 1) * 0.4;
        driftFy[i] = 0.35 + ((noiseOffset[i] * 7.31) % 1) * 0.4;
      }

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

    return { angles, baseRadii, noiseOffset, positions, velocities, sizes, alphas, colors, ringCore, haloSide, haloBaseX, haloBaseY, wavePhase, cosA, sinA, restX, restY, normX, normY, driftFx, driftFy };
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

  // ── frame pacing: 30fps idle, full rate while the cursor interacts ───────
  const invalidate = useThree((st) => st.invalidate);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const minGap = mouse.current.active ? 0 : 1000 / IDLE_FPS - 2;
      if (now - last < minGap) return;
      last = now;
      invalidate();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, invalidate]);

  // ── per-frame update ───────────────────────────────────────────────────────
  useFrame((state, delta) => {
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

    // The spring was tuned per 60fps frame; at 30fps run two steps so the
    // motion keeps the same speed and feel.
    const steps = Math.min(3, Math.max(1, Math.round(delta * 60)));

    const { velocities, ringCore, wavePhase, noiseOffset, cosA, sinA, restX, restY, normX, normY, driftFx, driftFy } = data;
    const wobbleTime = t * PULSE_SPEED;
    const driftTime = t * 0.55;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const onRing = ringCore[i] === 1;

      let tx = restX[i];
      let ty = restY[i];
      let springK = SPRING_K;
      let damp = DAMPING;

      if (!onRing) {
        const nx = normX[i];
        const ny = normY[i];
        const phase = wavePhase[i];
        const wobbleR = Math.sin(wobbleTime + phase) * PULSE_AMP;
        const wobbleT = Math.sin(wobbleTime * 0.82 + phase * 1.6) * PULSE_AMP * 0.5;
        const seed = noiseOffset[i];
        const driftX = Math.sin(driftTime * driftFx[i] + seed) * DRIFT_AMP;
        const driftY = Math.sin(driftTime * driftFy[i] + seed * 1.7) * DRIFT_AMP;

        tx += nx * wobbleR - ny * wobbleT + driftX;
        ty += ny * wobbleR + nx * wobbleT + driftY;
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
          const k = 1 - Math.sqrt(d2) / 0.88;
          const strength = k * k;
          if (onRing) {
            const currentR = Math.sqrt(cx * cx + cy * cy);
            const pullR = currentR + (RING_R - currentR) * strength * 1.6;
            tx = pullR * cosA[i];
            ty = pullR * sinA[i];
          } else {
            const pull = Math.min(1, strength * 1.45);
            tx += (RING_R * cosA[i] - tx) * pull;
            ty += (RING_R * sinA[i] - ty) * pull;
          }
        }
      }

      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let px = arr[i3];
      let py = arr[i3 + 1];
      for (let step = 0; step < steps; step++) {
        vx = (vx + (tx - px) * springK) * damp;
        vy = (vy + (ty - py) * springK) * damp;
        px += vx;
        py += vy;
      }
      velocities[i3] = vx;
      velocities[i3 + 1] = vy;
      arr[i3] = px;
      arr[i3 + 1] = py;
    }

    pos.needsUpdate = true;
  });

  return <points ref={meshRef} geometry={geometry} material={material} />;
}

/** Base zoom = ring size on a full desktop card; smaller containers scale down. */
const BASE_ZOOM = 185;
/** Ring diameter as a share of the container's shorter side (~1.8 world units). */
const ZOOM_PER_PX = 0.42;

function ResponsiveZoom() {
  const camera = useThree((st) => st.camera);
  const size = useThree((st) => st.size);
  const invalidate = useThree((st) => st.invalidate);
  useEffect(() => {
    const zoom = Math.min(BASE_ZOOM, Math.min(size.width, size.height) * ZOOM_PER_PX);
    if (Math.abs(camera.zoom - zoom) < 0.5) return;
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  return null;
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
        // Frames are requested by Particles' own pacer (30fps idle).
        frameloop={visible ? "demand" : "never"}
        camera={{ position: [0, 0, 10], zoom: BASE_ZOOM, near: 0.1, far: 100 }}
        className={`relative z-[1] ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ width: "100%", height: "100%", pointerEvents: interactive ? "auto" : "none" }}
        gl={{ antialias: !lite, alpha: true, powerPreference: lite ? "low-power" : "high-performance" }}
        dpr={lite ? 1 : [1, 1.5]}
      >
        <ResponsiveZoom />
        <Particles count={count} tone={tone} soft={ambient} running={visible} />
      </Canvas>
    </div>
  );
}
