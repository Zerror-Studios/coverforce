import type { FaqEntry } from "./types";

/** FAQs for /solutions/brokers. */
export const BROKERS_FAQS: FaqEntry[] = [
  {
    id: "quote-multiple-carriers",
    question: "How can a broker quote multiple carriers from one platform?",
    answer:
      "CoverForce lets brokers quote 60+ carrier products from a single workflow with no portal logins and no rekeying, comparing carriers in real time from one submission. Its API extracts data from ACORD forms and unstructured PDFs at 95% accuracy, then routes each risk to the carrier most likely to bind based on historical bind data, so producers place business faster with better carrier fit.",
  },
  {
    id: "commercial-insurance-api-brokers",
    question: "What is CoverForce's commercial insurance API for brokers?",
    answer:
      "CoverForce is an AI-native commercial insurance API that gives brokers real-time multi-carrier quoting and binding across 60+ carrier products for lines including BOP, workers' compensation, general liability, and cyber. It replaces separate carrier portals with one platform for every carrier and every office, and was named to the 2025 CB Insights Insurtech 50 for innovation in insurance distribution.",
  },
  {
    id: "place-business-profitably",
    question: "How does CoverForce help agencies place business more profitably?",
    answer:
      "CoverForce helps agencies place risks faster with better carrier fit and less wasted effort, so firms keep more premium and more margin. AI extraction, appetite matching, and automated certificate-of-insurance generation raise the floor for every producer, while real-time dashboards track submission volume, quote rates, bind rates, and premium across the agency.",
  },
  {
    id: "eliminate-rekeying",
    question: "Does CoverForce eliminate rekeying submissions into carrier portals?",
    answer:
      "Yes. CoverForce ingests ACORD forms and email submissions and extracts data from unstructured PDFs at 95% accuracy, so brokers enter a submission once instead of rekeying it into each carrier portal. Third-party data integrations automatically fill in missing details, and the single workflow covers every carrier and every office without separate portal logins.",
  },
  {
    id: "appetite-matching-brokers",
    question: "How does CoverForce know which carrier is most likely to bind a risk?",
    answer:
      "CoverForce's appetite matching automatically routes each submission to the carrier most likely to bind, based on historical bind data across its 60+ live carrier integrations. This intelligent routing reduces time wasted on unbindable risks and improves carrier fit, contributing to a reported 500% increase in applications processed per underwriter daily and a 0% API error rate on submission data.",
  },
  {
    id: "broker-lines",
    question: "What commercial lines can brokers quote through CoverForce?",
    answer:
      "Brokers can quote and bind commercial lines through CoverForce including business owner's policy (BOP), workers' compensation, general liability, and cyber, across 60+ live carrier integrations. The platform has processed 110,000+ submissions for 15,000+ agencies, using ACORD forms and NAICS industry codes to standardize data and enable real-time comparative quoting.",
  },
];
