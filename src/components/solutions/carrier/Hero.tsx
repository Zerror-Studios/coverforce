"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import {
  operatingRows,
  operatingSystemDescription,
  operatingSystemTitle,
} from "@/components/solutions/carrier/OperatingSystem";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const heroFeature = operatingRows[0];
const HeroMock = heroFeature.Mock;

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Carrier and MGAs"
    title="Be present at the moment agents quote"
    description="Brokers are moving to multi-carrier platforms. CoverForce puts your products in the quoting flow, reaching 15,000+ agencies through one integration — live in 30 days."
    feature={{ ...heroFeature, statColor: "#7CB518" }}
    featureHeaderTitle={operatingSystemTitle}
    featureHeaderDescription={operatingSystemDescription}
    featureHeaderCtaHref="/solutions/carrier"
    featureHeaderCtaLabel="Request a demo"
    rightCard={HeroMock ? <HeroMock /> : null}
    gradFlow={SOLUTION_GRAD_FLOW.carrier}
  />
);

export default Hero;
