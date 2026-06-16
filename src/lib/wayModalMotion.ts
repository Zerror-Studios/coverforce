export const WAY_MODAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
export const WAY_MODAL_EASE_OUT = "cubic-bezier(0.33, 1, 0.68, 1)";

export const WAY_MODAL_OVERLAY_OPEN_MS = 420;
export const WAY_MODAL_PANEL_OPEN_DELAY_MS = 260;
export const WAY_MODAL_PANEL_OPEN_MS = 580;
export const WAY_MODAL_PANEL_CLOSE_MS = 460;
export const WAY_MODAL_OVERLAY_CLOSE_DELAY_MS = 300;
export const WAY_MODAL_OVERLAY_CLOSE_MS = 380;

export const WAY_MODAL_CLOSE_TOTAL_MS =
  WAY_MODAL_PANEL_CLOSE_MS + WAY_MODAL_OVERLAY_CLOSE_DELAY_MS + WAY_MODAL_OVERLAY_CLOSE_MS;

export type WayModalRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function rectFromDOM(rect: DOMRect): WayModalRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
