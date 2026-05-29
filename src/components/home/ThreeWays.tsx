import React, { type ReactNode } from "react";

import {
  RiFilter3Line,
  RiBarChartGroupedLine,
  RiCodeBoxLine,
  RiRocketLine,
  RiBuilding4Line,
} from "@remixicon/react";
import Container from "../common/Container";
type WayCardProps = {
  label: string;
  tagline: string;
  taglinePosition?: "left" | "right";
  variant: "dark" | "light";
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

function WayCard({
  label,
  tagline,
  taglinePosition = "right",
  variant,
  icon,
  children,
  className = "",
}: WayCardProps) {
  const isDark = variant === "dark";

  return (
    <article
      className={`relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl p-5 md:min-h-[360px] md:p-6 lg:min-h-[400px] ${
        isDark
          ? "bg-gradient-to-br from-[#5B35E0] via-[#4a2d9e] to-[#3d2878] text-white"
          : "bg-gradient-to-br from-[#EDE8F8] via-[#F5F3FA] to-white text-[#0a143b]"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
            isDark ? "text-white/80" : "text-[#0a143b]/60"
          }`}
        >
          {label}
        </span>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
            isDark ? "bg-white/15 text-white" : "bg-white text-[#5B35E0] shadow-sm"
          }`}
        >
          {icon}
        </span>
      </div>

      <div className="relative mt-4 flex flex-1 items-center justify-center py-4">
        {children}
      </div>

      <p
        className={`mt-auto text-sm font-semibold leading-snug md:text-base ${
          taglinePosition === "left" ? "text-left" : "text-right"
        } ${isDark ? "text-white" : "text-[#0a143b]"}`}
      >
        {tagline}
      </p>
    </article>
  );
}

function WholesalerMock() {
  return (
    <div className="w-full max-w-[280px] space-y-3">
      <div className="rounded-xl bg-white p-4 text-[#0a143b] shadow-lg">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Active (2)
        </p>
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-500">ACTID 23</span>
            <span className="font-medium">In review</span>
          </div>
          <div className="flex justify-between">
            <span>Gross Premium</span>
            <span className="font-semibold">$1,200,000</span>
          </div>
          <div className="flex justify-between">
            <span>Net Premium</span>
            <span className="font-semibold">$925,000</span>
          </div>
        </div>
      </div>
      <div className="ml-8 rounded-lg bg-white/90 px-3 py-2 text-[10px] text-[#0a143b] shadow-md">
        New submission received
      </div>
    </div>
  );
}

function BrokerMock() {
  return (
    <div className="w-full max-w-[260px] rounded-xl bg-white p-5 text-[#0a143b] shadow-lg">
      <p className="text-xs font-semibold text-neutral-500">Broker Workflow</p>
      <p className="mt-2 text-2xl font-semibold">60% faster quotes</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full w-[60%] rounded-full bg-[#5B35E0]" />
      </div>
      <div className="mt-6 flex items-end gap-1">
        {[40, 65, 45, 80, 55, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-[#5B35E0]/80"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
      <p className="mt-2 text-right text-xs font-medium text-neutral-500">
        40+ carriers
      </p>
    </div>
  );
}

function DeveloperMock() {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-5 text-[#0a143b] shadow-xl md:max-w-lg md:p-6">
      <p className="text-sm font-semibold">Developers</p>
      <p className="text-xs text-neutral-500">Built with Coverforce API</p>
      <div className="mt-4 flex gap-2">
        {["All", "Integration", "Testing"].map((tab, i) => (
          <span
            key={tab}
            className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wide ${
              i === 1
                ? "bg-[#5B35E0] text-white"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>
      <ul className="mt-5 space-y-3 text-sm">
        {[
          "API Key Generated",
          "Sandbox Connected",
          "Test Quote Successful",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0"
          >
            <span>{item}</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
              Done
            </span>
          </li>
        ))}
      </ul>
    </div>  
  );
}

const ThreeWays = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-[#C4D4F8]/50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 size-[500px] rounded-full bg-[#E8D4F8]/60 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#5B35E0]/20 to-transparent"
        aria-hidden
      />

      <Container>
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
            <div className="space-y-5 md:space-y-6">
              <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#797979]">
                <span
                  className="inline-block size-2 shrink-0 rounded-full bg-[#797979]"
                  aria-hidden
                />
                Built for your role
              </p>
              <h2 className="max-w-xl text-3xl font-semibold leading-[1.12] tracking-tight text-[#0a143b] md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                One platform.
                <br />
                Three Ways to Use It.
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#0a143b]/70 md:text-lg lg:pt-8 xl:pt-10">
              Whether you&apos;re routing submissions, quoting carriers, or
              building on our API, CoverForce adapts to your role.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:mt-14">
            <WayCard
              label="Wholesalers"
              tagline="Grow distribution efficiently"
              variant="dark"
              icon={<RiFilter3Line className="size-5" />}
            >
              <WholesalerMock />
            </WayCard>

            <WayCard
              label="Brokers"
              tagline="One workflow for every producer"
              variant="light"
              icon={<RiBarChartGroupedLine className="size-5" />}
            >
              <BrokerMock />
            </WayCard>

            <WayCard
              label="Developers"
              tagline="Build insurance products on Coverforce APIs"
              taglinePosition="left"
              variant="dark"
              icon={<RiCodeBoxLine className="size-5" />}
              className="md:col-span-2"
            >
              <DeveloperMock />
            </WayCard>

            <WayCard
              label="Startups"
              tagline="One workflow for every producer"
              variant="light"
              icon={<RiRocketLine className="size-5" />}
            >
              <BrokerMock />
            </WayCard>

            <WayCard
              label="Carriers"
              tagline="Grow distribution efficiently"
              variant="dark"
              icon={<RiBuilding4Line className="size-5" />}
            >
              <WholesalerMock />
            </WayCard>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ThreeWays;
