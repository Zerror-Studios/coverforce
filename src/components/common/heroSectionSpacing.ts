/**
 * Shared optical top spacing for Developers / Integration / Pricing heroes.
 * Same nudge + vertical padding so copy sits at the same place in the first viewport.
 */
export const HERO_COPY_INSET =
  "mx-auto flex max-w-3xl -translate-y-6 flex-col items-center px-6 py-16 text-center md:-translate-y-10 md:py-20";

/** For heroes that own the first viewport themselves (Developers copy block). */
export const HERO_COPY_STACK = `${HERO_COPY_INSET} min-h-svh justify-center`;

/**
 * Pricing (and similar flow heroes): same copy Y as HERO_COPY_STACK,
 * without locking a full empty viewport before the next section.
 */
export const HERO_COPY_FLOW =
  "mx-auto flex max-w-3xl -translate-y-6 flex-col items-center px-6 pb-8 pt-[max(7rem,calc(50svh-10.5rem))] text-center md:-translate-y-10 md:pb-10 md:pt-[max(8rem,calc(50svh-11rem))]";

/** Full-viewport shell used by Integration (and similar) heroes. */
export const HERO_SVH_SHELL =
  "relative flex h-svh items-center justify-center overflow-hidden pb-24 md:pb-32";

/** Wider inset for product heroes with a sliding copy/stat carousel. */
export const HERO_CAROUSEL_INSET =
  "mx-auto flex w-full max-w-5xl -translate-y-6 flex-col items-center px-4 py-16 text-center sm:px-6 md:-translate-y-10 md:py-20 lg:max-w-6xl";
