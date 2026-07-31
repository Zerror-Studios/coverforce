"use client";

import { useCallback, useRef, useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Container from "../common/Container";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

type WhySlide = {
  id: string;
  title: string;
  descriptionLines: string[];
  image: string;
  alt: string;
  href?: string;
};

const whySlides: WhySlide[] = [
  {
    id: "slide-1",
    title: "1. AI Investments",
    descriptionLines: [
      "AI-first infrastructure that gets smarter with every quote -",
      "driving higher bind rates and a customer experience",
      "that keeps improving for Chase.",
    ],
    image:
      "/images/why/ai.avif",
    alt: "Abstract blue and purple fluid gradient waves",
  },
  {
    id: "slide-2",
    title: "2. Market Power",
    descriptionLines: [
      "The largest bindable carrier network in the market means",
      "Chase inherits access on day one, instead of negotiating",
      "carrier relationships alone.",
    ],
    image:
      "https://images.unsplash.com/photo-1778146006808-493fc1c2ea45?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Abstract deep purple liquid waves",
  },
  {
    id: "slide-3",
    title: "3. Carrier Knowledge",
    descriptionLines: [
      "60+ live integrations and deep institutional know-how mean",
      "CoverForce launches in weeks - on rails already built",
      "and battle-tested.",
    ],
    image:
      "/images/why/carrier.avif",
    alt: "Abstract cyan light geometric glow",
  },
  {
    id: "slide-4",
    title: "4. Security & Resilience",
    descriptionLines: [
      "SOC 2 Type II certified, cloud-native, and built for enterprise scale -",
      "giving Chase infrastructure that's secure, resilient, and ready",
      "for FI-grade volume from day one.",
    ],
    image:
      "https://images.unsplash.com/photo-1777789062108-d88910b37faf?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Abstract violet silk waves on black",
  },
  {
    id: "slide-5",
    title: "5. Recognized excellence and innovation",
    descriptionLines: [
      "Named to the 2025 CB Insights Insurtech 50 - an annual list honoring",
      "the world's most innovative and high-impact insurtech companies",
      "transforming insurance distribution.",
    ],
    image: "/images/blog/blog3.png",
    alt: "CoverForce Insurtech 50 2025 recognition",
    href: "/blog/coverforce-named-to-the-2025-cb-insights-list-of-the-50-most-innovative-insurtech-startups",
  },
];

const SLIDE_TRANSITION_MS = 1080;

/** Desktop shows 5 slots: 4 visible + always-zero right reserve for the next card. */
const VISIBLE_SLIDE_COUNT = 5;
const SLIDE_FLEX_BY_VISUAL_INDEX = [17, 4, 2, 1, 0] as const;

/**
 * While a card expands: everything before it → 0, clicked card → active,
 * everything after → default sizes for the shifted positions.
 * For next-step: [0, 17, 4, 2, 1] then commit remaps to [17, 4, 2, 1, 0].
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
    visualIndex < total - 1 ? getSlideFlex(visualIndex + 1, expandingTarget) : 0;

  if (flex === 0 || nextFlex === 0 || visualIndex === total - 1) {
    return "why-slide--no-gap";
  }

  return "";
}

function ActiveSlideContent({ slide, compact = false }: { slide: WhySlide; compact?: boolean }) {
  const descriptionClassName = `max-w-3xl font-sans text-sm font-regular leading-[1.4] text-[#50617a] md:text-[1.125rem]${
    compact ? "" : " mt-2"
  }`;

  if (slide.href) {
    return (
      <Link href={slide.href} className="group block">
        <p className={`${descriptionClassName} transition-colors duration-300 group-hover:text-[#0130BE]`}>
          {slide.descriptionLines.join(" ")}
        </p>
      </Link>
    );
  }

  return <p className={descriptionClassName}>{slide.descriptionLines.join(" ")}</p>;
}

const WhyCoverforce = ({ paddingTop }: { paddingTop?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [expandingTarget, setExpandingTarget] = useState<number | null>(null);
  const [suppressTransition, setSuppressTransition] = useState(false);
  const commitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingStepsRef = useRef(0);
  const isExpandingRef = useRef(false);

  // Monotonic rotation keys so wrap-around mounts the next card on the right
  // (flex 0) instead of reusing the first card from the left.
  const orderedSlides = useMemo(
    () =>
      Array.from({ length: VISIBLE_SLIDE_COUNT }, (_, index) => {
        const slide = whySlides[(rotation + index) % whySlides.length]!;
        return {
          slide,
          key: `why-slot-${rotation + index}`,
        };
      }),
    [rotation],
  );
  const active = rotation % whySlides.length;
  const activeSlide =
    expandingTarget !== null
      ? orderedSlides[expandingTarget]!.slide
      : whySlides[active]!;
  const isExpanding = expandingTarget !== null;
  isExpandingRef.current = isExpanding;

  const clearCommitTimeout = useCallback(() => {
    if (commitTimeoutRef.current) clearTimeout(commitTimeoutRef.current);
    commitTimeoutRef.current = null;
  }, []);

  const advanceOne = useCallback(() => {
    if (isExpandingRef.current) return;
    clearCommitTimeout();
    setExpandingTarget(1);
    commitTimeoutRef.current = setTimeout(() => {
      // Commit without transition: leaving slide unmounts on the left,
      // incoming slide mounts on the right as the always-zero reserve.
      setSuppressTransition(true);
      setExpandingTarget(null);
      setRotation((current) => current + 1);
    }, SLIDE_TRANSITION_MS);
  }, [clearCommitTimeout]);

  // Keep transitions off until the reorder DOM update is painted, then restore.
  // Continue queued steps one-by-one for a continuous loop.
  useLayoutEffect(() => {
    if (!suppressTransition) return;
    void trackRef.current?.offsetWidth;
    requestAnimationFrame(() => {
      void trackRef.current?.offsetWidth;
      requestAnimationFrame(() => {
        setSuppressTransition(false);

        if (pendingStepsRef.current > 0) {
          pendingStepsRef.current -= 1;
        }

        if (pendingStepsRef.current > 0) {
          window.setTimeout(() => {
            advanceOne();
          }, 48);
        }
      });
    });
  }, [suppressTransition, rotation, advanceOne]);

  const handleSlideClick = useCallback(
    (visualIndex: number) => {
      if (visualIndex === 0 || isExpanding) return;
      if (getSlideFlex(visualIndex, null) === 0) return;

      // Step forward one card at a time so wrapping stays continuous.
      pendingStepsRef.current = visualIndex;
      advanceOne();
    },
    [advanceOne, isExpanding],
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
      {/* Slider CSS - scoped to this section */}
      <style>{`
        .why-slider-track {
          display: flex;
          align-items: stretch;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          /* Fluid height: keeps proportion across screens without going tiny on desktop */
          height: clamp(32rem, 68vh + 2vw, 44rem);
          contain: layout style;
        }
        @media (min-width: 1280px) {
          .why-slider-track {
            height: clamp(34rem, 70vh + 1.5vw, 46rem);
          }
        }
        @media (min-width: 1536px) {
          .why-slider-track {
            height: clamp(36rem, 68vh + 2vw, 48rem);
          }
        }
        @media (max-height: 740px) and (min-width: 1024px) {
          .why-slider-track {
            height: clamp(24rem, 56vh, 32rem);
          }
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
          width: 100%;
          overflow: hidden;
          border-radius: 2px;
          background: #E3E3E3;
          aspect-ratio: 4 / 5;
          height: auto;
          max-height: min(24rem, 62vh);
          min-height: 13.75rem;
        }
        @media (min-width: 640px) {
          .why-swiper-slide {
            aspect-ratio: 5 / 6;
            max-height: min(26rem, 58vh);
            min-height: 16rem;
          }
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
                  className="max-w-2xl text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                >
                  <span data-split>Infrastructure to run your distribution</span>
                  <br />
                  <span data-split>not a tool to quote one risk.</span>
                </h2>
                <p
                  ref={descRef}
                  className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
                >
                  Insurance distribution should work like infrastructure - just
                  like Stripe for payments or Plaid for identity.
                </p>
              </div>

              <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
                <p
                  className="hidden font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:block"
                >
                  Insurance distribution should work like infrastructure - just
                  like Stripe for payments or Plaid for identity.
                </p>
              </div>
            </div>

            {/* ── Mobile: normal Swiper ── */}
            <div className="relative mt-8 md:mt-10 lg:hidden">
              <Swiper
                spaceBetween={12}
                slidesPerView={1.1}
                speed={600}
                onSlideChange={(swiper) => setRotation(swiper.activeIndex)}
                className="why-coverforce-swiper !overflow-visible"
              >
                {whySlides.map((slide, slideIndex) => (
                  <SwiperSlide key={slide.id}>
                    {slide.href ? (
                      <Link href={slide.href} className="block">
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
                          {active === slideIndex ? (
                            <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/70 via-black/20 to-transparent px-4 pb-4 pt-10">
                              <h3 className="max-w-[14rem] font-heading text-lg font-medium leading-[1.12] tracking-tight text-white sm:max-w-[18rem] sm:text-xl">
                                {slide.title}
                              </h3>
                            </div>
                          ) : null}
                        </article>
                      </Link>
                    ) : (
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
                        {active === slideIndex ? (
                          <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/70 via-black/20 to-transparent px-4 pb-4 pt-10">
                            <h3 className="max-w-[14rem] font-heading text-lg font-medium leading-[1.12] tracking-tight text-white sm:max-w-[18rem] sm:text-xl">
                              {slide.title}
                            </h3>
                          </div>
                        ) : null}
                      </article>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mt-4 flex flex-col gap-3">
                <ActiveSlideContent slide={activeSlide} compact />
              </div>
            </div>

            {/* ── Desktop: expanding slider ── */}
            <div className="relative mt-8 hidden md:mt-10 lg:mt-12 lg:block">
              <div
                ref={trackRef}
                className={`why-slider-track${
                  isExpanding ? " why-slider-track--animating" : ""
                }${suppressTransition ? " why-slider-track--no-transition" : ""}`}
              >
                {orderedSlides.map(({ slide, key }, visualIndex) => {
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
                  const slideClassName = `why-slide text-left ${gapClass} ${
                    isCollapsed
                      ? "is-collapsed is-zero"
                      : isZero
                        ? "is-zero"
                        : isExpanded || isActive
                          ? "is-active"
                          : isClickable
                            ? "is-clickable is-inactive"
                            : "is-inactive"
                  }`;
                  const slideImage = (
                    <>
                      <Image
                        width={1000}
                        height={1000}
                        sizes="25vw"
                        className="h-full w-full object-cover"
                        src={slide.image}
                        alt={slide.alt}
                        draggable={false}
                      />
                      {isActive || isExpanded ? (
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/70 via-black/20 to-transparent px-5 pb-5 pt-14">
                          <h3 className="max-w-[14rem] font-heading text-lg font-medium leading-[1.12] tracking-tight text-white lg:max-w-[16rem] lg:text-[1.375rem]">
                            {slide.title}
                          </h3>
                        </div>
                      ) : null}
                    </>
                  );

                  if (slide.href && (isActive || isExpanded)) {
                    return (
                      <Link
                        key={key}
                        href={slide.href}
                        className={slideClassName}
                        style={{ flex: `${flexGrow} 0 0` }}
                        aria-current={isActive || isExpanded ? "true" : undefined}
                      >
                        {slideImage}
                      </Link>
                    );
                  }

                  return (
                  <button
                    type="button"
                    key={key}
                    className={slideClassName}
                    style={{ flex: `${flexGrow} 0 0` }}
                    onClick={() => handleSlideClick(visualIndex)}
                    aria-pressed={isExpanded || isActive}
                    aria-hidden={isZero}
                    tabIndex={isClickable ? 0 : -1}
                  >
                    {slideImage}
                  </button>
                )})}
              </div>

              <div className="mt-4 flex items-end justify-between gap-8">
                <div className="max-w-4xl">
                  <ActiveSlideContent slide={activeSlide} />
                </div>
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