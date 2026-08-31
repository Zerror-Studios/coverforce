import StaticBlogDetail from "@/components/blogDets/StaticBlogDetail";
import {
  CASE_STUDY_DETAIL,
  getStaticMoreBlogs,
} from "@/data/staticBlogDetails";
import { createArticleMetadata } from "@/lib/seo";

export const metadata = createArticleMetadata({
  title: `${CASE_STUDY_DETAIL.title} | CoverForce`,
  description: CASE_STUDY_DETAIL.summary,
  path: CASE_STUDY_DETAIL.path,
  image: CASE_STUDY_DETAIL.image,
});

export default function CaseStudyPage() {
  return (
    <StaticBlogDetail
      detail={CASE_STUDY_DETAIL}
      morePosts={getStaticMoreBlogs(CASE_STUDY_DETAIL.slug)}
    />
  );
}
