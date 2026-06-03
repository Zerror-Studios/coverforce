"use client";

import GradFlow from "gradflow";

export const DEVELOPER_GRADFLOW_CONFIG = {
  color1: { r: 138, g: 128, b: 221 },
  color2: { r: 172, g: 168, b: 215 },
  color3: { r: 138, g: 128, b: 221 },
  speed: 0.8,
  scale: 1,
  type: "animated" as const,
  noise: 0,
};

export default function DeveloperCardGradFlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <GradFlow config={DEVELOPER_GRADFLOW_CONFIG} className="size-full" />
    </div>
  );
}
