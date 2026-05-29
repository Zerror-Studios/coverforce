import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

type CarrierResult = {
  id: string;
  brand: React.ReactNode;
  title: string;
  description: string;
};

const carrierResults: CarrierResult[] = [
  {
    id: "employers",
    brand: (
      <span className="text-base font-black tracking-[0.18em] text-white md:text-lg">
        EMPLOYERS
      </span>
    ),
    title: "0% Error Rate",
    description:
      "Only integration partner to achieve 0% API error rate on submission data.",
  },
  {
    id: "nationwide",
    brand: (
      <span className="text-base font-bold tracking-wide text-white md:text-lg">
        NATIONWIDE
      </span>
    ),
    title: "Live in 12 Weeks",
    description:
      "BOP integration: under 12 weeks, less than 10 hours carrier eng time.",
  },
  {
    id: "chubb",
    brand: (
      <span className="text-lg font-light tracking-[0.32em] text-white md:text-xl">
        CHUBB
      </span>
    ),
    title: "Trust & Quality",
    description:
      "Submission quality → first wholesale partner appointed in 2+ years.",
  },
  {
    id: "liberty",
    brand: (
      <div className="flex items-center gap-2 text-white">
        <span className="flex size-8 items-center justify-center rounded-full border border-white/80 text-[10px] font-bold">
          LM
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Liberty Mutual</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">
            Insurance
          </span>
        </div>
      </div>
    ),
    title: "5-Point Bind Advantage",
    description:
      "Only integration partner to achieve 0% API error rate on submission data.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
      <span className="inline-block size-2 shrink-0 bg-[#5B35E0]" aria-hidden />
      {children}
    </p>
  );
}

function CarrierCard({ result }: { result: CarrierResult }) {
  return (
    <article className="flex flex-col gap-10 lg:gap-12 lg:px-8 xl:px-10 first:lg:pl-0 last:lg:pr-0">
      <div className="min-h-[3rem]">{result.brand}</div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white md:text-2xl">
          {result.title}
        </h3>
        <p className="max-w-[240px] text-sm leading-relaxed text-white/55">
          {result.description}
        </p>
      </div>
    </article>
  );
}

const CarrierResults = () => {
  return (
    <section className="bg-[#0a143b] text-white">
      <Container>
        <div className="relative py-16 md:py-20 lg:py-24">
          {/* Wave — 130% width, anchored left top inside container */}
          <div
            className="pointer-events-none absolute left-0 top-0 z-0 h-[min(55vw,420px)] w-[130%] md:h-[min(50vw,480px)] lg:h-[520px]"
            aria-hidden
          >
            <Image
              src="/carrier-results-wave.svg"
              alt=""
              fill
              sizes="130vw"
              className="object-contain object-left-top"
            />
          </div>

          <div className="relative z-10 flex flex-col">
            {/* Header */}
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
              <div className="space-y-5 lg:max-w-xl">
                <Eyebrow>Named carrier results</Eyebrow>
                <h2 className="text-3xl font-semibold leading-[1.12] tracking-tight md:text-4xl lg:text-[2.75rem]">
                  Carrier results that speak for themselves
                </h2>
              </div>

              <div className="flex flex-col gap-6 lg:items-end lg:text-right">
                <p className="max-w-md text-sm leading-relaxed text-white/70 lg:ml-auto">
                  Named outcomes provide clear, organized quote comparisons from
                  appointed carriers, helping agents from production carrier
                  partnerships.
                </p>
                <Button
                  href="/"
                  variant="primary"
                  className="w-fit px-6 py-3 lg:ml-auto"
                >
                  Explore Carrier
                </Button>
              </div>
            </div>

            {/* Spacer so wave sits between header and stats */}
            <div className="h-[min(28vw,200px)] md:h-[min(24vw,240px)] lg:h-[280px]" />

            {/* Carrier columns */}
            <div className="grid gap-14 border-t border-white/10 pt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/15 lg:pt-16">
              {carrierResults.map((result) => (
                <CarrierCard key={result.id} result={result} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CarrierResults;
