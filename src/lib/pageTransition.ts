export const PAGE_TRANSITION_OUT_MS = 520;
export const PAGE_TRANSITION_IN_MS = 820;
export const PAGE_TRANSITION_DELAY_MS = 120;
/** Total time until the incoming page has fully settled. */
export const PAGE_TRANSITION_MS = PAGE_TRANSITION_DELAY_MS + PAGE_TRANSITION_IN_MS;

export const PAGE_TRANSITION_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export const PAGE_BG_LIGHT = "#ffffff";
export const PAGE_BG_DARK = "#121C49";
export const PAGE_BG_PRICING = "#151f4d";

type PendingPathListener = (pathname: string) => void;

const pendingPathListeners = new Set<PendingPathListener>();

export function getPageTransitionBg(pathname: string): string {
  if (pathname.startsWith("/pricing")) {
    return PAGE_BG_PRICING;
  }

  if (
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/calculation") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/author")
  ) {
    return PAGE_BG_LIGHT;
  }

  return PAGE_BG_DARK;
}

export function setPageTransitionBg(pathname: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(
    "--page-transition-bg",
    getPageTransitionBg(pathname),
  );
  document.documentElement.dataset.pageEnter = pathname.startsWith("/pricing")
    ? "pricing"
    : "default";
}

/** Eagerly notify listeners of the destination path so chrome can update before the route settles. */
export function setPendingPathname(pathname: string) {
  pendingPathListeners.forEach((listener) => listener(pathname));
}

export function subscribePendingPathname(listener: PendingPathListener) {
  pendingPathListeners.add(listener);
  return () => {
    pendingPathListeners.delete(listener);
  };
}

/** Animations are defined in globals.css on ::view-transition-* (page-content). */
export function pageAnimation() {}

export function installPageTransitionBgSync() {
  if (typeof document === "undefined") return () => {};

  const handleClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      setPageTransitionBg(url.pathname);
      setPendingPathname(url.pathname);
    } catch {
      // Ignore malformed hrefs.
    }
  };

  document.addEventListener("click", handleClick, true);

  return () => {
    document.removeEventListener("click", handleClick, true);
  };
}
