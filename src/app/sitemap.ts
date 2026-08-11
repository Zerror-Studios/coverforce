import type { MetadataRoute } from "next";
import { siteRoutes } from "@/config/site";
import { authorSlugs } from "@/data/authorSeo";
import {
  BLOG_PAGE_SIZE,
  blogPageHref,
  getBlogTotalPages,
} from "@/lib/blogPagination";
import { absoluteUrl } from "@/utils/url";
import { getBlogPosts } from "@/lib/webflow";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = siteRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.priority,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    const postRoutes = posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt
        ? new Date(post.publishedAt)
        : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const totalPages = getBlogTotalPages(posts.length, BLOG_PAGE_SIZE);
    const paginationRoutes: MetadataRoute.Sitemap = Array.from(
      { length: Math.max(0, totalPages - 1) },
      (_, i) => ({
        url: absoluteUrl(blogPageHref(i + 2)),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })
    );

    blogRoutes = [...postRoutes, ...paginationRoutes];
  } catch {
    blogRoutes = [];
  }

  const authorRoutes: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: absoluteUrl(`/author/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...blogRoutes, ...authorRoutes];
}
