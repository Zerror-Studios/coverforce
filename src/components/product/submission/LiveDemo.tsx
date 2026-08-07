"use client";

import { useRef } from "react";
import Container from "@/components/common/Container";
import GenieEffect from "@/components/genie-effect";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

const LiveDemo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  return (
    <section ref={sectionRef} className="bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33">
        <div className="relative border-b border-[#FFFFFF33] py-16 md:py-20 lg:py-24">
          <div className="relative z-10 flex flex-col gap-12 md:gap-14 lg:gap-16">
            <div
              ref={headerRef}
              className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
            >
              <div className="flex flex-col justify-end space-y-5">
                <h2
                  ref={headingRef}
                  className="max-w-md text-2xl font-heading font-regular leading-[1.15] tracking-tight text-white sm:text-3xl sm:leading-tight md:text-4xl lg:text-3xl lg:leading-[1.15]"
                >
                  <span data-split>
                    CoverForce doc <br /> reader
                  </span>
                </h2>
              </div>

              <div className="flex max-w-md flex-col items-start justify-end gap-6 text-left lg:ml-auto">
                <p
                  ref={descRef}
                  className="font-sans font-regular text-sm leading-[1.4] text-[#D1D1D1] md:text-[1.125rem]"
                >
                  Click any sample document below and watch CoverForce extract and
                  structure every field in real time.
                </p>
              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <GenieEffect />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LiveDemo;
