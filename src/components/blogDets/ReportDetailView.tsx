import ReportHero from "@/components/blogDets/ReportHero";
import ReportContext from "@/components/blogDets/ReportContext";
import ReportFindings from "@/components/blogDets/ReportFindings";
import Milestones from "@/components/about/Milestones";
import MoreBlogs from "@/components/blogDets/MoreBlogs";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import type { BlogPost } from "@/data/blogPosts";
import {
  buildBreadcrumbJsonLd,
  buildStaticArticleJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";
import type { ReportDetail } from "@/lib/webflow";

type ReportDetailViewProps = {
  report: ReportDetail;
  morePosts: Pick<
    BlogPost,
    "slug" | "title" | "image" | "date" | "author" | "href"
  >[];
};

export default function ReportDetailView({
  report,
  morePosts,
}: ReportDetailViewProps) {
  const path = `/blog/${report.slug}`;
  const breadcrumbs = [
    ...breadcrumbsForPath("/blog"),
    { name: report.title, path },
  ];

  return (
    <PageWrapper>
      <JsonLd
        data={[
          buildStaticArticleJsonLd({
            title: report.title,
            description: report.summary,
            path,
            image: report.image,
            author: report.author,
            datePublished: report.publishedAt,
            articleSection: "News",
          }),
          buildBreadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <ReportHero hero={report.reportHero} blogSlug={report.slug} />
      <ReportContext context={report.context} />
      <Milestones variant="report" reportMilestones={report.reportMilestones} />
      <ReportFindings title={report.findingsTitle} cards={report.findings} />
      <MoreBlogs posts={morePosts} />
    </PageWrapper>
  );
}
