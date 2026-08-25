import React from "react";
import Hero from "@/components/contact/Hero";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import PageWrapper from "@/components/PageWrapper";
import PageJsonLd from "@/components/common/PageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import { STARTUP_FAQS } from "@/data/startupFaqs";
import { buildFaqPageJsonLd } from "@/lib/jsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/contact");

const ContactPage = () => {
  return (
    <>
      <PageJsonLd path="/contact" />
      <JsonLd data={buildFaqPageJsonLd(STARTUP_FAQS)} />
      <PageWrapper>
        <Hero />
        <StartupFaq />
      </PageWrapper>
    </>
  );
};

export default ContactPage;
