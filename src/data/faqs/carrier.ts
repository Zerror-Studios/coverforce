import type { FaqEntry } from "./types";

/** FAQs for /solutions/carrier. */
export const CARRIER_FAQS: FaqEntry[] = [
  {
    id: "reach-more-agents",
    question:
      "How can an insurance carrier reach more agents through a single API integration?",
    answer:
      "CoverForce is a carrier distribution platform that connects a carrier's products to 15,000+ agencies, brokers, wholesalers, and MGAs through one API integration, with no separate partnerships required. Carriers go live in about 30 days with fewer than 10 hours of engineering time, and the platform reports up to 70% net new business from newly reachable distributors.",
  },
  {
    id: "carrier-distribution-platform",
    question: "What is CoverForce's carrier distribution platform?",
    answer:
      "CoverForce is an AI-native commercial insurance distribution platform whose carrier API places a carrier's quote-and-bind products directly inside the multi-carrier quoting flow used by 15,000+ agencies. It supports lines like BOP, workers' compensation, general liability, and cyber, connecting carriers to brokers, wholesalers, and high-growth startups nationwide through a single integration rather than many one-off connections.",
  },
  {
    id: "carrier-integration-time",
    question: "How long does it take a carrier to integrate with CoverForce?",
    answer:
      "A carrier can go live on CoverForce in roughly 30 days, with a BOP integration referenced as live in 12 weeks and requiring fewer than 10 hours of carrier engineering time. CoverForce handles submission validation, document extraction, and mapping of NAICS industry codes to the carrier's classification system, minimizing the internal build effort for the carrier's team.",
  },
  {
    id: "submission-quality",
    question: "How does CoverForce improve submission quality for carriers?",
    answer:
      "CoverForce uses AI to validate submissions for completeness, extract data from ACORD forms and documents, pre-answer underwriting questions, and map industry codes to a carrier's classification system before submissions reach underwriters. The platform reports a 0% API error rate on submission data and a 500% improvement in applications processed per underwriter daily, drawn from 350,000+ AI-labeled carrier interactions.",
  },
  {
    id: "net-new-business",
    question:
      "Does CoverForce deliver net new business to carriers or just digitize existing volume?",
    answer:
      "CoverForce reports that up to 70% of the business carriers receive through the platform is net new, sourced from distributors they were not previously connected to. Because one integration exposes a carrier's products to 15,000+ agencies, brokers, wholesalers, and startups, carriers expand distribution reach without negotiating and building separate partnerships for each channel.",
  },
  {
    id: "carrier-lines",
    question: "Which insurance lines can carriers distribute through CoverForce?",
    answer:
      "Carriers can distribute commercial lines through CoverForce including business owner's policy (BOP), workers' compensation, general liability, and cyber, quoted and bound in real time. The platform has processed 110,000+ submissions across 60+ carrier and MGA integrations, using ACORD forms and NAICS codes to standardize data across carriers.",
  },
];
