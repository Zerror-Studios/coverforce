"use client";

import { useEffect, useState } from "react";

const BASE_PREMIUM = 1_021_677_315.11;
const PREMIUM_PER_TICK = 108.66;
const TICK_MS = 5_000;

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

export const GdpCounter = ({ className }: GdpCounterProps) => {
  const [value, setValue] = useState(BASE_PREMIUM);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((current) => current + PREMIUM_PER_TICK);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className={`inline-flex items-baseline font-mono text-inherit ${className ?? ""}`}
      aria-label={formatPremium(value)}
    >
      {formatPremium(value)}
    </span>
  );
};
