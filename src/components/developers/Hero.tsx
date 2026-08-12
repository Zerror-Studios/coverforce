"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import HeroReveal from "@/components/common/HeroReveal";
import ApiCodeReveal from "@/components/developers/ApiCodeReveal";
import EyebrowPill from "@/components/common/EyebrowPill";
import { HERO_COPY_STACK } from "@/components/common/heroSectionSpacing";

// Lazy-load – R3F must never run on the server
const WavePlaneCanvas = dynamic(
  () => import("@/components/product/Waveplane3d").then((m) => ({ default: m.WavePlaneCanvas })),
  { ssr: false }
);

// Purple → deep navy palette
const DEVELOPER_COLOURS = ["#100B3C", "#154BC1", "#5100FF", "#5100FF69"];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#151f4d] text-white">
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
        <div className="flex flex-col">
          <HeroReveal className={`${HERO_COPY_STACK} max-w-4xl`}>
            <EyebrowPill surface="dark" className="mx-auto">
              Developers
            </EyebrowPill>

            <h1 className="max-w-4xl text-3xl font-heading font-normal leading-[1.15] tracking-tight md:text-4xl lg:whitespace-nowrap lg:text-6xl xl:text-6xl">
              Embed insurance
              <br />
              with one API
            </h1>

            <p className="mx-auto mt-8 max-w-xl font-sans text-sm font-regular leading-relaxed text-white/85 md:text-sm">
              One API for 40+ carriers, with open docs, MCP support, and sandbox
              access. Add quoting, binding, and policy management, then go live in
              30 days.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Button
                href="https://developer.coverforce.com/docs/coverforce-api/lxj5tz15jwgjy-authentication"
                target="_blank"
                rel="noreferrer"
                balanced
                surface="on-dark"
              >
                Read the docs
              </Button>
            </div>
          </HeroReveal>

          <HeroReveal
            className="relative z-10 mx-auto w-full max-w-6xl px-2 pb-10 max-md:-mt-48 sm:-mt-60 sm:px-4 md:-mt-28 md:px-4 md:pb-20 lg:-mt-36 lg:max-w-7xl lg:pb-24"
            delay={0.75}
          >
            <div className="relative mx-auto h-[24rem] w-full sm:h-[30rem] md:h-[32rem] lg:h-[38rem]">
              <Image
                src="/images/developers/display.svg"
                alt="CoverForce API request example showing POST /v1/quote"
                width={1200}
                height={720}
                className="h-full w-full object-fill md:object-contain"
                priority
              />

              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 px-[6%] pt-[2%] translate-y-4 sm:translate-y-5 sm:gap-3.5 sm:px-[8%] md:translate-y-3 md:justify-end md:gap-4 md:px-[10%] md:pt-0">
                <div className="hidden w-14 md:block md:w-16 lg:w-20">
                  <Image
                    src="/images/developers/display-logo.svg"
                    alt="CoverForce logo"
                    width={1200}
                    height={720}
                    className="h-auto w-full object-contain"
                    priority
                  />
                </div>
                <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-xl lg:max-w-3xl">
                  <Image
                    src="/images/developers/display-editor.svg"
                    alt="CoverForce API request editor"
                    width={1200}
                    height={720}
                    className="h-auto w-full object-contain"
                    priority
                  />
                  <ApiCodeReveal className="pointer-events-none absolute inset-0 flex flex-col justify-center pl-[9%] pr-[3%] pb-[8%] pt-[2%] sm:pl-[11%] sm:pb-[10%] md:pl-[11%] md:pb-[10%]" />
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
