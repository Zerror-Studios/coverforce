"use client";

import { disableScrollRestoration, scrollToTop } from "@/lib/scrollToTop";
import { PAGE_TRANSITION_MS } from "@/lib/pageTransition";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

type LenisScrollProps = {
  children: ReactNode;
};

export default function LenisScroll({ children }: LenisScrollProps) {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const restoreScrollRestoration = disableScrollRestoration();
    scrollToTop();

    return restoreScrollRestoration;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => scrollToTop(), PAGE_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const instance = new Lenis({
      smoothWheel: true,
      lerp: 0.1,
      wheelMultiplier: 0.7,
      gestureOrientation: "vertical",
    });

    lenis.current = instance;
    window.lenis = instance;
    scrollToTop();

    let frame: number;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const handleResize = () => {
      instance.resize();
    };

    const handlePageShow = () => {
      scrollToTop();
    };

    const handleLoad = () => {
      scrollToTop();
      window.requestAnimationFrame(() => scrollToTop());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("load", handleLoad);

    const settleFrames = window.requestAnimationFrame(() => {
      scrollToTop();
      window.requestAnimationFrame(() => scrollToTop());
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settleFrames);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("load", handleLoad);
      instance.destroy();
      lenis.current = null;
      window.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
