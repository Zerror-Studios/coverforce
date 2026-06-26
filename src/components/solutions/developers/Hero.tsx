import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import HeroReveal from "@/components/common/HeroReveal";
import EyebrowPill from "@/components/common/EyebrowPill";

const Hero = () => {
  return (
    <section className="relative h-screen bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom={true}>
        <div className="grid h-screen grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <HeroReveal className="flex h-full flex-col justify-center space-y-8">
            <EyebrowPill surface="light">Developers</EyebrowPill>
            <h1 className="max-w-xl text-3xl font-heading font-normal tracking-normal text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-none">
              Embed commercial insurance into any product
            </h1>
            <p className="max-w-sm font-heading text-sm font-regular leading-relaxed text-[#444444]  md:text-sm">One API for 40+ carriers, AI-powered quoting, binding, and policy management so you can add commercial insurance without becoming an insurance company.</p>

            <div className="flex flex-wrap gap-4">
              <Button href="/solutions/startups" balanced>
                Apply to Start Up Program
              </Button>
              <Button href="#program-overview" balanced variant="secondary">
                How Program Works
              </Button>
            </div>
          </HeroReveal>

          <div className="relative flex items-center justify-center">
            <Image
              src="/images/solution/developers.svg"
              alt="CoverForce startups program"
              width={1200}
              height={900}
              className="h-auto w-full object-contain object-bottom"
              priority
            />
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
