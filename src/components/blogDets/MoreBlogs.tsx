import Link from "next/link";
import CmsImage from "@/components/common/CmsImage";
import Container from "@/components/common/Container";

type MorePost = {
  slug: string;
  title: string;
  image: string;
};

function MoreCard({ post }: { post: MorePost }) {
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
    </Link>
  );
}

const MoreBlogs = ({
  title = "More Insights on Shaping the Future of Insurance",
  posts = [],
}: {
  title?: string;
  posts?: MorePost[];
}) => {
  if (!posts.length) return null;

  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="pb-16 pt-6 md:pb-24 md:pt-10">
          <h2 className="max-w-sm font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
            {title}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {posts.map((post) => (
              <MoreCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MoreBlogs;
