import BlogCard from "@/components/blog/BlogCard";
import Container from "@/components/common/Container";
import type { BlogPost } from "@/data/blogPosts";

type AuthorPostsProps = {
  authorName: string;
  posts: BlogPost[];
};

export default function AuthorPosts({ authorName, posts }: AuthorPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="pb-16 pt-10 md:pb-24 md:pt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
              Articles by {authorName}
            </h2>
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
