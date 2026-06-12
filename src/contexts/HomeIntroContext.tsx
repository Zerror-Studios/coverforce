"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type HomeIntroPhase = "idle" | "nav" | "text" | "network" | "done";

type HomeIntroContextValue = {
  enabled: boolean;
  phase: HomeIntroPhase;
};

const HomeIntroContext = createContext<HomeIntroContextValue>({
  enabled: false,
  phase: "done",
});

export const HOME_INTRO_INITIAL_MS = 300;
export const HOME_INTRO_NAV_MS = 1200;
export const HOME_INTRO_TEXT_MS = 1000;
export const HOME_INTRO_NETWORK_MS = 850;
export const HOME_INTRO_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function HomeIntroProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<HomeIntroPhase>(enabled ? "idle" : "done");

  useEffect(() => {
    if (!enabled) {
      setPhase("done");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    setPhase("idle");

    const navAt = HOME_INTRO_INITIAL_MS;
    const textAt = navAt + HOME_INTRO_NAV_MS;
    const networkAt = textAt + HOME_INTRO_TEXT_MS;
    const doneAt = networkAt + HOME_INTRO_NETWORK_MS;

    const timers = [
      setTimeout(() => setPhase("nav"), navAt),
      setTimeout(() => setPhase("text"), textAt),
      setTimeout(() => setPhase("network"), networkAt),
      setTimeout(() => setPhase("done"), doneAt),
    ];

    return () => timers.forEach(clearTimeout);
  }, [enabled]);

  return (
    <HomeIntroContext.Provider value={{ enabled, phase }}>
      {children}
    </HomeIntroContext.Provider>
  );
}

export function useHomeIntro() {
  return useContext(HomeIntroContext);
}
