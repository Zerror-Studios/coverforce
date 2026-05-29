import React from "react";
import Button from "@/components/common/Button";
import Container from "../common/Container";

type StatItem = {
  value: string;
  label: string;
};

const stats: StatItem[] = [
  { value: "140K+", label: "AI-labeled Carrier Interactions" },
  { value: "40+", label: "Carrier & MGA Integrations" },
  { value: "15,000+", label: "Agencies on Platform" },
  { value: "$500M+", label: "Gross Quoted Premium" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
      <span className="inline-block size-2 shrink-0 bg-linear-to-r from-[#FFFFFF] to-[#AFB3EF] rounded-full" aria-hidden />
      {children}
    </p>
  );
}

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#141E4B] text-white">

      <Container borderColor="#FFFFFF1A">
        <div className="relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-between py-16 md:py-20 lg:py-24">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Eyebrow>The AI distribution flow</Eyebrow>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
              AI-Native Insurance Distribution Platform
            </h1>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Button href="/" variant="primary">
                Request demo
              </Button>
              <Button href="/" variant="secondary">
                Start a quote
              </Button>
            </div>
          </div>

          <div className="mt-16 border-t border-white/15 pt-10 md:mt-20 md:pt-12">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:flex md:divide-x md:divide-white/15">
              {stats.map((stat) => (
                <li
                  key={stat.label}
                  className="flex flex-col gap-2 md:flex-1 md:px-8 lg:px-10 first:md:pl-0 last:md:pr-0"
                >
                  <p className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-xs leading-relaxed text-white/55 md:text-sm">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
