"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import {
  operatingRows,
  operatingSystemDescription,
  operatingSystemTitle,
} from "@/components/solutions/developers/OperatingSystem";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const heroFeature = operatingRows[0];
const HeroMock = heroFeature.Mock;

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Developers"
    title="Embed commercial insurance into any product"
    titleClassName="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-none"
    description="One API for 40+ carriers, AI-powered quoting, binding, and policy management so you can add commercial insurance without becoming an insurance company."
    feature={heroFeature}
    featureHeaderTitle={operatingSystemTitle}
    featureHeaderDescription={operatingSystemDescription}
    featureHeaderCtaHref="/solutions/developers"
    featureHeaderCtaLabel="View API docs"
    rightCard={HeroMock ? <HeroMock /> : null}
    gradFlow={SOLUTION_GRAD_FLOW.developer}
  />
);

export default Hero;
