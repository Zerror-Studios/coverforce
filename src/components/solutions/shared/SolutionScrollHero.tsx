"use client";

import { useRef, type ReactNode } from "react";
import { RiArrowRightLine } from "@remixicon/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import HeroReveal from "@/components/common/HeroReveal";
import EyebrowPill from "@/components/common/EyebrowPill";
import {
  MarqueeRow,
  type MarqueeLogo,
} from "@/components/solutions/wholesalers/MarqueeLine";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import type { GradFlowColors, GradFlowRgb } from "@/data/wayCardStyles";
import { GradFlow } from "gradflow";

gsap.registerPlugin(ScrollTrigger);

/** Darken GradFlow RGB so hero text stays readable without a black overlay. */
function darkenGradFlowColor(color: GradFlowRgb, amount = 0.42): GradFlowRgb {
  const keep = 1 - amount;
  return {
    r: Math.round(color.r * keep),
    g: Math.round(color.g * keep),
    b: Math.round(color.b * keep),
  };
}

function darkenGradFlow(colors: GradFlowColors, amount = 0.42): GradFlowColors {
  return {
    color1: darkenGradFlowColor(colors.color1, amount),
    color2: darkenGradFlowColor(colors.color2, amount),
    color3: darkenGradFlowColor(colors.color3, amount + 0.08),
  };
}

export type SolutionHeroFeature = {
  readonly heading: string;
  readonly description: string;
  readonly stat?: string;
  readonly statLabelLines?: readonly [string, string];
  readonly statColor?: string;
};

export type SolutionListPoint = {
  readonly id: string;
  readonly text: string;
};

type SolutionScrollHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  titleClassName?: string;
  primaryButtonHref?: string;
  primaryButtonLabel?: string;
  secondaryButtonHref?: string;
  secondaryButtonLabel?: string;
  feature?: SolutionHeroFeature;
  featureHeaderTitle?: ReactNode;
  featureHeaderDescription?: string;
  featureHeaderCtaHref?: string;
  featureHeaderCtaLabel?: string;
  featureHeaderCtaVariant?: "link" | "request-demo";
  listTag?: string;
  listHeading?: string;
  listPoints?: readonly SolutionListPoint[];
  rightCard?: ReactNode;
  rightCardTransferTargetId?: string;
  gradFlow: GradFlowColors;
  showMarquee?: boolean;
  marqueeLogos?: readonly MarqueeLogo[];
  marqueeSize?: "default" | "large";
  showSecondSection?: boolean;
};

function PointText({ text }: { text: string }) {
  return (
    <p className="max-w-sm text-sm font-heading font-regular leading-relaxed text-[#0a143b] md:text-sm">
      {text}
    </p>
  );
}

