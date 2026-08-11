import PageWrapper from "@/components/PageWrapper";
import LegalPage from "@/components/legal/LegalPage";
import { securityContent } from "@/content/legal/securityContent";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/security");

const SecurityPage = () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/security" />
      <LegalPage {...securityContent} />
    </PageWrapper>
  );
};

export default SecurityPage;
