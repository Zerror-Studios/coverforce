"use client";

import OperatingSystemSection from "@/components/solutions/shared/OperatingSystemSection";
import { createSolutionStepMock } from "@/components/solutions/shared/SolutionStepIllustration";

export const developersHeroCardMock = createSolutionStepMock(
  "/images/developers/operating-step-1.png",
  "Developer-first infrastructure for quote-to-bind workflows",
);

export const operatingRows = [
  {
    id: "infrastructure",
    heading: "Developer-first infrastructure for quote-to-bind workflows",
    description:
      "Build faster with open APIs, MCP support, sandbox access, and direct engineering support - everything needed to go from integration to production in 30 days.",
    Mock: developersHeroCardMock,
  },
  {
    id: "ai-workflows",
    heading: "AI-native insurance workflows",
    description:
      "CoverForce built AI-native testing infrastructure that validates integrations on both the developer and carrier side - surfacing errors early so issues get resolved proactively and at scale across every partner.",
    Mock: createSolutionStepMock(
      "/images/developers/operating-step-2.png",
      "AI-native insurance workflows",
      {
        // Portrait phone mock (359×740) - cap its width so it doesn't
        // stretch to the full card column and tower over the text.
        width: 359,
        height: 740,
        imageClassName: "h-auto w-[210px] object-contain sm:w-[240px] lg:w-[270px]",
      },
    ),
  },
  {
    id: "docs",
    heading: "Docs your team can start with immediately",
    description:
      "Access OpenAPI specs, endpoint references, code samples, and integration guides with sandbox access available on signup.",
    Mock: createSolutionStepMock(
      "/images/developers/operating-step-3.png",
      "Docs your team can start with immediately",
    ),
  },
];

export const operatingSystemTitle =
  "Infrastructure to embed commercial insurance - not a portal to rebuild.";
export const operatingSystemDescription =
  "See how custom integrations compare to CoverForce - from API-first intake through bind, on infrastructure built for developers shipping commercial insurance products.";

export default function OperatingSystem({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  return (
    
    <OperatingSystemSection
      sectionTitle={<>{operatingSystemTitle}</>}
      sectionDescription={operatingSystemDescription}
      ctaHref="https://developer.coverforce.com/docs/coverforce-api/cucsxu65m1jkf-introduction-to-cover-force-api"
      ctaLabel="View API docs"
      ctaTarget="_blank"
      ctaRel="noreferrer"
      paddingTop={true}
      showHeader={showHeader}
      showStats={false}
      rows={operatingRows}
    />
  );
}
