"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

const OurStory = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
  });

  useGSAP(
    () => {
      const story = storyRef.current;
      if (!story) return;

      return animateSplitTextReveal(story, {
        trigger: story,
        start: "top 88%",
        end: "bottom 45%",
        scrub: true,
        sequentialTargets: true,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="flex flex-col items-center py-20 md:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-3xl">
            <div
              ref={headerRef}
              className="flex flex-col items-start justify-end space-y-5 text-left"
            >
              <EyebrowPill surface="light" className="mb-0">
                Our Story
              </EyebrowPill>

              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Why CoverForce was founded</span>
              </h2>
            </div>

            <div ref={storyRef} className="mt-10 space-y-6 text-left md:mt-12 lg:mt-14">
              <p data-split className="text-base font-heading font-regular leading-[1.5] text-[#454545] sm:text-lg md:text-4xl md:leading-[1.12] lg:text-[1.6rem] lg:leading-[1.12]">
                CoverForce was born out of a simple observation: commercial insurance needed
                digital enablers. Despite being a trillion-dollar industry, the process of
                quoting, binding, and managing insurance policies remained slow, fragmented,
                and paper-heavy — costing agents time, limiting carriers&apos; reach, and
                frustrating business owners.
              </p>
              <p data-split className="text-base font-heading font-regular leading-[1.5] text-[#454545] sm:text-lg md:text-4xl md:leading-[1.12] lg:text-[1.6rem] lg:leading-[1.12]">
                In 2020, we saw an opportunity to reimagine the infrastructure stack of
                insurance. The vision was clear: create a single API and platform that could
                connect agents, platforms, and carriers seamlessly — making commercial
                insurance distribution as simple and instant as any modern digital transaction.
              </p>
              <p data-split className="text-base font-heading font-regular leading-[1.5] text-[#454545] sm:text-lg md:text-4xl md:leading-[1.12] lg:text-[1.6rem] lg:leading-[1.12]">
                Today, CoverForce continues to invest in building the most reliable,
                developer-friendly infrastructure for commercial insurance.
              </p>
              <p data-split className="text-base font-heading font-regular leading-[1.5] text-[#454545] sm:text-lg md:text-4xl md:leading-[1.12] lg:text-[1.6rem] lg:leading-[1.12]">
                Our mission remains the same as it was at the start: to empower carriers,
                agencies, and platforms with technology that makes insurance distribution
                effortless, scalable, and built for the future.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurStory;
