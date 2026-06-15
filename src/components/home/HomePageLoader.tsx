"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  HOME_INTRO_EASE,
  HOME_INTRO_HERO_RISE_MS,
  HOME_INTRO_LOADER_WAVE_MS,
  useHomeIntro,
} from "@/contexts/HomeIntroContext";
import { animateLoaderWordsWave } from "@/lib/animateSplitTextReveal";

const LOADER_WORDS = ["The", "AI", "Distribution", "Flow"] as const;
const WORD_DONE_COLOR = "#000000";

export default function HomePageLoader() {
  const { enabled, phase } = useHomeIntro();
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordsWrapRef = useRef<HTMLParagraphElement>(null);
  const waveCleanupRef = useRef<(() => void) | null>(null);
  const [textHidden, setTextHidden] = useState(false);
  const ranWaveRef = useRef(false);
  const ranOutRef = useRef(false);
  const ranRevealRef = useRef(false);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const words = wordsWrapRef.current?.querySelectorAll<HTMLElement>("[data-loader-word-inner]");
    if (!overlay || !enabled) return;

    gsap.set(overlay, { opacity: 1, autoAlpha: 1 });
    if (words?.length) {
      gsap.set(words, { yPercent: 0, autoAlpha: 1 });
    }
  }, [enabled]);

  useEffect(() => {
    return () => {
      waveCleanupRef.current?.();
      waveCleanupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!enabled || phase !== "loader-wave" || ranWaveRef.current) return;

    const line = wordsWrapRef.current;
    if (!line) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ranWaveRef.current = true;
    waveCleanupRef.current?.();

    waveCleanupRef.current = animateLoaderWordsWave(line, {
      theme: "light",
      duration: HOME_INTRO_LOADER_WAVE_MS / 1000 - 0.15,
      delay: 0.05,
      charsClass: "loader-wave-char",
      wordsClass: "loader-wave-word",
    });
  }, [enabled, phase]);

  useEffect(() => {
    if (!enabled || phase !== "loader-out" || ranOutRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ranOutRef.current = true;

    waveCleanupRef.current?.();
    waveCleanupRef.current = null;

    const line = wordsWrapRef.current;
    if (!line) return;

    gsap.set(line, { color: WORD_DONE_COLOR, autoAlpha: 0 });
    setTextHidden(true);
  }, [enabled, phase]);

  useEffect(() => {
    if (!enabled || phase !== "hero-rise" || ranRevealRef.current) return;

    const overlay = overlayRef.current;
    const line = wordsWrapRef.current;
    if (!overlay) return;

    if (line) gsap.set(line, { autoAlpha: 0 });
    setTextHidden(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      overlay.style.pointerEvents = "none";
      gsap.set(overlay, { autoAlpha: 0 });
      return;
    }

    ranRevealRef.current = true;
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: HOME_INTRO_HERO_RISE_MS / 1000,
      ease: HOME_INTRO_EASE,
      onComplete: () => {
        overlay.style.pointerEvents = "none";
      },
    });
  }, [enabled, phase]);

  if (!enabled) return null;
  if (phase === "nav" || phase === "text" || phase === "network" || phase === "done") {
    return null;
  }

  const showText =
    (phase === "loader-in" || phase === "loader-wave" || phase === "loader-out" || phase === "hero-rise") &&
    !textHidden;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white"
      aria-live="polite"
      aria-busy={phase !== "hero-rise"}
    >
      {showText ? (
        <p
          ref={wordsWrapRef}
          data-loader-line
          className="max-w-[92vw] px-6 text-center font-heading text-[clamp(1.45rem,4.8vw,3.1rem)] font-medium leading-[1.2] tracking-tight text-[#BCC5D6] [word-spacing:normal]"
        >
          {LOADER_WORDS.map((word, index) => (
            <Fragment key={word}>
              <span className="inline-block overflow-hidden align-bottom pb-0.5">
                <span data-loader-word-inner className="inline-block">
                  {word}
                </span>
              </span>
              {index < LOADER_WORDS.length - 1 ? (
                <span aria-hidden className="inline">
                  {" "}
                </span>
              ) : null}
            </Fragment>
          ))}
        </p>
      ) : null}
    </div>
  );
}
