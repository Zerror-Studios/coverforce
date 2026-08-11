import React from "react";
import Hero from "@/components/contact/Hero";
import PageWrapper from "@/components/PageWrapper";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/contact");

const ContactPage = () => {
  return (
    <>
      <PageJsonLd path="/contact" />
      <PageWrapper>
        <Hero />
      </PageWrapper>
    </>
  );
};

export default ContactPage;
