import Explore from "@/components/home/Explore";
import Hero from "@/components/pricing/Hero";
import PricingPlans from "@/components/pricing/PricingPlans";
import PageWrapper from '@/components/PageWrapper'

const PricingPage = () => {
  return (
    <>
      <PageWrapper>
        <Hero />
        <PricingPlans />
        <Explore />
      </PageWrapper>
    </>
  );
};

export default PricingPage;
