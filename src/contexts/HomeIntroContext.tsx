"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type HomeIntroPhase =
  | "loader-in"
  | "loader-wave"
  | "loader-out"
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

export const HOME_INTRO_LOADER_IN_MS = 350;
export const HOME_INTRO_LOADER_WAVE_MS = 2000;
export const HOME_INTRO_LOADER_OUT_MS = 0;
export const HOME_INTRO_HERO_RISE_MS = 1000;
export const HOME_INTRO_NAV_MS = 1200;
export const HOME_INTRO_TEXT_MS = 1000;
export const HOME_INTRO_NETWORK_MS = 850;
export const HOME_INTRO_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

const PRE_NAV_PHASES: HomeIntroPhase[] = ["loader-in", "loader-wave", "loader-out", "hero-rise"];

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

    const loaderWaveAt = HOME_INTRO_LOADER_IN_MS;
    const loaderOutAt = loaderWaveAt + HOME_INTRO_LOADER_WAVE_MS;
    const heroRiseAt = loaderOutAt + HOME_INTRO_LOADER_OUT_MS;
    const navAt = heroRiseAt + HOME_INTRO_HERO_RISE_MS;
    const textAt = navAt + HOME_INTRO_NAV_MS;
    const networkAt = textAt + HOME_INTRO_TEXT_MS;
    const doneAt = networkAt + HOME_INTRO_NETWORK_MS;

    const timers = [
      setTimeout(() => setPhase("loader-wave"), loaderWaveAt),
      setTimeout(() => setPhase("loader-out"), loaderOutAt),
      setTimeout(() => setPhase("hero-rise"), heroRiseAt),
      setTimeout(() => setPhase("nav"), navAt),
      setTimeout(() => setPhase("text"), textAt),
      setTimeout(() => setPhase("network"), networkAt),
      setTimeout(() => setPhase("done"), doneAt),
    ];

    return () => timers.forEach(clearTimeout);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || phase === "done") {
      document.body.style.overflow = "";
      window.lenis?.start();
      return;
    }

    document.body.style.overflow = "hidden";
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
