"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import Image from "next/image";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const WHOLESALERS_HERO_LOGOS = [
  { src: "/images/solutions/wholesalers/logos/agentero-white.svg", alt: "Agentero" },
  { src: "/images/solutions/wholesalers/logos/amwins-white.svg", alt: "Amwins" },
  { src: "/images/solutions/wholesalers/logos/bridge-specialty-group-white.svg", alt: "Bridge Specialty Group" },
  { src: "/images/solutions/wholesalers/logos/international-underwriting-agency-white.svg", alt: "International Underwriting Agency" },
  { src: "/images/solutions/wholesalers/logos/jencap-white.svg", alt: "Jencap" },
  { src: "/images/solutions/wholesalers/logos/johnson-and-johnson-insurance-white.svg", alt: "Johnson & Johnson Insurance" },
  { src: "/images/solutions/wholesalers/logos/one80-intermediaries-white.svg", alt: "One80 Intermediaries" },
  { src: "/images/solutions/wholesalers/logos/pathpoint-white.svg", alt: "Pathpoint" },
  { src: "/images/solutions/wholesalers/logos/rt-specialty-white.svg", alt: "RT Specialty" },
  { src: "/images/solutions/wholesalers/logos/xs-brokers-white.svg", alt: "XS Brokers" },
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
        src="/images/solutions/wholesalers/hero.svg"
        alt="Wholesale desk triaging and routing retail submissions"
        width={588}
        height={372}
        // The SVG has ~64px of transparent shadow padding on every side (the
        // artwork is only 460 of its 588px). Draw it at 116% of the column and
        // pull the extra out with -8% margins so the visible artwork fills
        // ~90% of the column.
        className="relative z-10 -mx-[8%] h-auto w-[116%] max-w-none shrink-0"
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
