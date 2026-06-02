"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  MICRO_BAR_MS,
  MICRO_BAR_STAGGER_MS,
  MICRO_EASE,
  MICRO_ENTRANCE_MS,
  microEaseOut,
} from "@/lib/motion";

type AnimatedCarrierBarProps = {
  logo: string;
  logoAlt: string;
  value: number;
  animate: boolean;
  delay?: number;
  duration?: number;
};

function AnimatedCarrierBar({
  logo,
  logoAlt,
  value,
  animate,
  delay = 0,
  duration = MICRO_BAR_MS,
}: AnimatedCarrierBarProps) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!animate) return;

    const visibilityTimer = window.setTimeout(() => setVisible(true), delay);

    const valueTimer = window.setTimeout(() => {
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setCurrent(microEaseOut(progress) * value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setCurrent(value);
        }
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(visibilityTimer);
      window.clearTimeout(valueTimer);
    };
  }, [animate, value, delay, duration]);

  return (
    <div
      className="space-y-2 transition-[opacity,transform]"
      style={{
        transitionDuration: `${MICRO_ENTRANCE_MS}ms`,
        transitionTimingFunction: MICRO_EASE,
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(0.4rem)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="relative h-6 w-20 shrink-0">
          <Image
            src={logo}
            alt={logoAlt}
            fill
            className="object-contain object-left"
            sizes="80px"
          />
        </div>
        <span className="shrink-0 text-sm font-mono font-medium tabular-nums text-white">
          {current.toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${current}%` }}
        />
      </div>
    </div>
  );
}

const CARRIER_BARS = [
  {
    logo: "/images/coailtionloading-logo.svg",
    logoAlt: "Coalition",
    value: 94.8,
    delay: 0,
  },
  {
    logo: "/images/chubbloading-logo.svg",
    logoAlt: "Chubb",
    value: 10.4,
    delay: MICRO_BAR_STAGGER_MS,
  },
] as const;

export default function AnimatedCarrierBars() {
  const [animate, setAnimate] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

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
    <div ref={rootRef} className="space-y-5">
      {CARRIER_BARS.map((bar) => (
        <AnimatedCarrierBar
          key={bar.logoAlt}
          logo={bar.logo}
          logoAlt={bar.logoAlt}
          value={bar.value}
          animate={animate}
          delay={bar.delay}
        />
      ))}
    </div>
  );
}
