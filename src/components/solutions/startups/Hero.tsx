import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import StartupRecentActivityCard from "@/components/solutions/startups/StartupRecentActivityCard";
import { MarqueeRow } from "@/components/solutions/wholesalers/MarqueeLine";

const Hero = () => {
  return (
    <section className="relative h-svh overflow-hidden bg-white text-[#0a143b]">
      <Container borderColor="#53535380" className="relative z-10 flex h-full flex-col">
        <div className="grid h-full min-h-0 flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex h-full flex-col justify-center space-y-8">
            <h1 className="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-none">
              The faster way to build a modern brokerage
            </h1>
            <p className="max-w-sm font-heading text-sm font-regular leading-relaxed text-[#444444]  md:text-sm">CoverForce gives early-stage startups the infrastructure, carriers, and ecosystem support to go from zero to launch in days.</p>

            <div className="flex flex-wrap gap-4">
              <Button href="/solutions/startups" balanced>
                Apply to Start Up Program
              </Button>
              <Button href="#program-overview" balanced variant="secondary">
                How Program Works
              </Button>
            </div>
          </div>

          <div className="relative z-10 flex h-full min-h-0 w-full items-center justify-center lg:justify-end">
            <StartupRecentActivityCard />
          </div>
        </div>

        <div className="relative z-10 shrink-0 pb-6 md:pb-8">
          <MarqueeRow />
        </div>
      </Container>
      <Image
        src="/images/solution/startup-bg.png"
        alt="CoverForce startups program"
        width={1200}
        height={900}
        className="absolute top-0 right-0 z-0 h-full w-[50vw] object-cover"
        priority
      />
    </section>
  );
};

export default Hero;
