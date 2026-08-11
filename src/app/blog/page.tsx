import Hero from "@/components/blog/Hero";
import Listing from "@/components/blog/Listing";
import PageWrapper from "@/components/PageWrapper";
import { createPageMetadata } from "@/lib/seo";
import { getBlogPosts, toListingPost } from "@/lib/webflow";

export const metadata = createPageMetadata("/blog");
export const dynamic = "force-dynamic";

const BlogPage = async () => {
  const posts = await getBlogPosts();
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

  return (
    <PageWrapper>
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
      <Listing posts={posts.map(toListingPost)} />
    </PageWrapper>
  );
};

export default BlogPage;
