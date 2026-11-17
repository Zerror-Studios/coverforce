import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HASH_RETRY_MS = 50;
const HASH_MAX_ATTEMPTS = 40;
const HASH_SCROLL_DURATION = 1.45;

export function scrollToTop(immediate = true) {
  if (typeof window === "undefined") return;

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.lenis?.scrollTo(0, { immediate });
}

/** Prefer the real nav bar height so mega-menu chrome isn't counted. */
export function getHeaderScrollOffset(extra = 0) {
  if (typeof window === "undefined") return -extra;

  const nav =
    document.querySelector<HTMLElement>("[data-site-nav]") ??
    document.querySelector<HTMLElement>(".site-view-header");
  const height = nav?.getBoundingClientRect().height ?? 0;
  return -(height + extra);
}

export function prepareScrollLayout() {
  if (typeof window === "undefined") return;

  window.lenis?.resize();
  // Page order, so pins created late (async chunks) are measured first.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

export function scrollToHash(
  hash?: string,
  options?: { immediate?: boolean; duration?: number },
) {
  if (typeof window === "undefined") return false;

  const id = (hash ?? window.location.hash).replace(/^#/, "");
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  prepareScrollLayout();

  const nav =
    document.querySelector<HTMLElement>("[data-site-nav]") ??
    document.querySelector<HTMLElement>(".site-view-header");
  const headerHeight = nav?.getBoundingClientRect().height ?? 0;
  target.style.scrollMarginTop = `${headerHeight}px`;

  const offset = getHeaderScrollOffset();
  const immediate = options?.immediate ?? false;
  const duration = options?.duration ?? HASH_SCROLL_DURATION;
  const lenis = window.lenis;

  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target, {
      offset,
      immediate,
      duration,
      force: true,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const top =
      target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: immediate ? "auto" : "smooth",
    });
  }

  return true;
}

/**
 * Waits until the hash target exists, refreshes layout, then scrolls once.
 * Defaults to a smooth Lenis scroll (not an instant jump).
 */
export function scrollToHashWhenReady(
  hash?: string,
  options?: { immediate?: boolean; duration?: number },
) {
  if (typeof window === "undefined") return () => {};

  const id = (hash ?? window.location.hash).replace(/^#/, "");
  if (!id) return () => {};

  let attempts = 0;
  let cancelled = false;
  let timer: number | undefined;

  const tryScroll = () => {
    if (cancelled) return;

    prepareScrollLayout();

    if (
      scrollToHash(`#${id}`, {
        immediate: options?.immediate ?? false,
        duration: options?.duration ?? HASH_SCROLL_DURATION,
      })
    ) {
      return;
    }

    attempts += 1;
    if (attempts < HASH_MAX_ATTEMPTS) {
      timer = window.setTimeout(tryScroll, HASH_RETRY_MS);
    }
  };

  tryScroll();

  return () => {
    cancelled = true;
    if (timer !== undefined) window.clearTimeout(timer);
  };
}

export function disableScrollRestoration() {
  if (typeof window === "undefined") return () => {};

  const previous = window.history.scrollRestoration;
  window.history.scrollRestoration = "manual";

  return () => {
    window.history.scrollRestoration = previous;
  };
}
