import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";

const Hero = () => {
  return (
    <section className="relative h-screen bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom={true}>
        <div className="grid h-screen grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center space-y-8">
            <h1 className="max-w-xl text-3xl font-heading font-normal leading-[1.12] tracking-tight text-[#0a143b] md:text-4xl lg:text-[3.5rem] lg:leading-[1.1]">
            Be present at the moment agents quote
              </h1>
              <p className="max-w-sm font-heading text-sm font-regular leading-relaxed text-[#444444]  md:text-sm">Brokers are moving to multi-carrier platforms. CoverForce puts your products in the quoting flow, reaching 15,000+ agencies through one integration — live in 30 days.</p>
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
