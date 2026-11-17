"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import HeroReveal from "@/components/common/HeroReveal";
import EyebrowPill from "@/components/common/EyebrowPill";
import HeroQuoteCode from "@/components/developers/HeroQuoteCode";
import { HERO_COPY_STACK } from "@/components/common/heroSectionSpacing";

// Lazy-load – R3F must never run on the server
const WavePlaneCanvas = dynamic(
  () => import("@/components/product/Waveplane3d").then((m) => ({ default: m.WavePlaneCanvas })),
  { ssr: false }
);

// Purple → deep navy palette
const DEVELOPER_COLOURS = ["#100B3C", "#154BC1", "#5100FF", "#5100FF69"];

/**
 * Desktop-only layers around the terminal, drawn under it. Each is scaled to
 * 90% around its own centre. They're display:none below md, so (lazy-loaded)
 * they never download on mobile (~520 KB saved there).
 */
const HERO_SIDE_LAYERS = [
  {
    // Dashed web → terminal connector; both ends tuck under the cards.
    src: "/images/developers/hero-connector.svg",
    alt: "",
    className: "",
  },
  {
    src: "/images/developers/hero-web.svg",
    alt: "Web app showing a Hiscox quote ready to bind",
    className: "origin-[17.1%_29.1%] scale-90",
  },
  {
    src: "/images/developers/hero-ai.svg",
    alt: "AI assistant returning three bindable quotes over CoverForce MCP",
    className: "origin-[23.1%_79.4%] scale-90",
  },
  {
    src: "/images/developers/hero-phone.svg",
    alt: "Mobile app listing quotes from Hiscox, Travelers and Chubb",
    className: "origin-[89.3%_54.4%] scale-90",
  },
] as const;

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
                href="https://developer.coverforce.com/docs/coverforce-api/cucsxu65m1jkf-introduction-to-cover-force-api"
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
            {/* Phones: full-width display at its natural ratio (no stretching);
                md+: fixed-height stage with the display contained. */}
            <div className="relative mx-auto w-full max-md:overflow-hidden md:h-[32rem] lg:h-[38rem]">
              <Image
                src="/images/developers/hero-display.png"
                alt=""
                width={2156}
                height={1280}
                className="h-auto w-full md:h-full md:object-contain"
                sizes="(min-width: 1280px) 1080px, 100vw"
                priority
              />

              {/* Display image carries the menubar; nudge content below it */}
              {/* Box keeps the artwork's 953:501 ratio (≤88% wide, ≤72% tall).
                  The artwork is split into layers that each keep the full
                  953×501 canvas, so they stay aligned with each other and with
                  the typed-code overlay, and each can be scaled around its own
                  centre (transform origins = each part's measured centre). */}
              <div className="absolute inset-0 z-10 flex items-center justify-center translate-y-[3%] [container-type:size]">
                <div className="relative aspect-[953/501] w-[min(88cqw,137cqh)]">
                  {HERO_SIDE_LAYERS.map((layer) => (
                    <div
                      key={layer.src}
                      className={`absolute inset-0 hidden md:block ${layer.className}`}
                    >
                      <Image
                        src={layer.src}
                        alt={layer.alt}
                        width={953}
                        height={501}
                        className="size-full"
                      />
                    </div>
                  ))}

                  {/* quote.ts terminal - larger on desktop. On mobile it's the
                      only layer: centred and enlarged so it sits inside the
                      display (dark window ~half the display width). */}
                  <div className="absolute inset-0 origin-[53.3%_52.1%] -translate-x-[3.3%] -translate-y-[2.1%] scale-[2.2] md:translate-x-0 md:translate-y-0 md:scale-115">
                    <Image
                      src="/images/developers/hero-terminal.svg"
                      alt="CoverForce API call returning three bindable quotes"
                      width={953}
                      height={501}
                      className="absolute inset-0 size-full"
                      priority
                    />
                    <HeroQuoteCode className="pointer-events-none absolute inset-0 size-full" />
                  </div>
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
