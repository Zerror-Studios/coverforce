import type { ReactNode } from "react";

/** Brand navy — default accent for light pills (text, border, tinted bg). */
const DEFAULT_ACCENT = "#151f4d";

type EyebrowPillProps = {
  children: ReactNode;
  /** Surface the pill sits on. "dark" = light pill on dark bg, "light" = navy-outlined pill on light bg. */
  surface?: "dark" | "light";
  className?: string;
  /** When set, tags the inner dot with `data-card-dot` (used as a landing target). */
  dotAttr?: string;
  /** Override the default dot color (e.g. card gradient accent). */
  dotColor?: string;
  /** Gradient or solid fill for the pill background (overrides accent coloring). */
  background?: string;
  /** Accent color for the pill (text, border, tinted bg, dot). Applies to the light surface. */
  accent?: string;
};

const DARK_SHADOW =
  "0 2px 2px -1px #08011408, 0 1px 1px -.5px #08011408, 0 .5px .5px #08011408, 0 2px 8px #ffffff0a inset, 0 1px 3px #ffffff1a inset, 0 .5px .5px #ffffff1f inset";

export default function EyebrowPill({
  children,
  surface = "dark",
  className = "",
  dotAttr,
  dotColor,
  background,
  accent,
}: EyebrowPillProps) {
  const useGradient = Boolean(background);
  const resolvedAccent = accent ?? DEFAULT_ACCENT;
  const useAccent = !useGradient && surface === "light";

  const baseClass =
    "mb-5 flex w-fit items-center justify-center gap-2.5 rounded-full px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] md:text-[0.65rem]";

  let wrapperStyle: React.CSSProperties;
  let textClass = "";

  if (useGradient) {
    wrapperStyle = { background, boxShadow: DARK_SHADOW };
    textClass = "text-white";
  } else if (useAccent) {
    wrapperStyle = {
      background: resolvedAccent,
      boxShadow: DARK_SHADOW,
    };
    textClass = "text-white";
  } else {
    wrapperStyle = { boxShadow: DARK_SHADOW };
    textClass = "bg-[#ffffff14] text-white";
  }

  const dotColorResolved = dotColor ?? "#FFFFFF";

  return (
    <p style={wrapperStyle} className={`${baseClass} ${textClass} ${className}`}>
      <span
        className={`size-1.5 shrink-0 rounded-full ${dotAttr ? "opacity-100 lg:opacity-0" : ""}`}
        style={{ backgroundColor: dotColorResolved }}
        data-card-dot={dotAttr}
        aria-hidden
      />
      {children}
    </p>
  );
}
