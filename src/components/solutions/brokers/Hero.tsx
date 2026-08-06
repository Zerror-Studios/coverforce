"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import SolutionHeroCards from "@/components/solutions/shared/SolutionHeroCards";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";
import { BROKERS_HERO_LOGOS } from "@/data/brokersHeroLogos";

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Brokers"
    title="Place business more profitably."
    titleClassName="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-6xl lg:leading-none xl:text-6xl"
    description="CoverForce helps every producer place risks faster, with better carrier fit and less wasted effort - so your firm keeps more premium and more margin."
    primaryButtonHref="/contact"
    primaryButtonLabel="Start a quote"
    secondaryButtonHref="#workflow"
    secondaryButtonLabel="How it works"
    rightCard={
      <SolutionHeroCards
        transferTargetId="brokers-step-1-card"
        cardOne={{
          src: "/images/broker/broker1.svg",
          alt: "Broker quoting dashboard",
          width: 444,
          height: 269,
        }}
        cardTwo={{
          src: "/images/broker/broker2.svg",
          alt: "Broker workflow summary",
          width: 371,
          height: 179,
        }}
      />
    }
    rightCardTransferTargetId="brokers-step-1-card"
    showMarquee
    marqueeLogos={BROKERS_HERO_LOGOS}
    marqueeSize="default"
    marqueeLogosPerSet={4}
    marqueeVariant="pulsating"
    showSecondSection={false}
    gradFlow={SOLUTION_GRAD_FLOW.broker}
  />
);

export default Hero;
