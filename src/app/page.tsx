import Hero from "@/components/home/Hero";
import HomeSectionsAfterIntro from "@/components/home/HomeSectionsAfterIntro";
import ThreeWays from "@/components/home/ThreeWays";
import DistributionFlow from "@/components/home/DistributionFlow";
import ProcessFlow from "@/components/home/ProcessFlow";
import WhyCoverforce from "@/components/home/WhyCoverforce";
import DataAdvantage from "@/components/home/DataAdvantage";
import Review from "@/components/home/Review";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import CarrierResults from "@/components/home/CarrierResults";
import Explore from "@/components/home/Explore";
import { createPageMetadata } from "@/lib/seo";
import Marquee from "@/components/home/Marquee";
import PageWrapper from "@/components/PageWrapper";

const HomePage = () => {
  return (
    <>
      <PageWrapper>
        <Hero />
        <HomeSectionsAfterIntro>
          <Marquee />
          <ThreeWays />
          <DistributionFlow />
          <ProcessFlow />
          <WhyCoverforce />
          <DataAdvantage />
          <div className="relative z-[1] h-0 overflow-visible">
            <SectionRadialGlow className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <Review />
          <CarrierResults />
          <Explore />
        </HomeSectionsAfterIntro>
      </PageWrapper >
    </>
  );
};

export default HomePage;

export async function generateMetadata() {
  return createPageMetadata("/");
}
