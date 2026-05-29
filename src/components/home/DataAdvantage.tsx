import React, { type ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import Container from "../common/Container";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] ${className}`}
    >
      <span className="inline-block size-2 shrink-0 bg-[#5B35E0]" aria-hidden />
      {children}
    </p>
  );
}

type CarrierBarProps = {
  label: string;
  value: number;
};

function CarrierBar({ label, value }: CarrierBarProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-semibold tracking-wide text-white">
        {label}
      </span>
      <div className="flex flex-1 items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="w-12 shrink-0 text-right text-sm font-medium tabular-nums text-white">
          {value}%
        </span>
      </div>
    </div>
  );
}

const DataAdvantage = () => {
  return (
    <section className="bg-[#0a143b] py-16 text-white md:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-10 lg:gap-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-12">
            <div className="space-y-5">
              <Eyebrow className="text-white/70">The data advantage</Eyebrow>
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                Intelligence Built on Data no One Else has
              </h2>
            </div>

            <div className="flex flex-col gap-6 lg:items-end lg:text-right">
              <p className="max-w-md text-sm leading-relaxed text-white/75 lg:ml-auto">
                140,000+ proprietary carrier interactions. Every transaction
                makes the platform smarter.
              </p>
              <Button
                href="/"
                variant="primary"
                className="w-fit px-6 py-3 lg:ml-auto"
              >
                Explore AI
              </Button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <article className="flex min-h-[420px] flex-col justify-between rounded-2xl bg-[#E8EBF0] p-6 text-[#0a143b] md:p-8 lg:min-h-[460px] lg:p-10">
              <div className="space-y-8">
                <Eyebrow className="text-[#0a143b]/60">
                  Submission intelligence
                </Eyebrow>
                <div>
                  <p className="text-[clamp(4.5rem,12vw,7.5rem)] font-semibold leading-none tracking-tight text-[#4F63E8]">
                    95%
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#0a143b]/70">
                    Pre-fill Accuracy
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold leading-snug md:text-xl">
                  Upload an ACORD form AI reads it instantly
                </h3>
                <p className="text-sm leading-relaxed text-[#0a143b]/65">
                  Pre-fill with precision, no manual entry, no errors
                </p>
              </div>
            </article>

            <article className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8 lg:min-h-[460px] lg:p-10">
              <div className="absolute inset-0 bg-[#2a2458]" aria-hidden />
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(255,255,255,0.18),transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(91,53,224,0.45),transparent_55%),linear-gradient(135deg,#3d3568_0%,#1a2544_50%,#0a143b_100%)]"
                aria-hidden
              />
              <div
                className="absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(108deg,transparent,transparent_48px,rgba(255,255,255,0.04)_48px,rgba(255,255,255,0.04)_96px)]"
                aria-hidden
              />

              <div className="relative z-10 flex flex-col justify-between gap-10">
                <div className="space-y-5">
                  <Eyebrow className="text-white/80">Appetite intelligence</Eyebrow>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold leading-snug md:text-xl">
                      Same risk, different carriers.
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-white/75">
                      See which carriers quote which risks before you submit.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <CarrierBar label="Coalition" value={94.8} />
                  <CarrierBar label="CHUBB" value={10.4} />
                </div>
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DataAdvantage;
