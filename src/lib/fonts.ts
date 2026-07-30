/**
 * Tailwind font family utilities (see globals.css @theme).
 *
 * @example
 * // Body copy - Inter (also default on <body>)
 * <p className="font-sans text-base font-normal">Paragraph text</p>
 *
 * @example
 * // Page / section titles - Poppins
 * <h1 className="font-heading text-5xl font-semibold">Hero headline</h1>
 *
 * @example
 * // Eyebrows & labels - DM Mono
 * <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]">
 *   Built for your role
 * </p>
 *
 * @example
 * // Weights (all families): font-thin … font-black
 * <span className="font-sans font-medium">Inter 500</span>
 * <span className="font-heading font-bold">Poppins 700</span>
 * <span className="font-mono font-normal">DM Mono 400</span>
 */
export const fontFamily = {
  /** Inter - body, paragraphs, UI */
  sans: "font-sans",
  /** Poppins - headings, display */
  heading: "font-heading",
  /** DM Mono - eyebrows, tags, code-like labels */
  mono: "font-mono",
} as const;

/** Common Figma-style eyebrow (DM Mono) */
export const eyebrowClass =
  "font-mono text-[11px] font-medium uppercase tracking-[0.14em]";

/** Common section title (Poppins) */
export const headingClass =
  "font-heading font-semibold leading-tight tracking-tight";

/** Common body (Inter - optional; body already uses Inter) */
export const bodyClass = "font-sans leading-relaxed";
