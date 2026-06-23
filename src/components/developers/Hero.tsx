import Image from "next/image";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#121C49] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 38%, rgba(49, 78, 155, 0.55) 0%, rgba(18, 28, 73, 0.92) 52%, #121C49 100%)",
        }}
        aria-hidden
      />

      <Image
        src="/images/developers/developer-bg.svg"
        alt=""
        width={1600}
        height={882}
        className="pointer-events-none absolute -bottom-16 left-0 z-[1] h-auto w-full"
        priority
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex min-h-screen flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-6 pt-24 text-center md:pt-28 lg:pt-32">
            <p className="flex items-center justify-center gap-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white md:text-xs">
              <span className="size-2 shrink-0 rounded-full bg-white" aria-hidden />
              Developers
            </p>

            <h1 className="mt-5 max-w-4xl text-3xl font-heading font-normal leading-[1.15] tracking-tight md:text-4xl lg:text-5xl xl:text-5xl">
              Build commercial <br /> insurance into your product <br /> with one API
            </h1>

            <p className="mx-auto mt-8 max-w-xl font-sans text-sm font-regular leading-relaxed text-white/85 md:text-sm">
              RESTful APIs, open docs, MCP support, and sandbox access —
              everything developers need to go from API key to production in 30
              days.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Button
                href="/"
                balanced
                className="border-transparent bg-gradient-to-r from-[#5B35E0] to-[#7C3AED] text-white transition-opacity hover:opacity-95"
              >
                Request API access
              </Button>
              <Button href="/" balanced variant="primary" surface="on-dark">
                Read the docs
              </Button>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-4 pb-16 md:mt-20 md:pb-20 lg:mt-24 lg:max-w-7xl lg:pb-24">
            <Image
              src="/images/developers/display.svg"
              alt="CoverForce API request example showing POST /v1/quote"
              width={1200}
              height={720}
              className="mx-auto h-auto max-h-[min(24rem,58vw)] w-full object-contain md:max-h-[32rem] lg:max-h-[38rem]"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
