"use client";

import { useRef, type CSSProperties } from "react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { ScrollTriggeredOdometerStat } from "@/components/common/AnimatedPercent";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

const STATS = [
  {
    id: "carriers-mgas",
    value: 60,
    suffix: "+",
    label: "Carrier & MGA products",
    ariaLabel: "60+ Carrier & MGA products",
  },
  {
    id: "api-products",
    value: 200,
    suffix: "+",
    label: "API capabilities",
    ariaLabel: "200+ API capabilities",
  },
  {
    id: "integrated-carriers",
    value: 5,
    suffix: "+",
    label: "CoverForce-exclusive integrations",
    ariaLabel: "5+ CoverForce-exclusive integrations",
  },
  {
    id: "integrated-products",
    value: 8,
    suffix: "",
    label: "Avg integration in weeks",
    ariaLabel: "8 Avg integration in weeks",
  },
] as const;

const VALUE_CLASS =
  "font-heading text-[1.8rem] font-semibold tracking-tight md:text-[2.6rem] lg:text-[3.1rem]";

const LABEL_CLASS =
  "flex min-h-[2.9rem] max-w-[11rem] items-start justify-center text-center font-sans text-[0.68rem] font-regular leading-relaxed md:min-h-[4.5rem] md:max-w-[12rem] md:text-lg";

const VALUE_COLOR_STYLE: CSSProperties = {
  color: "#E25E2F",
};

const LABEL_COLOR_STYLE: CSSProperties = {
  color: "#50617A",
};

function StatCell({
  stat,
  showLeftDivider,
  showRightDivider,
}: {
  stat: (typeof STATS)[number];
  showLeftDivider: boolean;
  showRightDivider: boolean;
}) {
  return (
    <div
      className={`relative flex h-full flex-col items-center justify-start gap-2 px-4 py-10 text-center md:gap-3 md:px-6 md:py-12 lg:py-14 ${showLeftDivider
          ? "before:absolute before:left-0 before:top-1/2 before:hidden before:h-[58%] before:w-px before:-translate-y-1/2 before:bg-[#D8DCE8] md:before:block"
          : ""
        } ${showRightDivider
          ? "after:absolute after:right-0 after:top-1/2 after:hidden after:h-[58%] after:w-px after:-translate-y-1/2 after:bg-[#D8DCE8] md:after:block"
          : ""
        }`}
    >
      <div
        className={`${VALUE_CLASS} flex items-baseline`}
        style={VALUE_COLOR_STYLE}
        aria-label={stat.ariaLabel}
      >
        <ScrollTriggeredOdometerStat
          value={stat.value}
          className="inline"
        />
        {stat.suffix && (
          <span className="ml-0.5 leading-none">{stat.suffix}</span>
        )}
      </div>

      <p className={LABEL_CLASS} style={LABEL_COLOR_STYLE}>
        {stat.label}
      </p>
    </div>
  );
}

const IntegrationStats = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="py-12 md:py-16 lg:py-20">
          <div
            ref={headerRef}
            className="mb-10 grid gap-8 md:mb-12 lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end">
              <EyebrowPill surface="light">Key highlights</EyebrowPill>

              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Integration scale at a glance</span>
              </h2>

              <p
                ref={descRef}
                className="max-w-lg font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
              >
                Carriers, MGAs, and API-enabled products connected through
                CoverForce - the numbers behind the platform.
              </p>
            </div>

            <p className="hidden max-w-lg font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:ml-auto lg:block lg:text-right">
              Carriers, MGAs, and API-enabled products connected through
              CoverForce - the numbers behind the platform.
            </p>
          </div>

          <div className="grid grid-cols-2 items-stretch md:grid-cols-4">
            {STATS.map((stat, index) => (
              <StatCell
                key={stat.id}
                stat={stat}
                showLeftDivider
                showRightDivider={index === STATS.length - 1}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default IntegrationStats;