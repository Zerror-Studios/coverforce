export type StartupFaqEntry = {
  id: string;
  question: string;
  answer: string;
};

/** Plain-text FAQ copy for UI + FAQPage JSON-LD (keep in sync with StartupFaq). */
export const STARTUP_FAQS: StartupFaqEntry[] = [
  {
    id: "bor",
    question:
      "Does CoverForce offer its own market access solution, or act as a broker of record?",
    answer:
      "Neither. CoverForce is neutral infrastructure - we are not a broker of record, and we do not offer our own market access solution. We don't take positions in the market or compete with the brokerages and MGAs we serve. Instead, we partner with established market access providers who offer carrier appointments to startups that aren't yet appointed directly. Those partners set their own terms and pricing; CoverForce negotiates preferred rates on behalf of Startup Program members. Our role is to connect the dots - not to own the relationship between a startup and its carriers.",
  },
  {
    id: "partner",
    question:
      "What does it take to become a market access partner and join the CoverForce partner marketplace?",
    answer:
      "The primary requirement is a commitment to offering preferred pricing to CoverForce customers. Our Startup Program members are early-stage brokerages that are price-sensitive and volume-driven - partners who offer competitive, transparent pricing get the most out of the relationship. Beyond pricing, we look for partners with broad carrier appetite, clean onboarding processes, and a genuine interest in supporting the next generation of insurtech brokerages. If that describes your organization, apply to become a partner at /contact.",
  },
];
