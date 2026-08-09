"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

const CARD_HEIGHT = "min-h-[28rem] md:min-h-[28rem] lg:min-h-[30rem]";

type RecognitionCard =
  | { id: string; type: "image"; src: string; alt: string }
  | { id: string; type: "text"; text: string };

const CARDS: RecognitionCard[] = [
  {
    id: "recognition-1",
    type: "image",
    src: "/images/about/recoginition-1.webp",
    alt: "CoverForce Insurtech 50 2025 recognition",
  },
  {
    id: "recognition-2",
    type: "text",
    text: "Named to the 2025 CB Insights Insurtech 50, an annual list honoring the world's most innovative and high-impact insurtech companies.",
  },
  {
    id: "recognition-3",
    type: "image",
    src: "/images/about/recoginition-3.webp",
    alt: "Insurtech industry event",
  },
];

function RecognitionImageCard({ src, alt }: { src: string; alt: string }) {
  return (
    <article className={`relative overflow-hidden rounded-md ${CARD_HEIGHT}`}>
      <Image src={src} alt={alt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 33vw" />
    </article>
  );
}

function RecognitionTextCard({ text }: { text: string }) {
  return (
    <article
      className={`flex overflow-hidden rounded-md bg-white ${CARD_HEIGHT} flex-col justify-end p-6 md:p-8`}
    >
      <p className="font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#111110] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
        {text}
      </p>
    </article>
  );
}

function RecognitionCardItem({ card }: { card: RecognitionCard }) {
  if (card.type === "image") {
    return <RecognitionImageCard src={card.src} alt={card.alt} />;
  }

  return <RecognitionTextCard text={card.text} />;
}

const Recognition = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    theme: "dark",
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      const overlay = overlayRef.current;
      const grid = cardsGridRef.current;
      if (!section || !container || !overlay || !grid) return;

      const cards = gsap.utils.toArray<HTMLElement>(".recognition-card", grid);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isSmallDevice = window.matchMedia("(max-width: 1023px)").matches;

      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, x: 0, clearProps: "transform" });
        return;
      }

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

      gsap.set(container, {
        y: 0,
        scale: 1,
        force3D: true,
        transformOrigin: "50% 50%",
        backfaceVisibility: "hidden",
      });
      gsap.set(overlay, { opacity: 0, pointerEvents: "none" });

      let parallaxTl: gsap.core.Timeline | null = null;
      let overlayTl: gsap.core.Timeline | null = null;

      if (!isSmallDevice) {
        const getShift = () => container.offsetHeight;
        const scrollEnd = "bottom -180%";
        const scrollConfig = {
          trigger: section,
          scrub: 0.35,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        };

        parallaxTl = gsap.timeline({
          scrollTrigger: {
            ...scrollConfig,
            start: "bottom bottom",
            end: scrollEnd,
          },
        });

        parallaxTl.to(container, {
          y: getShift,
          scale: 0.8,
          ease: "none",
          force3D: true,
        });

        overlayTl = gsap.timeline({
          scrollTrigger: {
            ...scrollConfig,
            start: "bottom center",
            end: scrollEnd,
          },
        });

        overlayTl.to(overlay, {
          opacity: 0.85,
          ease: "none",
        });
      }

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
        revealTl.scrollTrigger?.kill();
        revealTl.kill();
        parallaxTl?.scrollTrigger?.kill();
        parallaxTl?.kill();
        overlayTl?.scrollTrigger?.kill();
        overlayTl?.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative z-30 overflow-hidden bg-[#151f4d] text-white">
      <div ref={containerRef} className="relative z-10 overflow-hidden lg:will-change-transform">
        <Container borderColor="#FFFFFF33" className="relative z-10">
          <div className="flex flex-col gap-10 py-16 md:gap-12 md:py-20 lg:gap-14 lg:py-24">
            <div
              ref={headerRef}
              className="flex max-w-xl flex-col items-start justify-end space-y-5"
            >
              <EyebrowPill surface="dark" className="mb-0">
                Recognition
              </EyebrowPill>

              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>
                  Recognized Among the World&apos;s Leading Insurtech Innovators
                </span>
              </h2>
            </div>

            <div ref={cardsGridRef} className="grid gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
              {CARDS.map((card) => (
                <div key={card.id} className="recognition-card h-full">
                  <RecognitionCardItem card={card} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 bg-[#080808]"
        aria-hidden
      />
    </section>
  );
};

export default Recognition;
