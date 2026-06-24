export const PAGE_TRANSITION_MS = 1000;

export const PAGE_TRANSITION_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function pageAnimation() {
  if (typeof document === "undefined") return;
  if (!document.startViewTransition) return;

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: "translateY(0) scale(1)",
      },
      {
        opacity: 0.4,
        transform: "translateY(-10%) scale(0.96)",
      },
    ],
    {
      duration: PAGE_TRANSITION_MS,
      easing: PAGE_TRANSITION_EASE,
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    },
  );

  document.documentElement.animate(
    [
      {
        transform: "translateY(100%)",
      },
      {
        transform: "translateY(0)",
      },
    ],
    {
      duration: PAGE_TRANSITION_MS,
      easing: PAGE_TRANSITION_EASE,
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    },
  );
}
