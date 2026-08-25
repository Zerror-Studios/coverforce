import React from "react";
import WhyCoverforce from "@/components/home/WhyCoverforce";
import Hero from "@/components/product/intelligence/Hero";
import IntelligenceWorkFlow from "@/components/product/intelligence/IntelligenceWorkFlow";
import ExplorePlatform from "@/components/product/intelligence/ExplorePlatform";
import CommingSoon from "@/components/product/intelligence/CommingSoon";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import { createPageMetadata, getPageSeo } from "@/lib/seo";
import CarrierMatch from "@/components/product/quote/CarrierMatch";
import { STARTUP_FAQS } from "@/data/startupFaqs";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildProductJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";

const PATH = "/product/intelligence";
export const metadata = createPageMetadata(PATH);

const IntelligencePage = () => {
  const seo = getPageSeo(PATH);

  return (
    <PageWrapper>
      <JsonLd
        data={[
          buildProductJsonLd({
            path: PATH,
            name: seo.label,
            description: seo.description,
          }),
          buildBreadcrumbJsonLd(breadcrumbsForPath(PATH)),
          buildFaqPageJsonLd(STARTUP_FAQS),
        ]}
      />
      <Hero />
      <IntelligenceWorkFlow />
      <CarrierMatch eyepilllabel="Appetite Checker" />
      <ExplorePlatform />
      <WhyCoverforce paddingTop={true} />
      <CommingSoon />
      <StartupFaq />
    </PageWrapper>
  );
};

export default IntelligencePage;
