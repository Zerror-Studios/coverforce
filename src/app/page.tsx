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
import { createPageMetadata } from "@/lib/seo";
import PageWrapper from "@/components/PageWrapper";

const HomePage = () => {
  return (
    <>
      <PageWrapper>
        <Hero />
        <HomeSectionsAfterIntro>
          <ThreeWays />
          <DistributionFlow />
          <ProcessFlow />
          <WhyCoverforce paddingTop={true} />
          <DataAdvantage />
          <div className="relative z-[1] h-0 overflow-visible">
            <SectionRadialGlow className="absolute left-1/2 top-0 w-[min(44rem,80vw)] -translate-x-1/2 -translate-y-[74%] blur-[8rem] opacity-75" />
          </div>
          <Review />
          <CarrierResults />
        </HomeSectionsAfterIntro>
      </PageWrapper >
    </>
  );
};

export default HomePage;

export const metadata = createPageMetadata("/");
