"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Container from "../common/Container";
import ArrowNavButton from "../common/ArrowNavButton";
import Image from "next/image";

import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

type WhySlide = {
  id: string;
  title: string;
  descriptionLines: string[];
  image: string;
  alt: string;
};

const whySlides: WhySlide[] = [
  {
    id: "slide-1",
    title: "AI Investments",
    descriptionLines: [
      "AI-first infrastructure that gets smarter with every quote —",
      "driving higher bind rates and a customer experience",
      "that keeps improving for Chase.",
    ],
    image: "/images/hero/img1.avif",
    alt: "AI-powered insurance infrastructure",
  },
  {
    id: "slide-2",
    title: "Market Power",
    descriptionLines: [
      "The largest bindable carrier network in the market means",
      "Chase inherits access on day one, instead of negotiating",
      "carrier relationships alone.",
    ],
    image: "/images/hero/img2.avif",
    alt: "Commercial insurance carrier network",
  },
  {
    id: "slide-3",
    title: "Carrier Knowledge",
    descriptionLines: [
      "60+ live integrations and deep institutional know-how mean",
      "CoverForce launches in weeks — on rails already built",
      "and battle-tested.",
    ],
    image: "/images/hero/img3.avif",
    alt: "Carrier integrations and insurance expertise",
  },
  {
    id: "slide-4",
    title: "Security & Resilience",
    descriptionLines: [
      "SOC 2 Type II certified, cloud-native, and built for enterprise scale —",
      "giving Chase infrastructure that's secure, resilient, and ready",
      "for FI-grade volume from day one.",
    ],
    image: "/images/hero/img4.avif",
    alt: "Secure and resilient enterprise infrastructure",
  },
];

// Small delay before a hover actually switches the active slide — absorbs
// fast mouse passes across slide edges so it doesn't flicker between slides.
const HOVER_SWITCH_DELAY_MS = 90;

