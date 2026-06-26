"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import HeroReveal from "@/components/common/HeroReveal";
import ApiCodeReveal from "@/components/developers/ApiCodeReveal";

// Lazy-load – R3F must never run on the server
const WavePlaneCanvas = dynamic(
  () => import("@/components/product/Waveplane3d").then((m) => ({ default: m.WavePlaneCanvas })),
  { ssr: false }
);

// Purple → deep navy palette
const DEVELOPER_COLOURS = ["#100B3C", "#154BC1", "#5100FF", "#5100FF69"];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#121C49] text-white">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 38%, rgba(49, 78, 155, 0.55) 0%, rgba(18, 28, 73, 0.92) 52%, #121C49 100%)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[60%] w-full"
        aria-hidden
      >
        <WavePlaneCanvas className="h-full w-full" colors={DEVELOPER_COLOURS} />
      </div>

      <Container className="relative z-10">
        <div className="flex min-h-screen flex-col">
          <HeroReveal className="flex flex-1 flex-col items-center justify-center px-6 pt-24 text-center md:pt-28 lg:pt-32">
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
              >
                Request API access
              </Button>
              <Button href="/" balanced variant="secondary" surface="on-dark">
                Read the docs
              </Button>
            </div>
          </HeroReveal>

          <HeroReveal
            className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-4 pb-16 md:mt-20 md:pb-20 lg:mt-24 lg:max-w-7xl lg:pb-24"
            delay={0.75}
          >
            <div className="relative mx-auto h-[min(24rem,58vw)] w-full md:h-[32rem] lg:h-[38rem]">
              <Image
                src="/images/developers/display.svg"
                alt="CoverForce API request example showing POST /v1/quote"
                width={1200}
                height={720}
                className="h-full w-full object-contain"
                priority
              />

              <div className="absolute inset-0 z-10 flex translate-y-3 flex-col items-center justify-end gap-3 px-[10%] md:gap-4">
                <div className="w-14 md:w-16 lg:w-20">
                  <Image
                    src="/images/developers/display-logo.svg"
                    alt="CoverForce logo"
                    width={1200}
                    height={720}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <div className="relative w-full max-w-xl lg:max-w-3xl">
                  <Image
                    src="/images/developers/display-editor.svg"
                    alt="CoverForce API request editor"
                    width={1200}
                    height={720}
                    className="h-auto w-full object-contain"
                  />
                  <ApiCodeReveal className="pointer-events-none absolute inset-0 flex flex-col justify-center pl-[11%] pr-[3%] pb-[10%] pt-[2%]" />
                </div>
              </div>
            </div>
          </HeroReveal>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
