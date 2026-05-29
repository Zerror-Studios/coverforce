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
      <span className="inline-block size-2 shrink-0 bg-[#5B35E0]" aria-hidden />
      {children}
    </p>
  );
}

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a143b] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#2d4a9e_0%,#1a2f6e_35%,#0a143b_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15)_0%,transparent_8%),radial-gradient(circle_at_80%_60%,rgba(91,53,224,0.2)_0%,transparent_12%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08)_0%,transparent_6%)]"
        aria-hidden
      />

      <Container>
        <div className="relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-between py-16 md:min-h-[calc(100svh-5rem)] md:py-20 lg:py-24">
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
