"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import Image from "next/image";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const BROKERS_HERO_LOGOS = [
    { src: "/images/solutions/brokers/logos/broker-brooks.svg", alt: "Brooks" },
    { src: "/images/solutions/brokers/logos/broker-diligence-brokerage.svg", alt: "Diligence Brokerage" },
    { src: "/images/solutions/brokers/logos/broker-direct-work-comp.svg", alt: "Direct Work Comp" },
    { src: "/images/solutions/brokers/logos/broker-ironpoint-insurance.svg", alt: "IronPoint Insurance" },
    { src: "/images/solutions/brokers/logos/broker-paramount-exclusive.svg", alt: "Paramount Exclusive" },
    { src: "/images/solutions/brokers/logos/broker-pcfg-insurance.svg", alt: "PCFG Insurance" },
    { src: "/images/solutions/brokers/logos/broker-skyscraper-insurance.svg", alt: "Skyscraper Insurance" },
    { src: "/images/solutions/brokers/logos/broker-workcompone.svg", alt: "WorkCompOne" },
    { src: "/images/solutions/brokers/logos/network-agentero.svg", alt: "Agentero" },
    { src: "/images/solutions/brokers/logos/network-asnoa.svg", alt: "ASNOA" },
    { src: "/images/solutions/brokers/logos/network-first-connect.svg", alt: "First Connect" },
    { src: "/images/solutions/brokers/logos/network-isu-steadfast.svg", alt: "ISU Steadfast" },
    { src: "/images/solutions/brokers/logos/network-san-of-florida.svg", alt: "SAN of Florida" },
    { src: "/images/solutions/brokers/logos/partner-justworks.svg", alt: "Justworks" },
    { src: "/images/solutions/brokers/logos/localedge.svg", alt: "Localedge" },
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
      <Image
        src="/images/solutions/brokers/hero.svg"
        alt="Broker quoting dashboard"
        width={531}
        height={427}
        className="relative z-10 mx-auto h-auto w-full max-w-[550px] lg:max-w-none"
        priority
      />
    }
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
