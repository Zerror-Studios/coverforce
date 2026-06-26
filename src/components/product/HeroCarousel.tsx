"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import gsap from "gsap";

export type CopySlide = {
  type: "copy";
  label: string;
  title: ReactNode;
  description: string;
};

export type StatSlide = {
  type: "stat";
  value: string;
  label: string;
};

export type HeroSlide = CopySlide | StatSlide;

const ROTATE_MS = 4800;
const EXIT_MS = 700;
const ENTER_MS = 700;

const STAT_GRADIENT =
  "bg-gradient-to-r from-[#F0784A] to-[#E63946] bg-clip-text text-transparent";

type TransitionPhase = "idle" | "exiting" | "entering";
type SlideDirection = "forward" | "backward";

type SlideState =
  | "active"
  | "enter"
  | "exit"
  | "exit-right"
  | "waiting-right"
  | "pre-enter-forward"
  | "pre-enter-backward"
  | "hidden"
  | "hidden-left";

function getNextIndex(index: number, total: number) {
  return (index + 1) % total;
}

function getDirection(from: number, to: number, total: number): SlideDirection {
  if (from === to) return "forward";

  const forwardSteps = (to - from + total) % total;
  const backwardSteps = (from - to + total) % total;

  return forwardSteps <= backwardSteps ? "forward" : "backward";
}

function getSlideState(
  index: number,
  activeIndex: number,
  phase: TransitionPhase,
  pendingIndex: number | null,
  direction: SlideDirection,
  enterReady: boolean,
  total: number,
): SlideState {
  const nextIndex = getNextIndex(activeIndex, total);

  if (phase === "exiting" && pendingIndex !== null) {
    if (index === activeIndex) {
      return direction === "forward" ? "exit" : "exit-right";
    }

    if (index === pendingIndex) {
      return direction === "forward" ? "pre-enter-forward" : "pre-enter-backward";
    }

    return "hidden";
  }

  if (phase === "entering") {
    if (index === activeIndex) {
      if (enterReady) return "enter";
      return direction === "forward" ? "pre-enter-forward" : "pre-enter-backward";
    }

    return "hidden";
  }

  if (index === activeIndex) return "active";
  if (index === nextIndex) return "waiting-right";
  return "hidden-left";
}

const slideStateClass: Record<SlideState, string> = {
  active: "submission-hero-content--active",
  enter: "submission-hero-content--enter",
  exit: "submission-hero-content--exit",
  "exit-right": "submission-hero-content--exit-right",
  "waiting-right": "submission-hero-content--waiting-right",
  "pre-enter-forward": "submission-hero-content--pre-enter-forward",
  "pre-enter-backward": "submission-hero-content--pre-enter-backward",
  hidden: "submission-hero-content--hidden",
  "hidden-left": "submission-hero-content--hidden-left",
};

function getSlideKey(slide: HeroSlide, index: number) {
  if (slide.type === "copy") return slide.description;
  return `${slide.value}-${index}`;
}

function HeroSlideContent({ slide }: { slide: HeroSlide }) {
  if (slide.type === "stat") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <p
          className={`font-heading text-6xl font-medium leading-none tracking-tight md:text-7xl lg:text-9xl ${STAT_GRADIENT}`}
        >
          {slide.value}
        </p>
        <p className="mt-6 font-heading text-base font-regular text-white md:text-3xl">
          {slide.label}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <p className="flex items-center justify-center gap-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white md:text-xs">
        <span className="size-2 shrink-0 rounded-full bg-white" aria-hidden />
        {slide.label}
      </p>

      <h1 className="mt-5 max-w-2xl text-3xl font-heading font-normal leading-[1.15] tracking-tight md:text-4xl lg:text-5xl xl:text-5xl">
        {slide.title}
      </h1>

      <p className="mt-8 max-w-xl font-sans text-sm font-regular leading-relaxed text-white/85 md:text-sm">
        {slide.description}
      </p>
    </div>
  );
}

type HeroCarouselNavProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  ariaLabel: string;
};

export function HeroCarouselNav({
  count,
  activeIndex,
  onSelect,
  ariaLabel,
}: HeroCarouselNavProps) {
  return (
    <div
      className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 md:bottom-14"
      role="tablist"
      aria-label={ariaLabel}
    >
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: count }, (_, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Slide ${index + 1}`}
              onClick={() => onSelect(index)}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isActive ? "w-10 bg-white/30" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            >
              {isActive ? (
                <span
                  key={activeIndex}
                  className="hero-nav-progress-fill absolute inset-0 rounded-full bg-white"
                  style={
                    { "--hero-nav-duration": `${ROTATE_MS}ms` } as CSSProperties
                  }
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function useHeroCarousel(slides: HeroSlide[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<SlideDirection>("forward");
  const [enterReady, setEnterReady] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const phaseRef = useRef<TransitionPhase>("idle");
  const activeIndexRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  phaseRef.current = phase;
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const active = wrapper.querySelector<HTMLElement>(
      ".submission-hero-content--active",
    );
    if (!active) return;

    const items = Array.from(active.querySelectorAll<HTMLElement>("p, h1"));
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 28 });
    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.45,
    });

    return () => {
      tween.kill();
      gsap.set(items, { clearProps: "opacity,transform" });
    };
  }, []);

  const startTransition = useCallback((targetIndex: number, slideDirection: SlideDirection) => {
    if (phaseRef.current !== "idle") return;

    setDirection(slideDirection);
    setPendingIndex(targetIndex);
    setEnterReady(false);
    setPhase("exiting");

    window.setTimeout(() => {
      setActiveIndex(targetIndex);
      setPhase("entering");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setEnterReady(true));
      });
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    if (phase !== "entering" || !enterReady) return;

    const timer = window.setTimeout(() => {
      setPhase("idle");
      setPendingIndex(null);
      setEnterReady(false);
    }, ENTER_MS);

    return () => window.clearTimeout(timer);
  }, [phase, enterReady]);

  const advanceSlide = useCallback(() => {
    if (phaseRef.current !== "idle") return;

    const targetIndex = getNextIndex(activeIndexRef.current, slides.length);
    startTransition(targetIndex, "forward");
  }, [slides.length, startTransition]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex || phaseRef.current !== "idle") return;

      startTransition(index, getDirection(activeIndex, index, slides.length));
    },
    [activeIndex, slides.length, startTransition],
  );

  const restartInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(advanceSlide, ROTATE_MS);
  }, [advanceSlide]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    restartInterval();

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [restartInterval]);

  const handleSelectSlide = useCallback(
    (index: number) => {
      goToSlide(index);
      restartInterval();
    },
    [goToSlide, restartInterval],
  );

  return {
    activeIndex,
    handleSelectSlide,
    track: (
      <div ref={wrapperRef} className="submission-hero-wrapper translate-y-4 md:translate-y-6">
        {slides.map((slide, index) => {
          const state = getSlideState(
            index,
            activeIndex,
            phase,
            pendingIndex,
            direction,
            enterReady,
            slides.length,
          );
          const isVisible =
            state === "active" || state === "enter" || state === "exit" || state === "exit-right";

          return (
            <div
              key={getSlideKey(slide, index)}
              className={`submission-hero-content ${slideStateClass[state]}`}
              aria-hidden={!isVisible}
            >
              <HeroSlideContent slide={slide} />
            </div>
          );
        })}
      </div>
    ),
  };
}

type HeroCarouselProps = {
  slides: HeroSlide[];
  navLabel: string;
};

export default function HeroCarousel({ slides, navLabel }: HeroCarouselProps) {
  const { activeIndex, handleSelectSlide, track } = useHeroCarousel(slides);

  return (
    <>
      {track}
      <HeroCarouselNav
        count={slides.length}
        activeIndex={activeIndex}
        onSelect={handleSelectSlide}
        ariaLabel={navLabel}
      />
    </>
  );
}
