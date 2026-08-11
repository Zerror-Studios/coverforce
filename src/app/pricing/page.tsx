import Hero from "@/components/pricing/Hero";
import PricingPlans from "@/components/pricing/PricingPlans";
import PageWrapper from "@/components/PageWrapper";
import HowPricingWorks from "@/components/pricing/HowPricingWorks";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/pricing");

const PricingPage = () => {
  return (
    <>
      <PageJsonLd path="/pricing" />
      <PageWrapper>
        <Hero />
        <PricingPlans />
        <HowPricingWorks />
      </PageWrapper>
    </>
  );
};

export default PricingPage;
