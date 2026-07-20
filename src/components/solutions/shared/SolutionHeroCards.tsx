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
        config: { baseY: number; startY: number; startX: number; startCenterY: number },
      ) => {
        const baseY = progress * config.baseY;
        const extraY = gsap.utils.interpolate(config.startY, 0, progress);
        const extraX = gsap.utils.interpolate(config.startX, 0, progress);
        const centerY = gsap.utils.interpolate(config.startCenterY, 0, progress);

        gsap.set(root, { y: centerY });
        gsap.set(cardOneEl, { x: 0, y: baseY });
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
              startY: 176,
              startX: -56,
              startCenterY: -92,
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

        updateCards(0, { baseY: 64, startY: 176, startX: -56, startCenterY: -92 });

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
              startY: 88,
              startX: -28,
              startCenterY: -44,
            }),
        });

        updateCards(0, { baseY: 32, startY: 88, startX: -28, startCenterY: -44 });

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
      className="relative mx-auto w-full max-w-[min(100%,420px)] pb-16 will-change-transform sm:pb-20 md:pb-16"
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
        className="relative z-20 -ml-8 mt-10 w-[94%] max-w-[360px] will-change-transform sm:-ml-10 sm:mt-12 md:absolute md:bottom-0 md:-left-4 md:mt-0 md:w-[88%] lg:-left-6 lg:w-[86%]"
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
