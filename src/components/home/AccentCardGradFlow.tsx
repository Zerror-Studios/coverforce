"use client";

import GradFlow from "gradflow";

export const ACCENT_GRADFLOW_CONFIG = {
  color1: { r: 44, g: 51, b: 187 },
  color2: { r: 159, g: 124, b: 255 },
  color3: { r: 44, g: 51, b: 187 },
  speed: 0.5,
  scale: 0.5,
  type: "animated" as const,
  noise: 0,
};

export default function AccentCardGradFlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <GradFlow config={ACCENT_GRADFLOW_CONFIG} className="size-full" />
    </div>
  );
}
