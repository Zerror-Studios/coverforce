"use client";

import { useRef } from "react";

import Container from "../common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

const DistributionFlow = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

  return (
    <section ref={sectionRef} className="bg-white">
      <Container borderColor="#53535380">
        <div className="relative z-10 pt-16 md:pt-20 lg:pt-24">
          <div
            ref={headerRef}
            className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-between"
          >
            <div className="max-w-md">
              <h2
                ref={headingRef}
                className="mt-3 text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:mt-5 md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Built to streamline</span>
                <br />
                <span data-split>commercial insurance workflows</span>
              </h2>
              <p
                ref={descRef}
                className="mt-4 max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
              >
                Upload emails and documents to instantly extract insurance-ready
                data with AI.
              </p>
            </div>
            <p
              className="hidden max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:block lg:mt-4"
            >
              Upload emails and documents to instantly extract insurance-ready
              data with AI.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DistributionFlow;
