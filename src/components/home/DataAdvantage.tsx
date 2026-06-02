import React, { type ReactNode } from "react";
import Image from "next/image";
import AnimatedCarrierBars from "@/components/common/AnimatedCarrierBar";
import AnimatedPercent from "@/components/common/AnimatedPercent";
import Button from "@/components/common/Button";
import Container from "../common/Container";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  dotClassName?: string;
};

function Eyebrow({
  children,
  className = "",
  dotClassName = "bg-linear-to-r from-[#FFFFFF] to-[#AFB3EF]",
}: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] ${className}`}
    >
      <span
        className={`inline-block size-2 shrink-0 rounded-full ${dotClassName}`}
        aria-hidden
      />
      {children}
    </p>
  );
}

const DataAdvantage = () => {
  return (
    <section className="bg-[#141E4B] text-white">
      <Container borderColor="#FFFFFF1A">
        <div className="flex flex-col gap-10 lg:gap-14 py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-12">
            <div className="flex flex-col justify-end space-y-5">
              <Eyebrow className="text-[#FFFFFF80]">The data advantage</Eyebrow>
              <h2 className="max-w-md text-3xl font-heading font-regular leading-tight tracking-tight md:text-4xl lg:text-3xl lg:leading-[1.15]">
                Intelligence Built on Data no One Else has
              </h2>
            </div>

            <div className="flex max-w-sm flex-col items-start justify-end gap-6 text-left lg:ml-auto">
              <p className="text-sm font-sans font-regular leading-relaxed text-white/80">
                140,000+ proprietary carrier interactions. Every transaction
                makes the platform smarter.
              </p>
              <Button
                href="/"
                variant="primary"
              >
                Explore AI
              </Button>
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
                  <Eyebrow
                    className="text-[#525252]"
                    dotClassName="bg-[#525252]"
                  >
                    Submission intelligence
                  </Eyebrow>
                  <div>
                    <AnimatedPercent className="text-5xl font-heading font-medium leading-none tracking-tight text-[#4F63E8]" />
                    <p className="mt-2 text-lg font-heading font-medium text-[#525252]">
                      Pre-fill Accuracy
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-medium md:text-2xl max-w-xs">
                    Upload an ACORD form AI reads it instantly
                  </h3>
                  <p className="text-sm font-sans font-regular leading-relaxed text-[#525252]">
                    Pre-fill with precision, no manual entry, no errors
                  </p>
                </div>
              </div>
            </article>

            <article className="relative flex aspect-[556/586] w-full flex-col justify-between overflow-hidden rounded-sm p-6 md:p-8 lg:p-10">
              <Image
                src="/images/cardbg.png"
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-[#141E4B]/20"
                aria-hidden
              />

              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between gap-10">
                <div className="space-y-5">
                  <Eyebrow className="text-white/80">Appetite intelligence</Eyebrow>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-heading font-medium md:text-3xl max-w-xs">
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
