"use client";

import dynamic from "next/dynamic";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import HeroReveal from "@/components/common/HeroReveal";
import EyebrowPill from "@/components/common/EyebrowPill";
import { HERO_COPY_FLOW } from "@/components/common/heroSectionSpacing";

const WavePlaneCanvas = dynamic(
  () =>
    import("@/components/product/Waveplane3d").then((module) => ({
      default: module.WavePlaneCanvas,
    })),
  { ssr: false },
);

const PRICING_COLOURS = ["#123B68", "#087F8C", "#18BFA2", "#A7F3D0"];

const Hero = () => {
  return (
    <section className="pricing-hero-shell relative h-svh overflow-hidden bg-[#151f4d] text-white">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 38%, rgba(49, 78, 155, 0.55) 0%, rgba(18, 28, 73, 0.92) 52%, #121C49 100%)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[60%] w-full"
        aria-hidden
      >
        <WavePlaneCanvas className="h-full w-full" colors={PRICING_COLOURS} />
      </div>

      <Container borderColor="#FFFFFF33" className="relative z-10 h-full">
        <HeroReveal className={HERO_COPY_FLOW}>
          <EyebrowPill surface="dark">Pricing</EyebrowPill>

          <h1 className="text-3xl font-heading font-normal leading-[1.15] tracking-tight md:text-4xl lg:whitespace-nowrap lg:text-6xl xl:text-6xl">
            Two plans.
            <br />
            One platform.
          </h1>

          <p className="mx-auto mt-10 max-w-xl font-sans text-sm font-regular leading-relaxed text-white/85 md:mt-6 md:text-sm">
            Whether you&apos;re launching your first book or scaling enterprise
            distribution, CoverForce&apos;s AI-powered infrastructure grows with you.
          </p>

          <div className="mt-12 flex w-full max-w-[21rem] flex-row items-center justify-center gap-2.5 sm:mt-14 sm:max-w-none sm:gap-4 md:mt-14">
            <Button href="#plans" balanced surface="on-dark" className="!min-w-0 !px-3.5 sm:!min-w-[148px] sm:!px-5">
              Explore plans
            </Button>
            <Button href="/contact" balanced variant="secondary" surface="on-dark" className="!min-w-0 !px-3.5 sm:!min-w-[148px] sm:!px-5">
              Talk to sales
            </Button>
          </div>
        </HeroReveal>
      </Container>
    </section>
  );
};

export default Hero;
