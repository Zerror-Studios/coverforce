"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import {
  CARD_BACKGROUND_STYLES,
  type CardBackground,
} from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

const WayCardDotGridScene = dynamic(
  () => import("@/components/home/WayCardDotGridScene"),
  { ssr: false, loading: () => null },
);

function useLazyInView<T extends HTMLElement>(rootMargin = "240px 0px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return { ref, visible };
}

type ValueCard = {
  id: string;
  label: string;
  body: string;
  background: CardBackground;
};

const VALUE_CARDS: ValueCard[] = [
  {
    id: "ownership",
    label: "Ownership",
    body: "We take full responsibility for outcomes - from first idea to lasting customer impact.",
    background: "developer",
  },
  {
    id: "learning-curious",
    label: "Be Learning-Curious",
    body: "We stay curious, ask better questions, and keep leveling up how we build and serve.",
    background: "wholesaler",
  },
  {
    id: "communication",
    label: "Communication",
    body: "Clear, direct communication keeps teams aligned, decisions fast, and customers informed.",
    background: "broker",
  },
  {
    id: "frugality",
    label: "Frugality",
    body: "We focus on what yields real customer benefit and ROI - spending energy where it matters most.",
    background: "startup",
  },
  {
    id: "customer-obsession",
    label: "Customer Obsession",
    body: "Every decision starts with the customer - their workflow, their trust, and their success.",
    background: "carrier",
  },
];

const CARD_HEIGHT = "min-h-[22rem] md:min-h-[29rem]";

function ValueCardItem({ card }: { card: ValueCard }) {
  const [hovered, setHovered] = useState(false);
  const { ref: cardRef, visible: inView } = useLazyInView<HTMLElement>();

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`values-card values-card-shell way-card-shell  group relative flex ${CARD_HEIGHT} flex-col overflow-hidden rounded-md`}
    >
      <div className="way-card-body values-card-body absolute inset-0 overflow-hidden rounded-md">
        <div
          className="absolute inset-0 rounded-md"
          style={{ background: CARD_BACKGROUND_STYLES[card.background] }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-md"
          aria-hidden
        >
          {inView ? <WayCardDotGridScene variant="dark" active={hovered} /> : null}
        </div>
      </div>

      <div className="values-card-content pointer-events-none relative z-10 flex w-full flex-1 flex-col justify-center p-6 md:p-8">
        <div className="max-w-[22rem]">
          <p className="font-mono text-[0.6875rem] font-medium uppercase text-white md:text-sm">
            {card.label}
          </p>
          <p className="mt-3 font-heading text-base font-medium leading-[1.35] tracking-tight text-white md:mt-5 md:text-2xl md:leading-[1.3]">
            {card.body}
          </p>
        </div>
      </div>
    </article>
  );
}

const OurValues = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const stickyContentRef = useRef<HTMLDivElement>(null);
  const cardsViewportRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stickyContent = stickyContentRef.current;
      const viewport = cardsViewportRef.current;
      const grid = cardsGridRef.current;
      if (!section || !stickyContent || !viewport || !grid) return;

      const cards = gsap.utils.toArray<HTMLElement>(".values-card", grid);
      if (!cards.length) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, x: 0, clearProps: "transform" });
        return;
      }

      const mm = gsap.matchMedia();
      gsap.set(cards, { opacity: 0, x: 72 });

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top 78%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      revealTl.to(cards, {
        opacity: 1,
        x: 0,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.14,
        clearProps: "transform",
      });

      mm.add("(min-width: 1024px)", () => {
        const getShift = () => Math.max(0, grid.scrollWidth - viewport.clientWidth);
        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getShift()}`,
            scrub: 1,
            pin: stickyContent,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        horizontalTl.to(grid, {
          x: () => -getShift(),
          ease: "none",
        });

        return () => {
          horizontalTl.scrollTrigger?.kill();
          horizontalTl.kill();
        };
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
        mm.revert();
        revealTl.scrollTrigger?.kill();
        revealTl.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh overflow-hidden bg-white text-[#0a143b]"
    >
      <style>{`
        .values-card-shell.way-card-shell {
          --way-card-hover-scale: 1.03;
        }

        .values-card-shell .way-card-body {
          transition: transform 800ms cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: translate3d(0, 0, 0) scale(1);
        }
      `}</style>
      <Container borderColor="#53535380" className="relative z-10 min-h-svh">
        <div
          ref={stickyContentRef}
          className="flex min-h-svh flex-col justify-center gap-10 py-12 md:gap-12 md:py-16 lg:h-svh lg:gap-14 lg:py-0"
        >
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col items-start justify-end space-y-5">
              <EyebrowPill surface="light" className="mb-0">
                Our Values
              </EyebrowPill>
              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Built for efficiency</span>
              </h2>
            </div>

            <div className="max-w-md text-left lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#797979] md:text-[1.125rem]"
              >
                Our values shape our culture, decisions, and the impact we create
                every day.
              </p>
            </div>
          </div>

          <div ref={cardsViewportRef} className="relative overflow-hidden lg:min-h-[29rem]">
            <div
              ref={cardsGridRef}
              className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:flex lg:w-max lg:gap-8"
            >
              {VALUE_CARDS.map((card) => (
                <div key={card.id} className="lg:w-[24rem] lg:flex-none">
                  <ValueCardItem card={card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurValues;
