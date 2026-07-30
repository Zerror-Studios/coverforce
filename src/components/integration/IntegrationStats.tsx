"use client";

import { useRef } from "react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { ScrollTriggeredOdometerStat } from "@/components/common/AnimatedPercent";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

const STATS = [
  {
    id: "carriers-mgas",
    value: 61,
    label: "Carriers & MGAs",
    ariaLabel: "61 carriers and MGAs",
  },
  {
    id: "api-products",
    value: 190,
    label: "API Enabled Products",
    ariaLabel: "190 API enabled products",
  },
  {
    id: "integrated-carriers",
    value: 42,
    label: "CoverForce Integrated Carriers & MGAs",
    ariaLabel: "42 CoverForce integrated carriers and MGAs",
  },
  {
    id: "integrated-products",
    value: 46,
    label: "Products Integrated with CoverForce",
    ariaLabel: "46 products integrated with CoverForce",
  },
] as const;

const VALUE_CLASS =
  "text-4xl font-heading font-medium tracking-tight text-[#111110] md:text-5xl lg:text-[3.25rem]";

function StatCell({
  stat,
  showDivider,
}: {
  stat: (typeof STATS)[number];
  showDivider: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center px-4 py-10 text-center md:px-6 md:py-12 lg:py-14 ${
        showDivider
          ? "before:absolute before:left-0 before:top-1/2 before:hidden before:h-[58%] before:w-px before:-translate-y-1/2 before:bg-[#D8DCE8] md:before:block"
          : ""
      }`}
    >
      <div className="flex min-h-[3.25rem] items-end justify-center md:min-h-[3.75rem]">
        <ScrollTriggeredOdometerStat
          value={stat.value}
          className={VALUE_CLASS}
          ariaLabel={stat.ariaLabel}
        />
      </div>

      <p className="mt-3 max-w-[11rem] text-sm font-sans font-regular leading-snug text-[#6B7280] md:mt-4 md:max-w-[12rem] md:text-[0.9375rem]">
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

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

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
                className="max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
              >
                Carriers, MGAs, and API-enabled products connected through
                CoverForce - the numbers behind the platform.
              </p>
            </div>
            <p className="hidden max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:ml-auto lg:block lg:text-right">
              Carriers, MGAs, and API-enabled products connected through
              CoverForce - the numbers behind the platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, index) => (
              <StatCell key={stat.id} stat={stat} showDivider={index > 0} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default IntegrationStats;
