import type { FaqEntry } from "./types";

/** FAQs for the home page. */
export const HOME_FAQS: FaqEntry[] = [
  {
    id: "commercial-insurance-api",
    question: "What is a commercial insurance API?",
    answer:
      "A commercial insurance API is a software interface that lets agencies, brokers, and MGAs connect their own systems directly to insurance carriers to quote and bind commercial policies programmatically, without manual portal work. CoverForce provides such an API, connecting distributors to 60+ carrier and MGA integrations for real-time quoting and binding across lines like BOP, general liability, workers' compensation, and cyber.",
  },
  {
    id: "what-is-coverforce",
    question: "What is CoverForce?",
    answer:
      "CoverForce is an AI-native commercial insurance distribution platform that connects insurance agencies, brokers, wholesalers, and MGAs to carriers through APIs for real-time quoting and binding. The platform has 60+ carrier and MGA integrations, serves 15,000+ agencies, and has processed 110,000+ submissions. It offers three products: Submission Intake, Quote & Bind, and Intelligence.",
  },
  {
    id: "choose-best-api",
    question: "How do I choose the best commercial insurance API?",
    answer:
      "Evaluate a commercial insurance API on carrier coverage, lines of business supported, real-time bindability, data-extraction accuracy, integration effort, and security certifications. CoverForce addresses these with 60+ carrier and MGA integrations, real-time multi-carrier quote-and-bind, ACORD and NAICS handling, a production-like sandbox, and SOC 2 Type II certification, with many customers integrating in weeks.",
  },
  {
    id: "insurance-distribution-platform",
    question: "What is an insurance distribution platform?",
    answer:
      "An insurance distribution platform is infrastructure that connects the parties who sell insurance—agencies, brokers, wholesalers, and MGAs—to the carriers that underwrite it, enabling submission, quoting, and binding in one place. CoverForce is an AI-native example that unifies submission intake, multi-carrier quote-and-bind, and underwriting intelligence across 60+ carrier and MGA integrations.",
  },
  {
    id: "lines-of-business",
    question: "Which types of insurance can I quote and bind through CoverForce?",
    answer:
      "CoverForce supports quoting and binding for commercial lines including Business Owner's Policy (BOP), general liability, workers' compensation, and cyber, using standard ACORD forms and NAICS class codes. Submissions reach 40+ carriers from a single application, and the platform spans 60+ total carrier and MGA integrations for appetite matching and binding.",
  },
  {
    id: "who-uses-coverforce",
    question: "Who uses CoverForce?",
    answer:
      "CoverForce is used by commercial insurance agencies, brokers, wholesalers, and MGAs that want to quote and bind across multiple carriers through one API or workflow. More than 15,000 agencies use the platform, which has processed 110,000+ submissions and captured 350,000+ AI-labeled carrier interactions that improve extraction and appetite matching over time.",
  },
];
