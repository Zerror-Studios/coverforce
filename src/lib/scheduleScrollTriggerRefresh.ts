import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Coalesced ScrollTrigger.refresh().
 *
 * Every section used to call ScrollTrigger.refresh() as it mounted. A full
 * refresh re-measures every trigger (and pin) on the page, so when the home
 * page mounts its sections together that was ~10 full re-measures back to
 * back in one long main-thread task. Calls made close together now collapse
 * into a single refresh once mounting has settled.
 */
const SETTLE_MS = 60;

let timer: ReturnType<typeof setTimeout> | undefined;
let raf = 0;

/**
 * ScrollTrigger refreshes triggers in CREATION order. Sections load in
 * separate chunks, so a pinned section (e.g. home ProcessFlow, ~30 viewport
 * heights of pin spacing) can be created AFTER the triggers below it - those
 * then get measured without the pin spacing and fire far too early (e.g. the
 * WhyCoverforce / CarrierResults dark overlay showing while you read them).
 * Sorting by page position first makes every trigger see the pins above it.
 */
export function refreshScrollTriggersInPageOrder() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

export function scheduleScrollTriggerRefresh() {
  if (typeof window === "undefined") return;
  clearTimeout(timer);
  cancelAnimationFrame(raf);
  timer = setTimeout(() => {
    // Wait for the next frame so layout from the mounting commit is final.
    raf = requestAnimationFrame(() => {
      raf = 0;
      refreshScrollTriggersInPageOrder();
    });
  }, SETTLE_MS);
}
