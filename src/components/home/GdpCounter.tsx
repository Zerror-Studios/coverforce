"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Quoted premium grows continuously from this anchor (same idea as a
 * time-based revenue counter): value = ANCHOR + elapsed * rate.
 * Refreshing the page picks up the correct point on that curve.
 */
const ANCHOR_PREMIUM = 1_021_677_532.43;
/** UTC instant when ANCHOR_PREMIUM was true. */
const ANCHOR_EPOCH_MS = Date.UTC(2026, 7, 11, 0, 0, 0); // 11 Aug 2026 00:00 UTC

/** ~$108.66 every ~1.75s on average (matches prior tick feel). */
const PREMIUM_PER_SECOND = 108.66 / 1.75;

const TICK_MS = 3_000;
const FLIP_MS = 0.45;

type GdpCounterProps = {
  className?: string;
};

const formatPremium = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const nextTickMs = () => TICK_MS;

/** Continuous premium at a given wall-clock time. */
export function getPremiumAt(nowMs = Date.now()) {
  const elapsedSec = Math.max(0, (nowMs - ANCHOR_EPOCH_MS) / 1000);
  return ANCHOR_PREMIUM + elapsedSec * PREMIUM_PER_SECOND;
}

function FlipDigit({ digit }: { digit: string }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-baseline tabular-nums leading-none">
      <span className="invisible inline-block">{digit}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: FLIP_MS, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 inline-flex items-center justify-center"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FlipValue({ value }: { value: string }) {
  return (
    <span className="inline-flex items-baseline">
      {value.split("").map((char, index) =>
        /\d/.test(char) ? (
          <FlipDigit key={`d-${index}`} digit={char} />
        ) : (
          <span key={`s-${index}-${char}`} className="inline-block">
            {char}
          </span>
        ),
      )}
    </span>
  );
}

export const GdpCounter = ({ className }: GdpCounterProps) => {
  // Start at anchor to keep SSR/client markup aligned; sync to epoch on mount.
  const [value, setValue] = useState(ANCHOR_PREMIUM);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncFromClock = () => setValue(getPremiumAt());

    syncFromClock();

    const schedule = () => {
      timeoutRef.current = setTimeout(() => {
        // Always re-derive from epoch so background tabs catch up correctly.
        syncFromClock();
        schedule();
      }, nextTickMs());
    };

    schedule();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const formatted = formatPremium(value);

  return (
    <span
      className={`inline-flex items-baseline font-mono text-inherit ${className ?? ""}`}
      aria-label={formatted}
    >
      <FlipValue value={formatted} />
    </span>
  );
};
