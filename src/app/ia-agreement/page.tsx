import PageWrapper from "@/components/PageWrapper";
import LegalPage from "@/components/legal/LegalPage";
import PageJsonLd from "@/components/common/PageJsonLd";
import { createPageMetadata } from "@/lib/seo";
import { iaAgreementContent } from "@/content/legal/iaAgreementContent";

export const metadata = createPageMetadata("/ia-agreement");

const IaAgreementPage = () => {
  return (
    <PageWrapper>
      <PageJsonLd path="/ia-agreement" />
      <LegalPage {...iaAgreementContent} />
    </PageWrapper>
  );
};

export default IaAgreementPage;
