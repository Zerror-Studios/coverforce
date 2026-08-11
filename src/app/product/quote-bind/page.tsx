import React from "react";
import WhyCoverforce from "@/components/home/WhyCoverforce";
import Review from "@/components/home/Review";
import Hero from "@/components/product/quote/Hero";
import CarrierMatch from "@/components/product/quote/CarrierMatch";
import QuoteWorkFlow from "@/components/product/quote/QuoteWorkFlow";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import { createPageMetadata, getPageSeo } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";

const PATH = "/product/quote-bind";
export const metadata = createPageMetadata(PATH);

const QuoteBindPage = () => {
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
        ]}
      />
      <Hero />
      <CarrierMatch />
      <QuoteWorkFlow />
      <WhyCoverforce paddingTop={true} />
      <Review />
    </PageWrapper>
  );
};

export default QuoteBindPage;
