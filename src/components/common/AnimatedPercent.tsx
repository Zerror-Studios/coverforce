"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  MICRO_EASE,
  MICRO_ROLL_MS,
  MICRO_ROLL_STAGGER_MS,
} from "@/lib/motion";

const TENS_95_SEQUENCE = [0, 1, 5, 6, 9] as const;
const ONES_95_SEQUENCE = [0, 1, 2, 3, 4, 5] as const;

const TENS_40_SEQUENCE = [0, 1, 4] as const;
const ONES_40_SEQUENCE = [0, 1, 8, 0] as const;

const TENS_60_SEQUENCE = [0, 1, 5, 6] as const;
const ONES_60_SEQUENCE = [0, 1, 8, 0] as const;

type DigitColumn = {
  sequence: readonly number[];
  duration?: number;
  delay?: number;
};

type DigitRollerProps = {
  sequence: readonly number[];
  animate: boolean;
  duration?: number;
  delay?: number;
};

function DigitRoller({
  sequence,
  animate,
  duration = MICRO_ROLL_MS,
  delay = 0,
}: DigitRollerProps) {
  const endIndex = sequence.length - 1;

  return (
    <span
      className="relative inline-block h-[1em] w-[0.62em] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
      }}
    >
      <span
        className="flex flex-col will-change-transform"
        style={{
          transition: animate
            ? `transform ${duration}ms ${MICRO_EASE} ${delay}ms`
            : "none",
          transform: animate
            ? `translateY(calc(-${endIndex} * 1em))`
            : "translateY(0)",
        }}
      >
        {sequence.map((digit, index) => (
          <span
            key={`${digit}-${index}`}
            className="flex h-[1em] items-center justify-center leading-none"
          >
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

type AnimatedStatProps = {
  columns: DigitColumn[];
  suffix?: string;
  suffixClassName?: string;
  className?: string;
  ariaLabel?: string;
  /** When true, runs the digit roll animation */
  roll?: boolean;
  rootRef?: RefObject<HTMLSpanElement | null>;
};

export function AnimatedStat({
  columns,
  suffix = "",
  suffixClassName = "",
  className = "",
  ariaLabel,
  roll = false,
  rootRef: externalRef,
}: AnimatedStatProps) {
  const internalRef = useRef<HTMLSpanElement>(null);
  const rootRef = externalRef ?? internalRef;

  const displayValue = columns
    .map((col) => col.sequence[col.sequence.length - 1])
    .join("");

  return (
    <span
      ref={rootRef}
      className={`inline-flex items-baseline leading-none ${className}`}
      aria-label={ariaLabel ?? `${displayValue}${suffix}`}
    >
      <span className="inline-flex tabular-nums" aria-hidden>
        {columns.map((col, index) => (
          <DigitRoller
            key={`${index}-${col.sequence.join("-")}`}
            sequence={col.sequence}
            animate={roll}
            duration={col.duration ?? MICRO_ROLL_MS}
            delay={col.delay ?? (index > 0 ? MICRO_ROLL_STAGGER_MS : 0)}
          />
        ))}
      </span>
      {suffix ? (
        <span className={`inline-block ${suffixClassName}`} aria-hidden>
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

/** Re-runs odometer roll when `animationKey` or `columns` change */
export function ReplayableAnimatedStat({
  columns,
  animationKey,
  suffix = "",
  suffixClassName = "",
  className = "",
  ariaLabel,
}: AnimatedStatProps & { animationKey: number }) {
  const [roll, setRoll] = useState(false);

  useEffect(() => {
    if (animationKey === 0) return;
    setRoll(false);
    const id = window.setTimeout(() => setRoll(true), 40);
    return () => window.clearTimeout(id);
  }, [animationKey]);

  return (
    <AnimatedStat
      columns={columns}
      suffix={suffix}
      suffixClassName={suffixClassName}
      className={className}
      ariaLabel={ariaLabel}
      roll={roll}
    />
  );
}

function buildDigitColumns(prev: number, next: number): DigitColumn[] {
  const prevStr = String(prev);
  const nextStr = String(next);
  const width = Math.max(prevStr.length, nextStr.length);
  const paddedPrev = prevStr.padStart(width, "0");
  const paddedNext = nextStr.padStart(width, "0");

  return paddedNext.split("").map((char, index) => {
    const prevDigit = Number(paddedPrev[index]);
    const nextDigit = Number(char);
    return {
      sequence: prevDigit === nextDigit ? [nextDigit] : [prevDigit, nextDigit],
      duration: MICRO_ROLL_MS * 0.75,
      delay: index > 0 ? MICRO_ROLL_STAGGER_MS : 0,
    };
  });
}

function staticDigitColumns(value: number): DigitColumn[] {
  return String(value)
    .split("")
    .map((char) => ({ sequence: [Number(char)] }));
}

type PeriodicIncrementalStatProps = {
  start: number;
  step?: number;
  max: number;
  intervalMs?: number;
  suffix?: string;
  suffixClassName?: string;
  className?: string;
  enabled?: boolean;
};

/** Slowly ticks up on an interval with odometer-style digit rolls */
export function PeriodicIncrementalStat({
  start,
  step = 1,
  max,
  intervalMs = 8000,
  suffix = "",
  suffixClassName = "",
  className = "",
  enabled = true,
}: PeriodicIncrementalStatProps) {
  const [value, setValue] = useState(start);
  const [animationKey, setAnimationKey] = useState(0);
  const prevRef = useRef(start);

  useEffect(() => {
    if (!enabled) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setValue((current) => {
        const next = current + step;
        return next > max ? start : next;
      });
      setAnimationKey((key) => key + 1);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [enabled, start, step, max, intervalMs]);

  useEffect(() => {
    if (animationKey === 0) return;

    const settleMs =
      MICRO_ROLL_MS * 0.75 + MICRO_ROLL_STAGGER_MS * (String(value).length - 1) + 80;
    const id = window.setTimeout(() => {
      prevRef.current = value;
    }, settleMs);

    return () => window.clearTimeout(id);
  }, [animationKey, value]);

  const columns = useMemo(
    () =>
      animationKey === 0
        ? staticDigitColumns(value)
        : buildDigitColumns(prevRef.current, value),
    [animationKey, value],
  );

  return (
    <ReplayableAnimatedStat
      animationKey={animationKey}
      columns={columns}
      suffix={suffix}
      suffixClassName={suffixClassName}
      className={className}
      ariaLabel={`${value}${suffix}`}
    />
  );
}

function ScrollTriggeredAnimatedStat(
  props: Omit<AnimatedStatProps, "roll">,
) {
  const [roll, setRoll] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setRoll(true);
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <AnimatedStat {...props} rootRef={rootRef} roll={roll} />;
}

type AnimatedPercentProps = {
  className?: string;
  tensDuration?: number;
  onesDuration?: number;
  onesDelay?: number;
};

/** 95% slide-up (Data Advantage) */
export default function AnimatedPercent({
  className = "",
  tensDuration = 1700,
  onesDuration = 1400,
  onesDelay = 100,
}: AnimatedPercentProps) {
  return (
    <ScrollTriggeredAnimatedStat
      className={className}
      suffix="%"
      ariaLabel="95 percent"
      columns={[
        { sequence: TENS_95_SEQUENCE, duration: tensDuration },
        { sequence: ONES_95_SEQUENCE, duration: onesDuration, delay: onesDelay },
      ]}
    />
  );
}

const FORTY_PLUS_SUFFIX_CLASS = "ml-0.5 text-lg font-sans font-medium leading-none text-[#494646]";

/** 40+ slide-up (Brokers / Startups mock) */
export function AnimatedFortyPlus({ className = "" }: { className?: string }) {
  return (
    <ScrollTriggeredAnimatedStat
      className={className}
      suffix="+"
      suffixClassName={FORTY_PLUS_SUFFIX_CLASS}
      ariaLabel="40 plus carriers"
      columns={[
        { sequence: TENS_40_SEQUENCE, duration: 1500 },
        { sequence: ONES_40_SEQUENCE, duration: 1400, delay: 85 },
      ]}
    />
  );
}

const TENS_60_COLUMNS: DigitColumn[] = [
  { sequence: TENS_60_SEQUENCE, duration: 1600 },
  { sequence: ONES_60_SEQUENCE, duration: 1400, delay: 95 },
];

const TENS_68_COLUMNS: DigitColumn[] = [
  { sequence: TENS_60_SEQUENCE, duration: 1600 },
  { sequence: [0, 1, 4, 6, 8], duration: 1400, delay: 95 },
];

/** 60% on scroll-in; rolls to 68% / back on card hover */
export function AnimatedSixtyPercentHover({
  className = "",
  cardHovered = false,
  scrollReady = false,
}: {
  className?: string;
  cardHovered?: boolean;
  scrollReady?: boolean;
}) {
  const [animationKey, setAnimationKey] = useState(0);
  const columns = cardHovered ? TENS_68_COLUMNS : TENS_60_COLUMNS;

  useEffect(() => {
    if (!scrollReady) return;
    setAnimationKey((k) => k + 1);
  }, [scrollReady, cardHovered]);

  return (
    <ReplayableAnimatedStat
      animationKey={animationKey}
      className={className}
      suffix="%"
      ariaLabel={cardHovered ? "68 percent" : "60 percent"}
      columns={columns}
    />
  );
}

/** 60% slide-up (Brokers / Startups mock) — scroll only */
export function AnimatedSixtyPercent({ className = "" }: { className?: string }) {
  return (
    <ScrollTriggeredAnimatedStat
      className={className}
      suffix="%"
      ariaLabel="60 percent"
      columns={TENS_60_COLUMNS}
    />
  );
}
