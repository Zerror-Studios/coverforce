import type { FaqEntry } from "./types";

/** FAQs for /developers. */
export const DEVELOPERS_FAQS: FaqEntry[] = [
  {
    id: "what-is-api",
    question: "What is the CoverForce insurance API?",
    answer:
      "The CoverForce insurance API is a unified REST API that lets developers embed real-time commercial insurance quoting, binding, and policy management across 60+ carrier and MGA integrations. It handles submission intake, multi-carrier quote and bind, ACORD form parsing, and policy document retrieval so agencies, brokers, wholesalers, and MGAs can build carrier connectivity without integrating each carrier individually.",
  },
  {
    id: "api-documentation",
    question: "Where can developers find CoverForce's insurance API documentation?",
    answer:
      "CoverForce's developer documentation includes OpenAPI specifications, endpoint references, code samples, and step-by-step integration guides, with sandbox access available on signup. The docs cover eligibility checks by policy type, state, and NAICS code, multi-carrier quoting, binding, payment, and webhook-based status tracking. The platform also supports the Model Context Protocol (MCP) for AI-agent-driven workflows.",
  },
  {
    id: "authentication",
    question: "How does authentication work for the CoverForce insurance API?",
    answer:
      "The CoverForce API uses API-key-based authentication issued when you sign up for sandbox access, with keys passed on each request to authorize quoting, binding, and document endpoints. Sandbox and production use separate credentials, and enterprise controls govern broker codes, commissions, and network oversight. Full authentication details and request examples are documented in the developer portal's endpoint references.",
  },
  {
    id: "sandbox",
    question: "Does CoverForce offer a sandbox environment for testing the insurance API?",
    answer:
      "Yes. CoverForce provides a free sandbox environment available on signup that mirrors production behavior, letting developers test submission intake, quoting, binding, and webhooks before going live. The sandbox is validated with AI-native testing, and CoverForce is SOC 2 Type II certified. Most clients move from sandbox to production in approximately 30 days.",
  },
  {
    id: "how-to-integrate",
    question: "How do you integrate the CoverForce insurance API?",
    answer:
      "To integrate, sign up for sandbox access, obtain API keys, and use the OpenAPI specs and code samples to call endpoints for eligibility, quoting, binding, and payment. CoverForce's cloud-native architecture and single unified API replace one-off carrier connections, and webhooks provide real-time application status. Typical production deployment takes about 30 days.",
  },
  {
    id: "document-ai",
    question: "What data can CoverForce's Document AI extract from insurance documents?",
    answer:
      "CoverForce's Document AI extracts structured data from ACORD forms, policies, loss runs, and proposals, converting unstructured submissions into clean, API-ready fields. This supports submission intake, renewal pre-filling from prior policies, and higher submission quality. It underpins the Submission Intake and Intelligence products used for AI underwriting across lines like BOP, workers' comp, general liability, and cyber.",
  },
];
