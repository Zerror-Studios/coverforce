"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import Image from "next/image";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const WHOLESALERS_HERO_LOGOS = [
  { src: "/images/wholesaler/logo/network - Agentero (white).svg", alt: "Agentero" },
  { src: "/images/wholesaler/logo/wholesaler - Amwins (white).svg", alt: "Amwins" },
  { src: "/images/wholesaler/logo/wholesaler - Bridge Specialty Group (white).svg", alt: "Bridge Specialty Group" },
  { src: "/images/wholesaler/logo/wholesaler - International Underwriting Agency (official brand asset, supplied) (white).svg", alt: "International Underwriting Agency" },
  { src: "/images/wholesaler/logo/wholesaler - Jencap (white).svg", alt: "Jencap" },
  { src: "/images/wholesaler/logo/wholesaler - Johnson & Johnson Insurance (official jjins.com, upscaled) (white).svg", alt: "Johnson & Johnson Insurance" },
  { src: "/images/wholesaler/logo/wholesaler - One80 Intermediaries (white).svg", alt: "One80 Intermediaries" },
  { src: "/images/wholesaler/logo/wholesaler - Pathpoint (official pathpoint.com SVG) (white).svg", alt: "Pathpoint" },
  { src: "/images/wholesaler/logo/wholesaler - RT Specialty (white).svg", alt: "RT Specialty" },
  { src: "/images/wholesaler/logo/wholesaler - XS Brokers (official brand asset, supplied) (white).svg", alt: "XS Brokers" },
] as const;


const Hero = () => (
  <SolutionScrollHero
    eyebrow="Wholesalers"
    title="Scale your wholesale operation from one platform"
    description="CoverForce centralizes intake, routing, broker controls, and program distribution so your wholesale team can move faster without changing how retailers submit business."
    primaryButtonHref="/contact"
    primaryButtonLabel="Talk to sales"
    secondaryButtonHref="#workflow"
    secondaryButtonLabel="How it works"
    rightCard={
      <Image
        src="/images/wholesaler/wholesaler-hero.svg"
        alt="Wholesale desk triaging and routing retail submissions"
        width={588}
        height={372}
        className="relative z-10 mx-auto h-auto w-full max-w-[550px] lg:max-w-[420px] xl:max-w-[550px]"
        priority
      />
    }
    showMarquee
    marqueeVariant="pulsating"
    marqueeLogos={WHOLESALERS_HERO_LOGOS}
    marqueeSize="large"
    marqueeLogosPerSet={4}
    showSecondSection={false}
    gradFlow={SOLUTION_GRAD_FLOW.wholesaler}
  />
);

export default Hero;
