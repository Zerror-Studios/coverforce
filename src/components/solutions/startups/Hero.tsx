"use client";

import Image from "next/image";
import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

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
    title="The faster way to build a modern brokerage"
    titleClassName="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-none"
    description="CoverForce gives early-stage startups the infrastructure, carriers, and ecosystem support to go from zero to launch in days."
    primaryButtonHref="/contact"
    primaryButtonLabel="Apply to Startup Program"
    secondaryButtonHref="#launch"
    secondaryButtonLabel="How it Works"
    rightCard={<StartupHeroCard />}
    showSecondSection={false}
    showMarquee
    marqueeLogos={STARTUP_MARQUEE_LOGOS}
    marqueeSize="large"
    gradFlow={SOLUTION_GRAD_FLOW.startup}
  />
);

export default Hero;
