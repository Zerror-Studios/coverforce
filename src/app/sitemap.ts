import type { MetadataRoute } from "next";
import { siteRoutes } from "@/config/site";
import { authorSlugs } from "@/data/authorSeo";
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
    blogRoutes = posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt
        ? new Date(post.publishedAt)
        : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
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
