"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import WatchDemoButton from "@/components/common/WatchDemoButton";
import Container from "../common/Container";
import SectionRadialGlow from "../common/SectionRadialGlow";
import dynamic from "next/dynamic";

const OpticalFiber = dynamic(() => import("./OpticalFiber"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});
import HeroDataLines from "./HeroDataLines";
import {
  HOME_INTRO_EASE,
  HOME_INTRO_HERO_RISE_MS,
  HOME_INTRO_LOADER_FADE_MS,
  HOME_INTRO_LOADER_WAVE_MS,
  useHomeIntro,
} from "@/contexts/HomeIntroContext";
import { animateLoaderWordsWave } from "@/lib/animateSplitTextReveal";
import { GdpCounter } from "./GdpCounter";

const INTRO_TITLE_LINES = [
  ["AI-Native", "Insurance"],
  ["Distribution", "Platform"],
] as const;

type StatItem = {
  value: string;
  label: string;
};

const stats: StatItem[] = [
  { value: "140K+", label: "AI-labeled Carrier Interactions" },
  { value: "40+", label: "Carrier & MGA Integrations" },
  { value: "15,000+", label: "Agencies on Platform" },
  { value: "110K+", label: "Submissions" },
];

const heroTheme = {
  settledBg: "bg-[#151f4d]",
  sectionText: "text-white",
  gdpText: "text-white/85",
  title: "text-white",
  titleMuted: "text-[#BCC5D6]",
  statValueActive: "text-white",
  statValueInactive: "text-[#8296B0]",
  statLabelActive: "text-white/80",
  statLabelInactive: "text-[#8296B0]",
  statLine: "bg-white/5",
  fiberColor: "#ffffff",
  fiberOriginGlow: true,
} as const;

