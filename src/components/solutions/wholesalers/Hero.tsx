"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import SolutionHeroCards from "@/components/solutions/shared/SolutionHeroCards";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

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
    showSecondSection={false}
    gradFlow={SOLUTION_GRAD_FLOW.wholesaler}
  />
);

export default Hero;
