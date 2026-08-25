"use client";

import { useRef, useState } from "react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import Button from "@/components/common/Button";
import ButtonArrowIcon from "@/components/common/ButtonArrowIcon";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { CARD_UI_GRADIENT_STYLES } from "@/data/wayCardStyles";

type LaunchStep = {
  id: string;
  label: string;
  title: string;
  description: string;
  body: string[];
  /** Colored chip fill on the dark preview card */
  pillBackground: string;
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
    pillBackground: CARD_UI_GRADIENT_STYLES.wholesaler,
  },
  {
    id: "license",
    label: "STEP 02",
    title: "Get Licensed",
    description: "Secure producer and entity licenses.",
    body: [
      "Licensing requirements vary by state - each has its own exam, application, and renewal cadence. The two main portals used by regulators across the country are NIPR and Sircon.",
    ],
    pillBackground: CARD_UI_GRADIENT_STYLES.broker,
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
    pillBackground:
      "linear-gradient(45deg, #0C7861 0%, #0D9E4F 50%, #2FE46E 100%)",
  },
  {
    id: "api",
    label: "STEP 04",
    title: "Connect the API",
    description: "Plug into CoverForce and start quoting in days, not months.",
    body: [
      "One integration gives you real-time quoting and binding across commercial lines - GL, BOP, Workers' Comp, Professional Liability, and more. Our sandbox is ready from day one.",
    ],
    pillBackground: CARD_UI_GRADIENT_STYLES.developer,
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
    pillBackground: CARD_UI_GRADIENT_STYLES.carrier,
  },
];

const CARD_BACKGROUND = "linear-gradient(135deg, #0a143b 0%, #1c2b63 100%)";
const TAB_ACCENT = "#0a143b";
/** Startup hero palette, darker green — completed checks + progress fill */
const COMPLETE_GRADIENT =
  "linear-gradient(45deg, #0C7861 0%, #0D9E4F 50%, #2FE46E 100%)";
const COMPLETE_ACCENT = "#0D9E4F";

type LaunchPreviewCardProps = {
  step: LaunchStep;
  stepIndex: number;
  stepCount: number;
  onPrevious: () => void;
  onNext: () => void;
  /** Desktop keeps previous/next + apply; mobile only shows apply on the first card. */
  footer?: "full" | "apply" | "none";
};

function LaunchPreviewCard({
  step,
  stepIndex,
  stepCount,
  onPrevious,
  onNext,
  footer = "full",
}: LaunchPreviewCardProps) {
  const canGoPrevious = stepIndex > 0;
  const canGoNext = stepIndex < stepCount - 1;

  return (
    <article className="launch-preview-card way-card-shell relative flex w-full flex-col overflow-hidden rounded-md text-white">
      <div
        className="way-card-body absolute inset-0 overflow-hidden rounded-md"
        style={{ background: CARD_BACKGROUND }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col p-6 sm:p-8 md:min-h-[28rem] md:p-10">
        <EyebrowPill
          surface="dark"
          background={step.pillBackground}
          className="mb-0"
        >
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

        {footer !== "none" ? (
          <div
            className={`mt-auto flex items-center gap-4 border-t border-white/30 pt-6 sm:pt-8 ${
              footer === "full" ? "justify-between" : "justify-end"
            }`}
          >
            {footer === "full" ? (
              <div className="flex items-center gap-3">
                {canGoPrevious ? (
                  <Button
                    type="button"
                    variant="outline"
                    surface="on-dark"
                    onClick={onPrevious}
                    icon={({ className = "" }) => (
                      <ButtonArrowIcon className={`-scale-x-100 ${className}`} />
                    )}
                  >
                    Previous
                  </Button>
                ) : null}
                {canGoNext ? (
                  <Button
                    type="button"
                    variant="outline"
                    surface="on-dark"
                    onClick={onNext}
                  >
                    Next
                  </Button>
                ) : null}
                {!canGoPrevious && !canGoNext ? <span aria-hidden /> : null}
              </div>
            ) : null}
            <Button href="/contact" surface="on-dark">
              Apply now
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="size-4"
      aria-hidden
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const LAUNCH_SECTION_TITLE = "How to Launch a Digital Brokerage";
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

  // Progress reflects how far through the flow the user has clicked -
  // completed steps + the currently active one count toward fill.
  const progressPercent = ((activeStep + 1) / launchSteps.length) * 100;

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

        .launch-progress-fill {
          transition: width 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .launch-tab-icon-inner {
          transition: background 300ms ease, color 300ms ease, transform 300ms ease;
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
              stepCount={launchSteps.length}
              onPrevious={() => selectStep(index - 1)}
              onNext={() => selectStep(index + 1)}
              footer="none"
            />
          ))}
          <div className="flex justify-start">
            <Button href="/contact">Apply now</Button>
          </div>
        </div>

        <div className="hidden grid-cols-7 items-stretch gap-16 pb-24 xl:gap-23 lg:grid">
          <div className="flex h-full min-h-0 flex-col justify-center lg:col-span-3">
            <div
              role="tablist"
              aria-label="Launch steps"
              aria-orientation="vertical"
              className="flex w-full max-w-sm flex-col gap-4"
            >
              {launchSteps.map((step, index) => {
                const isActive = activeStep === index;
                const isComplete = index < activeStep;

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
                      className={`launch-tab-icon-inner mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-sm font-medium ${isComplete
                          ? "text-white"
                          : isActive
                            ? "bg-white text-[#0a143b]"
                            : "bg-[#0a143b] text-white"
                        }`}
                      style={isComplete ? { background: COMPLETE_GRADIENT } : undefined}
                    >
                      {isComplete ? <CheckIcon /> : index + 1}
                    </span>
                    <span
                      className={`min-w-0 flex-1 font-sans text-base leading-snug transition-colors duration-300 ${isComplete
                          ? "font-medium"
                          : isActive
                            ? "font-semibold text-white"
                            : "font-regular text-[#0a143b]"
                        }`}
                      style={isComplete ? { color: COMPLETE_ACCENT } : undefined}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-[#0a143b]/10"
              role="progressbar"
              aria-valuenow={activeStep + 1}
              aria-valuemin={1}
              aria-valuemax={launchSteps.length}
              aria-label="Launch progress"
            >
              <div
                className="launch-progress-fill h-full rounded-full"
                style={{ width: `${progressPercent}%`, background: COMPLETE_GRADIENT }}
              />
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
              stepCount={launchSteps.length}
              onPrevious={() => selectStep(activeStep - 1)}
              onNext={() => selectStep(activeStep + 1)}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Launch;