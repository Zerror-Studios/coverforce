import CaseStudyHero from "@/components/blogDets/CaseStudyHero";
import CaseStudyContent from "@/components/blogDets/CaseStudyContent";
import MoreBlogs from "@/components/blogDets/MoreBlogs";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import type { BlogPost } from "@/data/blogPosts";
import {
  buildBreadcrumbJsonLd,
  buildStaticArticleJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";
import type { CaseStudyDetail } from "@/lib/webflow";

type CaseStudyDetailViewProps = {
  study: CaseStudyDetail;
  morePosts: Pick<
    BlogPost,
    "slug" | "title" | "image" | "date" | "author" | "href"
  >[];
};

export default function CaseStudyDetailView({
  study,
  morePosts,
}: CaseStudyDetailViewProps) {
  const path = `/blog/${study.slug}`;
  const breadcrumbs = [
    ...breadcrumbsForPath("/blog"),
    { name: study.title, path },
  ];

  return (
    <PageWrapper>
      <JsonLd
        data={[
          buildStaticArticleJsonLd({
            title: study.title,
            description: study.summary,
            path,
            image: study.image,
            author: study.author,
            datePublished: study.publishedAt,
            articleSection: "Case Study",
          }),
          buildBreadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <CaseStudyHero hero={study.caseStudyHero} heroMeta={study.heroMeta} />
      <CaseStudyContent
        bodyHtml={study.bodyHtml}
        stats={study.stickyStats}
        tags={study.tags}
      />
      <MoreBlogs posts={morePosts} />
    </PageWrapper>
  );
}