const Hero = () => {
  const theme = heroTheme;
  const sectionRef = useRef<HTMLElement>(null);
  const { enabled: introEnabled, phase: introPhase } = useHomeIntro();
  const [introSettled, setIntroSettled] = useState(!introEnabled);
  const [fiberGlowVisible, setFiberGlowVisible] = useState(
    !theme.fiberOriginGlow || !introEnabled,
  );
  const isIntroWhiteBg =
    introEnabled &&
    !introSettled &&
    (introPhase === "loader-in" ||
      introPhase === "loader-fade" ||
      introPhase === "loader-wave");
  const introTitleMuted =
    introEnabled &&
    (introPhase === "loader-in" ||
      introPhase === "loader-fade" ||
      introPhase === "loader-wave" ||
      introPhase === "hero-rise");
  const introUiLocked = introEnabled && introPhase !== "done";
  const heroRiseStartedRef = useRef(false);
  const introFadeStartedRef = useRef(false);
  const introWaveStartedRef = useRef(false);
  const waveCleanupRef = useRef<(() => void) | null>(null);
  const moveTargetRef = useRef({ x: 0, y: 0 });

  const statsWrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const titleSlotRef = useRef<HTMLDivElement | null>(null);
  const titleSpacerRef = useRef<HTMLDivElement | null>(null);
  const titleLineRef = useRef<HTMLHeadingElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const gdpLineRef = useRef<HTMLDivElement | null>(null);
  const dataLinesRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<HTMLDivElement | null>(null);
  const revealAnimatedRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(1);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const statCount = useMemo(() => stats.length, []);

  const centerIntroTitle = () => {
    const spacer = titleSpacerRef.current;
    const title = titleLineRef.current;
    if (!spacer || !title) return;

    const spacerRect = spacer.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    // Align the title's TOP with the spacer's top — this matches where the
    // title settles after clearProps (absolute top-0), so it doesn't shift
    // down at the end of the rise. (Title is slightly taller than the spacer.)
    moveTargetRef.current = {
      x: spacerRect.left + spacerRect.width / 2 - window.innerWidth / 2,
      y: spacerRect.top + titleRect.height / 2 - window.innerHeight / 2,
    };

    gsap.set(title, {
      position: "fixed",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      zIndex: 30,
      margin: 0,
      force3D: true,
      backfaceVisibility: "hidden",
    });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !introEnabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(section, { clearProps: "all" });
      gsap.set(titleLineRef.current, { clearProps: "all" });
      return;
    }

    gsap.set(section, { backgroundColor: "#ffffff" });
    centerIntroTitle();

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!heroRiseStartedRef.current) centerIntroTitle();
      });
    }
  }, [introEnabled]);

  useLayoutEffect(() => {
    if (!introEnabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sectionRef.current?.removeAttribute("data-intro-reveal");
      return;
    }

    if (gdpLineRef.current) {
      gsap.set(gdpLineRef.current, { autoAlpha: 0 });
    }
    if (buttonsRef.current) {
      gsap.set(buttonsRef.current, { autoAlpha: 0 });
    }
    if (statsWrapRef.current) {
      gsap.set(statsWrapRef.current, { autoAlpha: 0 });
    }
    if (networkRef.current) {
      gsap.set(networkRef.current, { autoAlpha: 0 });
    }
    if (dataLinesRef.current) {
      gsap.set(dataLinesRef.current, { autoAlpha: 0 });
    }
  }, [introEnabled]);

  useEffect(() => {
    return () => {
      waveCleanupRef.current?.();
      waveCleanupRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (!introEnabled || introPhase !== "loader-fade" || introFadeStartedRef.current) return;
    const title = titleLineRef.current;
    if (!title) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    introFadeStartedRef.current = true;
    title.classList.remove("opacity-0");
    gsap.fromTo(
      title,
      { opacity: 0 },
      {
        opacity: 1,
        duration: HOME_INTRO_LOADER_FADE_MS / 1000,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  }, [introEnabled, introPhase]);

  useEffect(() => {
    if (!introEnabled || introPhase !== "loader-wave" || introWaveStartedRef.current) return;
    const line = titleLineRef.current;
    if (!line) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    introWaveStartedRef.current = true;
    waveCleanupRef.current?.();
    waveCleanupRef.current = animateLoaderWordsWave(line, {
      theme: "light",
      duration: HOME_INTRO_LOADER_WAVE_MS / 1000 - 0.15,
      delay: 0.05,
      charsClass: "loader-wave-char",
      wordsClass: "loader-wave-word",
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!heroRiseStartedRef.current) centerIntroTitle();
      });
    });
  }, [introEnabled, introPhase]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleLineRef.current;
    if (!section || !title || !introEnabled || introPhase !== "hero-rise" || heroRiseStartedRef.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(section, { backgroundColor: "#151f4d" });
      gsap.set(title, {
        clearProps:
          "position,left,top,xPercent,yPercent,zIndex,margin,transform,opacity",
      });
      setIntroSettled(true);
      return;
    }

    heroRiseStartedRef.current = true;
    centerIntroTitle();
    const chars = title.querySelectorAll<HTMLElement>(".loader-wave-char");
    const { x, y } = moveTargetRef.current;
    const riseDur = HOME_INTRO_HERO_RISE_MS / 1000;

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        gsap.set(title, {
          clearProps:
            "position,left,top,xPercent,yPercent,zIndex,margin,transform,opacity",
        });
        gsap.set(section, { backgroundColor: "#151f4d" });
        setIntroSettled(true);
      },
    });

    tl.to(section, { backgroundColor: "#151f4d", duration: riseDur }, 0);
    tl.to(title, { x, y, duration: riseDur }, 0);
    if (chars.length) {
      tl.to(chars, { color: "#ffffff", duration: riseDur, ease: "power2.inOut" }, 0);
    }
  }, [introEnabled, introPhase]);

  useEffect(() => {
    if (!theme.fiberOriginGlow) return;

    if (!introEnabled) {
      setFiberGlowVisible(true);
      return;
    }

    if (introPhase === "done") {
      setFiberGlowVisible(true);
    }
  }, [theme.fiberOriginGlow, introEnabled, introPhase]);

  useLayoutEffect(() => {
    if (!introEnabled || introPhase !== "nav" || revealAnimatedRef.current) return;
    revealAnimatedRef.current = true;
    if (theme.fiberOriginGlow) setFiberGlowVisible(true);
    sectionRef.current?.removeAttribute("data-intro-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (gdpLineRef.current) gsap.set(gdpLineRef.current, { clearProps: "all" });
      if (buttonsRef.current) gsap.set(buttonsRef.current, { clearProps: "all" });
      if (statsWrapRef.current) gsap.set(statsWrapRef.current, { clearProps: "all" });
      if (networkRef.current) gsap.set(networkRef.current, { clearProps: "all" });
      if (dataLinesRef.current) gsap.set(dataLinesRef.current, { clearProps: "all" });
      return;
    }

    const revealDur = 0.5;
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        if (gdpLineRef.current) gsap.set(gdpLineRef.current, { clearProps: "all" });
        if (buttonsRef.current) gsap.set(buttonsRef.current, { clearProps: "all" });
        if (statsWrapRef.current) gsap.set(statsWrapRef.current, { clearProps: "all" });
        if (networkRef.current) gsap.set(networkRef.current, { clearProps: "all" });
        if (dataLinesRef.current) gsap.set(dataLinesRef.current, { clearProps: "all" });
      },
    });

    if (gdpLineRef.current) {
      tl.to(
        gdpLineRef.current,
        { autoAlpha: 1, duration: revealDur },
        0,
      );
    }

    if (buttonsRef.current) {
      tl.to(
        buttonsRef.current,
        { autoAlpha: 1, duration: revealDur },
        0,
      );
    }

    if (statsWrapRef.current) {
      tl.to(
        statsWrapRef.current,
        { autoAlpha: 1, duration: revealDur },
        0.05,
      );
    }

    if (networkRef.current) {
      tl.to(
        networkRef.current,
        { autoAlpha: 1, duration: revealDur, ease: "power2.out" },
        0.08,
      );
    }

    if (dataLinesRef.current) {
      tl.to(dataLinesRef.current, { autoAlpha: 1, duration: revealDur }, 0.04);
    }
  }, [introEnabled, introPhase, theme.fiberOriginGlow]);

  useLayoutEffect(() => {
    const update = () => {
      const listEl = listRef.current;
      const itemEl = itemRefs.current[activeIndex];
      if (!listEl || !itemEl) return;

      const listRect = listEl.getBoundingClientRect();
      const itemRect = itemEl.getBoundingClientRect();
      setIndicator({
        left: itemRect.left - listRect.left,
        width: itemRect.width,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeIndex, statCount]);

  const sectionBgClass =
    !introEnabled || introSettled
      ? theme.settledBg
      : isIntroWhiteBg
        ? "bg-white"
        : "";

  return (
    <section
      ref={sectionRef}
      data-intro-reveal={introEnabled ? "pending" : undefined}
      className={`relative isolate overflow-hidden ${theme.sectionText} ${sectionBgClass}`}
    >
      <Container className="relative z-10 px-0!">


        {/* ── 100vh block: heading + button + network ── */}
        <div className="relative z-10 flex min-h-svh flex-col justify-between pt-12 md:h-screen md:pt-20 lg:pt-20">
          <div ref={dataLinesRef} data-hero-reveal className="absolute inset-0 z-0">
            <HeroDataLines />
          </div>

          {/* Heading + CTA */}
          <div
            ref={headingRef}
            className="relative z-10 flex flex-1 flex-col items-center justify-center pt-10 text-center md:pt-0"
          >
            <div ref={titleSlotRef} className="relative z-30 mt-6 flex w-full justify-center">
              <div
                ref={gdpLineRef}
                data-hero-reveal
                className="absolute left-1/2 -top-16 z-20 -translate-x-1/2 md:-top-9"
              >
                <div className={`flex max-w-[18rem] flex-col items-center gap-1 text-[0.625rem] font-sans tracking-wide sm:max-w-none sm:text-xs md:inline-flex md:flex-row md:gap-2 ${theme.gdpText}`}>
                  <span className="text-center sm:whitespace-nowrap">Quoted premium through CoverForce</span>
                  <GdpCounter/>
                </div>
              </div>
              <div
                ref={titleSpacerRef}
                className="pointer-events-none invisible max-w-5xl px-4 text-[2.2rem] font-heading font-regular leading-[1.05] tracking-tight sm:px-6 sm:text-5xl md:text-4xl lg:text-6xl xl:text-6xl"
                aria-hidden
              >
                {INTRO_TITLE_LINES.map((line, lineIndex) => (
                  <span
                    key={lineIndex}
                    className={`block whitespace-nowrap ${lineIndex > 0 ? "mt-1" : ""}`}
                  >
                    {line.join(" ")}
                  </span>
                ))}
              </div>
              <h1
                ref={titleLineRef}
                data-loader-line
                className={`absolute left-1/2 top-0 z-10 max-w-5xl -translate-x-1/2 px-4 text-[2.2rem] font-heading font-normal leading-[1.05] tracking-tight will-change-[transform,opacity] sm:px-6 sm:text-5xl md:text-4xl lg:text-6xl xl:text-6xl ${introEnabled && introPhase === "loader-in" ? "opacity-0" : ""
                  } ${introTitleMuted ? theme.titleMuted : theme.title}`}
              >
                {INTRO_TITLE_LINES.map((line, lineIndex) => (
                  <span
                    key={lineIndex}
                    className={`block whitespace-nowrap ${lineIndex > 0 ? "mt-1" : ""}`}
                  >
                    {line.map((word, wordIndex) => (
                      <React.Fragment key={word}>
                        <span className="inline-block overflow-hidden align-bottom pb-0.5">
                          <span data-loader-word-inner className="inline-block">
                            {word}
                          </span>
                        </span>
                        {wordIndex < line.length - 1 ? (
                          <span aria-hidden className="inline">
                            {" "}
                          </span>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </span>
                ))}
              </h1>
            </div>
            <div
              ref={buttonsRef}
              data-hero-reveal
              className={`mt-8 flex w-full max-w-[21rem] flex-row items-center justify-center gap-2.5 sm:mt-10 sm:max-w-none sm:gap-4 ${
                introUiLocked ? "pointer-events-none" : ""
              }`}
            >
              <RequestDemoButton balanced surface="on-dark" className="!min-w-0 !px-3.5 sm:!min-w-[148px] sm:!px-5">
                Request Demo
              </RequestDemoButton>
              <WatchDemoButton balanced variant="secondary" surface="on-dark" className="!min-w-0 !px-3.5 sm:!min-w-[148px] sm:!px-5">
                Watch Demo
              </WatchDemoButton>
            </div>
          </div>
          {/* ── Stats — below the fold ── */}
          <div
            ref={statsWrapRef}
            data-hero-reveal
            className={`relative motion-reduce:opacity-100 ${
              introUiLocked ? "pointer-events-none" : ""
            }`}
          >
            <SectionRadialGlow className="absolute left-1/2 top-20 z-0 -translate-x-1/2 -translate-y-1/3 md:top-20" />

            {/* Mobile: scrolling stats marquee */}
            <div className="relative py-5 md:hidden" aria-label="Platform stats">
              <div className="logo-marquee-viewport">
                <div className="logo-marquee-track !gap-10" style={{ animationDuration: "28s" }}>
                  {[...stats, ...stats].map((stat, index) => (
                    <div
                      key={`${stat.label}-${index}`}
                      className="flex shrink-0 flex-col items-center gap-1.5 px-2"
                      aria-hidden={index >= stats.length ? true : undefined}
                    >
                      <p className={`text-[1.35rem] font-heading font-regular tracking-tight ${theme.statValueActive}`}>
                        {stat.value}
                      </p>
                      <p className={`whitespace-nowrap text-center text-[0.68rem] font-sans font-regular leading-relaxed ${theme.statLabelActive}`}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: interactive stats row */}
            <ul
              ref={listRef}
              className="relative hidden gap-x-4 gap-y-8 pb-6 pt-2 md:flex md:py-10"
              onMouseLeave={() => setActiveIndex(1)}
            >
              <div
                className="pointer-events-none absolute inset-y-0 w-full"
                aria-hidden
              >
                {/* Top full-width line + moving segment */}
                <div className={`absolute left-0 top-0 h-[0.05rem] w-full ${theme.statLine}`}>
                  <div
                    className="h-full rounded-full linear-line_color transition-[transform,width] duration-300 ease-out"
                    style={{
                      width: `${indicator.width}px`,
                      transform: `translateX(${indicator.left}px)`,
                    }}
                  />
                </div>

                {/* Bottom full-width line + moving segment */}
                <div className={`absolute bottom-0 left-0 h-[0.05rem] w-full ${theme.statLine}`}>
                  <div
                    className="h-full rounded-full linear-line_color transition-[transform,width] duration-300 ease-out"
                    style={{
                      width: `${indicator.width}px`,
                      transform: `translateX(${indicator.left}px)`,
                    }}
                  />
                </div>
              </div>

              {stats.map((stat, index) => (
                <li
                  key={stat.label}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="flex flex-1 flex-col items-center gap-2 px-8"
                >
                  <p
                    className={`font-heading text-3xl font-regular tracking-tight transition-colors lg:text-4xl ${
                      index === activeIndex ? theme.statValueActive : theme.statValueInactive
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-center font-sans text-lg font-regular leading-relaxed transition-colors ${
                      index === activeIndex ? theme.statLabelActive : theme.statLabelInactive
                    }`}
                  >
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
        {/* Network image — inside 100vh, pushed to bottom via justify-between */}
        <div className="relative h-[260px] w-full overflow-hidden pt-4 sm:h-[320px] sm:pt-6 md:h-[480px] md:pt-10 lg:h-[500px]">
          <div
            ref={networkRef}
            data-hero-reveal
            className="relative z-10 h-full w-full motion-reduce:translate-y-0 motion-reduce:opacity-100"
            aria-label="Partner network"
          >
            <OpticalFiber
              className="h-full w-full"
              contentScale={1.4}
              fanSpread={0.58}
              fanReach={1.2}
              fanHeight={0.62}
              fanOffsetX={0.45}
              fov={86}
              color={theme.fiberColor}
              originGlow={theme.fiberOriginGlow}
              glowVisible={theme.fiberOriginGlow ? fiberGlowVisible : false}
              bloomOnScroll
              bloomGlow
            />
          </div>
        </div>


      </Container>
    </section>
  );
};

export default Hero;
