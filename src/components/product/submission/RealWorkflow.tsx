"use client";

import { useRef } from "react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Document Intake",
    before: "50 MIN",
    after: "8 sec",
  },
  {
    step: "02",
    title: "Carrier data entry",
    before: "15 MIN",
    after: "3 mins",
  },
  {
    step: "03",
    title: "Review & Submit",
    before: "HOURS",
    after: "~3mins",
  },
  {
    step: "04",
    title: "Quoting",
    before: "45 MIN",
    after: "4 sec",
  },
  {
    step: "05",
    title: "Bind and Deliver",
    before: "5 MIN",
    after: "1 min",
  },
] as const;

function WorkflowStepCard({
  step,
  title,
  before,
  after,
}: (typeof WORKFLOW_STEPS)[number]) {
  return (
    <div className="relative flex min-h-[22rem] flex-col justify-between border border-[#E9E9E9] bg-white p-5 md:min-h-[24rem] md:p-6 lg:min-h-[26rem]">
      <div className="flex items-start justify-between gap-4">
        <span className="font-heading text-3xl font-regular leading-none text-[#4F4F4F] md:text-6xl">
          {step}
        </span>
        <div className="text-right">
          <p className="font-mono text-[0.65rem] font-medium text-[#9A9A9A] line-through md:text-sm">
            {before}
          </p>
          <p className="mt-0.5 font-heading text-sm font-medium text-[#2D3E9D] md:text-lg">
            {after}
          </p>
        </div>
      </div>
      <p className="font-heading text-sm font-medium text-[#2D3E9D] md:text-lg">
        {title}
      </p>
    </div>
  );
}

function SavingsSummaryCard() {
  return (
    <div className="relative flex min-h-[22rem] flex-col items-end justify-end bg-[#CCBEFF]/10 p-5 md:min-h-[24rem] md:p-6 lg:min-h-[26rem]">
      <p className="font-heading text-3xl font-regular leading-none text-[#4F4F4F] md:text-6xl">
        107m
      </p>
      <p className="mt-2 font-heading text-[0.65rem] font-normal text-[#4F4F4F] md:text-xs">
        Saved per submission
      </p>
    </div>
  );
}

const RealWorkflow = () => {
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
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end space-y-5">
              <h2
                ref={headingRef}
                className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Move From </span>
                <span data-split className="text-[#5B35E0]">
                  115 Minutes
                </span>
                <span data-split> to </span>
                <span data-split className="text-[#5B35E0]">
                  8 Minutes
                </span>
              </h2>
              <Button href="/" variant="primary">
                Request Demo
              </Button>
            </div>

            <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                AI replaces manual insurance workflows with faster, accurate
                submission processing.
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:mt-16 lg:grid-cols-3">
            {WORKFLOW_STEPS.map((item) => (
              <WorkflowStepCard key={item.step} {...item} />
            ))}
            <SavingsSummaryCard />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RealWorkflow;
