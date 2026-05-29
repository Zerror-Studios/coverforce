import type { CSSProperties } from "react";

export const containerPadding = "px-2 md:px-4 lg:px-6 xl:px-6";

export const DEFAULT_BORDER_COLOR = "#e5e7eb";

export function getSideBorderStyle(
  color: string = DEFAULT_BORDER_COLOR,
): CSSProperties {
  return {
    borderLeft: "2px solid transparent",
    borderRight: "2px solid transparent",
    borderImage: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 16px, transparent 16px, transparent 24px) 1`,
  };
}
