import type { FaqEntry } from "./types";

/** FAQs for /pricing. */
export const PRICING_FAQS: FaqEntry[] = [
  {
    id: "api-cost",
    question: "How much does the CoverForce insurance API cost?",
    answer:
      "CoverForce uses usage-based pricing rather than per-seat fees, and does not publish fixed prices; cost is quoted per account based on application and transaction volume. Pricing is obtained by contacting CoverForce through \"Talk to sales\" or by applying to the startup program. Both the Startup and Enterprise plans include unlimited seats, so cost scales with usage, not team size.",
  },
  {
    id: "pricing-plans",
    question: "What pricing plans does CoverForce offer?",
    answer:
      "CoverForce offers two plans: a Startup plan for insurtechs and early-stage companies, and an Enterprise plan for established brokers and larger organizations. Both use usage-based pricing with unlimited seats. The Startup plan includes a free sandbox, standard API, and Slack support; the Enterprise plan adds AI ingestion, quoting, binding, custom integrations, and 24/7 dedicated support.",
  },
  {
    id: "per-seat",
    question: "Does CoverForce charge per user or per seat?",
    answer:
      "No. CoverForce does not charge per seat and includes unlimited seats on both its Startup and Enterprise plans. Instead, pricing is application- and usage-based, scaling with transaction volume rather than team size. CoverForce frames this as aligned incentives, since cost grows with usage as your business grows rather than penalizing you for adding users.",
  },
  {
    id: "get-quote",
    question: "How do I get a price quote for the CoverForce insurance API?",
    answer:
      "To get pricing, contact CoverForce directly: use \"Talk to sales\" for the Enterprise plan or \"Apply to our startup program\" for the Startup plan. Because pricing is usage-based and tailored to each account's transaction volume, CoverForce does not list fixed numbers online and provides a custom quote after understanding your expected volume and needs.",
  },
  {
    id: "free-trial",
    question: "Is there a free way to try CoverForce before paying?",
    answer:
      "Yes. CoverForce's Startup plan includes a free sandbox environment, and sandbox access is available on signup, letting developers test the API before committing to paid usage. The sandbox mirrors production behavior for quoting, binding, and webhooks. Formal pricing is then arranged through the startup program or sales, based on your usage.",
  },
];
