"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import SolutionHeroCards from "@/components/solutions/shared/SolutionHeroCards";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Carrier and MGAs"
    title="Be present at the moment agents quote"
    description="Brokers are moving to multi-carrier platforms. CoverForce puts your products in the quoting flow, reaching 15,000+ agencies through one integration — live in 30 days."
    secondaryButtonHref="#workflow"
    secondaryButtonLabel="How it works"
    rightCard={
      <SolutionHeroCards
        transferTargetId="carrier-step-1-card"
        cardOne={{
          src: "/images/carrier/career1.svg",
          alt: "Carrier integration dashboard",
          width: 389,
          height: 238,
        }}
        cardTwo={{
          src: "/images/carrier/career2.svg",
          alt: "Carrier quote workflow",
          width: 371,
          height: 179,
        }}
      />
    }
    rightCardTransferTargetId="carrier-step-1-card"
    showSecondSection={false}
    gradFlow={SOLUTION_GRAD_FLOW.carrier}
  />
);

export default Hero;
