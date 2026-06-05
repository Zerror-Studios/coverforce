import type { CSSProperties } from "react";

/** Crisp micro-interaction ease — quick roll, soft settle */
export const MICRO_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

export const MICRO_ROLL_MS = 1650;
export const MICRO_ROLL_STAGGER_MS = 90;
export const MICRO_ENTRANCE_MS = 420;
export const MICRO_BAR_MS = 1100;
export const MICRO_BAR_STAGGER_MS = 100;
export const MICRO_CHART_MS = 900;
export const MICRO_CHART_STAGGER_MS = 45;
export const MICRO_WORKFLOW_MS = 1100;
export const MICRO_WORKFLOW_DELAY_MS = 180;
export const MICRO_TAB_COLOR_MS = 480;

export const MICRO_IO_OPTIONS: IntersectionObserverInit = {
  threshold: 0.3,
  rootMargin: "0px 0px -8% 0px",
};

export function microEaseOut(progress: number): number {
  return 1 - (1 - progress) ** 4;
}

type MicroRevealOptions = {
  delay?: number;
  offsetY?: string;
  offsetX?: string;
};

export function microRevealStyle(
  animate: boolean,
  { delay = 0, offsetY = "0.4rem", offsetX = "0" }: MicroRevealOptions = {},
): CSSProperties {
  return {
    opacity: animate ? 1 : 0,
    transform: animate
      ? "translate(0, 0)"
      : `translate(${offsetX}, ${offsetY})`,
    transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
    transitionDelay: `${delay}ms`,
  };
}

type MicroPopOptions = {
  delay?: number;
};

export function microPopStyle(
  animate: boolean,
  { delay = 0 }: MicroPopOptions = {},
): CSSProperties {
  return {
    opacity: animate ? 1 : 0,
    transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
    transitionDelay: `${delay}ms`,
  };
}
