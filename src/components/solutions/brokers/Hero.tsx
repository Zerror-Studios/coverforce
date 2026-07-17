"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import { brokersHeroCardMock } from "@/components/solutions/brokers/OperatingSystem";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const HeroMock = brokersHeroCardMock;

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Brokers"
    title="Place business more profitably."
    titleClassName="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-6xl lg:leading-none xl:text-6xl"
    description="CoverForce helps every producer place risks faster, with better carrier fit and less wasted effort — so your firm keeps more premium and more margin."
    primaryButtonHref="/contact"
    primaryButtonLabel="Start a quote"
    secondaryButtonHref="#workflow"
    secondaryButtonLabel="How it works"
    rightCard={HeroMock ? <HeroMock /> : null}
    rightCardTransferTargetId="brokers-step-1-card"
    showSecondSection={false}
    gradFlow={SOLUTION_GRAD_FLOW.broker}
  />
);

export default Hero;