const WhyCoverforce = ({ paddingTop }: { paddingTop?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive((current) => (current === index ? current : index));
  }, []);

  const prev = useCallback(() => {
    setActive((current) => (current - 1 + whySlides.length) % whySlides.length);
  }, []);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % whySlides.length);
  }, []);

  // Debounced hover activation: wait a beat before switching so a mouse
  // just passing through on its way elsewhere doesn't trigger a swap.
  const handleSlideMouseEnter = useCallback((index: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      goTo(index);
    }, HOVER_SWITCH_DELAY_MS);
  }, [goTo]);

  const handleTrackMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, []);

  useEffect(
    () => () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    },
    [],
  );

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

  useGSAP(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const section = sectionRef.current;
    if (!container || !overlay || !section) return;

    gsap.set(container, {
      y: 0,
      scale: 1,
      force3D: true,
      transformOrigin: "50% 50%",
      backfaceVisibility: "hidden",
    });
    gsap.set(overlay, { opacity: 0, pointerEvents: "none" });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallDevice = window.matchMedia("(max-width: 1023px)").matches;
    if (reducedMotion || isSmallDevice) return;

    const getShift = () => container.offsetHeight;

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
          flex-shrink: 0;
          background: #E3E3E3;
          transition: flex 1.08s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .why-slide.is-active   { flex: 5 0 0; cursor: default; }
        .why-slide.is-inactive { flex: 1 0 0; cursor: pointer; }

        .why-slide img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .why-slide-copy {
          transition:
            opacity 500ms cubic-bezier(0.19, 1, 0.22, 1),
            transform 700ms cubic-bezier(0.19, 1, 0.22, 1);
        }
        .why-slide.is-inactive .why-slide-copy {
          opacity: 0;
          transform: translateY(20px);
        }
        .why-slide.is-active .why-slide-copy {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 700ms;
        }

        .why-slide-mask {
          overflow: hidden;
        }
        .why-slide-title-inner,
        .why-slide-description-line {
          opacity: 0;
          transform: translateY(110%);
          transition:
            opacity 500ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .why-slide.is-active .why-slide-title-inner {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 850ms;
        }
        .why-slide.is-active .why-slide-description-line {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 980ms;
        }
        .why-slide.is-active p .why-slide-mask:nth-child(2) .why-slide-description-line {
          transition-delay: 1070ms;
        }
        .why-slide.is-active p .why-slide-mask:nth-child(3) .why-slide-description-line {
          transition-delay: 1160ms;
        }
        .why-slide.is-active p .why-slide-mask:nth-child(4) .why-slide-description-line {
          transition-delay: 1250ms;
        }

        .why-swiper-slide {
          position: relative;
          height: 340px;
          overflow: hidden;
          border-radius: 2px;
          background: #E3E3E3;
        }
        @media (min-width: 640px) {
          .why-swiper-slide { height: 380px; }
        }
      `}</style>
      <div ref={containerRef} className="relative z-10 overflow-hidden lg:will-change-transform">
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
                  className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                >
                  <span data-split>Infrastructure to Run Your Distribution Not a Tool to Quote One Risk.</span>
                </h2>
                <p
                  ref={descRef}
                  className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
                >
                  Insurance distribution should work like infrastructure — just
                  like Stripe for payments or Plaid for identity.
                </p>
              </div>

              <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
                <p
                  className="hidden font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:block"
                >
                  Insurance distribution should work like infrastructure — just
                  like Stripe for payments or Plaid for identity.
                </p>
                <div className="hidden w-full flex-wrap items-center justify-end gap-3 lg:flex">
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

            {/* ── Mobile: normal Swiper ── */}
            <div className="relative mt-12 md:mt-14 lg:hidden">
              <Swiper
                spaceBetween={12}
                slidesPerView={1.1}
                speed={600}
                className="why-coverforce-swiper !overflow-visible"
              >
                {whySlides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <article className="why-swiper-slide">
                      <Image
                        width={1000}
                        height={1000}
                        sizes="85vw"
                        className="h-full w-full object-cover"
                        src={slide.image}
                        alt={slide.alt}
                        draggable={false}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent"
                        aria-hidden
                      />
                      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-7">
                        <h3 className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
                          {slide.title}
                        </h3>
                        <p className="mt-3 font-sans text-sm font-regular leading-[1.4] text-white/85 md:text-[1.125rem]">
                          {slide.descriptionLines.join(" ")}
                        </p>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ── Desktop: expanding slider ── */}
            <div className="relative mt-12 hidden md:mt-14 lg:mt-16 lg:block">
              <div className="why-slider-track" onMouseLeave={handleTrackMouseLeave}>
                {whySlides.map((slide, i) => (
                  <button
                    type="button"
                    key={slide.id}
                    className={`why-slide text-left ${i === active ? "is-active" : "is-inactive"}`}
                    onMouseEnter={() => handleSlideMouseEnter(i)}
                    onFocus={() => goTo(i)}
                    onClick={() => goTo(i)}
                    aria-pressed={i === active}
                  >
                    <Image
                      width={1000}
                      height={1000}
                      sizes="25vw"
                      className="h-full w-full object-cover"
                      src={slide.image}
                      alt={slide.alt}
                      draggable={false}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/35 to-transparent"
                      aria-hidden
                    />
                    <div className="why-slide-copy pointer-events-none absolute inset-x-0 bottom-0 z-20 max-w-3xl p-8 text-white lg:p-10">
                      <div className="why-slide-mask">
                        <h3 className="why-slide-title-inner max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
                          {slide.title}
                        </h3>
                      </div>
                      <p className={`mt-4 font-sans text-sm font-regular leading-[1.4] text-white/85 md:text-[1.125rem] ${i === 3 ? "max-w-2xl" : "max-w-xl"}`}>
                        {slide.descriptionLines.map((line) => (
                          <span key={line} className="why-slide-mask block">
                            <span className="why-slide-description-line block">
                              {line}
                            </span>
                          </span>
                        ))}
                      </p>
                    </div>
                  </button>
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