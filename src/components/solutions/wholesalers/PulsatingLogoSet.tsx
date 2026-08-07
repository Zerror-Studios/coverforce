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
    "flex h-7 w-[7.5rem] shrink-0 items-center justify-center sm:h-8 sm:w-36 md:h-8 md:w-40 lg:h-9 lg:w-44",
  large:
    "flex h-8 w-36 shrink-0 items-center justify-center sm:h-9 sm:w-40 md:h-9 md:w-44 lg:h-10 lg:w-48",
} as const;

const LOGO_IMAGE_CLASS =
  "h-full w-full max-h-full max-w-full object-contain object-center opacity-100 grayscale contrast-200";

const LOGO_TONE_CLASS = {
  dark: "brightness-0",
  light: "brightness-0 invert",
} as const;

const STAGGER_MS = 110;
const TRANSITION_MS = 520;

type PulsatingLogoSetProps = {
  logos?: readonly MarqueeLogo[];
  size?: "default" | "large";
  tone?: "dark" | "light";
  logosPerSet?: number;
  /** How long logos stay fully visible between enter and exit */
  intervalMs?: number;
};

function chunkLogos(logos: readonly MarqueeLogo[], perSet: number) {
  const sets: MarqueeLogo[][] = [];
  for (let i = 0; i < logos.length; i += perSet) {
    const slice = logos.slice(i, i + perSet);
    if (slice.length === perSet) sets.push(slice);
  }
  return sets.length > 0 ? sets : [logos.slice(0, perSet)];
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
  tone = "light",
  logosPerSet = 5,
  intervalMs = 3200,
}: PulsatingLogoSetProps) {
  const sets = useMemo(() => chunkLogos(logos, logosPerSet), [logos, logosPerSet]);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("hidden");

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
      className="flex w-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8 md:px-12 lg:gap-6 lg:px-16"
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
                width={size === "large" ? 192 : 176}
                height={size === "large" ? 40 : 36}
                className={`${LOGO_IMAGE_CLASS} ${LOGO_TONE_CLASS[tone]}`}
                draggable={false}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PulsatingLogoSet;
