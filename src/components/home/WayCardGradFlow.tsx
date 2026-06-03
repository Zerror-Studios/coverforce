"use client";

import dynamic from "next/dynamic";

const GradFlow = dynamic(() => import("gradflow"), { ssr: false });

export const GRADFLOW_CONFIGS = {
  accent: {
    color1: { r: 44, g: 51, b: 187 },
    color2: { r: 159, g: 124, b: 255 },
    color3: { r: 44, g: 51, b: 187 },
    speed: 0.6,
    scale: 1,
    type: "animated" as const,
    noise: 0,
  },
  light: {
    color1: { r: 218, g: 222, b: 245 },
    color2: { r: 248, g: 240, b: 252 },
    color3: { r: 255, g: 255, b: 255 },
    speed: 0.7,
    scale: 1,
    type: "animated" as const,
    noise: 0,
  },
  developer: {
    color1: { r: 138, g: 128, b: 221 },
    color2: { r: 172, g: 168, b: 215 },
    color3: { r: 138, g: 128, b: 221 },
    speed: 0.8,
    scale: 1,
    type: "animated" as const,
    noise: 0,
  },
} as const;

export type GradFlowVariant = keyof typeof GRADFLOW_CONFIGS;

type WayCardGradFlowProps = {
  variant: GradFlowVariant;
};

export default function WayCardGradFlow({ variant }: WayCardGradFlowProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <GradFlow config={GRADFLOW_CONFIGS[variant]} className="size-full" />
    </div>
  );
}
