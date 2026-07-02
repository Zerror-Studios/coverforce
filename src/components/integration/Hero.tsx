"use client";

import dynamic from "next/dynamic";
import Container from "@/components/common/Container";
import {
  HeroCarouselNav,
  useHeroCarousel,
  type HeroSlide,
} from "@/components/product/HeroCarousel";

// Lazy-load – R3F must never run on the server
const WavePlaneCanvas = dynamic(
  () => import("@/components/product/Waveplane3d").then((m) => ({ default: m.WavePlaneCanvas })),
  { ssr: false }
);

// Blue → ice palette
const INTELLIGENCE_COLOURS = ["#0045FF", "#36B6FF", "#9EDDFF", "#D3F1FF"];

const SLIDES: HeroSlide[] = [
  {
    type: "copy",
    label: "AI-Powered Insurance Distribution",
    title: (
      <>
        One API.
        <br />
        The entire market.
      </>
    ),
    description:
      "Real-time visibility across submissions, quotes, binds, and carrier performance with enterprise controls for broker codes, commissions, and network oversight.",
  },
  {
    type: "stat",
    value: "40+",
    label: "Carriers in one workflow",
  },
  {
    type: "stat",
    value: "30 days",
    label: "To production",
  },
  {
    type: "stat",
    value: "SOC 2",
    label: "Type II certified",
  },
];

const Hero = () => {
  const { activeIndex, handleSelectSlide, track } = useHeroCarousel(SLIDES);

  return (
    <section className="relative flex h-svh items-center justify-center overflow-hidden bg-[#151f4d] pb-24 text-white md:pb-32">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(49, 78, 155, 0.55) 0%, rgba(18, 28, 73, 0.92) 52%, #121C49 100%)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[60%] w-full"
        aria-hidden
      >
        <WavePlaneCanvas className="h-full w-full" colors={INTELLIGENCE_COLOURS} />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-3xl -translate-y-6 flex-col items-center px-6 py-16 text-center md:-translate-y-10 md:py-20">
          {track}
        </div>
      </Container>

      <HeroCarouselNav
        count={SLIDES.length}
        activeIndex={activeIndex}
        onSelect={handleSelectSlide}
        ariaLabel="Integration hero slides"
      />
    </section>
  );
};

export default Hero;
