import type { ReactNode } from "react";

type EyebrowPillProps = {
  children: ReactNode;
  /** Surface the pill sits on. "dark" = light pill on dark bg, "light" = dark pill on light bg. */
  surface?: "dark" | "light";
  className?: string;
};

const SURFACE_STYLES = {
  dark: {
    wrapper: "bg-[#ffffff14] text-white",
    dot: "bg-white",
    boxShadow:
      "0 2px 2px -1px #08011408, 0 1px 1px -.5px #08011408, 0 .5px .5px #08011408, 0 2px 8px #ffffff0a inset, 0 1px 3px #ffffff1a inset, 0 .5px .5px #ffffff1f inset",
  },
  light: {
    wrapper: "bg-[#0801140a] text-[#0a143b]",
    dot: "bg-[#413CC0]",
    boxShadow:
      "0 2px 2px -1px #08011408, 0 1px 1px -.5px #08011408, 0 .5px .5px #08011408, 0 2px 8px #08011405 inset, 0 1px 3px #0801140d inset, 0 .5px .5px #08011412 inset",
  },
} as const;

export default function EyebrowPill({
  children,
  surface = "dark",
  className = "",
}: EyebrowPillProps) {
  const styles = SURFACE_STYLES[surface];

  return (
    <p
      style={{ boxShadow: styles.boxShadow }}
      className={`mb-5 flex w-fit items-center justify-center gap-2.5 rounded-full px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] md:text-[0.65rem] ${styles.wrapper} ${className}`}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${styles.dot}`} aria-hidden />
      {children}
    </p>
  );
}
