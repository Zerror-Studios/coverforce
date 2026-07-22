"use client";

import { useRef, type ComponentType } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Rocket, Briefcase } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import {
  CARD_BACKGROUND_STYLES,
  type CardBackground,
} from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

type AudienceCard = {
  number: string;
  title: [string, string];
  description: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  background: CardBackground;
};

const audienceCards: AudienceCard[] = [
  {
    number: "01",
    title: ["Stealth or", "funded teams"],
    description:
      "You're building quietly, backed by investors, or part of a trusted accelerator program.",
    Icon: Rocket,
    background: "startup",
  },
  {
    number: "02",
    title: ["Studio-built", "companies"],
    description:
      "Your company started inside a venture studio, foundry, or company builder and is now ready to launch or grow.",
    Icon: Building2,
    background: "wholesaler",
  },
  {
    number: "03",
    title: ["New", "brokerages"],
    description:
      "You're starting a brokerage, writing your first policies, or growing an early book of business.",
    Icon: Briefcase,
    background: "broker",
  },
];

const REVEAL_EASE = "power3.out";

function AudienceCardItem({
  item,
  cardRef,
}: {
  item: AudienceCard;
  cardRef: (el: HTMLElement | null) => void;
}) {
  const { number, title, description, Icon, background } = item;

  return (
    <article
      ref={cardRef}
      className="whos-for-card way-card-shell relative flex min-h-[22rem] flex-col overflow-hidden rounded-md text-white will-change-transform md:min-h-[26rem] lg:min-h-[28rem]"
    >
      <div
        className="absolute inset-0"
        style={{ background: CARD_BACKGROUND_STYLES[background] }}
        aria-hidden
      />

      <div className="pointer-events-none relative z-10 flex h-full min-h-[22rem] flex-col p-6 md:min-h-[26rem] md:p-8 lg:min-h-[28rem]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[15rem] text-2xl font-heading font-regular leading-[1.15] tracking-tight text-white sm:max-w-[18rem] sm:text-3xl md:text-4xl lg:text-3xl lg:leading-[1.15]">
            {title[0]}
            <br />
            {title[1]}
          </h3>
          <Icon
            className="mt-1 size-6 shrink-0 text-white/85 md:size-7"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>

        <div className="mt-auto">
          <span className="font-mono text-xs font-medium tracking-wide text-white/70 md:text-sm">
            {number}
          </span>
          <div className="mt-3 border-t border-white/35 pt-4">
            <p className="max-w-md font-sans text-sm font-regular leading-[1.4] text-white/85 md:text-[1.125rem]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

const WhosFor = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  useGSAP(
    () => {
      const grid = cardsGridRef.current;
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (!grid || !cards.length) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, x: 72, force3D: true });
      });

      const st = ScrollTrigger.create({
        trigger: grid,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: REVEAL_EASE,
            onComplete: () => gsap.set(cards, { clearProps: "transform" }),
          });
        },
      });

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);

      return () => {
        lenis?.off("scroll", onLenisScroll);
        st.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative bg-[#121C49] text-white">
      <Container borderColor="#FFFFFF33" className="relative z-10">
        <div className="flex flex-col gap-10 py-16 md:gap-12 md:py-20 lg:gap-14 lg:py-24">
          <div
            ref={headerRef}
            className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-5"
          >
            <h2
              ref={headingRef}
              className="order-1 max-w-sm text-2xl font-heading font-regular leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl md:text-4xl lg:col-start-1 lg:row-start-1 lg:text-3xl lg:leading-[1.15]"
            >
              <span data-split>Built for founders who are </span>
              <span
                data-split
                className="bg-linear-to-r from-[#A483FE] via-[#8B7CFF] to-[#C4B5FF] bg-clip-text text-transparent"
              >
                serious
              </span>
              <span data-split> about insurance.</span>
            </h2>

            <div className="order-2 flex max-w-md flex-col items-start justify-end gap-6 text-left lg:col-start-2 lg:row-start-1 lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans text-sm font-regular leading-[1.4] text-[#D1D1D1] md:text-[1.125rem]"
              >
                If you meet the criteria, apply below.
              </p>
            </div>

            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <Button href="/contact" surface="on-dark">
                Apply to Startup Program
              </Button>
            </div>
          </div>

          <div
            ref={cardsGridRef}
            className="grid gap-4 md:grid-cols-3 md:gap-5"
          >
            {audienceCards.map((card, index) => (
              <AudienceCardItem
                key={card.number}
                item={card}
                cardRef={(el) => {
                  cardRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhosFor;
