import type { FaqEntry } from "./types";

/** FAQs for /solutions/wholesalers. */
export const WHOLESALERS_FAQS: FaqEntry[] = [
  {
    id: "wholesale-platform",
    question:
      "What is CoverForce's wholesale insurance platform for wholesalers and MGAs?",
    answer:
      "CoverForce is an AI-native wholesale insurance platform that centralizes intake, routing, broker controls, and program distribution so a wholesale team can scale from one platform without changing how retailers submit business. It routes a single submission to 40+ carriers, checks each against live appetite before underwriting, and manages 200+ broker codes from a unified dashboard with full audit trails.",
  },
  {
    id: "mga-multi-carrier",
    question: "How does an MGA quote and bind across multiple carriers with CoverForce?",
    answer:
      "CoverForce lets an MGA send one submission and route it to 40+ carriers, with each submission checked against live carrier appetite before underwriting to eliminate no-quote markets. Its AI reads emails, ACORD forms, loss runs, and proposals into structured applications at 95%+ accuracy, then supports real-time quoting and binding and generates certificates of insurance from bound policy data.",
  },
  {
    id: "reduce-retyping",
    question: "How does CoverForce reduce underwriter re-typing for wholesalers?",
    answer:
      "CoverForce's AI inbox and document reader turn emails, ACORD forms, loss runs, and proposals into structured applications at 95%+ accuracy, eliminating the manual entry where underwriters otherwise spend about 40% of their day re-typing from ACORD forms. Automated enrichment fills in missing details, so incomplete submissions no longer stall underwriting.",
  },
  {
    id: "broker-codes",
    question:
      "Can CoverForce manage broker codes and producer permissions for a wholesale operation?",
    answer:
      "Yes. CoverForce manages 200+ broker codes from a unified dashboard with broker code delegation, producer permission controls, and a full audit trail. This lets wholesale operations control network access and delegate authority centrally while retailers keep submitting business the same way, preserving oversight as volume scales.",
  },
  {
    id: "appetite-engine",
    question: "How does CoverForce's appetite engine prevent wasted submissions?",
    answer:
      "CoverForce's AI appetite engine checks every submission against live carrier appetite before underwriting and routes it to 40+ carriers in one pass, eliminating no-quote markets and blind routing that wastes producer time on unbindable risks. The platform reports a 0% API error rate on an Employers integration and a 500% increase in daily applications processed per underwriter.",
  },
  {
    id: "go-live-timeline",
    question: "How quickly can a wholesaler go live on CoverForce?",
    answer:
      "CoverForce references 12-week implementation timelines for carrier integrations, and its platform centralizes intake, smart routing, and broker controls so wholesale teams move faster without changing how retailers submit business. Across 60+ carrier and MGA integrations, it has processed 110,000+ submissions and reports a 5-point bindability advantage on Liberty Mutual submissions.",
  },
];
