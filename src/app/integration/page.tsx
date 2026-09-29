import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Hero from "@/components/integration/Hero";
import CardSection from "@/components/integration/CardSection";
import IntegrationStats from "@/components/integration/IntegrationStats";
import Integration from "@/components/integration/Integration";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import PageJsonLd from "@/components/common/PageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import { INTEGRATION_FAQS } from "@/data/faqs";
import { buildFaqPageJsonLd } from "@/lib/jsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/integration");
export const revalidate = 3600;

const IntegrationPage = async () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/integration" />
      <JsonLd data={buildFaqPageJsonLd(INTEGRATION_FAQS)} />
      <Hero />
      <CardSection />
      <IntegrationStats />
      <Integration/>
      <StartupFaq items={INTEGRATION_FAQS} />
    </PageWrapper>
  );
};

export default IntegrationPage;
