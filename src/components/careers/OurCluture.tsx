"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

type CultureItem = {
  src: string;
  alt: string;
  caption: string;
  placement: string;
  imageHeight?: "large" | "medium";
};

const CULTURE_PARALLAX_TRAVEL = [
  { start: -52, end: 78 },
  { start: 64, end: -72 },
  { start: -36, end: 72 },
  { start: 72, end: -88 },
  { start: -46, end: 62 },
  { start: 50, end: -56 },
] as const;

const IMAGE_HEIGHTS = {
  large:
    "relative h-[18rem] w-full overflow-hidden rounded-xl sm:h-[22rem] md:h-[26rem] lg:h-[32rem]",
  medium:
    "relative h-[16rem] w-full overflow-hidden rounded-xl sm:h-[18rem] md:h-[22rem] lg:h-[26rem]",
} as const;

const cultureItems: CultureItem[] = [
  {
    src: "/images/careers/img1.webp",
    alt: "Team meeting collaboration",
    caption:
      "Built on collaboration — we ship together, share context freely, and win as one team.",
    placement: "lg:col-span-5 lg:row-span-6",
    imageHeight: "large",
  },
  {
    src: "/images/careers/img2.webp",
    alt: "Colleagues discussing work",
    caption:
      "A culture people stick with — we keep attrition around 2%, because the work and the team are worth staying for.",
    placement: "lg:col-span-7 lg:col-start-6 lg:row-span-6 lg:row-start-1",
    imageHeight: "large",
  },
  {
    src: "/images/careers/img3.webp",
    alt: "Team outdoor adventure",
    caption: "Tight feedback loops and shared ownership keep collaboration high and handoffs low.",
    placement: "lg:col-span-6 lg:row-span-3 lg:row-start-7 lg:mt-10 xl:mt-12",
    imageHeight: "medium",
  },
  {
    src: "/images/careers/img4.webp",
    alt: "Global team gathering outdoors",
    caption:
      "People stay because they grow here — low attrition, high trust, real impact on customers.",
    placement: "lg:col-span-6 lg:col-start-7 lg:row-span-3 lg:row-start-9",
    imageHeight: "medium",
  },
];

const bottomCulturePair = {
  left: {
    src: "/images/careers/img5.webp",
    alt: "Diverse team group photo",
    caption: "Collaboration first — from product to support, we build side by side.",
    placement: "",
    imageHeight: "large" as const,
  },
  right: {
    src: "/images/careers/img6.webp",
    alt: "Team in modern office space",
    caption: "~2% attrition. A team that chooses to keep building together.",
    placement: "",
    imageHeight: "medium" as const,
  },
};

const captionClassName =
  "max-w-md font-heading text-base font-medium leading-snug tracking-tight text-white/85 md:text-lg";

function CultureImage({
  item,
  className = "",
}: {
  item: CultureItem;
  className?: string;
}) {
  const imageWrapClass = item.imageHeight
    ? IMAGE_HEIGHTS[item.imageHeight]
    : "relative min-h-[14rem] w-full overflow-hidden rounded-xl";

  return (
    <div className={`${imageWrapClass} ${className}`}>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover"
        sizes={
          item.imageHeight
            ? "(max-width: 1024px) 100vw, 42vw"
            : "(max-width: 1024px) 100vw, 33vw"
        }
      />
    </div>
  );
}

function BottomCulturePair({
  left,
  right,
}: {
  left: CultureItem;
  right: CultureItem;
}) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:col-span-12 lg:row-start-12 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-4 xl:gap-x-8">
      <div className="culture-parallax-card flex flex-col gap-4 md:gap-5 lg:col-span-5 lg:gap-0">
        <div className="sm:min-h-[22rem] md:min-h-[26rem] lg:flex lg:min-h-[32rem] lg:items-end">
          <CultureImage item={left} className="w-full" />
        </div>
        <p className={`${captionClassName} lg:mt-4`}>{left.caption}</p>
      </div>

      <div className="culture-parallax-card flex flex-col gap-4 md:gap-5 lg:col-span-4 lg:col-start-6 lg:gap-0">
        <div className="sm:min-h-[22rem] md:min-h-[26rem] lg:flex lg:min-h-[32rem] lg:items-end">
          <CultureImage item={right} className="w-full" />
        </div>
        <p className={`${captionClassName} lg:mt-4`}>{right.caption}</p>
      </div>
    </div>
  );
}

function CultureCard({
  item,
  className = "",
}: {
  item: CultureItem;
  className?: string;
}) {
  return (
    <article
      className={`culture-parallax-card flex min-h-0 flex-col gap-4 md:gap-5 ${item.imageHeight ? "" : "h-full"} ${className}`}
    >
      <CultureImage item={item} />
      <p className={`${captionClassName} shrink-0`}>{item.caption}</p>
    </article>
  );
}

const OurCluture = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const grid = gridRef.current;
      if (!section || !grid) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (reducedMotion || isMobile) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        ".culture-parallax-card",
        grid,
      );
      const cleanups: Array<() => void> = [];

      cards.forEach((card, index) => {
        const travel =
          CULTURE_PARALLAX_TRAVEL[index] ?? CULTURE_PARALLAX_TRAVEL[0];

        gsap.set(card, { y: travel.start, force3D: true });

        const tween = gsap.to(card, {
          y: travel.end,
          ease: "none",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      });

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);
      ScrollTrigger.refresh();

      return () => {
        lenis?.off("scroll", onLenisScroll);
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33" className="relative">
        <SectionRadialGlow className="absolute left-1/2 top-[10%] z-0 -translate-x-1/2 opacity-70 md:top-[12%]" />

        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col items-start justify-end space-y-5">
              <EyebrowPill surface="dark" className="mb-0">
                Our Culture
              </EyebrowPill>

              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Driven by People,</span>
                <br />
                <span data-split>Powered by Purpose</span>
              </h2>
            </div>

            <div className="max-w-md text-left lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-white/75 md:text-[1.125rem]"
              >
                Our culture is built on collaboration — and it shows in how we
                work and stay. With ~2% attrition, people stick around to keep
                building together.
              </p>
            </div>
          </div>

          <div
            ref={gridRef}
            className="mt-14 grid grid-cols-1 gap-10 md:mt-16 md:gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10 xl:gap-x-8"
          >
            {cultureItems.map((item) => (
              <CultureCard
                key={item.src}
                item={item}
                className={item.placement}
              />
            ))}
            <BottomCulturePair
              left={bottomCulturePair.left}
              right={bottomCulturePair.right}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurCluture;