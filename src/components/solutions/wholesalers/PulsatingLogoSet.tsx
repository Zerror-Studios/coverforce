"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import type { MarqueeLogo } from "./MarqueeLine";

const DEFAULT_LOGOS: MarqueeLogo[] = Array.from({ length: 15 }, (_, index) => ({
  src: `/images/marquee/logo (${index + 1}).png`,
  alt: `Partner logo ${index + 1}`,
}));

const LOGO_SIZE_CLASS = {
  default:
    "h-6 w-auto max-h-6 object-contain opacity-100 grayscale contrast-200 sm:h-7 sm:max-h-7 md:h-6 md:max-h-6 lg:h-7 lg:max-h-7",
  large:
    "h-7 w-auto max-h-7 object-contain opacity-100 grayscale contrast-200 sm:h-8 sm:max-h-8 md:h-10 md:max-h-10 lg:h-12 lg:max-h-12",
} as const;

const LOGO_TONE_CLASS = {
  dark: "brightness-0",
  light: "brightness-0 invert",
} as const;

type PulsatingLogoSetProps = {
  logos?: readonly MarqueeLogo[];
  size?: "default" | "large";
  tone?: "dark" | "light";
  logosPerSet?: number;
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

type Phase = "idle" | "exit" | "enter-from" | "enter-to";

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
  intervalMs = 4000,
}: PulsatingLogoSetProps) {
  const sets = useMemo(() => chunkLogos(logos, logosPerSet), [logos, logosPerSet]);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const signal = { cancelled: false };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      const id = window.setInterval(
        () => setSetIndex((i) => (i + 1) % sets.length),
        intervalMs,
      );
      return () => window.clearInterval(id);
    }

    const dwellMs = Math.max(intervalMs - 900, 2500);

    async function runCycle() {
      while (!signal.cancelled) {
        setPhase("idle");
        await wait(dwellMs, signal);
        if (signal.cancelled) break;

        setPhase("exit");
        await wait(680, signal);
        if (signal.cancelled) break;

        setSetIndex((i) => (i + 1) % sets.length);
        setPhase("enter-from");
        await wait(40, signal);
        if (signal.cancelled) break;

        setPhase("enter-to");
        await wait(680, signal);
      }
    }

    runCycle();

    return () => {
      signal.cancelled = true;
    };
  }, [intervalMs, sets.length]);

  const activeLogos = sets[setIndex] ?? sets[0] ?? [];

  const phaseClass =
    phase === "idle"
      ? "logo-set-item--idle"
      : phase === "exit"
        ? "logo-set-item--exit"
        : phase === "enter-from"
          ? "logo-set-item--enter-from"
          : "logo-set-item--enter-to";

  return (
    <div
      className="flex w-full items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16"
      aria-label="Partner logos"
    >
      {activeLogos.map((logo, i) => {
        const stagger = i * 0.08;

        return (
          <div
            key={`${setIndex}-${logo.src}`}
            className={`logo-set-item shrink-0 ${phaseClass} motion-reduce:animate-none motion-reduce:opacity-100`}
            style={{
              animationDelay: phase === "idle" ? `${stagger}s` : undefined,
              transitionDelay: phase !== "idle" ? `${stagger}s` : undefined,
            }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={size === "large" ? 180 : 120}
              height={size === "large" ? 60 : 40}
              className={`${LOGO_SIZE_CLASS[size]} ${LOGO_TONE_CLASS[tone]}`}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}

export default PulsatingLogoSet;
