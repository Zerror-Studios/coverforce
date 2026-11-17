"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useHomeIntro } from "@/contexts/HomeIntroContext";
import { scheduleScrollTriggerRefresh } from "@/lib/scheduleScrollTriggerRefresh";

/**
 * Below-the-fold home sections.
 *
 * These used to return null until the intro finished (~3.6s), which meant:
 * no server HTML for them (SEO), their code chunks only started downloading
 * at that moment, and every section mounted in one commit right as scrolling
 * unlocked - a long main-thread stall at the worst time.
 *
 * Now they're rendered (and server-rendered) from the start, just hidden and
 * non-interactive during the intro. Scroll is locked to the top while the
 * intro runs, so nothing here could be seen anyway. SiteLayout re-measures
 * ScrollTrigger once the intro reaches "done".
 */
export default function HomeSectionsAfterIntro({ children }: { children: ReactNode }) {
  const { enabled, phase } = useHomeIntro();
  const hidden = enabled && phase !== "done";
  const rootRef = useRef<HTMLDivElement>(null);

  // ProcessFlow pins against positions measured once. If anything changes
  // height afterwards (hero globe / card mocks / images finishing loading,
  // scrollbar returning after the intro), those positions go stale and the
  // pin starts in the wrong place - the section "sticks" early and jumps.
  // Re-measure (coalesced) whenever the page height above/around it changes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    let lastHeight = -1;
    let lastWidth = -1;
    const observer = new ResizeObserver(() => {
      const { scrollHeight, clientWidth } = document.documentElement;
      if (scrollHeight === lastHeight && clientWidth === lastWidth) return;
      lastHeight = scrollHeight;
      lastWidth = clientWidth;
      scheduleScrollTriggerRefresh();
    });
    // Body covers the hero as well as these sections.
    observer.observe(document.body);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      style={hidden ? { visibility: "hidden" } : undefined}
      inert={hidden}
      aria-hidden={hidden || undefined}
    >
      {children}
    </div>
  );
}
