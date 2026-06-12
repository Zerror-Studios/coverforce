"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import Container from "../common/Container";
import Button from "../common/Button";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

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

function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] ${className}`}
    >
      <span
        className="inline-block size-2 shrink-0 rounded-full bg-linear-to-r from-[#5B35E0] to-[#AFB3EF]"
        aria-hidden
      />
      {children}
    </p>
  );
}

const WhyCoverforce = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const animatingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number) => {
    if (index === active || animatingRef.current) return;
    animatingRef.current = true;
    setActive(index);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      animatingRef.current = false;
    }, 600);
  };

  const prev = () => goTo((active - 1 + whySlides.length) % whySlides.length);
  const next = () => goTo((active + 1) % whySlides.length);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      const heading = headingRef.current;
      const desc = descRef.current;
      if (!header || !heading) return;

      const cleanups: (() => void)[] = [];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cleanups.push(animateSplitTextReveal(heading, { trigger: header }));

      if (desc) {
        if (reducedMotion) {
          gsap.set(desc, { opacity: 1 });
        } else {
          gsap.set(desc, { opacity: 0 });

          const fadeTl = gsap.timeline({
            scrollTrigger: {
              trigger: header,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          });

          fadeTl.to(desc, { opacity: 1, duration: 0.8, ease: "power2.out" });

          const lenis = window.lenis;
          const onLenisScroll = () => ScrollTrigger.update();
          lenis?.on("scroll", onLenisScroll);

          cleanups.push(() => {
            lenis?.off("scroll", onLenisScroll);
            fadeTl.scrollTrigger?.kill();
            fadeTl.kill();
          });
        }
      }

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
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

      <Container borderColor="#53535380">
        <div className="pb-16 md:pb-20 lg:pb-24">
          {/* ── Header (unchanged) ── */}
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end space-y-5">
              <h2
                ref={headingRef}
                className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Infrastructure to Run Your Distribution Not a Tool to Quote One Risk.</span>
              </h2>
              <Button
                  href="/"
                  variant="primary"
                  className="!bg-[#0032C9] text-white"
                >
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
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={prev}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#53535329] bg-transparent text-[#424242] transition-colors hover:bg-[#f5f5f5]"
                  >
                    <RiArrowLeftLine className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={next}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0032C9] text-white transition-opacity hover:opacity-90"
                  >
                    <RiArrowRightLine className="size-5" />
                  </button>
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
                  <img src={slide.image} alt={slide.alt} draggable={false} />
                  <div className="why-slide-label">{slide.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyCoverforce;