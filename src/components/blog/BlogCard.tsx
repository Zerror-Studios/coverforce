import CmsImage from "@/components/common/CmsImage";
import Link from "next/link";
import type { BlogPost } from "@/data/blogPosts";

type BlogCardProps = {
  post: Pick<BlogPost, "slug" | "title" | "image" | "date" | "author">;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative w-full overflow-hidden rounded-md bg-[#F7F7FB]">
        <div className="relative aspect-video w-full">
          <CmsImage
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      <h3 className="mt-3 font-heading text-base font-medium leading-snug text-[#0a143b] transition-colors group-hover:text-[#413CC0] md:text-lg">
        {post.title}
      </h3>

      <p className="mt-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#6B7280] md:text-xs">
        {post.date} / {post.author}
      </p>
    </Link>
  );
}
