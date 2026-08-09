"use client";

import {
  disableScrollRestoration,
  scrollToHashWhenReady,
  scrollToTop,
} from "@/lib/scrollToTop";
import { getPageTransitionMs } from "@/lib/pageTransition";
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
    if (!window.location.hash) {
      scrollToTop();
    }

    return restoreScrollRestoration;
  }, []);

  useLayoutEffect(() => {
    let cancelHashScroll = () => {};
    const transitionMs = getPageTransitionMs();

    if (window.location.hash) {
      // Start at the top, then ease down to the hash once layout is ready.
      scrollToTop(true);
      const timer = window.setTimeout(() => {
        cancelHashScroll = scrollToHashWhenReady();
      }, transitionMs);

      return () => {
        window.clearTimeout(timer);
        cancelHashScroll();
      };
    }

    scrollToTop();
    const frame = window.requestAnimationFrame(() => scrollToTop());
    const timer = window.setTimeout(() => scrollToTop(), transitionMs);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
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

    if (!window.location.hash) {
      scrollToTop();
    }

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
      if (window.location.hash) {
        scrollToHashWhenReady();
        return;
      }
      scrollToTop();
    };

    const handleLoad = () => {
      if (window.location.hash) {
        scrollToHashWhenReady();
        return;
      }
      scrollToTop();
      window.requestAnimationFrame(() => scrollToTop());
    };

    const handleHashChange = () => {
      scrollToHashWhenReady();
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname !== window.location.pathname || !url.hash) return;

        event.preventDefault();
        window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
        scrollToHashWhenReady(url.hash);
      } catch {
        // Ignore malformed hrefs.
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("load", handleLoad);
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleAnchorClick, true);

    let settleHashTimer: number | undefined;
    const settleFrames = window.requestAnimationFrame(() => {
      if (window.location.hash) {
        settleHashTimer = window.setTimeout(() => {
          scrollToHashWhenReady();
        }, getPageTransitionMs());
        return;
      }
      scrollToTop();
      window.requestAnimationFrame(() => scrollToTop());
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settleFrames);
      if (settleHashTimer !== undefined) window.clearTimeout(settleHashTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleAnchorClick, true);
      instance.destroy();
      lenis.current = null;
      window.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