export default function SolutionScrollHero({
  eyebrow,
  title,
  description,
  titleClassName = "max-w-xl text-3xl font-heading font-normal leading-[1.12] tracking-tight text-[#0a143b] md:text-4xl lg:text-6xl lg:leading-[1.1] xl:text-6xl",
  primaryButtonHref = "/contact",
  primaryButtonLabel = "Request demo",
  secondaryButtonHref = "#workflow",
  secondaryButtonLabel = "How it works",
  feature,
  featureHeaderTitle,
  featureHeaderDescription,
  featureHeaderCtaHref,
  featureHeaderCtaLabel,
  featureHeaderCtaVariant = "link",
  listTag,
  listHeading,
  listPoints,
  rightCard,
  rightCardTransferTargetId,
  gradFlow,
  showMarquee = false,
  marqueeLogos,
  marqueeSize = "default",
  showSecondSection = true,
}: SolutionScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const listHeaderRef = useRef<HTMLDivElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const featureHeaderRef = useRef<HTMLDivElement>(null);
  const featureHeaderHeadingRef = useRef<HTMLHeadingElement>(null);
  const featureHeaderDescRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef: listHeaderRef,
    headingRef: listHeadingRef,
  });

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef: featureHeaderRef,
    headingRef: featureHeaderHeadingRef,
    descRef: featureHeaderDescRef,
  });

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!rightCard || !card) return;

      if (!showSecondSection && rightCardTransferTargetId) {
        const target = document.querySelector<HTMLElement>(
          `[data-transfer-target="${rightCardTransferTargetId}"]`,
        );

        if (!target) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(card, { clearProps: "transform" });
            return;
          }

          let sourceRect = card.getBoundingClientRect();
          let targetRect = target.getBoundingClientRect();

          const measure = () => {
            gsap.set(card, { x: 0, y: 0, scale: 1, transformOrigin: "top left" });
            sourceRect = card.getBoundingClientRect();
            targetRect = target.getBoundingClientRect();
          };

          const updateCardPosition = (progress: number) => {
            const x = gsap.utils.interpolate(0, targetRect.left - sourceRect.left, progress);
            const y = gsap.utils.interpolate(0, targetRect.top - sourceRect.top - 80, progress);
            const scale = gsap.utils.interpolate(1, targetRect.width / sourceRect.width, progress);

            gsap.set(card, { x, y, scale, transformOrigin: "top left" });
          };

          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            endTrigger: target,
            end: "top center",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: measure,
            onUpdate: (self) => updateCardPosition(self.progress),
          });

          measure();
          updateCardPosition(0);

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
            trigger.kill();
            lenis?.off("scroll", onLenisScroll);
            gsap.set(card, { clearProps: "transform" });
          };
        });

        return () => mm.revert();
      }

      if (!showSecondSection) return;

      const section = sectionRef.current;
      const heroContent = heroContentRef.current;
      const listHeader = listHeaderRef.current;
      if (!section || !heroContent || !listHeader) return;

      const getCenterY = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return rect.top + rect.height / 2;
      };

      const updateCardTransform = (progress: number) => {
        const viewportCenter = window.innerHeight / 2;
        const heroCenter = getCenterY(heroContent);
        const listCenter = getCenterY(listHeader) + 96;
        const targetCenter = gsap.utils.interpolate(heroCenter, listCenter, progress);
        const scale = gsap.utils.interpolate(1, 0.92, progress);

        gsap.set(card, {
          y: targetCenter - viewportCenter,
          scale,
        });
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          updateCardTransform(0);
          return;
        }

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          endTrigger: listHeader,
          end: "center center",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateCardTransform(self.progress),
        });

        updateCardTransform(0);

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    {
      scope: sectionRef,
      dependencies: [rightCard, rightCardTransferTargetId, showSecondSection],
    },
  );

  return (
    <section ref={sectionRef} className="relative z-20 bg-white text-[#0a143b]">
      <Container borderColor="#53535380" className="relative z-10">
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <div className="relative flex h-svh flex-col">
              <div ref={heroContentRef} className="flex min-h-0 flex-1 flex-col justify-center">
                <HeroReveal className="flex flex-col justify-center space-y-8">
                  <EyebrowPill surface="dark">{eyebrow}</EyebrowPill>
                  <h1 className={titleClassName} style={{ color: "#FFFFFF" }}>
                    {title}
                  </h1>
                  {description ? (
                    <p className="max-w-sm font-heading text-sm font-regular leading-relaxed text-white/80 md:text-sm">
                      {description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-4">
                    <Button href={primaryButtonHref} balanced surface="on-dark">
                      {primaryButtonLabel}
                    </Button>
                    <Button
                      href={secondaryButtonHref}
                      balanced
                      variant="secondary"
                      surface="on-dark"
                    >
                      {secondaryButtonLabel}
                    </Button>
                  </div>
                </HeroReveal>
              </div>

              {showMarquee ? (
                <div className="relative z-10 w-full shrink-0 pb-6 md:pb-8 lg:hidden">
                  <MarqueeRow logos={marqueeLogos} size={marqueeSize} tone="light" />
                </div>
              ) : null}
            </div>

            {showSecondSection ? (
            <div
              ref={listHeaderRef}
              className="flex flex-col justify-between pt-16 pb-16 lg:min-h-svh lg:pt-24 lg:pb-36"
            >
              {feature ? (
                <>
                  {featureHeaderTitle ? (
                    <div
                      ref={featureHeaderRef}
                      className="mb-24 grid gap-8 lg:w-[calc(200%+4rem)] lg:max-w-none lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12 xl:w-[calc(200%+5rem)]"
                    >
                      <div className="flex flex-col justify-end space-y-5">
                        <h2
                          ref={featureHeaderHeadingRef}
                          className="max-w-sm text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                        >
                          <span data-split>{featureHeaderTitle}</span>
                        </h2>
                        {featureHeaderCtaLabel &&
                        (featureHeaderCtaVariant === "request-demo" || featureHeaderCtaHref) ? (
                          featureHeaderCtaVariant === "request-demo" ? (
                            <RequestDemoButton>{featureHeaderCtaLabel}</RequestDemoButton>
                          ) : (
                            <Button href={featureHeaderCtaHref!}>
                              {featureHeaderCtaLabel}
                            </Button>
                          )
                        ) : null}
                      </div>
                      {featureHeaderDescription ? (
                        <div className="flex max-w-md flex-col items-start gap-6 text-left lg:ml-auto lg:items-end">
                          <p
                            ref={featureHeaderDescRef}
                            className="font-sans text-sm font-regular leading-[1.4] text-[#50617a] md:text-[1.125rem]"
                          >
                            {featureHeaderDescription}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="max-w-md">
                    <h2
                      ref={listHeadingRef}
                      className="max-w-lg text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#444444] md:text-3xl lg:max-w-md lg:text-[1.75rem] lg:leading-[1.25]"
                    >
                      <span data-split>{feature.heading}</span>
                    </h2>

                    <p className="mt-8 max-w-sm font-heading text-sm font-regular leading-relaxed text-[#444444] md:mt-6 md:text-sm">
                      {feature.description}
                    </p>
                    {feature.stat && feature.statLabelLines ? (
                      <div className="mt-10 flex items-center gap-4 md:mt-8 md:gap-5">
                        <span
                          className="text-2xl font-heading font-regular leading-[1.2] tracking-tight md:text-3xl lg:text-[1.75rem] lg:leading-[1.25]"
                          style={{ color: feature.statColor ?? "#33259F" }}
                        >
                          {feature.stat}
                        </span>
                        <span
                          className="font-heading text-sm font-medium leading-[1.2] md:text-xs"
                          style={{ color: feature.statColor ?? "#33259F" }}
                        >
                          {feature.statLabelLines[0]}
                          <br />
                          {feature.statLabelLines[1]}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {rightCard ? (
                    <div className="mt-8 w-full lg:hidden">
                      {rightCard}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {listTag ? <EyebrowPill surface="light">{listTag}</EyebrowPill> : null}
                  <h2
                    ref={listHeadingRef}
                    className="mt-4 max-w-lg text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#0a143b] md:text-3xl lg:max-w-md lg:text-[1.75rem] lg:leading-tight"
                  >
                    <span data-split>{listHeading}</span>
                  </h2>
                  <ul className="mt-8 space-y-0 md:mt-10">
                    {listPoints?.map((point) => (
                      <li
                        key={point.id}
                        className="flex gap-4 border-b border-black/10 py-4"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#151F4D] bg-[#151F4D] text-white">
                          <RiArrowRightLine className="size-3" aria-hidden />
                        </span>
                        <PointText text={point.text} />
                      </li>
                    ))}
                  </ul>
                  {rightCard ? (
                    <div className="mt-8 w-full lg:hidden">
                      {rightCard}
                    </div>
                  ) : null}
                </>
              )}
            </div>
            ) : null}
          </div>

          {rightCard ? (
            <div
              className={`relative z-30 ${
                showSecondSection ? "hidden lg:block" : "hidden lg:flex lg:h-svh lg:items-center lg:justify-center"
              }`}
            >
              {showSecondSection ? (
              <div className="sticky top-0 flex h-svh items-center justify-center">
                <div
                  ref={cardRef}
                  className="relative z-40 flex w-full items-center justify-center will-change-transform"
                >
                  {rightCard}
                </div>
              </div>
              ) : (
                <div
                  ref={cardRef}
                  className="relative flex w-full items-center justify-center will-change-transform"
                >
                  {rightCard}
                </div>
              )}
            </div>
          ) : null}

          {showMarquee ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-svh flex-col justify-end pb-6 md:pb-8 lg:flex">
              <div className="pointer-events-auto w-full">
                <MarqueeRow logos={marqueeLogos} size={marqueeSize} tone="light" />
              </div>
            </div>
          ) : null}
        </div>
      </Container>

      <div className="pointer-events-none absolute left-0 top-0 z-0 h-svh w-[calc(100vw+2rem)] overflow-hidden">
        <GradFlow
          className="absolute inset-0 h-full w-full"
          config={{
            ...darkenGradFlow(gradFlow),
            speed: 0.4,
            scale: 1,
            type: "stripe",
            noise: 0.08,
          }}
        />
      </div>
    </section>
  );
}
