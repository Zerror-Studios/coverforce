import Link from "next/link";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import SolutionHeroLabel from "@/components/solutions/SolutionHeroLabel";

const Hero = () => {
  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535333">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6  pt-28 text-center  md:pt-32 lg:pt-40">
          <SolutionHeroLabel>Pricing</SolutionHeroLabel>

          <h1 className="mt-6 text-3xl font-heading font-normal leading-[1.15] tracking-tight md:mt-7 md:text-4xl lg:mt-8 lg:text-5xl xl:text-5xl">
            Two plans.
            <br />
            One platform.
          </h1>

          <p className="mx-auto mt-10 max-w-xl font-sans text-sm font-regular leading-relaxed text-[#444444] md:mt-6 md:text-sm">
            Whether you&apos;re launching your first book or scaling enterprise
            distribution, CoverForce grows with you. Get access to the
            industry&apos;s leading AI-powered commercial insurance
            infrastructure.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-14">
            <Button href="#plans" balanced>
              Explore plans
            </Button>
            <Button href="#plans" balanced variant="secondary">
              Talk to sales
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
