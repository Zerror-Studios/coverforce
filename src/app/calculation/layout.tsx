import type { ReactNode } from "react";
import PageJsonLd from "@/components/common/PageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import { CALCULATION_FAQS } from "@/data/faqs";
import { buildFaqPageJsonLd } from "@/lib/jsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/calculation");

type CalculationLayoutProps = {
  children: ReactNode;
};

export default function CalculationLayout({ children }: CalculationLayoutProps) {
  return (
    <>
      <PageJsonLd path="/calculation" />
      <JsonLd data={buildFaqPageJsonLd(CALCULATION_FAQS)} />
      {children}
    </>
  );
}
