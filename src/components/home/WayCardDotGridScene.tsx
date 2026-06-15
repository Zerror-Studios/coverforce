"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const SPACING = 22;
const BULGE_RADIUS = 110;
const BULGE_STRENGTH = 28;
const POINT_SIZE = 3.6;
const MAX_PIXEL_RATIO = 1.25;

type WayCardDotGridSceneProps = {
  variant: "dark" | "light";
  active: boolean;
};

const vertexShader = /* glsl */ `
  uniform float uActive;
  uniform float uDrift;
  uniform float uBulgeStrength;
  uniform float uBulgeRadius;
  uniform vec2 uMouse;
  uniform float uHeight;
  uniform float uPointSize;

  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.y += uDrift;

    vec2 delta = pos.xy - uMouse;
    float dist2 = dot(delta, delta);
    float bulge = uActive * uBulgeStrength * exp(-dist2 / (uBulgeRadius * uBulgeRadius));
    vec2 dir = delta / (sqrt(dist2) + 0.001);
    pos.xy += dir * bulge * 0.42;

    float fade = smoothstep(0.0, uHeight * 0.32, pos.y);
    vAlpha = max(fade, 0.35);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uPointSize;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBaseAlpha;

  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float dist = dot(uv, uv);
    if (dist > 1.0) discard;

    float core = 1.0 - smoothstep(0.15, 1.0, dist);
    float alpha = uBaseAlpha * vAlpha * core;
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
}: WayCardDotGridSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const mouseRef = useRef({ x: 0.5, y: 0.72 });

  activeRef.current = active;

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
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    root.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
    camera.position.z = 1;

    const dotColor =
      variant === "dark"
        ? new THREE.Color(1, 1, 1)
        : new THREE.Color(91 / 255, 53 / 255, 224 / 255);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uActive: { value: 0 },
        uDrift: { value: 0 },
        uBulgeStrength: { value: BULGE_STRENGTH },
        uBulgeRadius: { value: BULGE_RADIUS },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHeight: { value: 1 },
        uPointSize: { value: POINT_SIZE },
        uColor: { value: dotColor },
        uBaseAlpha: { value: variant === "dark" ? 0.55 : 0.6 },
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
    let drift = 0;
    let frame = 0;
    let inView = false;
    let pageVisible = !document.hidden;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let trackingMouse = false;

    const rebuildGrid = () => {
      const size = readSize(root, card);
      if (!size) return false;

      width = size.width;
      height = size.height;

      camera.left = 0;
      camera.right = width;
      camera.top = 0;
      camera.bottom = height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      material.uniforms.uHeight.value = height;
      material.uniforms.uPointSize.value = POINT_SIZE * pixelRatio;
      material.uniforms.uMouse.value.set(
        mouseRef.current.x * width,
        mouseRef.current.y * height,
      );

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const verts = new Float32Array(cols * rows * 3);
      let count = 0;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = col * SPACING + SPACING * 0.5;
          const y = row * SPACING + SPACING * 0.5;
          if (x > width || y > height) continue;
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
      return count > 0;
    };

    const scheduleRebuild = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => rebuildGrid(), 80);
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
      card?.addEventListener("mousemove", onMove, { passive: true });
    };

    const stopMouseTracking = () => {
      if (!trackingMouse) return;
      trackingMouse = false;
      card?.removeEventListener("mousemove", onMove);
    };

    const onEnter = (event: Event) => {
      if (!(event instanceof MouseEvent)) return;
      updateMouse(event.clientX, event.clientY);
      startMouseTracking();
      rebuildGrid();
    };

    const onLeave = () => {
      stopMouseTracking();
    };

    card?.addEventListener("mouseenter", onEnter);
    card?.addEventListener("mouseleave", onLeave);

    const resizeObserver = new ResizeObserver(scheduleRebuild);
    resizeObserver.observe(root);
    if (card) resizeObserver.observe(card);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          rebuildGrid();
          if (!frame) frame = requestAnimationFrame(animate);
        }
      },
      { rootMargin: "120px 0px", threshold: 0.01 },
    );
    visibilityObserver.observe(root);

    const onPageVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && inView && !frame) {
        frame = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", onPageVisibility);

    const boot = () => {
      if (rebuildGrid()) return;
      requestAnimationFrame(boot);
    };

    boot();
    requestAnimationFrame(() => rebuildGrid());

    const shouldRun = () => inView && pageVisible;

    const animate = () => {
      frame = 0;

      if (!shouldRun()) return;

      const target = activeRef.current ? 1 : 0;
      displayActive += (target - displayActive) * 0.1;

      if (!reducedMotion) {
        drift = (drift + 0.35) % SPACING;
      } else {
        drift = 0;
      }

      material.uniforms.uActive.value = displayActive;
      material.uniforms.uDrift.value = drift;

      if (width > 0 && height > 0) {
        material.uniforms.uMouse.value.set(
          mouseRef.current.x * width,
          mouseRef.current.y * height,
        );
        renderer.render(scene, camera);
      }

      frame = requestAnimationFrame(animate);
    };

    if (shouldRun()) {
      frame = requestAnimationFrame(animate);
    }

    const refresh = () => scheduleRebuild();
    window.addEventListener("resize", refresh, { passive: true });

    return () => {
      window.removeEventListener("resize", refresh);
      document.removeEventListener("visibilitychange", onPageVisibility);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stopMouseTracking();
      card?.removeEventListener("mouseenter", onEnter);
      card?.removeEventListener("mouseleave", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      root.removeChild(renderer.domElement);
    };
  }, [variant]);

  return <div ref={rootRef} aria-hidden className="way-card-dot-grid-three" />;
}
