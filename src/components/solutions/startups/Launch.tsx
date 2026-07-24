"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { CARD_ACCENT_COLORS, CARD_BACKGROUND_STYLES, CARD_UI_GRADIENT_STYLES, type CardBackground } from "@/data/wayCardStyles";

const WholesalerMock = dynamic(() => import("@/components/home/WholesalerMock"), {
  loading: () => <MockPlaceholder />,
});

const BrokerMockWithCardHover = dynamic(
  () => import("@/components/home/BrokerMock").then((m) => ({ default: m.BrokerMockWithCardHover })),
  { loading: () => <MockPlaceholder /> },
);

const StartupRecentActivityCard = dynamic(
  () => import("@/components/solutions/startups/StartupRecentActivityCard"),
  { loading: () => <MockPlaceholder /> },
);

function MockPlaceholder({ className = "max-w-[250px] sm:max-w-[290px]" }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-[240px] w-full animate-pulse rounded-2xl bg-white/10 sm:h-[280px] md:h-[260px] ${className}`}
      aria-hidden
    />
  );
}

type LaunchStep = {
  id: string;
  label: string;
  title: string;
  description: string;
  cardTagline: string;
  background: CardBackground;
  mock: ReactNode;
  backgroundScene?: ReactNode;
  mockShiftDown?: boolean;
};

const launchSteps: LaunchStep[] = [
  {
    id: "license",
    label: "STEP 01",
    title: "Get Licensed",
    description: "Secure producer and entity licenses with guided checklists.",
    cardTagline: "Grow distribution efficiently",
    background: "wholesaler",
    mockShiftDown: true,
    mock: <WholesalerMock />,
  },
  {
    id: "appointments",
    label: "STEP 02",
    title: "Access the Market",
    description: "Accelerate carrier appointments through our partner network.",
    cardTagline: "One workflow for every producer",
    background: "broker",
    mockShiftDown: true,
    mock: <BrokerMockWithCardHover />,
  },
  {
    id: "api",
    label: "STEP 03",
    title: "Connect the API",
    description: "Plug into CoverForce and start quoting in days, not months.",
    cardTagline: "Be present at the moment agents quote",
    background: "carrier",
    mockShiftDown: true,
    mock: (
      <div className="w-full max-md:mt-10 max-md:sm:mt-12">
        <StartupRecentActivityCard />
      </div>
    ),
  },
];

type LaunchPreviewCardProps = {
  step: LaunchStep;
};

function LaunchPreviewCard({ step }: LaunchPreviewCardProps) {
  return (
    <article className="launch-preview-card way-card-shell relative w-full text-white max-md:aspect-[4/5] max-md:min-h-0 [contain-intrinsic-size:auto_530px] md:min-h-[22rem] md:aspect-[580/530]">
      <div
        className="way-card-body absolute inset-0 overflow-hidden rounded-md"
        style={{ background: CARD_BACKGROUND_STYLES[step.background] }}
      >
        {step.backgroundScene ? (
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
            {step.backgroundScene}
          </div>
        ) : null}
      </div>

      <div
        className={`way-card-mock pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-5 md:p-6 ${
          step.mockShiftDown ? "max-md:pt-[5.75rem] max-md:sm:pt-24 md:pt-28 lg:pt-32" : "max-md:pt-[5.75rem] max-md:sm:pt-24"
        }`}
      >
        <div
          className={`relative mx-auto flex h-full w-full max-w-full items-center justify-center max-md:scale-[0.82] max-md:origin-top ${
            step.mockShiftDown ? "md:items-center md:justify-center" : "md:items-end md:justify-center md:pb-4"
          }`}
        >
          {step.mock}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-4 sm:p-5 md:p-8">
        <EyebrowPill surface="dark" className="mb-0">
          {step.title}
        </EyebrowPill>
        <p className="mt-4 max-w-[13rem] text-left font-heading text-lg font-medium leading-[1.12] tracking-tight text-white max-md:sm:text-xl sm:max-w-xs sm:text-3xl md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
          {step.cardTagline}
        </p>
      </div>
    </article>
  );
}

const AUTO_TAB_MS = 3000;

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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % launchSteps.length);
    }, AUTO_TAB_MS);

    return () => window.clearInterval(id);
  }, [activeStep]);

  const selectStep = (index: number) => {
    setActiveStep(index);
  };

  return (
    <section id="launch" ref={sectionRef} className="bg-white text-[#0a143b]">
      <style>{`
        .launch-preview-card.way-card-shell {
          --way-card-hover-scale: 1.03;
        }

        .launch-preview-card .way-card-body {
          transition: transform 800ms cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: translate3d(0, 0, 0) scale(1);
        }

        .launch-preview-card .way-card-mock {
          transition: none;
          transform: none;
        }

        @media (prefers-reduced-motion: no-preference) {
          @media (hover: hover) {
            .launch-preview-card.way-card-shell:hover .way-card-mock {
              transform: none;
            }
          }
        }
      `}</style>

      <Container borderColor="#53535380">
        <div ref={headerRef} className="space-y-3 py-10 lg:hidden">
          <h2
            ref={headingRef}
            className="max-w-xs text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#0a143b]"
          >
            <span data-split>From idea to first bind Three steps</span>
          </h2>
          <p
            ref={descRef}
            className="max-w-sm font-sans text-sm font-regular leading-relaxed text-[#3E3E3E]"
          >
            Launching a brokerage used to be hard. We make it easier with ready
            infrastructure and trusted partners.
          </p>
        </div>

        {/* Mobile: step → card, stacked */}
        <div className="flex flex-col gap-12 pb-10 lg:hidden">
          {launchSteps.map((step) => (
            <div key={step.id} className="flex flex-col gap-5">
              <div className="border-t border-[#E5E7EB] py-4">
                <p className="font-mono text-sm font-regular leading-relaxed text-[#151f4d]">
                  {step.label}
                </p>
                <p className="mt-1 font-sans text-sm font-regular leading-relaxed text-[#151f4d]">
                  {step.title}
                </p>
                <p className="mt-1.5 font-sans text-sm font-regular leading-relaxed text-[#6B7280]">
                  {step.description}
                </p>
              </div>

              <LaunchPreviewCard step={step} />
            </div>
          ))}
        </div>

        {/* Desktop: click tabs to switch card */}
        <div className="hidden grid-cols-7 items-stretch gap-16 py-24 xl:gap-23 lg:grid">
          <div className="flex h-full min-h-0 flex-col lg:col-span-3">
            <div className="shrink-0 space-y-5">
              <h2 className="max-w-xs text-[1.75rem] font-heading font-regular leading-tight tracking-tight text-[#0a143b]">
                <span data-split>From idea to first bind Three steps</span>
              </h2>
              <p className="max-w-sm font-sans text-sm font-regular leading-relaxed text-[#3E3E3E]">
                Launching a brokerage used to be hard. We make it easier with ready
                infrastructure and trusted partners.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Launch steps"
              aria-orientation="vertical"
              className="mt-auto flex w-full max-w-sm flex-col gap-5 pt-10"
            >
              {launchSteps.map((step, index) => {
                const isActive = activeStep === index;
                const accent = CARD_ACCENT_COLORS[step.background];
                const tabGradient = CARD_UI_GRADIENT_STYLES[step.background];

                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    id={`launch-tab-${step.id}`}
                    aria-selected={isActive}
                    aria-controls="launch-panel"
                    onClick={() => selectStep(index)}
                    className={`group flex w-full items-start gap-5 rounded-xl border px-4 py-3.5 text-left outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-transparent text-white shadow-[0_8px_24px_rgba(10,20,59,0.12)]"
                        : "border-[color:var(--tab-accent)] bg-transparent"
                    }`}
                    style={
                      {
                        ["--tab-accent" as string]: accent,
                        ...(isActive ? { background: tabGradient } : null),
                      } as CSSProperties
                    }
                  >
                    <span
                      className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[color:var(--tab-accent)] text-white"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-sans text-base leading-snug transition-colors duration-300 ${
                          isActive
                            ? "font-semibold text-white"
                            : "font-regular text-[color:var(--tab-accent)]"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span
                        className={`mt-1 block font-sans text-sm leading-relaxed transition-colors duration-300 ${
                          isActive
                            ? "text-white/80"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {step.description}
                      </span>
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
            <LaunchPreviewCard key={active.id} step={active} />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Launch;
