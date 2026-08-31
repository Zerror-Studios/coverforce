import StaticBlogDetail from "@/components/blogDets/StaticBlogDetail";
import { REPORT_DETAIL, getStaticMoreBlogs } from "@/data/staticBlogDetails";
import { createArticleMetadata } from "@/lib/seo";

export const metadata = createArticleMetadata({
  title: `${REPORT_DETAIL.title} | CoverForce`,
  description: REPORT_DETAIL.summary,
  path: REPORT_DETAIL.path,
  image: REPORT_DETAIL.image,
});

export default function ReportPage() {
  return (
    <StaticBlogDetail
      detail={REPORT_DETAIL}
      morePosts={getStaticMoreBlogs(REPORT_DETAIL.slug)}
    />
  );
}
