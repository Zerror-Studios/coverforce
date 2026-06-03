import React, { type ReactNode } from "react";
import Image from "next/image";

import Container from "../common/Container";
import { BrokerMockWithCardHover } from "./BrokerMock";
import DeveloperMock from "./DeveloperMock";
import WholesalerMock from "./WholesalerMock";
type WayCardProps = {
  label: string;
  tagline: string;
  taglinePosition?: "left" | "right";
  variant: "dark" | "light";
  children: ReactNode;
  className?: string;
  wide?: boolean;
  accent?: boolean;
  cardBg?: string;
  cardBgImage?: string;
};

function CardBottomStrip({ label, tagline }: { label: string; tagline: string }) {
  return (
    <div
      className="-mx-5  -mb-5 mt-auto flex items-center justify-between gap-4 border-t border-[#E8E0F5]/60 px-4 py-3 md:-mx-6 md:-mb-6 md:px-5 md:py-3.5"
      style={{ background: "linear-gradient(90deg, #F8F3FF 0%, #F1F1FF 100%)" }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#797979]" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#797979]">{label}</span>
      </div>
      <p className="shrink-0 text-right text-lg font-heading font-medium leading-tight tracking-tight text-[#545353] max-w-[12rem]">{tagline}</p>
    </div>
  );
}

function WayCard({ label, tagline, taglinePosition = "right", variant, children, className = "", wide = false, accent = false, cardBg, cardBgImage }: WayCardProps) {
  const isDark = variant === "dark";
  const isLightText = accent || (isDark && !cardBg);

  return (
    <article
      className={`relative flex w-full flex-col overflow-hidden rounded-sm p-5 md:p-6 ${wide ? "aspect-[1179/530]" : "aspect-[580/530]"} ${cardBg ? "text-[#0a143b]" : accent ? "bg-[#9F7CFF] text-white" : isDark ? "bg-gradient-to-br from-[#5B35E0] via-[#4a2d9e] to-[#3d2878] text-white" : "bg-gradient-to-br from-[#EDE8F8] via-[#F5F3FA] to-white text-[#0a143b]"} ${className}`}
      style={cardBg ? { backgroundColor: cardBg } : undefined}
    >
      {cardBgImage && (
        <div className="pointer-events-none absolute -translate-y-1/5 left-1/2 z-0 h-[150%] w-[150%] -translate-x-1/2 md:-top-24 lg:-top-28">
          <Image src={cardBgImage} alt="" fill className="object-cover object-center w-full h-full" sizes="(max-width: 768px) 100vw, 50vw" aria-hidden />
        </div>
      )}
      {accent && (
        <span className="pointer-events-none absolute -left-8 -top-2 z-0 aspect-square w-[200%] rounded-full bg-[#2C33BB] md:-left-12 md:-top-4 blur-3xl" aria-hidden />
      )}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className={`flex items-start gap-4 ${cardBgImage ? "justify-end" : "justify-between"}`}>
          {!cardBgImage && (
            <p className="flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#FFFFFF]">
            <span className="inline-block size-2 shrink-0 rounded-full bg-[#FFFFFF]" aria-hidden />
            {label}
          </p>
          )}
          <span className="cursor-pointer flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#8E68F9]">
            <Image src="/images/expandicon.svg" alt="" width={20} height={20} className="size-5" aria-hidden />
          </span>
        </div>
        <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center py-2">
          {children}
        </div>
        {cardBgImage ? (
          <CardBottomStrip label={label} tagline={tagline} />
        ) : (
          <div className={`flex items-center  w-full ${taglinePosition === "left" ? "justify-start" : "justify-end"}`}>
            <p className={`text-lg font-heading font-medium leading-tight tracking-tight text-[#545353] ${taglinePosition === "left" ? "max-w-xs" : "max-w-[12rem]"}  ${taglinePosition === "left" ? "text-left" : "text-right"} text-white`}>
              {tagline}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

const ThreeWays = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <Container borderColor="#0A143B1A">
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-10 xl:gap-14">
            <div className="space-y-5 md:space-y-6">
              <p className="flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#797979]">
                <span className="inline-block size-2 shrink-0 rounded-full bg-[#797979]" aria-hidden />
                Built for your role
              </p>
              <h2 className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-3xl lg:leading-[1.1]">
                One platform.<br />Three Ways to Use It.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#091843BF] md:text-sm lg:pt-8 xl:pt-10">
              Whether you&apos;re routing submissions, quoting carriers, or building on our API, CoverForce adapts to your role.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:mt-14">
            <WayCard label="Wholesalers" tagline="Grow distribution efficiently" variant="dark" accent>
              <WholesalerMock />
            </WayCard>

            <WayCard label="Brokers" tagline="One workflow for every producer" variant="light" cardBg="#FFFFFFCC" cardBgImage="/images/secondcardbg.svg">
              <BrokerMockWithCardHover />
            </WayCard>

            <WayCard label="Developers" tagline="Build insurance products on Coverforce APIs" taglinePosition="left" variant="dark" wide cardBg="#8A80DDAB" className="md:col-span-2">
              <DeveloperMock />
            </WayCard>

            <WayCard label="Startups" tagline="One workflow for every producer" variant="light" cardBg="#FFFFFFCC" cardBgImage="/images/secondcardbg.svg">
              <BrokerMockWithCardHover />
            </WayCard>

            <WayCard label="Carriers" tagline="Grow distribution efficiently" variant="dark" accent>
              <WholesalerMock />
            </WayCard>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ThreeWays;