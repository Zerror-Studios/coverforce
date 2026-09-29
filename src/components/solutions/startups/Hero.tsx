"use client";

import Image from "next/image";
import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import { SOLUTION_GRAD_FLOW, type GradFlowRgb } from "@/data/wayCardStyles";

/** Deepen a GradFlow stop so white hero copy stays readable. */
function deepen(color: GradFlowRgb, amount: number): GradFlowRgb {
  const keep = 1 - amount;
  return {
    r: Math.round(color.r * keep),
    g: Math.round(color.g * keep),
    b: Math.round(color.b * keep),
  };
}

const startupFlow = SOLUTION_GRAD_FLOW.startup;
/** Flip L/R colors and shade the content side darker for contrast. */
const STARTUP_HERO_GRAD_FLOW = {
  color1: deepen(startupFlow.color3, 0.38),
  color2: deepen(startupFlow.color2, 0.18),
  color3: startupFlow.color1,
};

const STARTUP_MARQUEE_LOGOS = [
  { src: "/images/startups/logos/broker-Diligence Brokerage.svg", alt: "Diligence" },
  { src: "/images/startups/logos/startup - Anzen.svg", alt: "Anzen" },
  { src: "/images/startups/logos/startup - Broker Buddha BuddhAI.svg", alt: "Broker Buddha BuddhAI" },
  { src: "/images/startups/logos/startup - Coverwatch.svg", alt: "Coverwatch" },
  { src: "/images/startups/logos/startup - Harper.svg", alt: "Harper" },
  { src: "/images/startups/logos/startup - Knack.svg", alt: "Knack" },
  { src: "/images/startups/logos/startup - Latent Insurance.svg", alt: "Latent Insurance" },
  { src: "/images/startups/logos/startup - Rosella.svg", alt: "Rosella" },
  { src: "/images/startups/logos/startup - Switchboard.svg", alt: "Switchboard" }
] as const;

const StartupHeroCard = () => (
  <Image
    src="/images/startups/startup.svg"
    alt="Startup program dashboard preview"
    width={543}
    height={569}
    className="relative z-10 mx-auto h-auto w-full max-w-[550px] lg:max-w-[420px] xl:max-w-[550px]"
    priority
  />
);

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Startups"
    title="The fastest way to launch a commercial brokerage"
    titleClassName="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-6xl lg:leading-none xl:text-6xl"
    description="CoverForce gives early-stage startups the infrastructure, carriers, and ecosystem support to go from zero to a fully-launched insurance brokerage in days."
    primaryButtonHref="/contact"
    primaryButtonLabel="Apply to Startup Program"
    secondaryButtonHref="#program-overview"
    secondaryButtonLabel="How it Works"
    rightCard={<StartupHeroCard />}
    showSecondSection={false}
    showMarquee
    marqueeVariant="pulsating"
    marqueeLogos={STARTUP_MARQUEE_LOGOS}
    marqueeSize="large"
    marqueeLogosPerSet={4}
    gradFlow={STARTUP_HERO_GRAD_FLOW}
  />
);

export default Hero;
