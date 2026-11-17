"use client";

import SolutionScrollHero from "@/components/solutions/shared/SolutionScrollHero";
import Image from "next/image";
import { SOLUTION_GRAD_FLOW } from "@/data/wayCardStyles";

const Hero = () => (
  <SolutionScrollHero
    eyebrow="Carrier and MGAs"
    title="Be present at the moment agents quote"
    description="Brokers are moving to multi-carrier platforms. CoverForce puts your products in the quoting flow, reaching 15,000+ agencies through one integration - live in 30 days."
    secondaryButtonHref="#workflow"
    secondaryButtonLabel="How it works"
    rightCard={
      <Image
        src="/images/solutions/carriers/hero.svg"
        alt="Carrier quote requests and bindable quotes from agencies"
        width={648}
        height={544}
        className="relative z-10 mx-auto h-auto w-full max-w-[550px] lg:-mx-[5%] lg:w-[110%] lg:max-w-none lg:shrink-0"
        priority
      />
    }
    showSecondSection={false}
    gradFlow={SOLUTION_GRAD_FLOW.carrier}
  />
);

export default Hero;
