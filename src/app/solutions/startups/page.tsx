import CarrierResults from "@/components/home/CarrierResults";
import WhosFor from "@/components/solutions/startups/WhosFor";
import ProgramOverview from "@/components/solutions/startups/ProgramOverview";
import Launch from "@/components/solutions/startups/Launch";
import Enablement from "@/components/solutions/startups/Enablement";
import EducationalResources from "@/components/solutions/startups/EducationalResources";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import StartupTestimonials from "@/components/solutions/startups/StartupTestimonials";
import Hero from "@/components/solutions/startups/Hero";
import PageWrapper from "@/components/PageWrapper";
import { createPageMetadata } from "@/lib/seo";
import { getBlogPosts, toListingPost } from "@/lib/webflow";

export const metadata = createPageMetadata("/solutions/startups");
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
      <Hero />
      <WhosFor />
      <ProgramOverview />
      <Launch />
      {/* <Enablement /> */}
      <EducationalResources posts={posts} />
      <StartupFaq />
      <StartupTestimonials />
      <CarrierResults />
    </PageWrapper>
  );
};

export default page;
