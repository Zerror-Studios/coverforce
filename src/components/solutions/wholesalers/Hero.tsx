"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import {
  operatingRows,
  operatingSystemDescription,
  operatingSystemTitle,
} from "@/components/solutions/wholesalers/OperatingSystem";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const heroFeature = operatingRows[0];
const HeroMock = heroFeature.Mock;

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Wholesalers"
    title="Scale your wholesale operation from one platform"
    description="CoverForce centralizes intake, routing, broker controls, and program distribution so your wholesale team can move faster without changing how retailers submit business."
    feature={heroFeature}
    featureHeaderTitle={operatingSystemTitle}
    featureHeaderDescription={operatingSystemDescription}
    featureHeaderCtaHref="/solutions/wholesalers"
    featureHeaderCtaLabel="Talk to sales"
    rightCard={HeroMock ? <HeroMock /> : null}
    showMarquee
    gradFlow={SOLUTION_GRAD_FLOW.wholesaler}
  />
);

export default Hero;
