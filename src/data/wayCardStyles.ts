export type CardBackground =
  | "accent"
  | "light"
  | "developer"
  | "wholesaler"
  | "broker"
  | "startup";

export const CARD_BACKGROUNDS: Record<CardBackground, string> = {
  accent:
    "bg-[linear-gradient(135deg,#4541CD_0%,#352D93_38%,#121C49_100%)]",
  light: "bg-[linear-gradient(135deg,#DADEF5_0%,#F8F0FC_55%,#FFFFFF_100%)]",
  developer: "bg-[linear-gradient(135deg,#141C37_0%,#5100FF_100%)]",
  wholesaler:
    "bg-[linear-gradient(45deg,#0045FF_0%,#36B6FF_40%,#9EDDFF_72%,#D3F1FF_100%)]",
  broker:
    "bg-[linear-gradient(135deg,#1B2550_0%,#5566C4_42%,#B9A7E6_74%,#8A63E8_100%)]",
  startup:
    "bg-[linear-gradient(135deg,#154BC1_0%,#B87AFF_55%,#DACAFF_100%)]",
};
