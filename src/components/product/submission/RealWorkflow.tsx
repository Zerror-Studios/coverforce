"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

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
    <div
      data-workflow-card
      className="group relative flex min-h-[13rem] flex-col justify-between overflow-hidden border border-[#E9E9E9] bg-white p-4 transition-colors duration-500 ease-[cubic-bezier(0.62,0.16,0.13,1.01)] transform-3d will-change-transform hover:bg-[#CCBEFF]/10 md:min-h-[24rem] md:p-6 lg:min-h-[26rem]"
    >
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="font-heading text-2xl font-regular leading-none text-[#4F4F4F] md:text-6xl">
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
    </div>
  );
}

function SavingsSummaryCard() {
  return (
    <div
      data-workflow-card
      className="relative flex min-h-[13rem] flex-col items-end justify-end bg-[#CCBEFF]/10 p-4 transform-3d will-change-transform md:min-h-[24rem] md:p-6 lg:min-h-[26rem]"
    >
      <p className="font-heading text-2xl font-regular leading-none text-[#4F4F4F] md:text-6xl">
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
  const gridRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-workflow-card]");
      if (!cards.length) return;

      gsap.set(cards, { rotateY: 90, opacity: 0, transformOrigin: "left center" });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            rotateY: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });
    },
    { scope: gridRef },
  );

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
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
              >
                AI replaces manual insurance workflows with faster, accurate
                submission processing.
              </p>
              <Button href="/" variant="primary">
                Request Demo
              </Button>
            </div>

            <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
              <p
                className="hidden font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:block"
              >
                AI replaces manual insurance workflows with faster, accurate
                submission processing.
              </p>
            </div>
          </div>

          <div
            ref={gridRef}
            className="mt-12 grid grid-cols-2 gap-3 md:mt-14 md:gap-4 lg:mt-16 lg:grid-cols-3"
            style={{ perspective: "1200px" }}
          >
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
