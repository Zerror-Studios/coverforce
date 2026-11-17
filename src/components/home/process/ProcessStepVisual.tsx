"use client";

import type { ProcessStep } from "@/data/processSteps";
import Image from "next/image";

// Index 4 (step 5) is drawn by BindStepVisual, which embeds STEP_SVGS[4].
const STEP_SVGS = [
  "/images/home/process-flow/step-1.svg",
  "/images/home/process-flow/step-2.svg",
  "/images/home/process-flow/step-3.svg",
  "/images/home/process-flow/step-4.svg",
  "/images/home/process-flow/step-5.svg",
];

/** Step 5: confetti behind, step SVG, and the animated success badge where its check sits. */
function BindStepVisual({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <Image
        src="/images/home/process-flow/pop.svg"
        alt=""
        fill
        className="object-cover object-center"
        aria-hidden
      />
      <svg
        viewBox="0 0 433 486"
        className="relative z-10 h-full w-full"
        role="img"
        aria-label={label}
      >
        <image href={STEP_SVGS[4]} width="433" height="486" />
        {/* Badge in step5.svg was 48px centred at (216.4, 108.4); the gif's badge
            fills ~61% of its frame, so 78px renders it at that size. */}
        <image href="/images/home/process-flow/success.gif" x="177.4" y="69.4" width="78" height="78" />
      </svg>
    </div>
  );
}

export default function ProcessStepVisual({
  step,
  stepIndex,
}: {
  step: ProcessStep;
  stepIndex: number;
}) {
  if (stepIndex === 4) return <BindStepVisual label={step.heading} />;

  const svg = STEP_SVGS[stepIndex];
  if (svg) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <img
          src={svg}
          alt={step.heading}
          draggable={false}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return null;
}
