"use client";

import OperatingSystemSection from "@/components/solutions/shared/OperatingSystemSection";

export const operatingRows = [
  {
    id: "platform",
    heading: "One Platform for Every Carrier, Every Office",
    description:
      "One workflow for every producer — 40+ carrier integrations, dynamic carrier questions, no portal logins, no rekeying, and no office-by-office workflow gaps.",
    stat: "40+",
    statLabelLines: ["Carriers,", "One Workflow"] as [string, string],
  },
  {
    id: "ai",
    heading: "AI That Raises the Floor for Every Producer",
    description:
      "CoverForce gives every producer your best producers' carrier intelligence — with AI extraction, appetite matching, UW question assistance, and on-demand COI generation in one workflow.",
    stat: "95%",
    statLabelLines: ["Extraction", "Accuracy"] as [string, string],
  },
  {
    id: "visibility",
    heading: "See Everything Across the Firm",
    description:
      "Real-time dashboards show submission volume, quote rates, bind rates, and premium by office, producer, carrier, and LOB — so you know what's moving, where deals stall, and which carriers perform.",
    stat: "100%",
    statLabelLines: ["Pipeline", "Visibility"] as [string, string],
  },
];

export const operatingSystemTitle = "Precision engineering for professional workflow";
export const operatingSystemDescription =
  "See how manual workflows compare to CoverForce — from smart intake through bind, in one connected platform built for every producer.";

export default function OperatingSystem() {
  return (
    <OperatingSystemSection
      sectionTitle={
        <>
          Precision engineering for
          professional workflow
        </>
      }
      sectionDescription={operatingSystemDescription}
      ctaHref="/"
      ctaLabel="Start a quote"
      showHeader={false}
      rows={operatingRows.slice(1)}
    />
  );
}
