export type WayCardModalContent = {
  id: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  features: string[];
};

export const WAY_CARD_MODALS: Record<string, WayCardModalContent> = {
  Wholesalers: {
    id: "wholesalers",
    title: "Grow distribution efficiently",
    description:
      "Route submissions, manage MGAs, and expand your carrier network from one intake workflow built for wholesale teams.",
    primaryCta: { label: "Explore wholesaler tools", href: "/solutions/wholesalers" },
    secondaryCta: { label: "See pricing details", href: "/" },
    features: [
      "Centralize email and ACORD intake",
      "Distribute to the right markets faster",
      "Track submissions across producers",
      "Scale without adding back-office headcount",
    ],
  },
  Brokers: {
    id: "brokers",
    title: "One workflow for every producer",
    description:
      "Quote multiple carriers, pre-fill applications with AI, and give every producer the same fast path from intake to bind.",
    primaryCta: { label: "Explore broker workflow", href: "/solutions/brokers" },
    secondaryCta: { label: "See pricing details", href: "/" },
    features: [
      "AI pre-filled carrier applications",
      "Pipeline visibility for every producer",
      "Quotes from 40+ carriers in one place",
      "Faster quoting from intake to bind",
    ],
  },
  Developers: {
    id: "developers",
    title: "Build insurance products on Coverforce APIs",
    description:
      "Embed quoting, binding, and policy workflows into your product with sandbox-ready APIs and developer-first documentation.",
    primaryCta: { label: "Explore developer APIs", href: "/solutions/developers" },
    secondaryCta: { label: "View API docs", href: "/" },
    features: [
      "Sandbox and production environments",
      "API keys generated in minutes",
      "Test quotes across 40+ carriers",
      "Ship insurance features without legacy infra",
    ],
  },
  Startups: {
    id: "startups",
    title: "Launch coverage without legacy overhead",
    description:
      "Move from idea to bindable quotes with a single platform that handles intake, carrier connectivity, and producer workflows.",
    primaryCta: { label: "Explore startup tools", href: "/solutions/startups" },
    secondaryCta: { label: "Request a demo", href: "/" },
    features: [
      "Go live without building carrier integrations",
      "One workflow for every producer",
      "AI-assisted application completion",
      "Scale distribution as you grow",
    ],
  },
  Carriers: {
    id: "carriers",
    title: "Reach brokers and wholesalers at scale",
    description:
      "Put your appetite in front of the right submissions, streamline appetite matching, and grow appointed distribution digitally.",
    primaryCta: { label: "Explore carrier distribution", href: "/solutions/carrier" },
    secondaryCta: { label: "See pricing details", href: "/" },
    features: [
      "Receive cleaner, pre-structured submissions",
      "Match appetite before manual review",
      "Expand broker and MGA reach digitally",
      "Reduce friction from intake to quote",
    ],
  },
};
