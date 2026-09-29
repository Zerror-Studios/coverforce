"use client";

import type { ProcessStep } from "@/data/processSteps";
import dynamic from "next/dynamic";

const AcordStepVisual = dynamic(() => import("./AcordStepVisual"), {
  ssr: false,
  loading: () => <StepVisualPlaceholder />,
});
const ApplicationStepVisual = dynamic(() => import("./ApplicationStepVisual"), {
  ssr: false,
  loading: () => <StepVisualPlaceholder />,
});
const NaicsStepVisual = dynamic(() => import("./NaicsStepVisual"), {
  ssr: false,
  loading: () => <StepVisualPlaceholder />,
});
const CompareQuotesStepVisual = dynamic(() => import("./CompareQuotesStepVisual"), {
  ssr: false,
  loading: () => <StepVisualPlaceholder />,
});
const BindStepVisual = dynamic(() => import("./BindStepVisual"), {
  ssr: false,
  loading: () => <StepVisualPlaceholder />,
});

function StepVisualPlaceholder() {
  return (
    <div
      className="h-full w-full animate-pulse rounded-xl bg-[#E8ECF0]/60"
      aria-hidden
    />
  );
}

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

export default function ProcessStepVisual({
  step,
  stepIndex,
}: {
  step: ProcessStep;
  stepIndex: number;
}) {
  if (stepIndex === 0) return <AcordStepVisual />;
  if (stepIndex === 1) return <ApplicationStepVisual />;
  if (stepIndex === 2) return <NaicsStepVisual />;
  if (stepIndex === 3) return <CompareQuotesStepVisual />;
  if (stepIndex === 4) return <BindStepVisual />;

  return <ProcessStepVideo src={step.videoSrc} label={step.heading} />;
}
