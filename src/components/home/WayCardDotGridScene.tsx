"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const SPACING = 22;
const BULGE_RADIUS = 110;
const BULGE_STRENGTH = 28;
const POINT_SIZE = 3.6;
const MAX_PIXEL_RATIO = 1.25;
/** Drift speed in px/s (was 0.35px per frame at 60fps). */
const DRIFT_PX_PER_S = 21;
const DRIFT_MS = (SPACING / DRIFT_PX_PER_S) * 1000;

type WayCardDotGridSceneProps = {
  variant: "dark" | "light";
  active: boolean;
  tone?: "default" | "blueLight";
  track?: "card" | "window";
};

/*
 * Performance model
 * -----------------
 * The grid itself never changes, so it's drawn ONCE into a canvas one row
 * taller than the box. The idle drift is a CSS transform animation on that
 * canvas (runs on the compositor - zero JS, zero WebGL per frame) that loops
 * after exactly one row, so it's seamless. The vertical fade lives in the
 * root's CSS mask (globals.css), which doesn't move with the canvas.
 *
 * WebGL only re-renders while the hover bulge is animating in or out; the
 * rest of the time the GPU and main thread do nothing for this card.
 */

const vertexShader = /* glsl */ `
  uniform float uActive;
  uniform float uBulgeStrength;
  uniform float uBulgeRadius;
  uniform vec2 uMouse;
  uniform float uPointSize;

  void main() {
    vec3 pos = position;

    vec2 delta = pos.xy - uMouse;
    float dist2 = dot(delta, delta);
    float bulge = uActive * uBulgeStrength * exp(-dist2 / (uBulgeRadius * uBulgeRadius));
    vec2 dir = delta / (sqrt(dist2) + 0.001);
    pos.xy += dir * bulge * 0.42;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uPointSize;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBaseAlpha;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float dist = dot(uv, uv);
    if (dist > 1.0) discard;

    float core = 1.0 - smoothstep(0.15, 1.0, dist);
    float alpha = uBaseAlpha * core;
    if (alpha < 0.02) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function readSize(root: HTMLElement, card: Element | null) {
  const rect = root.getBoundingClientRect();
  if (rect.width > 1 && rect.height > 1) {
    return { width: rect.width, height: rect.height };
  }

  const shell = card ?? root.parentElement;
  if (!shell) return null;

  const shellRect = shell.getBoundingClientRect();
  if (shellRect.width < 1 || shellRect.height < 1) return null;

  return {
    width: shellRect.width,
    height: shellRect.height * 0.64,
  };
}

export default function WayCardDotGridScene({
  variant,
  active,
  tone = "default",
  track = "card",
}: WayCardDotGridSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const mouseRef = useRef({ x: 0.5, y: 0.72 });
  /** Set by the effect: wakes the render loop when `active` changes. */
  const wakeRef = useRef<() => void>(() => {});

  activeRef.current = active;

  useEffect(() => {
    wakeRef.current();
  }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const card = root.closest(".way-card-shell");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    root.appendChild(canvas);

    const drift = reducedMotion
      ? null
      : canvas.animate(
          [{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(0, ${SPACING}px, 0)` }],
          { duration: DRIFT_MS, iterations: Infinity, easing: "linear" },
        );

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
    camera.position.z = 1;

    const dotColor =
      variant === "dark"
        ? new THREE.Color(1, 1, 1)
        : tone === "blueLight"
          ? new THREE.Color(37 / 255, 48 / 255, 190 / 255) // #2530BE (darker brand blue)
          : new THREE.Color(91 / 255, 53 / 255, 224 / 255);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uActive: { value: 0 },
        uBulgeStrength: { value: BULGE_STRENGTH },
        uBulgeRadius: { value: BULGE_RADIUS },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPointSize: { value: POINT_SIZE * pixelRatio },
        uColor: { value: dotColor },
        uBaseAlpha: { value: variant === "dark" ? 0.55 : tone === "blueLight" ? 0.55 : 0.6 },
      },
      vertexShader,
      fragmentShader,
    });

    const geometry = new THREE.BufferGeometry();
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let width = 0;
    let height = 0;
    let displayActive = 0;
    let frame = 0;
    let inView = false;
    let pageVisible = !document.hidden;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let trackingMouse = false;

    /** Current drift offset in px (0..SPACING), read from the CSS animation. */
    const driftOffset = () => {
      const t = drift?.currentTime;
      if (typeof t !== "number") return 0;
      return ((t % DRIFT_MS) / DRIFT_MS) * SPACING;
    };

    const draw = () => {
      if (width <= 0 || height <= 0) return;
      material.uniforms.uActive.value = displayActive;
      // Mouse is in root coords; the canvas starts SPACING above the root and
      // is shifted down by the drift, so convert into canvas coords.
      material.uniforms.uMouse.value.set(
        mouseRef.current.x * width,
        mouseRef.current.y * height + SPACING - driftOffset(),
      );
      renderer.render(scene, camera);
    };

    const rebuildGrid = () => {
      const size = readSize(root, card);
      if (!size) return false;

      width = size.width;
      height = size.height;
      const canvasH = height + SPACING;

      camera.left = 0;
      camera.right = width;
      camera.top = 0;
      camera.bottom = canvasH;
      camera.updateProjectionMatrix();

      renderer.setSize(width, canvasH, false);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(canvasH / SPACING) + 1;
      const verts = new Float32Array(cols * rows * 3);
      let count = 0;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = col * SPACING + SPACING * 0.5;
          const y = row * SPACING + SPACING * 0.5;
          if (x > width || y > canvasH) continue;
          verts[count++] = x;
          verts[count++] = y;
          verts[count++] = 0;
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(verts.subarray(0, count), 3),
      );
      geometry.computeBoundingSphere();
      draw();
      return count > 0;
    };

    const scheduleRebuild = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => rebuildGrid(), 80);
    };

    const shouldRun = () => inView && pageVisible;

    // Only loops while the bulge is easing in, held, or easing out.
    const animate = () => {
      frame = 0;
      if (!shouldRun()) return;

      const target = activeRef.current ? 1 : 0;
      displayActive += (target - displayActive) * 0.1;
      const settledIdle = target === 0 && displayActive < 0.002;
      if (settledIdle) displayActive = 0;

      draw();

      if (!settledIdle) frame = requestAnimationFrame(animate);
    };

    const wake = () => {
      if (!frame && shouldRun()) frame = requestAnimationFrame(animate);
    };
    wakeRef.current = wake;

    const syncDrift = () => {
      if (!drift) return;
      if (shouldRun()) drift.play();
      else drift.pause();
    };

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = root.getBoundingClientRect();
      const w = rect.width || width;
      const h = rect.height || height;
      if (!w || !h) return;
      mouseRef.current = {
        x: (clientX - rect.left) / w,
        y: (clientY - rect.top) / h,
      };
    };

    const onMove = (event: Event) => {
      if (!(event instanceof MouseEvent)) return;
      updateMouse(event.clientX, event.clientY);
    };

    const startMouseTracking = () => {
      if (trackingMouse) return;
      trackingMouse = true;
      if (track === "window") {
        window.addEventListener("mousemove", onMove, { passive: true });
      } else {
        card?.addEventListener("mousemove", onMove, { passive: true });
      }
    };

    const stopMouseTracking = () => {
      if (!trackingMouse) return;
      trackingMouse = false;
      if (track === "window") {
        window.removeEventListener("mousemove", onMove);
      } else {
        card?.removeEventListener("mousemove", onMove);
      }
    };

    const onEnter = (event: Event) => {
      if (!(event instanceof MouseEvent)) return;
      updateMouse(event.clientX, event.clientY);
      startMouseTracking();
      wake();
    };

    const onLeave = () => {
      stopMouseTracking();
      wake();
    };

    if (track === "window") {
      startMouseTracking();
    } else {
      card?.addEventListener("mouseenter", onEnter);
      card?.addEventListener("mouseleave", onLeave);
    }

    const resizeObserver = new ResizeObserver(scheduleRebuild);
    resizeObserver.observe(root);
    if (card) resizeObserver.observe(card);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncDrift();
        if (inView) {
          rebuildGrid();
          wake();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.01 },
    );
    visibilityObserver.observe(root);

    const onPageVisibility = () => {
      pageVisible = !document.hidden;
      syncDrift();
      wake();
    };

    document.addEventListener("visibilitychange", onPageVisibility);

    const boot = () => {
      if (rebuildGrid()) return;
      requestAnimationFrame(boot);
    };

    boot();

    const refresh = () => scheduleRebuild();
    window.addEventListener("resize", refresh, { passive: true });

    return () => {
      wakeRef.current = () => {};
      window.removeEventListener("resize", refresh);
      document.removeEventListener("visibilitychange", onPageVisibility);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(frame);
      drift?.cancel();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stopMouseTracking();
      if (track !== "window") {
        card?.removeEventListener("mouseenter", onEnter);
        card?.removeEventListener("mouseleave", onLeave);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      root.removeChild(canvas);
    };
  }, [variant, track, tone]);

  return <div ref={rootRef} aria-hidden className="way-card-dot-grid-three" />;
}
