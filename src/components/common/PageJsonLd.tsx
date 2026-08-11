import JsonLd from "@/components/common/JsonLd";
import { buildMarketingPageJsonLd } from "@/lib/jsonLd";

/** WebPage + BreadcrumbList for a static marketing route. */
export default function PageJsonLd({ path }: { path: string }) {
  return <JsonLd data={buildMarketingPageJsonLd(path)} />;
}
