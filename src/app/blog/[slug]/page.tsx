import Hero from "@/components/blogDets/Hero";
import Content from "@/components/blogDets/Content";
import MoreBlogs from "@/components/blogDets/MoreBlogs";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import { createArticleMetadata } from "@/lib/seo";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  breadcrumbsForPath,
} from "@/lib/jsonLd";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/webflow";
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
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return createArticleMetadata({
    title: `${post.title} | CoverForce`,
    description:
      post.summary ||
      "Read the latest commercial insurance insights from CoverForce.",
    path: `/blog/${slug}`,
    image: post.image,
  });
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
  ]);

  if (!post) notFound();

  const morePosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      image: item.image,
      date: item.date,
      author: item.author,
    }));

  const breadcrumbs = [
    ...breadcrumbsForPath("/blog"),
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <PageWrapper>
      <JsonLd
        data={[buildArticleJsonLd(post), buildBreadcrumbJsonLd(breadcrumbs)]}
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
      <MoreBlogs posts={morePosts} />
    </PageWrapper>
  );
};

export default BlogDetailPage;
