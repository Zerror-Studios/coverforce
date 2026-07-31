import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Hero from "@/components/careers/Hero";
import OurValues from "@/components/careers/OurValues";
import OurCluture from "@/components/careers/OurCluture";
import Positions from "@/components/careers/Positions";
import { createPageMetadata } from "@/lib/seo";
import { getDoverJobs, groupJobsIntoCategories } from "@/lib/doverJobs";

export const metadata = createPageMetadata("/careers");
export const revalidate = 3600;

const CareerPage = async () => {
  let categories = [] as ReturnType<typeof groupJobsIntoCategories>;

  try {
    const jobs = await getDoverJobs();
    categories = groupJobsIntoCategories(jobs);
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
