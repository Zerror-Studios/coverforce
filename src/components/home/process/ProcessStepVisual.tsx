"use client";

import type { ProcessStep } from "@/data/processSteps";
import Image from "next/image";

const STEP_SVGS = [
  "/images/process/step1.svg",
  "/images/process/step2.svg",
  "/images/process/step3.svg",
  "/images/process/step4.svg",
  "/images/process/step5.svg",
];

function ProcessStepVideo({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full border-0 object-cover object-center outline-none"
        aria-label={label}
      />
    </div>
  );
}

/** Step 5: confetti behind, step SVG, and the animated success badge where its check sits. */
function BindStepVisual({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <Image
        src="/images/process/pop.svg"
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
        <image href="/images/process/success.gif" x="177.4" y="69.4" width="78" height="78" />
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

  return <ProcessStepVideo src={step.videoSrc} label={step.heading} />;
}
