"use client";

import { useEffect, useRef, useState } from "react";
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
};

export function AnimatedStat({
  columns,
  suffix = "",
  suffixClassName = "",
  className = "",
  ariaLabel,
}: AnimatedStatProps) {
  const [animate, setAnimate] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const displayValue = columns
    .map((col) => col.sequence[col.sequence.length - 1])
    .join("");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setAnimate(true);
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={rootRef}
      className={`inline-flex items-baseline leading-none ${className}`}
      aria-label={ariaLabel ?? `${displayValue}${suffix}`}
    >
      <span className="inline-flex tabular-nums" aria-hidden>
        {columns.map((col, index) => (
          <DigitRoller
            key={index}
            sequence={col.sequence}
            animate={animate}
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
    <AnimatedStat
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

const FORTY_PLUS_SUFFIX_CLASS = "ml-0.5 text-[0.55em] font-bold leading-none";

/** 40+ slide-up (Brokers / Startups mock) */
export function AnimatedFortyPlus({ className = "" }: { className?: string }) {
  return (
    <AnimatedStat
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

/** 60% slide-up (Brokers / Startups mock) */
export function AnimatedSixtyPercent({ className = "" }: { className?: string }) {
  return (
    <AnimatedStat
      className={className}
      suffix="%"
      ariaLabel="60 percent"
      columns={[
        { sequence: TENS_60_SEQUENCE, duration: 1600 },
        { sequence: ONES_60_SEQUENCE, duration: 1400, delay: 95 },
      ]}
    />
  );
}
