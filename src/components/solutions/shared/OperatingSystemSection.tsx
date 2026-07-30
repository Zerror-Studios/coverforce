"use client";

import { useRef, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import EyebrowPill from "@/components/common/EyebrowPill";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import {
  parseStatValue,
  ScrollTriggeredOdometerStat,
} from "@/components/common/AnimatedPercent";
import OperatingPlatformMock from "@/components/solutions/brokers/OperatingPlatformMock";
import OperatingAiMock from "@/components/solutions/brokers/OperatingAiMock";
import OperatingVisibilityMock from "@/components/solutions/brokers/OperatingVisibilityMock";
import ShrimpLineAnimation from "@/components/developers/Shrimplineanimation";
import ShrimpLineAnimation2 from "@/components/developers/Shrimplineanimation2";

gsap.registerPlugin(ScrollTrigger);

export type OperatingRow = {
  id: string;
  heading: string;
  description: string;
  tag?: string;
  stat?: string;
  statLabelLines?: [string, string];
  Mock?: ComponentType;
  transferTargetId?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type OperatingSystemConfig = {
  sectionTitle: ReactNode;
  sectionDescription: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaTarget?: string;
  ctaRel?: string;
  ctaVariant?: "link" | "request-demo";
  statColor?: string;
  statGradient?: string;
  showHeader?: boolean;
  showStats?: boolean;
  paddingTop?: boolean;
  rows: OperatingRow[];
};

const DEFAULT_MOCKS: Record<string, ComponentType> = {
  platform: OperatingPlatformMock,
  ai: OperatingAiMock,
  visibility: OperatingVisibilityMock,
};

function OperatingStatBlock({
  stat,
  labelLines,
  color,
  gradient,
}: {
  stat: string;
  labelLines: [string, string];
  color: string;
  gradient?: string;
}) {
  const { value, suffix } = parseStatValue(stat);
  const gradientStyle: CSSProperties | undefined = gradient
    ? {
        backgroundImage: gradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }
    : undefined;

  if (gradient) {
    return (
      <div className="operating-stat mt-10 flex items-center gap-4 md:mt-8 md:gap-5">
        <span
          className="operating-stat-gradient-text text-4xl font-heading font-bold tracking-tight md:text-5xl lg:text-[3.25rem]"
          style={gradientStyle}
          aria-label={stat}
        >
          {stat}
        </span>
        <span
          className="operating-stat-label operating-stat-gradient-text font-heading text-base font-medium leading-[1.25] md:text-lg md:leading-[1.2]"
          style={gradientStyle}
        >
          <span className="operating-stat-label-line block">{labelLines[0]}</span>
          <span className="operating-stat-label-line block">{labelLines[1]}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="operating-stat mt-10 flex items-center gap-4 md:mt-8 md:gap-5">
      <ScrollTriggeredOdometerStat
        value={value}
        suffix={suffix}
        className="text-4xl font-heading font-bold tracking-tight md:text-5xl lg:text-[3.25rem]"
        suffixClassName="font-heading font-bold"
        ariaLabel={stat}
        style={{ color }}
      />
      <span
        className="operating-stat-label font-heading text-base font-medium leading-[1.25] md:text-lg md:leading-[1.2]"
        style={{ color }}
      >
        <span className="operating-stat-label-line block">{labelLines[0]}</span>
        <span className="operating-stat-label-line block">{labelLines[1]}</span>
      </span>
    </div>
  );
}

export default function OperatingSystemSection({
  sectionTitle,
  sectionDescription,
  ctaHref = "/contact",
  ctaLabel = "Start a quote",
  ctaTarget,
  ctaRel,
  ctaVariant = "link",
  statColor = "#33259F",
  statGradient,
  showHeader = true,
  showStats = true,
  paddingTop = false,
  rows,
}: OperatingSystemConfig) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const mocks = gsap.utils.toArray<HTMLElement>(".operating-row-mock");

      mocks.forEach((mock) => {
        gsap.set(mock, { opacity: 0, y: 56 });

        gsap.to(mock, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mock,
            start: "top 68%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      const stats = gsap.utils.toArray<HTMLElement>(".operating-stat");
      stats.forEach((stat) => {
        const labelLines = gsap.utils.toArray<HTMLElement>(
          ".operating-stat-label-line",
          stat,
        );

        gsap.set(labelLines, { opacity: 0, y: 14 });

        gsap.to(labelLines, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: stat,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      const lenis = window.lenis;
      let scrollPending = false;
      const onLenisScroll = () => {
        if (scrollPending) return;
        scrollPending = true;
        requestAnimationFrame(() => {
          ScrollTrigger.update();
          scrollPending = false;
        });
      };
      lenis?.on("scroll", onLenisScroll);

      ScrollTrigger.refresh();

      return () => {
        lenis?.off("scroll", onLenisScroll);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative z-10 min-h-screen bg-white text-[#0a143b]">
      <ShrimpLineAnimation className="h-full" />
      <ShrimpLineAnimation2 className="h-full" />
      <Container borderColor="#53535380">
        <div className={paddingTop ? "pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24" : "pt-0 pb-16 md:pb-20 lg:pb-24"}>
          {showHeader ? (
            <div
              ref={headerRef}
              className="mb-24 flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-5"
            >
              <h2
                ref={headingRef}
                className="order-1 max-w-sm text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:col-start-1 lg:row-start-1 lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>{sectionTitle}</span>
              </h2>

              <div className="relative z-10 order-2 flex max-w-md flex-col items-start gap-6 text-left lg:col-start-2 lg:row-start-1 lg:ml-auto lg:items-end">
                <p
                  ref={descRef}
                  className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
                >
                  {sectionDescription}
                </p>
              </div>

              <div className="order-3 lg:col-start-1 lg:row-start-2">
                {ctaVariant === "request-demo" ? (
                  <RequestDemoButton>{ctaLabel}</RequestDemoButton>
                ) : (
                  <Button href={ctaHref} target={ctaTarget} rel={ctaRel}>
                    {ctaLabel}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div ref={headerRef} className="sr-only">
              <h2 ref={headingRef}>{sectionTitle}</h2>
              <p ref={descRef}>{sectionDescription}</p>
            </div>
          )}

          <div className="space-y-28 md:space-y-36 lg:space-y-44">
            {rows.map((row) => {
              const Mock = row.transferTargetId ? row.Mock : row.Mock ?? DEFAULT_MOCKS[row.id];

              return (
                <div
                  key={row.id}
                  className="operating-row grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
                >
                  <div className="flex flex-col justify-center">
                    {row.tag ? (
                      <EyebrowPill surface="light">{row.tag}</EyebrowPill>
                    ) : null}
                    <h3 className="max-w-lg text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#444444] md:text-3xl lg:max-w-md lg:text-[1.75rem] lg:leading-[1.25]">
                      {row.heading}
                    </h3>
                    <p className="mt-8 max-w-md font-heading text-base font-regular leading-relaxed text-[#444444] md:mt-6 md:text-base">
                      {row.description}
                    </p>
                    {row.ctaHref && row.ctaLabel ? (
                      <div className="mt-6">
                        <Button href={row.ctaHref}>{row.ctaLabel}</Button>
                      </div>
                    ) : null}
                    {showStats && row.stat && row.statLabelLines ? (
                      <OperatingStatBlock
                        stat={row.stat}
                        labelLines={row.statLabelLines}
                        color={statColor}
                        gradient={statGradient}
                      />
                    ) : null}
                  </div>

                  <div className="operating-row-mock flex items-center justify-center">
                    {row.transferTargetId ? (
                      <div
                        data-transfer-target={row.transferTargetId}
                        className="hidden w-full max-w-[800px] min-h-[300px] lg:block lg:max-w-[900px] lg:min-h-[360px]"
                        aria-hidden
                      />
                    ) : null}
                    {Mock ? (
                      row.transferTargetId ? (
                        <div className="w-full lg:hidden">
                          <Mock />
                        </div>
                      ) : (
                        <Mock />
                      )
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
