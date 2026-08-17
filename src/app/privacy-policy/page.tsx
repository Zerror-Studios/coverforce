import PageWrapper from "@/components/PageWrapper";
import LegalPage from "@/components/legal/LegalPage";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";
import { privacyContent } from "@/content/legal/privacyContent";

export const metadata = createPageMetadata("/privacy-policy");

const PrivacyPage = () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/privacy-policy" />
      <LegalPage {...privacyContent} />
    </PageWrapper>
  );
};

export default PrivacyPage;
