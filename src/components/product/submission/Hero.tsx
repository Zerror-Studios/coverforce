"use client";

import dynamic from "next/dynamic";
import Container from "@/components/common/Container";
import { HERO_CAROUSEL_INSET } from "@/components/common/heroSectionSpacing";
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

const SUBMISSION_COLOURS = ["#322696", "#7F44FF", "#A975FF", "#8E46FF"];

const SLIDES: HeroSlide[] = [
  {
    type: "copy",
    label: "Smart Intake",
    title: (
      <>
        AI that ingests
        <br />
        applications from any source.
      </>
    ),
    description:
      "Email, ACORDs, loss runs, prior policies, or AMS - AI extracts every field, enriches the submission, and pre-fills 40+ carrier applications in minutes.",
  },
  { type: "stat", value: "350,000+", label: "Submissions processed" },
  { type: "stat", value: "95% +",  label: "Extraction accuracy"  },
  { type: "stat", value: "93%",    label: "Faster per submission" },
];

const Hero = () => {
  const { activeIndex, handleSelectSlide, track } = useHeroCarousel(SLIDES);

  return (
    <section className="relative flex h-svh items-center justify-center bg-[#151f4d] pb-24 text-white md:pb-32">

      {/* Radial gradient overlay – keeps text readable over the wave */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(49,78,155,0.45) 0%, rgba(18,28,73,0.80) 48%, #121C49 100%)",
        }}
        aria-hidden
      />

      {/* 3-D wave plane – fills the lower portion of the hero */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[60%] w-full"
        aria-hidden
      >
        <WavePlaneCanvas className="h-full w-full" colors={SUBMISSION_COLOURS} />
      </div>

      <Container className="relative z-10">
        <div className={HERO_CAROUSEL_INSET}>
          {track}
        </div>
      </Container>

      <HeroCarouselNav
        count={SLIDES.length}
        activeIndex={activeIndex}
        onSelect={handleSelectSlide}
        ariaLabel="Submission hero slides"
      />
    </section>
  );
};

export default Hero;