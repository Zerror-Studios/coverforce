import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import BrokerCodeControlsMock from "@/components/solutions/wholesalers/BrokerCodeControlsMock";

const Hero = () => {
  return (
    <section className="relative h-screen bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="grid h-screen grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <h1 className="max-w-xl text-3xl font-heading font-normal leading-[1.12] tracking-tight text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-[1.1]">
            Scale your wholesale operation from one platform
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

          <div className="relative z-10 flex items-center justify-center">
            <BrokerCodeControlsMock />
          </div>
        </div>
      </Container>
      <Image
              src="/images/solution/wholesalers.svg"
              alt="CoverForce startups program"
              width={1200}
              height={900}
              className="absolute -bottom-[65%] right-0 h-auto w-full object-contain"
              priority
            />
    </section>
  );
};

export default Hero;
