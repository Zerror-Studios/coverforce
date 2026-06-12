"use client";

import { useRef } from "react";

import Container from "../common/Container";
import Button from "../common/Button";
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
          <div ref={headerRef} className="flex justify-between">
            <div>
              <h2
                ref={headingRef}
                className="mt-5 text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Built to streamline</span>
                <br />
                <span data-split>commercial insurance workflows</span>
              </h2>
              <Button
                href="/"
                variant="primary"
                className="!bg-[#0032C9] text-white mt-6"
              >
                start a quote
              </Button>
            </div>
            <p
              ref={descRef}
              className="mt-4 max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
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
