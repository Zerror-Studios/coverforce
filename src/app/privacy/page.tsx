import PageWrapper from "@/components/PageWrapper";
import LegalPage from "@/components/legal/LegalPage";
import { privacyContent } from "@/content/legal/privacyContent";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/privacy");

const PrivacyPage = () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/privacy" />
      <LegalPage {...privacyContent} />
    </PageWrapper>
  );
};

export default PrivacyPage;
