import type { FaqEntry } from "./types";

/** FAQs for /integration. */
export const INTEGRATION_FAQS: FaqEntry[] = [
  {
    id: "carrier-api-integration",
    question: "How does CoverForce's carrier API integration work?",
    answer:
      "CoverForce provides direct carrier API connections plus purpose-built AI agents that quote, bind, and issue policies in real time, without portal logins or manual re-entry. A single integration with CoverForce connects you to 60+ carrier and MGA products across lines like commercial auto, general liability, cyber, workers' comp, BOP, crime, D&O, EPLI, and professional liability, replacing dozens of one-off carrier builds.",
  },
  {
    id: "integration-timeline",
    question: "How long does carrier integration take with CoverForce?",
    answer:
      "New carrier integrations typically reach production in about 30 days, with an average integration timeline of roughly 8 weeks depending on scope. Because carriers are already connected through CoverForce's unified API, agencies and brokers avoid the multi-month effort of building and maintaining each carrier connection themselves. Sandbox access on signup lets teams start testing immediately.",
  },
  {
    id: "carrier-count",
    question: "How many insurance carriers does CoverForce connect to?",
    answer:
      "CoverForce connects 40+ carriers through 200+ API integrations, spanning 60+ carrier and MGA products, with 63+ carrier products tracked in its 2026 Carrier API Index. These integrations cover commercial lines including general liability, workers' compensation, BOP, cyber, commercial auto, crime, D&O, EPLI, and professional liability, all reachable through one unified API.",
  },
  {
    id: "single-connection",
    question: "Can I integrate multiple insurance carriers through a single connection?",
    answer:
      "Yes. CoverForce lets you quote and bind across multiple carriers from one submission and one API integration, so a single request checks appetite and returns real-time quotes from many carriers at once. This eliminates separate carrier portals and duplicate data entry, and enterprise controls manage broker codes, commissions, and network oversight across the connected carriers.",
  },
  {
    id: "ams-platforms",
    question: "Does CoverForce integrate with agency management systems and other platforms?",
    answer:
      "Yes. CoverForce offers real-time synchronization with agency management systems (AMS), premium finance platforms, and compliance partners, keeping submission and policy data consistent across the stack. Its AI workflow automation reads submissions, matches carrier appetite, and orchestrates the process from intake through policy delivery, and the platform is SOC 2 Type II certified.",
  },
];
