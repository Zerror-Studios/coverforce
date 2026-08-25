import Hero from "@/components/pricing/Hero";
import PricingPlans from "@/components/pricing/PricingPlans";
import PageWrapper from "@/components/PageWrapper";
import HowPricingWorks from "@/components/pricing/HowPricingWorks";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import PageJsonLd from "@/components/common/PageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import { STARTUP_FAQS } from "@/data/startupFaqs";
import { buildFaqPageJsonLd } from "@/lib/jsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/pricing");

const PricingPage = () => {
  return (
    <>
      <PageJsonLd path="/pricing" />
      <JsonLd data={buildFaqPageJsonLd(STARTUP_FAQS)} />
      <PageWrapper>
        <Hero />
        <PricingPlans />
        <HowPricingWorks />
        <StartupFaq />
      </PageWrapper>
    </>
  );
};

export default PricingPage;
