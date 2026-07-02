"use client";

import OperatingPlatformMock from "@/components/solutions/brokers/OperatingPlatformMock";
import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import {
  operatingRows,
  operatingSystemDescription,
  operatingSystemTitle,
} from "@/components/solutions/brokers/OperatingSystem";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const heroFeature = operatingRows[0];

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Brokers"
    title="Standardise commercial lines everywhere."
    titleClassName="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-none"
    feature={heroFeature}
    featureHeaderTitle={operatingSystemTitle}
    featureHeaderDescription={operatingSystemDescription}
    featureHeaderCtaHref="/"
    featureHeaderCtaLabel="Start a quote"
    rightCard={<OperatingPlatformMock variant="hero" />}
    gradFlow={SOLUTION_GRAD_FLOW.broker}
  />
);

export default Hero;
