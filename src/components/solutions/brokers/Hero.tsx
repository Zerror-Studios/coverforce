import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";

const Hero = () => {
  return (
    <section className="h-screen bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom={true}>
        <div className="grid h-screen grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex h-full flex-col justify-center space-y-8">
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
          </div>


          <div className="relative flex items-center justify-center">
            <Image
              src="/images/startups/startuphero.png"
              alt="CoverForce startups program"
              width={1200}
              height={900}
              className="h-auto w-full object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
