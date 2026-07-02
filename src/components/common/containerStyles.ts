import type { CSSProperties } from "react";

export const containerPadding = "px-5 md:px-4 lg:px-6 xl:px-6";

export const DEFAULT_BORDER_COLOR = "#e5e7eb";

const BORDER_WIDTH = "0.001rem";
const DASH_LENGTH = 5;
const DASH_GAP = 12;

function borderDashGradient(color: string, angle: number): string {
  return `repeating-linear-gradient(${angle}deg, ${color} 0px, ${color} ${DASH_LENGTH}px, transparent ${DASH_LENGTH}px, transparent ${DASH_GAP}px)`;
}

export function getSideBorderStyle(
  color: string = DEFAULT_BORDER_COLOR,
  opacity = 1,
): CSSProperties {
  const resolvedColor =
    opacity < 1
      ? `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
      : color;

  return {
    borderLeft: `${BORDER_WIDTH} solid transparent`,
    borderRight: `${BORDER_WIDTH} solid transparent`,
    borderImage: `${borderDashGradient(resolvedColor, 180)} 1`,
  };
}

export function getLeftBorderStyle(
  color: string = DEFAULT_BORDER_COLOR,
  opacity = 1,
): CSSProperties {
  const resolvedColor =
    opacity < 1
      ? `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
      : color;

  return {
    borderLeft: `${BORDER_WIDTH} solid transparent`,
    borderImage: `${borderDashGradient(resolvedColor, 180)} 1`,
  };
}

export function getRightBorderStyle(
  color: string = DEFAULT_BORDER_COLOR,
  opacity = 1,
): CSSProperties {
  const resolvedColor =
    opacity < 1
      ? `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
      : color;

  return {
    borderRight: `${BORDER_WIDTH} solid transparent`,
    borderImage: `${borderDashGradient(resolvedColor, 180)} 1`,
  };
}

export function getBottomBorderStyle(
  color: string = DEFAULT_BORDER_COLOR,
): CSSProperties {
  return {
    borderBottom: `${BORDER_WIDTH} solid transparent`,
    borderImage: `${borderDashGradient(color, 90)} 1`,
  };
}

export function getTopBorderStyle(
  color: string = DEFAULT_BORDER_COLOR,
): CSSProperties {
  return {
    borderTop: `${BORDER_WIDTH} solid transparent`,
    borderImage: `${borderDashGradient(color, 90)} 1`,
  };
}
