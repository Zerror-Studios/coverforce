import Hero from "@/components/blogDets/Hero";
import CaseStudyHero from "@/components/blogDets/CaseStudyHero";
import ReportHero from "@/components/blogDets/ReportHero";
import ReportContext from "@/components/blogDets/ReportContext";
import ReportFindings from "@/components/blogDets/ReportFindings";
import Milestones from "@/components/about/Milestones";
import StaticBlogContent from "@/components/blogDets/StaticBlogContent";
import MoreBlogs from "@/components/blogDets/MoreBlogs";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import type { StaticBlogDetail } from "@/data/staticBlogDetails";
import {
  buildBreadcrumbJsonLd,
  buildStaticArticleJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";
import type { BlogPost } from "@/data/blogPosts";

type StaticBlogDetailProps = {
  detail: StaticBlogDetail;
  morePosts: Pick<BlogPost, "slug" | "title" | "image" | "date" | "author">[];
};

export default function StaticBlogDetail({
  detail,
  morePosts,
}: StaticBlogDetailProps) {
  const breadcrumbs = [
    ...breadcrumbsForPath("/blog"),
    { name: detail.breadcrumb, path: detail.path },
  ];

  return (
    <PageWrapper>
      <JsonLd
        data={[
          buildStaticArticleJsonLd({
            title: detail.title,
            description: detail.summary,
            path: detail.path,
            image: detail.image,
            author: detail.author,
            datePublished: detail.publishedAt,
            articleSection: detail.category,
          }),
          buildBreadcrumbJsonLd(breadcrumbs),
        ]}
      />
      {detail.template === "report" ? (
        <>
          <ReportHero hero={detail.reportHero} />
          <ReportContext context={detail.context} />
          <Milestones
            variant="report"
            reportMilestones={detail.reportMilestones}
          />
          <ReportFindings cards={detail.findings} />
        </>
      ) : detail.template === "case-study" ? (
        <CaseStudyHero
          hero={detail.caseStudyHero}
          heroMeta={detail.heroMeta}
        />
      ) : (
        <Hero
          heroMeta={detail.heroMeta}
          post={{
            category: detail.category,
            breadcrumb: detail.breadcrumb,
            image: detail.image,
            title: detail.title,
            author: detail.author,
            authorRole: detail.authorRole,
            date: detail.date,
          }}
        />
      )}
      {detail.template === "case-study" ? (
        <StaticBlogContent
          stats={detail.stickyStats}
          sections={detail.contentSections}
          tags={detail.tags}
        />
      ) : null}
      <MoreBlogs posts={morePosts} />
    </PageWrapper>
  );
}
