"use client";

import OperatingSystemSection from "@/components/solutions/shared/OperatingSystemSection";
import { createSolutionStepMock } from "@/components/solutions/shared/SolutionStepIllustration";

export const carrierHeroCardMock = createSolutionStepMock(
  "/images/solution/carriers1.svg",
  "One Integration Across Your Distribution",
);

export const operatingRows = [
  {
    id: "integration",
    heading: "One Integration Across Your Distribution",
    description:
      "One API connects your products to wholesalers, brokers, and high-growth startups nationwide - no separate partnerships required.",
    Mock: carrierHeroCardMock,
    transferTargetId: "carrier-step-1-card",
  },
  {
    id: "ai-validated",
    heading: "AI-Native Testing Infrastructure, Error-Free Submissions",
    description:
      "AI validates every submission for completeness, extracts documents, pre-answers questions, and maps industry codes to your classification system.",
    stat: "0%",
    statLabelLines: ["API Error", "Rate"] as [string, string],
    Mock: createSolutionStepMock(
      "/images/solution/carriers2.svg",
      "AI-Native Testing Infrastructure, Error-Free Submissions",
    ),
  },
  {
    id: "connectivity",
    heading: "Carrier Connectivity Without the Long Build",
    description:
      "CoverForce handles the integration heavy lifting, helping your team go from contract to production in 30 days with less than 10 hours of carrier engineering time.",
    stat: "1",
    statLabelLines: ["Unified API", "For Programs"] as [string, string],
    Mock: createSolutionStepMock(
      "/images/solution/carriers3.svg",
      "Carrier Connectivity Without the Long Build",
    ),
  },
];

export const operatingSystemTitle = "Built for Carrier Distribution at Scale";
export const operatingSystemDescription =
  "Reach wholesalers, brokers, and high-growth startups from one integration - and grow with CoverForce’s Startup Program.";

export default function OperatingSystem() {
  return (
    <OperatingSystemSection
      sectionTitle={<>{operatingSystemTitle}</>}
      sectionDescription={operatingSystemDescription}
      ctaHref="/solutions/startups"
      ctaLabel="Explore Startup Program"
      ctaVariant="link"
      paddingTop={true}
      showHeader={true}
      rows={operatingRows}
    />
  );
}
