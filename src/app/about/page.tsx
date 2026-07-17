import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Hero from "@/components/about/Hero";
import OurStory from "@/components/about/OurStory";
import Milestones from "@/components/about/Milestones";
import Investors from "@/components/about/Investors";
import Leaderships from "@/components/about/Leaderships";
import Recognition from "@/components/about/Recognition";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/about");

const AboutPage = () => {
  return (
    <>
      <PageWrapper>
        <Hero />
        <OurStory />
        <Milestones />
        <Investors />
        <Leaderships />
        <Recognition />
      </PageWrapper>
    </>
  );
};

export default AboutPage;
