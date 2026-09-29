import type { FaqEntry } from "./types";

/** FAQs for /product/submission-intake. */
export const SUBMISSION_INTAKE_FAQS: FaqEntry[] = [
  {
    id: "submission-intake-automation",
    question: "What is insurance submission intake automation?",
    answer:
      "Insurance submission intake automation uses AI to turn incoming submissions—emails, ACORD forms, loss runs, and prior policies—into structured, validated data without manual re-keying. CoverForce's Smart Intake ingests submissions from any source, extracts every field, enriches the submission, and pre-fills applications for 40+ carriers in minutes, with 95%+ extraction accuracy across document formats.",
  },
  {
    id: "acord-forms",
    question: "How does CoverForce process ACORD forms?",
    answer:
      "CoverForce's AI Doc Reader ingests any ACORD form, loss run, or prior policy and extracts structured fields to pre-fill a carrier application in under 4 seconds, with 95%+ accuracy across formats. It reads documents by field meaning rather than a fixed template, so it generalizes across ACORD versions and layouts, and AI CodeMatch maps NAICS and class codes across carriers automatically.",
  },
  {
    id: "email-ingestion",
    question: "Can CoverForce ingest submissions directly from email?",
    answer:
      "Yes. CoverForce's AI Inbox automatically routes email submissions and parses their attachments, so ACORD forms, loss runs, and prior policies are extracted without manual sorting. The platform ingests submissions from any source—email, ACORD forms, loss runs, prior policies, and AMS systems—then extracts every field and pre-fills 40+ carrier applications in minutes.",
  },
  {
    id: "accuracy-and-speed",
    question: "How accurate and fast is CoverForce's submission data extraction?",
    answer:
      "CoverForce reports 95%+ extraction accuracy across document formats and pre-fills applications from a document in under 4 seconds. The platform cuts per-submission processing about 93%—from roughly 115 minutes to 8 minutes, saving around 107 minutes each—and has processed 350,000+ submissions, which continuously improves its AI models.",
  },
  {
    id: "submission-intake-api",
    question: "Is there a CoverForce API for submission intake?",
    answer:
      "Yes. CoverForce provides API access to its Smart Intake capabilities alongside 60+ live carrier integrations, so agencies and MGAs can ingest submissions, extract structured data, and pre-fill carrier applications programmatically. The platform is SOC 2 Type II certified, cloud-native, and built for enterprise scale.",
  },
  {
    id: "after-extraction",
    question: "What can CoverForce do after extracting a submission?",
    answer:
      "After extraction, CoverForce enriches the submission and pre-fills applications for 40+ carriers, then applies AI features that add value downstream. AI CodeMatch maps NAICS and class codes across carriers, AI SmartForm pre-fills carrier-specific questions from prior submissions, AI UW Co-Pilot flags appetite gaps and missing data before binding, and the AI COI Generator issues certificates of insurance on demand.",
  },
];
