import PageWrapper from "@/components/PageWrapper";
import WheelSection from "@/components/wheel/WheelSection";
import { createMetadata } from "@/lib/seo";

const WheelPage = () => {
  return (
    <PageWrapper>
      <WheelSection />
    </PageWrapper>
  );
};

export default WheelPage;

export const metadata = createMetadata({
  path: "/wheel",
  title: "Wheel Lab | CoverForce",
  description: "Experimental playground for the CoverForce tool wheel.",
  noIndex: true,
});
