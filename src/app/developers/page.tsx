import React from "react";
import Hero from "@/components/developers/Hero";
import CarrierResults from "@/components/home/CarrierResults";
import Review from "@/components/home/Review";
import WhyCoverforce from "@/components/home/WhyCoverforce";
import PageWrapper from "@/components/PageWrapper";
import Endpoints from "@/components/developers/Endpoints";
import OperatingSystem from "@/components/solutions/developers/OperatingSystem";
import { createPageMetadata } from "@/lib/seo";


export const metadata = createPageMetadata("/developers");

const DevelopersPage = () => {
  return (
    <>
      <PageWrapper>
        <Hero />
        <Endpoints />
        <OperatingSystem />
        <WhyCoverforce paddingTop={true} />
        <Review />
        <CarrierResults />
      </PageWrapper>
    </>
  );
};

export default DevelopersPage;
