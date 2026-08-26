import type { FaqEntry } from "./types";

/** FAQs for /calculation. */
export const CALCULATION_FAQS: FaqEntry[] = [
  {
    id: "what-is-roi-calculator",
    question: "What is the CoverForce ROI calculator?",
    answer:
      "The CoverForce ROI calculator is an interactive tool that lets insurance brokers, wholesalers, and agencies model the financial return of automating submission intake, quoting, and binding with CoverForce over a five-year period. It projects net ROI, payback period, return multiple, annual hours freed, and additional bound policies per month based on your own business inputs.",
  },
  {
    id: "calculator-inputs",
    question: "What inputs does the CoverForce ROI calculator use?",
    answer:
      "The calculator accepts your company profile (annual and bound premium, commission rates, growth and retention rates), operations data (monthly quote volume, current and projected bind rates, time per quote, staffing costs), quality metrics (manual error rates and rework costs), and technology costs (implementation fees, subscriptions, and in-house build costs). It uses these to estimate ROI specific to your business.",
  },
  {
    id: "calculator-outputs",
    question: "What outputs does the CoverForce ROI calculator produce?",
    answer:
      "The calculator produces a projected 5-year net ROI, payback period, return multiple per dollar invested, Year 1 value creation, hours freed annually, and additional bound policies per month. Figures shown on the page are illustrative examples that recalculate from your inputs, and it also models compounding premium commissions and the cost of delaying implementation.",
  },
  {
    id: "automation-roi",
    question: "How does CoverForce automation improve broker ROI?",
    answer:
      "CoverForce improves ROI by cutting time per quote, raising bind rates, and reducing manual error and rework across submission intake, quoting, and binding on 60+ carrier and MGA integrations. Faster multi-carrier quoting frees staff hours and lets teams bind more policies, while higher retention and compounding renewal commissions increase premium over time. The calculator quantifies these effects for your business.",
  },
  {
    id: "who-should-use",
    question: "Who should use the CoverForce ROI calculator?",
    answer:
      "The ROI calculator is built for insurance agencies, brokers, wholesalers, and MGAs evaluating whether to automate quoting and binding with CoverForce or build and maintain carrier integrations in-house. By entering their own premium, quote volume, and cost data, decision-makers can compare CoverForce's usage-based platform against manual workflows and internal build costs before committing.",
  },
];
