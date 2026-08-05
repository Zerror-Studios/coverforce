import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Hero from "@/components/integration/Hero";
import CardSection from "@/components/integration/CardSection";
import IntegrationStats from "@/components/integration/IntegrationStats";
import Integration from "@/components/integration/Integration";
import { createPageMetadata } from "@/lib/seo";
import { getWebflowCarriers } from "@/lib/webflow";

export const metadata = createPageMetadata("/integration");
export const revalidate = 3600;

const IntegrationPage = async () => {
  const carriers = await getWebflowCarriers();
  return (
    <PageWrapper>
      <Hero />
      <CardSection />
      <IntegrationStats />
      <Integration initialCarriers={carriers} />
    </PageWrapper>
  );
};

export default IntegrationPage;
