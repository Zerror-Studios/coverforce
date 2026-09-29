"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import type { MarqueeLogo } from "./MarqueeLine";

const DEFAULT_LOGOS: MarqueeLogo[] = Array.from({ length: 15 }, (_, index) => ({
  src: `/images/marquee/logo (${index + 1}).png`,
  alt: `Partner logo ${index + 1}`,
}));

const LOGO_SLOT_CLASS = {
  default:
    "flex h-14 max-w-[11rem] shrink-0 items-center justify-center sm:h-16 sm:max-w-48 md:h-20 md:max-w-56 lg:h-24 lg:max-w-64",
  large:
    "flex h-16 max-w-[12rem] shrink-0 items-center justify-center sm:h-20 sm:max-w-56 md:h-24 md:max-w-64 lg:h-28 lg:max-w-72 xl:h-24 xl:max-w-64",
} as const;

const LOGO_IMAGE_CLASS =
  "h-full w-auto max-w-full object-contain object-center";

const STAGGER_MS = 110;
const TRANSITION_MS = 520;
const MOBILE_MAX_WIDTH = 1023;

type PulsatingLogoSetProps = {
  logos?: readonly MarqueeLogo[];
  size?: "default" | "large";
  logosPerSet?: number;
  /** Logos visible at once below the `lg` breakpoint (default 2). */
  mobileLogosPerSet?: number;
  /** How long logos stay fully visible between enter and exit */
  intervalMs?: number;
  /** Preload the first visible logo set (hero marquee above the fold). */
  preload?: boolean;
};

function chunkLogos(logos: readonly MarqueeLogo[], perSet: number) {
  const safePerSet = Math.max(1, perSet);
  const sets: MarqueeLogo[][] = [];
  for (let i = 0; i < logos.length; i += safePerSet) {
    const slice = logos.slice(i, i + safePerSet);
    if (slice.length === safePerSet) sets.push(slice);
  }
  return sets.length > 0 ? sets : [logos.slice(0, safePerSet)];
}

function useResponsiveLogosPerSet(desktopPerSet: number, mobilePerSet: number) {
  const [perSet, setPerSet] = useState(desktopPerSet);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const sync = () => setPerSet(mq.matches ? mobilePerSet : desktopPerSet);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [desktopPerSet, mobilePerSet]);

  return perSet;
}

type Phase = "hidden" | "enter" | "visible" | "exit";

function wait(ms: number, signal: { cancelled: boolean }) {
  return new Promise<void>((resolve) => {
    const id = window.setTimeout(() => {
      if (!signal.cancelled) resolve();
    }, ms);
    if (signal.cancelled) {
      window.clearTimeout(id);
      resolve();
    }
  });
}

export function PulsatingLogoSet({
  logos = DEFAULT_LOGOS,
  size = "default",
  logosPerSet = 5,
  mobileLogosPerSet = 2,
  intervalMs = 3200,
  preload = false,
}: PulsatingLogoSetProps) {
  const activePerSet = useResponsiveLogosPerSet(logosPerSet, mobileLogosPerSet);
  const sets = useMemo(() => chunkLogos(logos, activePerSet), [logos, activePerSet]);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    setSetIndex(0);
  }, [activePerSet, sets.length]);

  const activeLogos = sets[setIndex] ?? sets[0] ?? [];
  const count = activeLogos.length;
  const waveMs = TRANSITION_MS + Math.max(0, count - 1) * STAGGER_MS;

  useEffect(() => {
    const signal = { cancelled: false };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setPhase("visible");
      const id = window.setInterval(
        () => setSetIndex((i) => (i + 1) % sets.length),
        intervalMs,
      );
      return () => window.clearInterval(id);
    }

    async function runCycle() {
      while (!signal.cancelled) {
        setPhase("hidden");
        await wait(40, signal);
        if (signal.cancelled) break;

        setPhase("enter");
        await wait(waveMs + 40, signal);
        if (signal.cancelled) break;

        setPhase("visible");
        await wait(intervalMs, signal);
        if (signal.cancelled) break;

        setPhase("exit");
        await wait(waveMs + 40, signal);
        if (signal.cancelled) break;

        setSetIndex((i) => (i + 1) % sets.length);
      }
    }

    runCycle();

    return () => {
      signal.cancelled = true;
    };
  }, [intervalMs, sets.length, waveMs]);

  return (
    <div
      className="flex w-full items-center justify-between gap-3 overflow-x-clip sm:gap-5 md:gap-6 lg:gap-8"
      aria-label="Partner logos"
    >
      {activeLogos.map((logo, i) => {
        // Enter: left → right. Exit: right → left.
        const delayMs =
          phase === "exit" ? (count - 1 - i) * STAGGER_MS : i * STAGGER_MS;

        return (
          <div
            key={`${setIndex}-${logo.src}`}
            className={`logo-set-item shrink-0 logo-set-item--${phase} motion-reduce:translate-y-0 motion-reduce:opacity-100`}
            style={{
              transitionDelay: phase === "hidden" ? "0ms" : `${delayMs}ms`,
            }}
          >
            <div className={LOGO_SLOT_CLASS[size]}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={1000}
                height={1000}
                className={LOGO_IMAGE_CLASS}
                draggable={false}
                priority={preload && setIndex === 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PulsatingLogoSet;
