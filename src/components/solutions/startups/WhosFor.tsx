"use client";

import { useRef, type ComponentType } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Rocket, Briefcase } from "lucide-react";
import Container from "@/components/common/Container";
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
    title: ["Stealth or VC", "funded teams"],
    description:
      "You're building in stealth, backed by investors, or part of an accelerator program.",
    Icon: Rocket,
    background: "startup",
  },
  {
    number: "02",
    title: ["Incubated", "startups"],
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
      className="whos-for-card way-card-shell relative flex flex-col overflow-hidden rounded-md text-white will-change-transform"
    >
      <div
        className="absolute inset-0"
        style={{ background: CARD_BACKGROUND_STYLES[background] }}
        aria-hidden
      />

      <div className="pointer-events-none relative z-10 flex flex-col p-6 md:p-8">
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

        <div className="mt-8 md:mt-10">
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
            className="flex max-w-3xl flex-col items-start"
          >
            <h2
              ref={headingRef}
              className="text-2xl font-heading font-regular leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl md:text-4xl lg:text-[1.625rem] lg:leading-[1.15] lg:whitespace-nowrap"
            >
              <span data-split>Built for founders who are serious about insurance.</span>
            </h2>

            <p
              ref={descRef}
              className="mt-4 max-w-md font-sans text-sm font-regular leading-[1.4] text-[#D1D1D1] md:mt-5 md:text-[1.125rem]"
            >
              If you meet the criteria, you're welcome to apply
            </p>
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

          <p className="max-w-2xl font-sans text-sm font-regular leading-[1.45] text-white/60 md:text-[0.9375rem]">
            <span className="font-medium text-white/75">Note:</span> B2B2B startups
            - those building for brokers, agencies, and distribution partners - are
            also a strong fit for this program.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default WhosFor;
