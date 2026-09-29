import React from "react";
import WhyCoverforce from "@/components/home/WhyCoverforce";
import Review from "@/components/home/Review";
import Hero from "@/components/product/submission/Hero";
import RealWorkflow from "@/components/product/submission/RealWorkflow";
import LiveDemo from "@/components/product/submission/LiveDemo";
import DemoSteps from "@/components/product/submission/DemoSteps";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import { createPageMetadata, getPageSeo } from "@/lib/seo";
import { SUBMISSION_INTAKE_FAQS } from "@/data/faqs";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildProductJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";

const PATH = "/product/submission-intake";
export const metadata = createPageMetadata(PATH);

const SubmissionIntakePage = () => {
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
          buildFaqPageJsonLd(SUBMISSION_INTAKE_FAQS),
        ]}
      />
      <Hero />
      <RealWorkflow />
      <LiveDemo />
      <DemoSteps />
      <WhyCoverforce paddingTop={true} />
      <Review />
      <StartupFaq items={SUBMISSION_INTAKE_FAQS} />
    </PageWrapper>
  );
};

export default SubmissionIntakePage;
