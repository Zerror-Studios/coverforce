"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import SolutionHeroCards from "@/components/solutions/shared/SolutionHeroCards";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const WHOLESALERS_HERO_LOGOS = [
  { src: "/images/wholesaler/logo/network - Agentero (white).png", alt: "Agentero" },
  { src: "/images/wholesaler/logo/wholesaler - Amwins (white).png", alt: "Amwins" },
  { src: "/images/wholesaler/logo/wholesaler - Bridge Specialty Group (white).png", alt: "Bridge Specialty Group" },
  { src: "/images/wholesaler/logo/wholesaler - International Underwriting Agency (official brand asset, supplied) (white).png", alt: "International Underwriting Agency" },
  { src: "/images/wholesaler/logo/wholesaler - Jencap (white).png", alt: "Jencap" },
  { src: "/images/wholesaler/logo/wholesaler - Johnson & Johnson Insurance (official jjins.com, upscaled) (white).png", alt: "Johnson & Johnson Insurance" },
  { src: "/images/wholesaler/logo/wholesaler - One80 Intermediaries (white).png", alt: "One80 Intermediaries" },
  { src: "/images/wholesaler/logo/wholesaler - Pathpoint (official pathpoint.com SVG) (white).png", alt: "Pathpoint" },
  { src: "/images/wholesaler/logo/wholesaler - RT Specialty (white).png", alt: "RT Specialty" },
  { src: "/images/wholesaler/logo/wholesaler - XS Brokers (official brand asset, supplied) (white).png", alt: "XS Brokers" },
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
      <SolutionHeroCards
        transferTargetId="wholesalers-step-1-card"
        cardOne={{
          src: "/images/wholesaler/wholesaler1.svg",
          alt: "Wholesale distribution dashboard",
          width: 444,
          height: 269,
        }}
        cardTwo={{
          src: "/images/wholesaler/wholesaler2.svg",
          alt: "Wholesale program workflow",
          width: 371,
          height: 179,
        }}
      />
    }
    rightCardTransferTargetId="wholesalers-step-1-card"
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
