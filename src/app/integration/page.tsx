import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Hero from "@/components/integration/Hero";
import CardSection from "@/components/integration/CardSection";
import IntegrationStats from "@/components/integration/IntegrationStats";
import Integration from "@/components/integration/Integration";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/integration");
export const revalidate = 3600;

const IntegrationPage = async () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/integration" />
      <Hero />
      <CardSection />
      <IntegrationStats />
      <Integration/>
    </PageWrapper>
  );
};

export default IntegrationPage;
