"use client";

import GradFlow from "gradflow";

export const LIGHT_GRADFLOW_CONFIG = {
  color1: { r: 218, g: 222, b: 245 },
  color2: { r: 248, g: 240, b: 252 },
  color3: { r: 255, g: 255, b: 255 },
  speed: 0.7,
  scale: 1,
  type: "animated" as const,
  noise: 0,
};

export default function LightCardGradFlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <GradFlow config={LIGHT_GRADFLOW_CONFIG} className="size-full" />
    </div>
  );
}
