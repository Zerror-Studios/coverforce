import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import HeroReveal from "@/components/common/HeroReveal";
import EyebrowPill from "@/components/common/EyebrowPill";
import OperatingPlatformMock from "@/components/solutions/brokers/OperatingPlatformMock";

const Hero = () => {
  return (
    <section className="relative h-screen bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom={true}>
        <div className="grid h-screen grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <HeroReveal className="flex h-full flex-col justify-center space-y-8">
            <EyebrowPill surface="light">Brokers</EyebrowPill>
            <h1 className="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-none">
            Standardise commercial lines everywhere.
            </h1>
            <div className="flex flex-wrap gap-4">
              <Button href="/solutions/startups" balanced>
                Apply to Start Up Program
              </Button>
              <Button href="#program-overview" balanced variant="secondary">
                How Program Works
              </Button>
            </div>
          </HeroReveal>


          <div className="relative z-10 flex items-center justify-center">
            <OperatingPlatformMock variant="hero" />
          </div>
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
