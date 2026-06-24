export const PAGE_TRANSITION_OUT_MS = 260;
export const PAGE_TRANSITION_IN_MS = 420;
export const PAGE_TRANSITION_MS = PAGE_TRANSITION_OUT_MS + PAGE_TRANSITION_IN_MS;

export const PAGE_TRANSITION_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export const PAGE_BG_LIGHT = "#ffffff";
export const PAGE_BG_DARK = "#121C49";

export function getPageTransitionBg(pathname: string): string {
  if (
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/calculation")
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
    } catch {
      // Ignore malformed hrefs.
    }
  };

  document.addEventListener("click", handleClick, true);

  return () => {
    document.removeEventListener("click", handleClick, true);
  };
}
