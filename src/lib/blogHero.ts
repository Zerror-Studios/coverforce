import type { BlogDetail, BlogPost } from "@/lib/webflow";

function publishedTime(post: { publishedAt?: string; date?: string }) {
  return Date.parse(post.publishedAt ?? post.date ?? "") || 0;
}

/**
 * Blog listing hero selection (Webflow CMS):
 * 1. Featured article(s) first — newest published wins if multiple.
 * 2. If none featured, latest published article.
 * Case studies are skipped for the hero.
 */
export function selectBlogHeroPost(
  posts: BlogPost[],
  blogDetails: BlogDetail[],
): BlogPost | null {
  if (!posts.length) return null;

  const listingBySlug = new Map(posts.map((post) => [post.slug, post]));

  const featuredNewestFirst = blogDetails
    .filter((post) => post.featured)
    .sort((a, b) => publishedTime(b) - publishedTime(a));

  for (const detail of featuredNewestFirst) {
    const match = listingBySlug.get(detail.slug);
    if (match && match.category !== "Case Study") {
      return match;
    }
  }

  const latestEligible = [...posts]
    .sort((a, b) => publishedTime(b) - publishedTime(a))
    .find((post) => post.category !== "Case Study");

  return latestEligible ?? posts[0] ?? null;
}
