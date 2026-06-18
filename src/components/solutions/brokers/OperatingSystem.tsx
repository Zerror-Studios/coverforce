"use client";

import { useRef } from "react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

type OperatingRow = {
  id: string;
  heading: string;
  description: string;
  stat: string;
  statLabelLines: [string, string];
};

const operatingRows: OperatingRow[] = [
  {
    id: "platform",
    heading: "One Platform for Every Carrier, Every Office",
    description:
      "One workflow for every producer — 40+ carrier integrations, dynamic carrier questions, no portal logins, no rekeying, and no office-by-office workflow gaps.",
    stat: "40+",
    statLabelLines: ["Carriers,", "One Workflow"],
  },
  {
    id: "ai",
    heading: "AI That Raises the Floor for Every Producer",
    description:
      "CoverForce gives every producer your best producers' carrier intelligence — with AI extraction, appetite matching, UW question assistance, and on-demand COI generation in one workflow.",
    stat: "95%",
    statLabelLines: ["Extraction", "Accuracy"],
  },
  {
    id: "visibility",
    heading: "See Everything Across the Firm",
    description:
      "Real-time dashboards show submission volume, quote rates, bind rates, and premium by office, producer, carrier, and LOB — so you know what's moving, where deals stall, and which carriers perform.",
    stat: "100%",
    statLabelLines: ["Pipeline", "Visibility"],
  },
];

const OperatingSystem = () => {
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
    <section ref={sectionRef} className="min-h-screen bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12 mb-12"
          >
            <div className="flex flex-col justify-end space-y-5">
              <h2
                ref={headingRef}
                className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Precision engineering for
                  professional workflow
                </span>
              </h2>
              <Button href="/" variant="outline">
                Start a quote
              </Button>
            </div>

            <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                See how manual workflows compare to CoverForce — from smart intake
                through bind, in one connected platform built for every producer.
              </p>
            </div>
          </div>

          {operatingRows.map((row) => (
            <div
              key={row.id}
              className="py-24 grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
            >
              <div className="flex flex-col justify-center">
                <h3 className="max-w-lg text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#444444] md:text-3xl lg:max-w-md lg:text-[1.75rem] lg:leading-[1.25]">
                  {row.heading}
                </h3>
                <p className="mt-8 max-w-sm font-heading text-sm font-regular leading-relaxed text-[#444444] md:mt-6 md:text-sm">
                  {row.description}
                </p>
                <div className="mt-10 flex items-center gap-4 md:mt-8 md:gap-5">
                  <span className="text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#33259F] md:text-3xl lg:text-[1.75rem] lg:leading-[1.25]">
                    {row.stat}
                  </span>
                  <span className="font-heading text-sm font-medium leading-[1.2] text-[#33259F] md:text-xs">
                    {row.statLabelLines[0]}
                    <br />
                    {row.statLabelLines[1]}
                  </span>
                </div>
              </div>

              <div />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default OperatingSystem;
