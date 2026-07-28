"use client";

import { useCallback, useRef, useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Container from "../common/Container";
import ArrowNavButton from "../common/ArrowNavButton";
import Button from "../common/Button";
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
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&h=1200&q=80",
    alt: "Abstract AI neural network visualization",
  },
  {
    id: "slide-2",
    title: "Market Power",
    descriptionLines: [
      "The largest bindable carrier network in the market means",
      "Chase inherits access on day one, instead of negotiating",
      "carrier relationships alone.",
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=1200&q=80",
    alt: "Modern city skyline representing market scale",
  },
  {
    id: "slide-3",
    title: "Carrier Knowledge",
    descriptionLines: [
      "60+ live integrations and deep institutional know-how mean",
      "CoverForce launches in weeks — on rails already built",
      "and battle-tested.",
    ],
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&h=1200&q=80",
    alt: "Team collaborating on insurance technology strategy",
  },
  {
    id: "slide-4",
    title: "Security & Resilience",
    descriptionLines: [
      "SOC 2 Type II certified, cloud-native, and built for enterprise scale —",
      "giving Chase infrastructure that's secure, resilient, and ready",
      "for FI-grade volume from day one.",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&h=1200&q=80",
    alt: "Secure data center infrastructure",
  },
  {
    id: "slide-5",
    title: "Security & Resilience",
    descriptionLines: [
      "SOC 2 Type II certified, cloud-native, and built for enterprise scale —",
      "giving Chase infrastructure that's secure, resilient, and ready",
      "for FI-grade volume from day one.",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&h=1200&q=80",
    alt: "Secure data center infrastructure",
  },
  {
    id: "slide-6",
    title: "Security & Resilience",
    descriptionLines: [
      "SOC 2 Type II certified, cloud-native, and built for enterprise scale —",
      "giving Chase infrastructure that's secure, resilient, and ready",
      "for FI-grade volume from day one.",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&h=1200&q=80",
    alt: "Secure data center infrastructure",
  },
  {
    id: "slide-7",
    title: "Security & Resilience",
    descriptionLines: [
      "SOC 2 Type II certified, cloud-native, and built for enterprise scale —",
      "giving Chase infrastructure that's secure, resilient, and ready",
      "for FI-grade volume from day one.",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&h=1200&q=80",
    alt: "Secure data center infrastructure",
  },
];

const SLIDE_TRANSITION_MS = 1080;

/** Progressive flex weights: big → small → smaller → thin slivers. */
const SLIDE_FLEX_BY_VISUAL_INDEX = [17, 4, 2, 1, 0.4, 0.4, 0] as const;

/**
 * While a card expands: everything before it → 0, clicked card → active,
 * everything after → default sizes for positions 2…n.
 */
function getExpandingFlex(visualIndex: number, expandingTarget: number) {
  if (visualIndex < expandingTarget) return 0;
  if (visualIndex === expandingTarget) return SLIDE_FLEX_BY_VISUAL_INDEX[0];

  const offset = visualIndex - expandingTarget;
  return (
    SLIDE_FLEX_BY_VISUAL_INDEX[offset] ??
    SLIDE_FLEX_BY_VISUAL_INDEX[SLIDE_FLEX_BY_VISUAL_INDEX.length - 1]
  );
}

function getSlideFlex(visualIndex: number, expandingTarget: number | null) {
  if (expandingTarget !== null) {
    return getExpandingFlex(visualIndex, expandingTarget);
  }

  return (
    SLIDE_FLEX_BY_VISUAL_INDEX[visualIndex] ??
    SLIDE_FLEX_BY_VISUAL_INDEX[SLIDE_FLEX_BY_VISUAL_INDEX.length - 1]
  );
}

function getSlideGapClass(
  visualIndex: number,
  expandingTarget: number | null,
  total: number,
) {
  const flex = getSlideFlex(visualIndex, expandingTarget);
  const nextFlex =
    visualIndex < total - 1
      ? getSlideFlex(visualIndex + 1, expandingTarget)
      : 0;

  if (flex === 0 || nextFlex === 0 || visualIndex === total - 1) {
    return "why-slide--no-gap";
  }

  return "";
}

const WhyCoverforce = ({ paddingTop }: { paddingTop?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expandingTarget, setExpandingTarget] = useState<number | null>(null);
  const [suppressTransition, setSuppressTransition] = useState(false);
  const commitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const orderedSlides = useMemo(
    () => [...whySlides.slice(active), ...whySlides.slice(0, active)],
    [active],
  );
  const activeSlide =
    expandingTarget !== null
      ? orderedSlides[expandingTarget]!
      : whySlides[active]!;
  const isExpanding = expandingTarget !== null;

  const clearCommitTimeout = useCallback(() => {
    if (commitTimeoutRef.current) clearTimeout(commitTimeoutRef.current);
    commitTimeoutRef.current = null;
  }, []);

  const goTo = useCallback((index: number, options?: { animate?: boolean }) => {
    clearCommitTimeout();
    const animate = options?.animate ?? true;
    if (!animate) setSuppressTransition(true);
    setExpandingTarget(null);
    setActive((current) => (current === index ? current : index));
  }, [clearCommitTimeout]);

  const beginExpand = useCallback(
    (visualIndex: number, targetIndex: number) => {
      clearCommitTimeout();
      setExpandingTarget(visualIndex);
      commitTimeoutRef.current = setTimeout(() => {
        goTo(targetIndex, { animate: false });
      }, SLIDE_TRANSITION_MS);
    },
    [clearCommitTimeout, goTo],
  );

  // Keep transitions off until the reorder DOM update is painted, then restore.
  useLayoutEffect(() => {
    if (!suppressTransition) return;
    void trackRef.current?.offsetWidth;
    requestAnimationFrame(() => {
      void trackRef.current?.offsetWidth;
      requestAnimationFrame(() => setSuppressTransition(false));
    });
  }, [suppressTransition, active]);

  const prev = useCallback(() => {
    if (isExpanding) return;
    goTo((active - 1 + whySlides.length) % whySlides.length);
  }, [active, goTo, isExpanding]);

  const next = useCallback(() => {
    if (isExpanding) return;
    beginExpand(1, (active + 1) % whySlides.length);
  }, [active, beginExpand, isExpanding]);

  const handleSlideClick = useCallback(
    (visualIndex: number, slideIndex: number) => {
      if (visualIndex === 0 || isExpanding) return;
      if (getSlideFlex(visualIndex, null) === 0) return;

      beginExpand(visualIndex, slideIndex);
    },
    [beginExpand, isExpanding],
  );

  useEffect(
    () => () => {
      clearCommitTimeout();
    },
    [clearCommitTimeout],
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
          align-items: stretch;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          height: 340px;
          contain: layout style;
        }
        @media (min-width: 640px) {
          .why-slider-track { height: 380px; }
        }
        @media (min-width: 1024px) {
          .why-slider-track { height: 420px; }
        }

        .why-slide {
          position: relative;
          min-width: 0;
          max-width: 100%;
          border-radius: 10px;
          overflow: hidden;
          margin-right: 12px;
          background: #E3E3E3;
          backface-visibility: hidden;
          transform: translateZ(0);
          transition: flex 1.08s cubic-bezier(0.19, 1, 0.22, 1);
        }
        @media (min-width: 640px) {
          .why-slide { margin-right: 16px; }
        }
        @media (min-width: 1024px) {
          .why-slide { margin-right: 20px; }
        }
        .why-slide.why-slide--no-gap,
        .why-slide:last-child {
          margin-right: 0;
        }
        .why-slider-track--animating .why-slide {
          will-change: flex;
        }
        .why-slider-track--no-transition .why-slide {
          transition: none !important;
          will-change: auto;
        }
        .why-slide.is-active { cursor: default; }
        .why-slide.is-inactive { cursor: default; }
        .why-slide.is-clickable { cursor: pointer; }
        .why-slide.is-collapsed {
          pointer-events: none;
          margin-right: 0 !important;
          transition: flex 1.08s cubic-bezier(0.19, 1, 0.22, 1),
            margin-right 1.08s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .why-slide.is-zero {
          pointer-events: none;
        }

        .why-swiper-slide {
          position: relative;
          height: 300px;
          overflow: hidden;
          border-radius: 2px;
          background: #E3E3E3;
        }
        @media (min-width: 640px) {
          .why-swiper-slide { height: 360px; }
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
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mt-6 flex flex-col gap-5">
                <h3 className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#444444] sm:text-3xl sm:leading-[1.12]">
                  {activeSlide.title}
                </h3>
                <p className="max-w-3xl font-sans text-sm font-regular leading-[1.4] text-[#50617a] md:text-[1.125rem]">
                  {activeSlide.descriptionLines.join(" ")}
                </p>
                <Button href="/contact">Contact us</Button>
              </div>
            </div>

            {/* ── Desktop: expanding slider ── */}
            <div className="relative mt-12 hidden md:mt-14 lg:mt-16 lg:block">
              <div
                ref={trackRef}
                className={`why-slider-track${
                  isExpanding ? " why-slider-track--animating" : ""
                }${suppressTransition ? " why-slider-track--no-transition" : ""}`}
              >
                {orderedSlides.map((slide, visualIndex) => {
                  const slideIndex = whySlides.findIndex((item) => item.id === slide.id);
                  const flexGrow = getSlideFlex(visualIndex, expandingTarget);
                  const isZero = flexGrow === 0;
                  const isActive = visualIndex === 0 && !isExpanding;
                  const isCollapsed =
                    isExpanding && expandingTarget !== null && visualIndex < expandingTarget;
                  const isExpanded =
                    isExpanding && expandingTarget !== null && visualIndex === expandingTarget;
                  const isClickable =
                    !isExpanding && visualIndex > 0 && !isZero;
                  const gapClass = getSlideGapClass(
                    visualIndex,
                    expandingTarget,
                    orderedSlides.length,
                  );
                  return (
                  <button
                    type="button"
                    key={slide.id}
                    className={`why-slide text-left ${gapClass} ${
                      isCollapsed
                        ? "is-collapsed is-zero"
                        : isZero
                          ? "is-zero"
                          : isExpanded || isActive
                            ? "is-active"
                            : isClickable
                              ? "is-clickable is-inactive"
                              : "is-inactive"
                    }`}
                    style={{ flex: `${flexGrow} 0 0` }}
                    onClick={() => handleSlideClick(visualIndex, slideIndex)}
                    aria-pressed={isExpanded || isActive}
                    aria-hidden={isZero}
                    tabIndex={isClickable ? 0 : -1}
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
                  </button>
                )})}
              </div>

              <div className="mt-6 flex items-end justify-between gap-8 border-t border-[#E8E8EE] pt-6">
                <div className="max-w-4xl">
                  <h3 className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#444444] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
                    {activeSlide.title}
                  </h3>
                  <p className="mt-4 max-w-3xl font-sans text-sm font-regular leading-[1.4] text-[#50617a] md:text-[1.125rem]">
                    {activeSlide.descriptionLines.join(" ")}
                  </p>
                </div>

                <Button href="/contact" className="shrink-0">
                  Contact us
                </Button>
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