"use client";

import { useRef, useState } from "react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

type LaunchStep = {
  id: string;
  label: string;
  title: string;
  description: string;
  body: string[];
};

const launchSteps: LaunchStep[] = [
  {
    id: "entity",
    label: "STEP 01",
    title: "Set Up Your Entity",
    description:
      "Form your LLC or S-Corp and get the legal foundation in place before anything else.",
    body: [
      "You'll need a registered business, an EIN, and a registered agent in each state you plan to operate in. Getting this right from day one matters - carriers and regulators will ask for documentation.",
    ],
  },
  {
    id: "license",
    label: "STEP 02",
    title: "Get Licensed",
    description: "Secure producer and entity licenses.",
    body: [
      "Licensing requirements vary by state - each has its own exam, application, and renewal cadence. The two main portals used by regulators across the country are NIPR and Sircon.",
    ],
  },
  {
    id: "market",
    label: "STEP 03",
    title: "Access the Market",
    description: "Accelerate carrier appointments through our partner network.",
    body: [
      "Carrier appointments take time to secure for a new brokerage. Our market access partners let you quote and bind through their existing appointments so you're generating revenue from day one.",
      "Startup Program members get preferred pricing from our market access partners. Start writing business on day one, not month six.",
    ],
  },
  {
    id: "api",
    label: "STEP 04",
    title: "Connect the API",
    description: "Plug into CoverForce and start quoting in days, not months.",
    body: [
      "One integration gives you real-time quoting and binding across commercial lines - GL, BOP, Workers' Comp, Professional Liability, and more. Our sandbox is ready from day one.",
    ],
  },
  {
    id: "quote",
    label: "STEP 05",
    title: "Quote Your First Risk",
    description:
      "Submit an account, get real-time comparative quotes, and bind - all in one flow.",
    body: [
      "CoverForce handles appetite matching, form prefill, and comparative quoting across carriers. Your team stays focused on the client. Your first bound policy is closer than you think.",
    ],
  },
];

// Single, consistent color treatment for every step (no more per-step colors)
const CARD_BACKGROUND = "linear-gradient(135deg, #0a143b 0%, #1c2b63 100%)";
const TAB_ACCENT = "#0a143b";

type LaunchPreviewCardProps = {
  step: LaunchStep;
  stepIndex: number;
  onPrevious: () => void;
};

function LaunchPreviewCard({ step, stepIndex, onPrevious }: LaunchPreviewCardProps) {
  return (
    <article className="launch-preview-card way-card-shell relative flex w-full flex-col overflow-hidden rounded-md text-white">
      <div
        className="way-card-body absolute inset-0 overflow-hidden rounded-md"
        style={{ background: CARD_BACKGROUND }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col p-6 sm:p-8 md:min-h-[28rem] md:p-10">
        <EyebrowPill surface="dark" className="mb-0">
          {step.title}
        </EyebrowPill>

        <p className="mt-5 max-w-xl font-heading text-xl font-medium leading-[1.2] tracking-tight text-white sm:text-2xl md:text-[1.625rem] md:leading-[1.15]">
          {step.description}
        </p>

        <div className="mt-5 space-y-4 sm:mt-6">
          {step.body.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-xl font-sans text-sm font-regular leading-[1.55] text-white/85 md:text-[0.9375rem] md:leading-[1.6]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/30 pt-6 sm:pt-8">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={onPrevious}
              className="font-sans text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              ← Previous
            </button>
          ) : (
            <span aria-hidden />
          )}
          <Button href="/contact" surface="on-dark">
            Apply now
          </Button>
        </div>
      </div>
    </article>
  );
}

const LAUNCH_SECTION_TITLE = "Steps to Launch a Digital Brokerage";
const LAUNCH_SECTION_DESCRIPTION =
  "From idea to first bind in five easy steps";

const Launch = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const active = launchSteps[activeStep]!;

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  // Auto-cycling removed intentionally - steps only advance on click,
  // since users need time to read each tile.

  const selectStep = (index: number) => {
    setActiveStep(index);
  };

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <style>{`
        .launch-preview-card.way-card-shell {
          --way-card-hover-scale: 1.02;
        }

        .launch-preview-card .way-card-body {
          transition: transform 800ms cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: translate3d(0, 0, 0) scale(1);
        }
      `}</style>

      <Container borderColor="#53535380">
        <div
          ref={headerRef}
          className="flex flex-col gap-4 pt-10 lg:pt-24 pb-10"
        >
          <h2
            ref={headingRef}
            className="max-w-xs text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#0a143b] sm:max-w-md lg:text-[1.75rem] lg:leading-tight"
          >
            <span data-split>{LAUNCH_SECTION_TITLE}</span>
          </h2>

          <div className="max-w-sm">
            <p
              ref={descRef}
              className="font-sans text-sm font-regular leading-relaxed text-[#3E3E3E]"
            >
              {LAUNCH_SECTION_DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8 pb-10 lg:hidden">
          {launchSteps.map((step, index) => (
            <LaunchPreviewCard
              key={step.id}
              step={step}
              stepIndex={index}
              onPrevious={() => selectStep(index - 1)}
            />
          ))}
        </div>

        <div className="hidden grid-cols-7 items-stretch gap-16 pb-24 xl:gap-23 lg:grid">
          <div className="flex h-full min-h-0 lg:col-span-3">
            <div
              role="tablist"
              aria-label="Launch steps"
              aria-orientation="vertical"
              className="flex h-full w-full max-w-sm flex-col justify-center gap-4"
            >
              {launchSteps.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    id={`launch-tab-${step.id}`}
                    aria-selected={isActive}
                    aria-controls="launch-panel"
                    onClick={() => selectStep(index)}
                    className={`group flex w-full items-center gap-5 rounded-xl border px-4 py-3.5 text-left outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 ${isActive
                        ? "border-transparent text-white shadow-[0_8px_24px_rgba(10,20,59,0.12)]"
                        : "border-[#0a143b]/25 bg-transparent"
                      }`}
                    style={isActive ? { background: TAB_ACCENT } : undefined}
                  >
                    <span
                      className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-sm font-medium transition-all duration-300 ${isActive
                          ? "bg-white text-[#0a143b]"
                          : "bg-[#0a143b] text-white"
                        }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`min-w-0 flex-1 font-sans text-base leading-snug transition-colors duration-300 ${isActive
                          ? "font-semibold text-white"
                          : "font-regular text-[#0a143b]"
                        }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id="launch-panel"
            aria-labelledby={`launch-tab-${active.id}`}
            className="flex h-full min-h-0 w-full flex-col lg:col-span-4"
          >
            <LaunchPreviewCard
              key={active.id}
              step={active}
              stepIndex={activeStep}
              onPrevious={() => selectStep(activeStep - 1)}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Launch;