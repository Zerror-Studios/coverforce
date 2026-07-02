"use client";

import { useRef } from "react";
import Image from "next/image";
import AnimatedCarrierBars from "@/components/common/AnimatedCarrierBar";
import AnimatedPercent from "@/components/common/AnimatedPercent";
import Button from "@/components/common/Button";
import Container from "../common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

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
                className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#9AA8BC] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Intelligence Built on Data</span>
                <br />
                <span data-split>no One Else has</span>
              </h2>
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-white/80 md:text-[1.125rem] lg:hidden"
              >
                140,000+ proprietary carrier interactions. Every transaction
                makes the platform smarter.
              </p>
              <Button href="/" surface="on-dark">
                Explore AI
              </Button>
            </div>

            <div className="max-w-md text-left lg:ml-auto">
              <p
                className="hidden font-sans font-regular text-sm leading-[1.4] text-white/80 md:text-[1.125rem] lg:block"
              >
                140,000+ proprietary carrier interactions. Every transaction
                makes the platform smarter.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <article
              className="relative flex aspect-[556/586] w-full flex-col justify-between overflow-hidden rounded-sm p-6 text-[#0a143b] md:p-8 lg:p-10"
              style={{ backgroundColor: "#FFFFFFCC" }}
            >
              <div className="pointer-events-none absolute -translate-y-1/5 left-1/2 z-0 h-[150%] w-[150%] -translate-x-1/2 md:-top-24 lg:-top-28">
                <Image
                  src="/images/secondcardbg.svg"
                  alt=""
                  fill
                  className="h-full w-full object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  aria-hidden
                />
              </div>

              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between">
                <div className="space-y-8">
                  <div>
                    <AnimatedPercent className="text-5xl font-heading font-medium leading-none tracking-tight text-[#121C49]" />
                    <p className="mt-2 text-lg font-heading font-medium text-[#525252]">
                      Pre-fill Accuracy
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="max-w-xs text-lg font-heading font-medium md:text-2xl">
                    Upload an ACORD form AI reads it instantly
                  </h3>
                  <p className="text-sm font-sans font-regular leading-relaxed text-[#525252]">
                    Pre-fill with precision, no manual entry, no errors
                  </p>
                </div>
              </div>
            </article>

            <article className="relative flex aspect-[556/586] w-full flex-col justify-between overflow-hidden rounded-sm p-6 md:p-8 lg:p-10">
              <video
                src="/carrier.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover object-center"
                aria-hidden
              />
              <div className="absolute inset-0 bg-[#141E4B]/20" aria-hidden />

              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between gap-10">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="max-w-xs text-3xl font-heading font-medium md:text-3xl">
                      Same risk, <br /> different carriers.
                    </h3>
                    <p className="max-w-[18rem] text-sm font-sans font-regular leading-relaxed text-[#FFFFFF]">
                      See which carriers quote which risks before you submit.
                    </p>
                  </div>
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
