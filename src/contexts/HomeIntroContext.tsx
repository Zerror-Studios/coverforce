"use client";

import { scrollToTop } from "@/lib/scrollToTop";
import gsap from "gsap";
import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";

export type HomeIntroPhase =
  | "loader-in"
  | "loader-fade"
  | "loader-wave"
  | "hero-rise"
  | "nav"
  | "text"
  | "network"
  | "done";

type HomeIntroContextValue = {
  enabled: boolean;
  phase: HomeIntroPhase;
};

const HomeIntroContext = createContext<HomeIntroContextValue>({
  enabled: false,
  phase: "done",
});

export const HOME_INTRO_LOADER_IN_MS = 400;
export const HOME_INTRO_LOADER_FADE_MS = 550;
export const HOME_INTRO_LOADER_WAVE_MS = 2000;
export const HOME_INTRO_HERO_RISE_MS = 1100;
export const HOME_INTRO_NAV_MS = 600;
export const HOME_INTRO_REVEAL_MS = 650;
/** @deprecated Use HOME_INTRO_REVEAL_MS */
export const HOME_INTRO_TEXT_MS = HOME_INTRO_REVEAL_MS;
export const HOME_INTRO_NETWORK_MS = 600;
export const HOME_INTRO_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

const PRE_NAV_PHASES: HomeIntroPhase[] = ["loader-in", "loader-fade", "loader-wave", "hero-rise"];

export function isPreNavIntroPhase(phase: HomeIntroPhase) {
  return PRE_NAV_PHASES.includes(phase);
}

export function HomeIntroProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<HomeIntroPhase>(enabled ? "loader-in" : "done");

  useLayoutEffect(() => {
    if (!enabled) return;
    scrollToTop();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setPhase("done");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    setPhase("loader-in");

    // One GSAP timeline keeps phase changes in sync (setTimeout drifts when the tab
    // is backgrounded / throttled, which desyncs Hero wave vs rise).
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    const hold = (ms: number) => tl.to({}, { duration: ms / 1000 });

    hold(HOME_INTRO_LOADER_IN_MS);
    tl.call(() => setPhase("loader-fade"));
    hold(HOME_INTRO_LOADER_FADE_MS);
    tl.call(() => setPhase("loader-wave"));
    hold(HOME_INTRO_LOADER_WAVE_MS);
    tl.call(() => setPhase("hero-rise"));
    hold(HOME_INTRO_HERO_RISE_MS);
    tl.call(() => setPhase("nav"));
    hold(HOME_INTRO_REVEAL_MS);
    tl.call(() => setPhase("done"));

    return () => {
      tl.kill();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || phase === "done") return;
    scrollToTop();
  }, [enabled, phase]);

  useEffect(() => {
    if (!enabled || phase === "done") {
      document.body.style.overflow = "";
      window.lenis?.start();
      scrollToTop();
      window.requestAnimationFrame(() => scrollToTop());
      return;
    }

    document.body.style.overflow = "hidden";
    scrollToTop();
    window.lenis?.stop();

    return () => {
      document.body.style.overflow = "";
      window.lenis?.start();
    };
  }, [enabled, phase]);

  return (
    <HomeIntroContext.Provider value={{ enabled, phase }}>
      {children}
    </HomeIntroContext.Provider>
  );
}

export function useHomeIntro() {
  return useContext(HomeIntroContext);
}
