"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SolutionHeroCardsProps = {
  transferTargetId: string;
  cardOne: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  cardTwo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export default function SolutionHeroCards({
  transferTargetId,
  cardOne,
  cardTwo,
}: SolutionHeroCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardOneRef = useRef<HTMLDivElement>(null);
  const cardTwoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const cardOneEl = cardOneRef.current;
      const cardTwoEl = cardTwoRef.current;
      if (!root || !cardOneEl || !cardTwoEl) return;

      const section = root.closest("section");
      const target = document.querySelector<HTMLElement>(
        `[data-transfer-target="${transferTargetId}"]`,
      );

      if (!section || !target) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const updateCards = (
        progress: number,
        config: {
          baseY: number;
          startY: number;
          startX: number;
          startCenterY: number;
          cardOneStartX: number;
          cardOneStartY: number;
        },
      ) => {
        const baseY = (1 - progress) * config.baseY;
        const extraY = gsap.utils.interpolate(config.startY, 0, progress);
        const extraX = gsap.utils.interpolate(config.startX, 0, progress);
        const centerY = gsap.utils.interpolate(config.startCenterY, 0, progress);
        const cardOneX = gsap.utils.interpolate(config.cardOneStartX, 0, progress);
        const cardOneY = gsap.utils.interpolate(config.cardOneStartY, 0, progress);

        gsap.set(root, { y: centerY });
        gsap.set(cardOneEl, { x: cardOneX, y: baseY + cardOneY });
        gsap.set(cardTwoEl, { x: extraX, y: baseY + extraY });
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          endTrigger: target,
          end: "top center",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            updateCards(self.progress, {
              baseY: 64,
              startY: 128,
              startX: -48,
              startCenterY: -92,
              cardOneStartX: 32,
              cardOneStartY: 24,
            }),
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

        updateCards(0, {
          baseY: 64,
          startY: 128,
          startX: -48,
          startCenterY: -92,
          cardOneStartX: 32,
          cardOneStartY: 24,
        });

        return () => {
          trigger.kill();
          lenis?.off("scroll", onLenisScroll);
          gsap.set([root, cardOneEl, cardTwoEl], { clearProps: "transform" });
        };
      });

      mm.add("(max-width: 1023px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.45,
          onUpdate: (self) =>
            updateCards(self.progress, {
              baseY: 32,
              startY: 64,
              startX: -24,
              startCenterY: -44,
              cardOneStartX: 16,
              cardOneStartY: 12,
            }),
        });

        updateCards(0, {
          baseY: 32,
          startY: 64,
          startX: -24,
          startCenterY: -44,
          cardOneStartX: 16,
          cardOneStartY: 12,
        });

        return () => {
          trigger.kill();
          gsap.set([root, cardOneEl, cardTwoEl], { clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [transferTargetId] },
  );

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-[min(100%,420px)] pb-12 will-change-transform sm:pb-16 md:pb-14 lg:max-w-[320px] xl:max-w-[min(100%,420px)]"
    >
      <div ref={cardOneRef} className="relative z-10 w-full will-change-transform">
        <Image
          src={cardOne.src}
          alt={cardOne.alt}
          width={cardOne.width}
          height={cardOne.height}
          className="h-auto w-full"
          priority
        />
      </div>
      <div
        ref={cardTwoRef}
        className="relative z-20 -ml-8 mt-6 w-[94%] max-w-[360px] will-change-transform sm:-ml-10 sm:mt-8 md:absolute md:bottom-20 md:-left-4 md:mt-0 md:w-[88%] lg:-left-5 lg:bottom-16 lg:w-[86%] lg:max-w-[280px] xl:-left-6 xl:bottom-20 xl:max-w-[360px]"
      >
        <Image
          src={cardTwo.src}
          alt={cardTwo.alt}
          width={cardTwo.width}
          height={cardTwo.height}
          className="h-auto w-full drop-shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          priority
        />
      </div>
    </div>
  );
}
