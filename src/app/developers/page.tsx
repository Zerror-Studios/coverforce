import React from "react";
import Hero from "@/components/developers/Hero";
import CarrierResults from "@/components/home/CarrierResults";
import Review from "@/components/home/Review";
import WhyCoverforce from "@/components/home/WhyCoverforce";
import PageWrapper from "@/components/PageWrapper";
import Endpoints from "@/components/developers/Endpoints";
import OperatingSystem from "@/components/solutions/developers/OperatingSystem";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import PageJsonLd from "@/components/common/PageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import { STARTUP_FAQS } from "@/data/startupFaqs";
import { buildFaqPageJsonLd } from "@/lib/jsonLd";
import { createPageMetadata } from "@/lib/seo";


export const metadata = createPageMetadata("/developers");

const DevelopersPage = () => {
  return (
    <>
      <PageJsonLd path="/developers" />
      <JsonLd data={buildFaqPageJsonLd(STARTUP_FAQS)} />
      <PageWrapper>
        <Hero />
        <Endpoints />
        <OperatingSystem />
        <WhyCoverforce paddingTop={true} />
        <Review />
        <CarrierResults />
        <StartupFaq />
      </PageWrapper>
    </>
  );
};

export default DevelopersPage;
