export type CardBackground = "accent" | "light" | "developer";

export const CARD_BACKGROUNDS: Record<CardBackground, string> = {
  accent:
    "bg-[linear-gradient(135deg,#4541CD_0%,#352D93_38%,#121C49_100%)]",
  light: "bg-[linear-gradient(135deg,#DADEF5_0%,#F8F0FC_55%,#FFFFFF_100%)]",
  developer: "bg-[linear-gradient(135deg,#8A80DD_0%,#ACA8D7_50%,#8A80DD_100%)]",
};
