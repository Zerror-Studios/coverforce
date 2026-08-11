import Hero from "@/components/blog/Hero";
import Listing from "@/components/blog/Listing";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import {
  BLOG_PAGE_SIZE,
  getBlogTotalPages,
} from "@/lib/blogPagination";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonLd";
import { createMetadata, getPageSeo } from "@/lib/seo";
import { getBlogPosts, toListingPost } from "@/lib/webflow";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type BlogPagedPageProps = {
  params: Promise<{ page: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    const pages = getBlogTotalPages(posts.length);
    return Array.from({ length: pages }, (_, i) => ({
      page: String(i + 1),
    }));
  } catch {
    return [{ page: "1" }];
  }
}

export async function generateMetadata({
  params,
}: BlogPagedPageProps): Promise<Metadata> {
  const { page: pageParam } = await params;
  const pageNum = Number.parseInt(pageParam, 10);
  if (!Number.isFinite(pageNum) || pageNum < 1) notFound();

  const seo = getPageSeo("/blog");
  if (pageNum === 1) {
    const meta = createMetadata({
      title: seo.title,
      description: seo.description,
      path: "/blog",
    });
    return { ...meta, title: { absolute: seo.title } };
  }

  const title = `${seo.title} — Page ${pageNum}`;
  const meta = createMetadata({
    title,
    description: seo.description,
    path: `/blog/page/${pageNum}`,
  });
  return { ...meta, title: { absolute: title } };
}

const BlogPagedPage = async ({ params }: BlogPagedPageProps) => {
  const { page: pageParam } = await params;
  const pageNum = Number.parseInt(pageParam, 10);
  if (!Number.isFinite(pageNum) || pageNum < 1) notFound();
  if (pageNum === 1) redirect("/blog");

  const posts = await getBlogPosts();
  const totalPages = getBlogTotalPages(posts.length);
  if (pageNum > totalPages) notFound();

  const featuredPost =
    posts.find((post) => post.featured) ?? posts[0] ?? null;
  const latest = posts
    .filter((post) => post.slug !== featuredPost?.slug)
    .slice(0, 4)
    .map((post) => ({
      href: `/blog/${post.slug}`,
      category: post.category,
      title: post.title,
      date: post.date,
    }));

  const seo = getPageSeo("/blog");
  const path = `/blog/page/${pageNum}`;
  const title = `${seo.title} — Page ${pageNum}`;

  return (
    <PageWrapper>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            path,
            title,
            description: seo.description,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: `Page ${pageNum}`, path },
          ]),
        ]}
      />
      {featuredPost ? (
        <Hero
          featured={{
            href: `/blog/${featuredPost.slug}`,
            image: featuredPost.image,
            category: featuredPost.category,
            title: featuredPost.title,
            date: featuredPost.date,
          }}
          latest={latest}
        />
      ) : null}
      <Listing
        posts={posts.map(toListingPost)}
        currentPage={pageNum}
        pageSize={BLOG_PAGE_SIZE}
      />
    </PageWrapper>
  );
};

export default BlogPagedPage;
