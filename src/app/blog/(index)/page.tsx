import Hero from "@/components/blog/Hero";
import Listing from "@/components/blog/Listing";
import PageWrapper from "@/components/PageWrapper";
import PageJsonLd from "@/components/common/PageJsonLd";
import { selectBlogHeroPost } from "@/lib/blogHero";
import { BLOG_PAGE_SIZE } from "@/lib/blogPagination";
import { createPageMetadata } from "@/lib/seo";
import { getBlogListingPosts, getBlogPosts } from "@/lib/webflow";

export const metadata = createPageMetadata("/blog");
export const dynamic = "force-dynamic";

const BlogPage = async () => {
  const [posts, blogDetails] = await Promise.all([
    getBlogListingPosts(),
    getBlogPosts(),
  ]);
  const featuredPost = selectBlogHeroPost(posts, blogDetails);
  const latest = posts
    .filter(
      (post) =>
        post.href !== featuredPost?.href && post.slug !== featuredPost?.slug,
    )
    .slice(0, 4)
    .map((post) => ({
      href: post.href ?? `/blog/${post.slug}`,
      category: post.category,
      title: post.title,
      date: post.date,
    }));

  return (
    <PageWrapper>
      <PageJsonLd path="/blog" />
      {featuredPost ? (
        <Hero
          featured={{
            href: featuredPost.href ?? `/blog/${featuredPost.slug}`,
            image: featuredPost.image,
            category: featuredPost.category,
            title: featuredPost.title,
            date: featuredPost.date,
          }}
          latest={latest}
        />
      ) : null}
      <Listing posts={posts} currentPage={1} pageSize={BLOG_PAGE_SIZE} />
    </PageWrapper>
  );
};

export default BlogPage;
