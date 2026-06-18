"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Container from "../common/Container";
import Button from "../common/Button";
import ArrowNavButton from "../common/ArrowNavButton";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

type WhySlide = {
  id: string;
  image: string;
  alt: string;
  label: string;
};

const whySlides: WhySlide[] = [
  {
    id: "slide-1",
    image:
      "https://images.unsplash.com/photo-1773227930443-730f0f1f2154?q=80&w=1332&auto=format&fit=crop",
    alt: "Abstract blue geometric pattern",
    label: "Full Lifecycle, Not Just Quotes",
  },
  {
    id: "slide-2",
    image:
      "https://images.unsplash.com/photo-1777828634169-e3d9f138ee01?q=80&w=1332&auto=format&fit=crop",
    alt: "Layered blue abstract shapes",
    label: "API-First Architecture",
  },
  {
    id: "slide-3",
    image:
      "https://images.unsplash.com/photo-1658753570876-3cc72c842b44?q=80&w=1332&auto=format&fit=crop",
    alt: "White geometric cube landscape",
    label: "Real-Time Data Sync",
  },
  {
    id: "slide-4",
    image:
      "https://images.unsplash.com/photo-1770885653473-ca48b4d69173?q=80&w=1332&auto=format&fit=crop",
    alt: "Flowing dark blue abstract waves",
    label: "Carrier Integrations",
  },
];

const SLIDE_TRANSITION_MS = 600;

const WhyCoverforce = ({ paddingTop }: { paddingTop?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const animatingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    if (index === active || animatingRef.current) return;
    animatingRef.current = true;
    setActive(index);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      animatingRef.current = false;
    }, SLIDE_TRANSITION_MS);
  }, [active]);

  const prev = useCallback(
    () => goTo((active - 1 + whySlides.length) % whySlides.length),
    [active, goTo],
  );
  const next = useCallback(
    () => goTo((active + 1) % whySlides.length),
    [active, goTo],
  );

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

  useGSAP(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const section = sectionRef.current;
    if (!container || !overlay || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const getShift = () => container.offsetHeight;

    gsap.set(container, {
      y: 0,
      scale: 1,
      force3D: true,
      transformOrigin: "50% 50%",
      backfaceVisibility: "hidden",
    });
    gsap.set(overlay, { opacity: 0, pointerEvents: "none" });

    const scrollEnd = "bottom -180%";
    const scrollConfig = {
      trigger: section,
      scrub: 0.35,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    };

    const parallaxTl = gsap.timeline({
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

    const overlayTl = gsap.timeline({
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
      parallaxTl.scrollTrigger?.kill();
      parallaxTl.kill();
      overlayTl.scrollTrigger?.kill();
      overlayTl.kill();
    };
  }, { scope: sectionRef });
  return (
    <section ref={sectionRef} className="relative z-30 overflow-hidden bg-white text-[#0a143b]">
      {/* Slider CSS — scoped to this section */}
      <style>{`
        .why-slider-track {
          display: flex;
          gap: 12px;
          align-items: stretch;
          width: 100%;
          height: 340px;
        }
        @media (min-width: 640px) {
          .why-slider-track { height: 380px; gap: 16px; }
        }
        @media (min-width: 1024px) {
          .why-slider-track { height: 420px; gap: 20px; }
        }

        .why-slide {
          position: relative;
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          background: #E3E3E3;
          transition: flex 0.6s cubic-bezier(0.77, 0, 0.18, 1);
        }
        .why-slide.is-active  { flex: 5 0 0; cursor: default; }
        .why-slide.is-inactive { flex: 1 0 0; }

        .why-slide img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.77, 0, 0.18, 1);
        }
        .why-slide.is-inactive:hover img { transform: scale(1.04); }

        .why-slide-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 32px 20px 18px;
          background: linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s ease 0.25s, transform 0.4s ease 0.25s;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .why-slide.is-active .why-slide-label {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <div ref={containerRef} className="relative z-10 overflow-hidden will-change-transform">
        <Container borderColor="#53535380">
          <div className={`pb-16 md:pb-20 lg:pb-24 ${paddingTop ? "pt-24" : ""}`}>
            {/* ── Header (unchanged) ── */}
            <div
              ref={headerRef}
              className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
            >
              <div className="flex flex-col justify-end space-y-5">
                <h2
                  ref={headingRef}
                  className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                >
                  <span data-split>Infrastructure to Run Your Distribution Not a Tool to Quote One Risk.</span>
                </h2>
                <Button href="/" variant="outline">
                  Start a quote
                </Button>
              </div>

              <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
                <p
                  ref={descRef}
                  className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
                >
                  Insurance distribution should work like infrastructure — just
                  like Stripe for payments or Plaid for identity.
                </p>
                <div className="flex w-full flex-wrap items-center justify-end gap-3">
                  <div className="flex items-center gap-3">
                    <ArrowNavButton
                      direction="prev"
                      tone="light"
                      aria-label="Previous slide"
                      onClick={prev}
                    />
                    <ArrowNavButton
                      direction="next"
                      tone="light"
                      aria-label="Next slide"
                      onClick={next}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Expanding Slider ── */}
            <div className="relative mt-12 md:mt-14 lg:mt-16">
              <div className="why-slider-track">
                {whySlides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className={`why-slide ${i === active ? "is-active" : "is-inactive"}`}
                    onClick={() => goTo(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                      width={1000}
                      height={1000}
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
                      className="w-full h-full object-cover"
                      src={slide.image}
                      alt={slide.alt}
                      draggable={false}
                    />
                    <div className="why-slide-label">{slide.label}</div>
                  </div>
                ))}
              </div>
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

export default WhyCoverforce;