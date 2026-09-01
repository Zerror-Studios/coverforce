import BlogCard from "@/components/blog/BlogCard";
import Container from "@/components/common/Container";
import type { BlogPost } from "@/data/blogPosts";

type MorePost = Pick<
  BlogPost,
  "slug" | "title" | "image" | "date" | "author" | "href"
>;

const MoreBlogs = ({
  title = "More Insights on Shaping the Future of Insurance",
  posts = [],
  getPostHref,
}: {
  title?: string;
  posts?: MorePost[];
  getPostHref?: (post: MorePost) => string;
}) => {
  if (!posts.length) return null;

  return (
    <section id="more-blogs" className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="pb-16 pt-6 md:pb-24 md:pt-10">
          <h2 className="max-w-sm font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
            {title}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                href={getPostHref?.(post)}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MoreBlogs;
