import type { ReactNode } from "react";
import { withAlpha } from "@/data/wayCardStyles";

/** Brand navy - default accent for light pills (text, border, tinted bg). */
const DEFAULT_ACCENT = "#151f4d";

type EyebrowPillProps = {
  children: ReactNode;
  /** Surface the pill sits on. "dark" = light pill on dark bg, "light" = navy-outlined pill on light bg. */
  surface?: "dark" | "light";
  className?: string;
  /** Override the default dot color (e.g. card gradient accent). */
  dotColor?: string;
  /** Gradient or solid fill for the pill background (overrides accent coloring). */
  background?: string;
  /** Accent color for the pill (text, border, tinted bg, dot). Applies to the light surface. */
  accent?: string;
  /** Use a white outer glow instead of the default dark drop shadow. */
  shadow?: "default" | "white";
};

const DARK_SHADOW =
  "0 2px 2px -1px #08011408, 0 1px 1px -.5px #08011408, 0 .5px .5px #08011408, 0 2px 8px #ffffff0a inset, 0 1px 3px #ffffff1a inset, 0 .5px .5px #ffffff1f inset";

const WHITE_SHADOW =
  "0 2px 6px -1px #ffffff55, 0 1px 2px #ffffff40, 0 .5px .5px #ffffff50, 0 2px 8px #ffffff0a inset, 0 1px 3px #ffffff1a inset, 0 .5px .5px #ffffff1f inset";

/** Blue inset highlight - readable on light/gray surfaces where white inset disappears */
const LIGHT_SHADOW =
  "0 1px 2px -1px #151f4d14, 0 1px 1px #151f4d0f, 0 2px 8px #413CC018 inset, 0 1px 3px #151f4d22 inset, 0 .5px .5px #5B35E028 inset";

export default function EyebrowPill({
  children,
  surface = "dark",
  className = "",
  dotColor,
  background,
  accent,
  shadow = "default",
}: EyebrowPillProps) {
  const useGradient = Boolean(background);
  const resolvedAccent = accent ?? DEFAULT_ACCENT;
  const useAccent = !useGradient && surface === "light";
  const resolvedShadow =
    shadow === "white" ? WHITE_SHADOW : useAccent ? LIGHT_SHADOW : DARK_SHADOW;

  const baseClass =
    "mb-5 flex w-fit items-center justify-center gap-2.5 rounded-full px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] md:text-[0.65rem]";

  let wrapperStyle: React.CSSProperties;
  let textClass = "";

  if (useGradient) {
    wrapperStyle = { background, boxShadow: resolvedShadow };
    textClass = "text-white";
  } else if (useAccent) {
    // Soft tinted fill + blue inset highlight so the glass edge reads on gray
    wrapperStyle = {
      background: withAlpha(resolvedAccent, 0.08),
      color: resolvedAccent,
      boxShadow: resolvedShadow,
    };
  } else {
    wrapperStyle = { boxShadow: resolvedShadow };
    textClass = "bg-[#ffffff14] text-white";
  }

  const dotColorResolved =
    dotColor ?? (useGradient ? "#FFFFFF" : useAccent ? resolvedAccent : "#FFFFFF");

  return (
    <p style={wrapperStyle} className={`${baseClass} ${textClass} ${className}`}>
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: dotColorResolved }}
        aria-hidden
      />
      {children}
    </p>
  );
}
