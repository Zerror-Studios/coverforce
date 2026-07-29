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
  { src: "/images/startups/logos/anzen.png", alt: "Anzen" },
  { src: "/images/startups/logos/broker.png", alt: "Broker" },
  { src: "/images/startups/logos/coverwatch.png", alt: "CoverWatch" },
  { src: "/images/startups/logos/harper.png", alt: "Harper" },
  { src: "/images/startups/logos/latent.png", alt: "Latent" },
  { src: "/images/startups/logos/rosella.png", alt: "Rosella" },
  { src: "/images/startups/logos/snapbind.png", alt: "Snapbind" },
  { src: "/images/startups/logos/switchboard.png", alt: "Switchboard" },
] as const;

const StartupHeroCard = () => (
  <Image
    src="/images/startups/startup.svg"
    alt="Startup program dashboard preview"
    width={543}
    height={569}
    className="relative z-10 mx-auto h-auto w-full max-w-[420px]"
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
    secondaryButtonHref="#launch"
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
