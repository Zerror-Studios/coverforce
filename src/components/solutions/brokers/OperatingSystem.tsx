"use client";

import OperatingSystemSection from "@/components/solutions/shared/OperatingSystemSection";
import { createSolutionStepMock } from "@/components/solutions/shared/SolutionStepIllustration";

export const brokersHeroCardMock = createSolutionStepMock(
  "/images/solution/broker1.svg",
  "One Platform for Every Carrier, Every Office",
);

export const operatingRows = [
  {
    id: "platform",
    heading: "One Platform for Every Carrier, Every Office",
    description:
      "One workflow for every producer - 60+ carrier products, dynamic carrier questions, no portal logins, no rekeying, and no office-by-office workflow gaps.",
    stat: "60+",
    statLabelLines: ["Carrier", "Products"] as [string, string],
    Mock: brokersHeroCardMock,
    transferTargetId: "brokers-step-1-card",
  },
  {
    id: "ai",
    heading: "AI That Raises the Floor for Every Producer",
    description:
      "CoverForce gives every producer your best producers' carrier intelligence - with AI extraction, appetite matching, UW question assistance, and on-demand COI generation in one workflow.",
    stat: "95%",
    statLabelLines: ["Extraction", "Accuracy"] as [string, string],
    Mock: createSolutionStepMock(
      "/images/solution/broker2.svg",
      "AI That Raises the Floor for Every Producer",
    ),
  },
  {
    id: "visibility",
    heading: "See Everything Across the Firm",
    description:
      "Real-time dashboards show submission volume, quote rates, bind rates, and premium by office, producer, carrier, and LOB - so you know what's moving, where deals stall, and which carriers perform.",
    stat: "100%",
    statLabelLines: ["Pipeline", "Visibility"] as [string, string],
    Mock: createSolutionStepMock(
      "/images/solution/broker3.svg",
      "See Everything Across the Firm",
    ),
  },
];

export const operatingSystemTitle =
  "We're focused on placement profitability and efficiency.";
export const operatingSystemDescription =
  "See how manual workflows compare to CoverForce - from smart intake through bind, in one connected platform built for every producer.";

export default function OperatingSystem() {
  return (
    <OperatingSystemSection
      sectionTitle={operatingSystemTitle}
      sectionDescription={operatingSystemDescription}
      ctaHref="/contact"
      ctaLabel="Start a quote"
      paddingTop={true}
      showHeader={true}
      rows={operatingRows}
    />
  );
}
