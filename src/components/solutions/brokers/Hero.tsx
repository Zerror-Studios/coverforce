"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import SolutionHeroCards from "@/components/solutions/shared/SolutionHeroCards";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const BROKERS_HERO_LOGOS = [
    { src: "/images/broker/logo/broker-Brooks.svg", alt: "Brooks" },
    { src: "/images/broker/logo/broker-Diligence Brokerage.svg", alt: "Diligence Brokerage" },
    { src: "/images/broker/logo/broker-Direct Work Comp.svg", alt: "Direct Work Comp" },
    { src: "/images/broker/logo/broker-IronPoint Insurance.svg", alt: "IronPoint Insurance" },
    { src: "/images/broker/logo/broker-Paramount Exclusive.svg", alt: "Paramount Exclusive" },
    { src: "/images/broker/logo/broker-PCFG Insurance.svg", alt: "PCFG Insurance" },
    { src: "/images/broker/logo/broker-Skyscraper Insurance.svg", alt: "Skyscraper Insurance" },
    { src: "/images/broker/logo/broker-WorkCompOne.svg", alt: "WorkCompOne" },
    { src: "/images/broker/logo/network-Agentero.svg", alt: "Agentero" },
    { src: "/images/broker/logo/network-ASNOA.svg", alt: "ASNOA" },
    { src: "/images/broker/logo/network-First Connect.svg", alt: "First Connect" },
    { src: "/images/broker/logo/network-ISU Steadfast.svg", alt: "ISU Steadfast" },
    { src: "/images/broker/logo/network-SAN of Florida.svg", alt: "SAN of Florida" },
    { src: "/images/broker/logo/network-Voldico.svg", alt: "Voldico" },
    { src: "/images/broker/logo/partner-Justworks.svg", alt: "Justworks" },
    { src: "/images/broker/logo/localedge.svg", alt: "Localedge" },
  ] as const;
  

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
    marqueeSize="large"
    marqueeLogosPerSet={4}
    marqueeVariant="pulsating"
    showSecondSection={false}
    gradFlow={SOLUTION_GRAD_FLOW.broker}
  />
);

export default Hero;
