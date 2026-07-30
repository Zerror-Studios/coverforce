"use client";

import { useRef } from "react";
import AnimatedCarrierBars from "@/components/common/AnimatedCarrierBar";
import { AnimatedEightyFivePercent } from "@/components/common/AnimatedPercent";
import Button from "@/components/common/Button";
import Container from "../common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { CARD_BACKGROUND_STYLES } from "@/data/wayCardStyles";

const DataAdvantage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef, theme: "dark" });

  return (
    <section ref={sectionRef} className="z-20 bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33">
        <div className="flex flex-col gap-10 py-16 md:py-20 lg:gap-14 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end space-y-5">
              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Intelligence built on data</span>
                <br />
                <span data-split>no one else has</span>
              </h2>
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-white/80 md:text-[1.125rem] lg:hidden"
              >
                Market intelligence and rich underwriting data - now visible so
                every placement, remarket, and service touch gets smarter.
              </p>
              <Button href="/product/intelligence#coming-soon" surface="on-dark">
                Explore AI
              </Button>
            </div>

            <div className="max-w-md text-left lg:ml-auto">
              <p className="hidden font-sans font-regular text-sm leading-[1.4] text-white/80 md:text-[1.125rem] lg:block">
                Market intelligence and rich underwriting data - now visible so
                every placement, remarket, and service touch gets smarter.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6 md:items-stretch">
            {/* Underwriting data retention */}
            <article
              className="relative flex min-h-[28rem] w-full flex-col overflow-hidden rounded-sm text-white md:min-h-[36rem] lg:min-h-[37rem]"
              style={{ background: CARD_BACKGROUND_STYLES.wholesaler }}
            >
              <div className="relative z-10 flex flex-1 flex-col justify-between gap-8 p-6 md:p-8 lg:p-10">
                <div className="space-y-2">
                  <AnimatedEightyFivePercent className="text-6xl font-heading font-medium leading-none tracking-tight text-white md:text-7xl" />
                  <p className="text-base font-heading font-medium text-white/80 md:text-lg">
                    Faster remarket &amp; service
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="max-w-sm text-lg font-heading font-medium md:text-2xl">
                    Retain underwriting data to streamline policy remarket and service
                  </h3>
                  <p className="max-w-sm text-sm font-sans font-regular leading-relaxed text-white/80">
                    Keep rich underwriting history with every account - so renewals, remarkets, and service run up to 85% faster.
                  </p>
                </div>
              </div>
            </article>

            {/* Placement / decline intelligence - keep RHS video */}
            <article className="relative flex min-h-[28rem] w-full flex-col justify-between overflow-hidden rounded-sm p-6 md:min-h-[36rem] md:p-8 lg:min-h-[37rem] lg:p-10">
              <video
                src="/carrier.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover object-center"
                aria-hidden
              />
              <div className="absolute inset-0 bg-[#141E4B]/35" aria-hidden />

              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between gap-10">
                <div className="space-y-2">
                  <h3 className="max-w-xs text-3xl font-heading font-medium md:text-3xl">
                    Know where to place - and who&apos;s declining you.
                  </h3>
                  <p className="max-w-[18rem] text-sm font-sans font-regular leading-relaxed text-white">
                    See which carriers will quote a risk before you submit - and which ones will decline.
                  </p>
                </div>

                <AnimatedCarrierBars />
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DataAdvantage;
