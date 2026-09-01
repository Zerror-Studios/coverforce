import Hero from "@/components/blogDets/Hero";
import Content from "@/components/blogDets/Content";
import CaseStudyDetailView from "@/components/blogDets/CaseStudyDetailView";
import ReportDetailView from "@/components/blogDets/ReportDetailView";
import MoreBlogs from "@/components/blogDets/MoreBlogs";
import StartupFaq from "@/components/solutions/startups/StartupFaq";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import { createArticleMetadata } from "@/lib/seo";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";
import {
  getBlogListingPosts,
  getBlogPageBySlug,
} from "@/lib/webflow";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getBlogPageBySlug(slug);
  if (!content) notFound();

  if (content.type === "case-study") {
    return createArticleMetadata({
      title: `${content.study.title} | CoverForce`,
      description: content.study.summary,
      path: `/blog/${slug}`,
      image: content.study.image,
    });
  }

  if (content.type === "report") {
    return createArticleMetadata({
      title: `${content.report.title} | CoverForce`,
      description: content.report.summary,
      path: `/blog/${slug}`,
      image: content.report.image,
    });
  }

  return createArticleMetadata({
    title: `${content.post.title} | CoverForce`,
    description:
      content.post.summary ||
      "Read the latest commercial insurance insights from CoverForce.",
    path: `/blog/${slug}`,
    image: content.post.image,
  });
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;
  const [content, listingPosts] = await Promise.all([
    getBlogPageBySlug(slug),
    getBlogListingPosts(),
  ]);

  if (!content) notFound();

  const morePosts = listingPosts
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      image: item.image,
      date: item.date,
      author: item.author,
      href: item.href,
    }));

  if (content.type === "case-study") {
    return (
      <CaseStudyDetailView study={content.study} morePosts={morePosts} />
    );
  }

  if (content.type === "report") {
    return (
      <ReportDetailView report={content.report} morePosts={morePosts} />
    );
  }

  const post = content.post;
  const faqs = post.faqs;
  const hasFaqs = faqs.length > 0;

  const breadcrumbs = [
    ...breadcrumbsForPath("/blog"),
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <PageWrapper>
      <JsonLd
        data={[
          buildArticleJsonLd(post),
          buildBreadcrumbJsonLd(breadcrumbs),
          ...(hasFaqs ? [buildFaqPageJsonLd(faqs)] : []),
        ]}
      />
      <Hero
        post={{
          category: post.category,
          breadcrumb: post.category,
          image: post.image,
          title: post.title,
          author: post.author,
          authorRole: post.authorRole || undefined,
          authorHref: post.authorHref,
          authorAvatar: post.authorAvatar,
          authorBio: post.authorBio || undefined,
          date: post.date,
        }}
      />
      <Content
        bodyHtml={post.bodyHtml}
        tags={post.tagName ? [post.tagName] : [post.category]}
      />
      {hasFaqs ? <StartupFaq items={faqs} /> : null}
      <MoreBlogs posts={morePosts} />
    </PageWrapper>
  );
};

export default BlogDetailPage;
