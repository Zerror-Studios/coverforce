"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";

type ButtonTextProps = {
  children: React.ReactNode;
  textClip: string;
  textLine: string;
  hovered: boolean;
};

const TOTAL_MS    = 650;
const WAVE_HALF   = 0.28;  // wave radius in normalized [0..1] pixel-space
const BLUR_MAX    = 2.0;
const OPACITY_MIN = 0.20;
const SCALE_MIN   = 0.85;

function bellCurve(dist: number): number {
  if (dist >= WAVE_HALF) return 0;
  const t = dist / WAVE_HALF;
  return Math.pow(1 - t * t, 2);
}

// Measure each char's center-x normalized to [0..1] across total text width
function measureOffsets(chars: HTMLSpanElement[]): number[] {
  const rects = chars.map((c) => c.getBoundingClientRect());
  const left  = rects[0].left;
  const right  = rects[rects.length - 1].right;
  const total = right - left;
  return rects.map((r) => (r.left + r.width / 2 - left) / total);
}

function clearChar(c: HTMLSpanElement) {
  c.style.scale   = "";
  c.style.filter  = "";
  c.style.opacity = "";
}

const ButtonText = ({ children, textClip, textLine, hovered }: ButtonTextProps) => {
  const textRef    = useRef<HTMLSpanElement>(null);
  const charsRef   = useRef<HTMLSpanElement[]>([]);
  const offsetsRef = useRef<number[] | null>(null); // pixel-based, measured lazily
  const rafRef     = useRef<number | null>(null);
  const text = typeof children === "string" ? children : String(children);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    el.innerHTML = "";
    offsetsRef.current = null; // reset on text change

    charsRef.current = [...text].map((ch) => {
      const span = document.createElement("span");
      span.style.display         = "inline-block";
      span.style.transformOrigin = "center center";
      span.style.willChange      = "transform, filter, opacity";
      // CSS handles scale easing — JS only sets the value
      span.style.transition      = "scale 0.15s cubic-bezier(0.4, 0, 0.2, 1)";
      span.textContent = ch === " " ? "\u00A0" : ch;
      el.appendChild(span);
      return span;
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  useEffect(() => {
    const chars = charsRef.current;
    if (!chars.length) return;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

    if (!hovered) {
      chars.forEach(clearChar);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Measure real pixel positions once, reuse after
    if (!offsetsRef.current) {
      offsetsRef.current = measureOffsets(chars);
    }
    const offsets = offsetsRef.current;

    const start      = performance.now();
    // front sweeps from 0-WAVE_HALF → 1+WAVE_HALF (low→high offset = left→right)
    const frontStart = 0.0 - WAVE_HALF;
    const frontEnd   = 1.0 + WAVE_HALF;

    function frame(now: number) {
      const t     = Math.min((now - start) / TOTAL_MS, 1);
      const front = frontStart + (frontEnd - frontStart) * t;

      chars.forEach((char, i) => {
        const dist = Math.abs(front - offsets[i]);
        const d    = bellCurve(dist);

        char.style.scale   = d > 0.005 ? (1 - (1 - SCALE_MIN) * d).toFixed(4) : "";
        char.style.filter  = d > 0.01  ? `blur(${(BLUR_MAX * d).toFixed(3)}px)` : "";
        char.style.opacity = d > 0.005 ? (1 - (1 - OPACITY_MIN) * d).toFixed(4) : "";
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        chars.forEach(clearChar);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [hovered]);

  return (
    <span className={`block overflow-hidden ${textClip}`}>
      <span ref={textRef} className={`block whitespace-nowrap ${textLine}`}>
        {text}
      </span>
    </span>
  );
};

export default ButtonText;