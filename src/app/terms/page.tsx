import PageWrapper from "@/components/PageWrapper";
import LegalPage from "@/components/legal/LegalPage";
import { termsContent } from "@/content/legal/termsContent";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/terms");

const TermsPage = () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/terms" />
      <LegalPage {...termsContent} />
    </PageWrapper>
  );
};

export default TermsPage;
