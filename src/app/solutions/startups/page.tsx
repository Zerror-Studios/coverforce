import CarrierResults from "@/components/home/CarrierResults";
import WhosFor from "@/components/solutions/startups/WhosFor";
import ProgramOverview from "@/components/solutions/startups/ProgramOverview";
import Launch from "@/components/solutions/startups/Launch";
import Enablement from "@/components/solutions/startups/Enablement";
import EducationalResources from "@/components/solutions/startups/EducationalResources";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import StartupTestimonials from "@/components/solutions/startups/StartupTestimonials";
import Hero from "@/components/solutions/startups/Hero";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import { STARTUPS_FAQS } from "@/data/faqs";
import { createPageMetadata } from "@/lib/seo";
import {
  buildFaqPageJsonLd,
  buildMarketingPageJsonLd,
} from "@/lib/jsonLd";
import { getBlogPosts, toListingPost } from "@/lib/webflow";

const PATH = "/solutions/startups";
export const metadata = createPageMetadata(PATH);
export const revalidate = 3600;

const page = async () => {
  const allPosts = await getBlogPosts();
  const startupHighlights = allPosts.filter((post) => post.highlightOnStartupPage);

  // Prefer startup highlights; if none, use latest posts. Never special-case featured.
  const selected =
    startupHighlights.length > 0
      ? startupHighlights
      : allPosts;

  const posts = selected.slice(0, 3).map(toListingPost);

  return (
    <PageWrapper>
      <JsonLd
        data={[
          ...buildMarketingPageJsonLd(PATH),
          buildFaqPageJsonLd(STARTUPS_FAQS),
        ]}
      />
      <Hero />
      <WhosFor />
      <ProgramOverview />
      <Launch />
      {/* <Enablement /> */}
      <EducationalResources posts={posts} />
      <StartupFaq items={STARTUPS_FAQS} />
      <StartupTestimonials />
      <CarrierResults />
    </PageWrapper>
  );
};

export default page;
