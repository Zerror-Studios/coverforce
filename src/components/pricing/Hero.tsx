import Link from "next/link";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import SolutionHeroLabel from "@/components/solutions/SolutionHeroLabel";

const Hero = () => {
  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535333" className="border-b">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center md:py-20 lg:pt-28 lg:pb-20">
          <SolutionHeroLabel>Pricing</SolutionHeroLabel>

          <h1 className="mt-5 text-3xl font-heading font-normal leading-[1.15] tracking-tight md:text-4xl lg:text-5xl xl:text-5xl">
            Two plans.
            <br />
            One platform.
          </h1>

          <p className="mx-auto mt-8 max-w-xl font-sans text-sm font-regular leading-relaxed text-[#444444] md:text-sm">
            Whether you&apos;re launching your first book or scaling enterprise
            distribution, CoverForce grows with you. Get access to the
            industry&apos;s leading AI-powered commercial insurance
            infrastructure.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="#plans" balanced>
              Explore plans
            </Button>
            <Link
              href="/"
              className="inline-flex h-10 min-h-10 items-center justify-center px-6 font-heading text-sm font-medium uppercase tracking-[0.12em] text-[#413CC0] transition-colors hover:text-[#33259F]"
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
