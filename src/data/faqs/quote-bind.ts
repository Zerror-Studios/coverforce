import type { FaqEntry } from "./types";

/** FAQs for /product/quote-bind. */
export const QUOTE_BIND_FAQS: FaqEntry[] = [
  {
    id: "quote-bind-api",
    question: "What is a quote and bind API?",
    answer:
      "A quote and bind API is an interface that lets an agency or broker submit a risk, receive bindable premium quotes from carriers, and issue a policy programmatically in one flow. CoverForce's Quote & Bind API sends one application to 40+ carriers, returns side-by-side bindable quotes with named carrier outcomes and premium breakdowns, and binds with payment collected in one click.",
  },
  {
    id: "how-quoting-api-works",
    question: "How does CoverForce's commercial insurance quoting API work?",
    answer:
      "With CoverForce, you submit a single commercial application and it reaches 40+ carrier-sanctioned integrations simultaneously, returning bindable quotes you can compare side by side with clear premium breakdowns. Supported lines include Business Owner's Policy, general liability, cyber, and workers' compensation. You then bind the chosen quote and collect payment without leaving the workflow.",
  },
  {
    id: "quote-to-bind-speed",
    question: "How fast can you go from quote to bind with CoverForce?",
    answer:
      "CoverForce reports quote-to-bind in under 60 seconds, with binding and payment completed in one click inside the same workflow. Because a single application reaches 40+ carriers at once, agencies compare bindable quotes immediately instead of re-keying data into separate carrier portals, which the platform associates with a 500% increase in applications handled per underwriter.",
  },
  {
    id: "commercial-lines",
    question: "Which commercial lines can I bind through the CoverForce Quote & Bind API?",
    answer:
      "CoverForce's Quote & Bind API supports Business Owner's Policy (BOP), general liability, cyber, and workers' compensation, submitted from one application to 40+ carrier integrations. Every submission includes integrated E&S compliance checks, and the platform adds AMS synchronization and automated renewals so bound policies stay in sync with your management system.",
  },
  {
    id: "integration-time",
    question: "How long does it take to integrate the CoverForce quote and bind API?",
    answer:
      "Many CoverForce customers deploy multi-carrier quote-and-bind in weeks rather than quarters, aided by clean documentation and a sandbox that behaves like production. The API lets developers submit one application to 40+ carriers, retrieve bindable quotes, and bind with payment, without building and maintaining separate integrations for each carrier.",
  },
  {
    id: "real-time-quotes",
    question: "Does CoverForce support real-time insurance quotes?",
    answer:
      "Yes. CoverForce returns real-time bindable quotes from 40+ carriers in response to a single application, with named carrier outcomes and clear premium breakdowns for side-by-side comparison. Quote-to-bind can complete in under 60 seconds, and AI is embedded throughout the workflow to speed data handling and carrier matching.",
  },
];
