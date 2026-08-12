import PageWrapper from "@/components/PageWrapper";
import LegalPage from "@/components/legal/LegalPage";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";
import { termsContent } from "@/content/legal/termsContent";

export const metadata = createPageMetadata("/terms-of-service");

const TermsPage = () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/terms-of-service" />
      <LegalPage {...termsContent} />
    </PageWrapper>
  );
};

export default TermsPage;
