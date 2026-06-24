"use client";

import { useRef } from "react";
import Image from "next/image";
import Container from "@/components/common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
type PricingWorkCard = {
  id: string;
  label: string;
  variant: "usage" | "split-dark" | "split-light";
  headline?: string;
  footerText?: string;
  imageSrc?: string;
  bottomSrc?: string;
};

const CARDS: PricingWorkCard[] = [
  {
    id: "usage",
    label: "Usage based",
    variant: "usage",
    footerText: "Pricing that grows with your volume.",
    imageSrc: "/images/pricing/flower.svg",
  },
  {
    id: "unlimited-users",
    label: "Unlimited users",
    variant: "split-dark",
    headline: "Add your whole team without per-seat fees.",
    bottomSrc: "/images/pricing/pricing2.gif",
  },
  {
    id: "aligned-incentives",
    label: "Aligned incentives",
    variant: "split-light",
    headline: "We grow when you grow.",
    bottomSrc: "/images/pricing/pricing3.jpeg",
  },
];

const CARD_HEIGHT = "min-h-[28rem] md:min-h-[29rem]";
const CARD_PADDING = "p-6 md:p-8";
const CARD_BOTTOM_HEIGHT = "min-h-[13rem] md:min-h-[18rem]";

function CardLabel({
  children,
  tone = "light",
}: {
  children: string;
  tone?: "light" | "dark" | "neutral";
}) {
  const toneClass =
    tone === "light"
      ? "text-white"
      : tone === "dark"
        ? "text-[#3B35A6]"
        : "text-[#2A2A2A]";

  return (
    <p
      className={`font-mono text-sm font-medium uppercase tracking-[0.14em] ${toneClass}`}
    >
      {children}
    </p>
  );
}

function UsageCard({ card }: { card: PricingWorkCard }) {
  return (
    <article
      className={`relative flex ${CARD_HEIGHT} flex-col overflow-hidden rounded-md bg-white/[0.06] ${CARD_PADDING} backdrop-blur-sm`}
    >
      <CardLabel>{card.label}</CardLabel>

      {card.imageSrc ? (
        <Image
          src={card.imageSrc}
          alt=""
          width={480}
          height={480}
          className="pointer-events-none absolute top-0 right-0 h-auto w-[82%] max-w-none object-contain object-right-bottom md:w-[78%]"
        />
      ) : null}

      {card.footerText ? (
        <p className="relative z-10 mt-auto font-heading text-sm font-medium leading-snug text-white md:text-2xl">
          {card.footerText}
        </p>
      ) : null}
    </article>
  );
}

function SplitDarkCard({ card }: { card: PricingWorkCard }) {
  return (
    <article className={`relative flex ${CARD_HEIGHT} flex-col overflow-hidden rounded-md`}>
      <div className={`flex min-h-0 flex-1 flex-col bg-white ${CARD_PADDING}`}>
        <CardLabel tone="dark">{card.label}</CardLabel>
        {card.headline ? (
          <h3 className="mt-auto font-heading text-xl font-medium leading-[1.15] tracking-tight text-[#372DA3] md:text-2xl">
            {card.headline}
          </h3>
        ) : null}
      </div>

      <div className={`relative ${CARD_BOTTOM_HEIGHT} bg-[linear-gradient(180deg,#1A1F5C_0%,#121C49_42%,#050816_100%)]`}>
        {card.bottomSrc ? (
          <Image
            src={card.bottomSrc}
            alt=""
            fill
            unoptimized={card.bottomSrc.endsWith(".gif")}
            className="object-cover object-center"
          />
        ) : null}
      </div>
    </article>
  );
}

function SplitLightCard({ card }: { card: PricingWorkCard }) {
  return (
    <article className={`relative flex ${CARD_HEIGHT} flex-col overflow-hidden rounded-md`}>
      <div className={`flex min-h-0 flex-1 flex-col bg-white ${CARD_PADDING}`}>
        <CardLabel tone="neutral">{card.label}</CardLabel>
        {card.headline ? (
          <h3 className="mt-auto max-w-[12rem] font-heading text-xl font-medium leading-[1.15] tracking-tight text-[#2A2A2A] md:text-2xl">
            {card.headline}
          </h3>
        ) : null}
      </div>

      <div className={`relative ${CARD_BOTTOM_HEIGHT} overflow-hidden bg-[#ECEEF2]`}>
        {card.bottomSrc ? (
          <Image
            src={card.bottomSrc}
            alt=""
            fill
            unoptimized={card.bottomSrc.endsWith(".gif")}
            className="object-cover object-center"
          />
        ) : null}
      </div>
    </article>
  );
}

function PricingWorkCard({ card }: { card: PricingWorkCard }) {
  if (card.variant === "usage") return <UsageCard card={card} />;
  if (card.variant === "split-dark") return <SplitDarkCard card={card} />;
  return <SplitLightCard card={card} />;
}

const HowPricingWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#121C49] text-white">      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, rgba(49, 78, 155, 0.5) 0%, rgba(18, 28, 73, 0.94) 55%, #121C49 100%)",
        }}
        aria-hidden
      />

      {/* Decorative diagonal swoosh pattern, top-right of section */}
      <svg
        className="pointer-events-none absolute -right-[10%] top-0 h-[60%] w-[70%] opacity-[0.07] md:opacity-[0.09]"
        viewBox="0 0 800 600"
        fill="none"
        preserveAspectRatio="xMaxYMin slice"
        aria-hidden
      >
        <path
          d="M -50 380 C 150 280, 280 480, 480 320 C 620 200, 700 260, 850 120"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M -50 440 C 170 340, 300 540, 500 380 C 640 260, 720 320, 870 180"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M -50 320 C 130 220, 260 420, 460 260 C 600 140, 680 200, 830 60"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M -50 500 C 190 400, 320 600, 520 440 C 660 320, 740 380, 890 240"
          stroke="white"
          strokeWidth="1"
        />
      </svg>

      <Container borderColor="#FFFFFF33" className="relative z-10">
        <div className="flex flex-col gap-10 py-16 md:py-20 lg:gap-14 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col items-start justify-end space-y-5">
              <h2
                ref={headingRef}
                className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#9AA8BC] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Scales with you not</span>
                <br />
                <span data-split>against you</span>
              </h2>
            </div>

            <div className="max-w-md text-left lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-white/80 md:text-[1.125rem]"
              >
                Pricing that aligns with how you grow — not how many seats you fill.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-12">            {CARDS.map((card) => (
              <PricingWorkCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowPricingWorks;