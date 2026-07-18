"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
};

export default function HeroReveal({
  children,
  className,
  delay = 0.45,
  stagger = 0.12,
}: HeroRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 30 });
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const items = Array.from(el.children) as HTMLElement[];
      if (!items.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 30 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger,
        delay,
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
