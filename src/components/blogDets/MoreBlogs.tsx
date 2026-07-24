import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";

type MorePost = {
  slug: string;
  title: string;
  image: string;
};

const POSTS: MorePost[] = [
  {
    slug: "coverforce-cb-insights-2025",
    title: "CoverForce Named to the 2025 CB Insights' List of the...",
    image: "/images/blog/blog6.png",
  },
  {
    slug: "coverforce-nowcerts-instant-cois",
    title: "CoverForce Partners With NowCerts to Launch Instant...",
    image: "/images/blog/blog7.png",
  },
  {
    slug: "coverforce-series-a-funding",
    title: "CoverForce Secures $13 Million in Series A Funding L...",
    image: "/images/blog/blog8.png",
  },
];

function MoreCard({ post }: { post: MorePost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative w-full overflow-hidden rounded-md bg-[#F7F7FB]">
        <div className="relative aspect-video w-full">
          <Image
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
}: {
  title?: string;
}) => {
  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="pb-16 pt-6 md:pb-24 md:pt-10">
          <h2 className="max-w-sm font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
            {title}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {POSTS.map((post) => (
              <MoreCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MoreBlogs;
