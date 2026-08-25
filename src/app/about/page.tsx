import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Hero from "@/components/about/Hero";
import OurStory from "@/components/about/OurStory";
import Milestones from "@/components/about/Milestones";
import Investors from "@/components/about/Investors";
import Leaderships from "@/components/about/Leaderships";
import Recognition from "@/components/about/Recognition";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import PageJsonLd from "@/components/common/PageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import { STARTUP_FAQS } from "@/data/startupFaqs";
import { buildFaqPageJsonLd } from "@/lib/jsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/about");

const AboutPage = () => {
  return (
    <>
      <PageJsonLd path="/about" />
      <JsonLd data={buildFaqPageJsonLd(STARTUP_FAQS)} />
      <PageWrapper>
        <Hero />
        <OurStory />
        <Milestones />
        <Investors />
        <Leaderships />
        <Recognition />
        <StartupFaq />
      </PageWrapper>
    </>
  );
};

export default AboutPage;
