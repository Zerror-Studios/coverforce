import type { MegaMenuBlogData } from "@/data/megaMenu";
import { getBlogPosts, type BlogDetail } from "@/lib/webflow";

function toFeatured(post: BlogDetail): MegaMenuBlogData["featured"] {
  return {
    title: post.title,
    href: `/blog/${post.slug}`,
    image: post.image,
    imageAlt: post.title,
  };
}

export async function getMegaMenuBlogData(): Promise<MegaMenuBlogData | null> {
  try {
    const posts = await getBlogPosts();
    if (!posts.length) return null;

    const featuredPost = posts.find((post) => post.featured) ?? posts[0]!;
    const latest = posts
      .filter((post) => post.slug !== featuredPost.slug)
      .slice(0, 2)
      .map((post) => ({
        label: post.title,
        href: `/blog/${post.slug}`,
        description:
          (post.summary || `${post.category} · ${post.date}`).slice(0, 110) +
          ((post.summary || "").length > 110 ? "…" : ""),
      }));

    // If we have fewer than 2 non-featured posts, fill from remaining list.
    if (latest.length < 2) {
      for (const post of posts) {
        if (latest.length >= 2) break;
        if (post.slug === featuredPost.slug) continue;
        if (latest.some((item) => item.href === `/blog/${post.slug}`)) continue;
        latest.push({
          label: post.title,
          href: `/blog/${post.slug}`,
          description:
          (post.summary || `${post.category} · ${post.date}`).slice(0, 110) +
          ((post.summary || "").length > 110 ? "…" : ""),
        });
      }
    }

    return {
      featured: toFeatured(featuredPost),
      latest,
    };
  } catch {
    return null;
  }
}
