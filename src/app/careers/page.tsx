import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Hero from "@/components/careers/Hero";
import OurValues from "@/components/careers/OurValues";
import OurCluture from "@/components/careers/OurCluture";
import Positions from "@/components/careers/Positions";
import { createPageMetadata } from "@/lib/seo";
import { getDoverJobCategories, JobCategory } from "@/lib/doverJobs";

export const metadata = createPageMetadata("/careers");
export const revalidate = 3600;

const CareerPage = async () => {
  let categories: JobCategory[] = [];

  try {
    categories = await getDoverJobCategories();
  } catch (error) {
    console.error("Failed to load Dover jobs:", error);
  }

  return (
    <>
      <PageWrapper>
        <Hero />
        <OurValues />
        <OurCluture />
        <Positions categories={categories} />
      </PageWrapper>
    </>
  );
};

export default CareerPage;
