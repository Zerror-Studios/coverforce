import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import HeroReveal from "@/components/common/HeroReveal";

type BlogPreview = {
  href: string;
  category: string;
  title: string;
  date: string;
};

const FEATURED_POST = {
  href: "/blog/coverforce-cb-insights-2025",
  image: "/images/blog/blog6.png",
  category: "News",
  title:
    "CoverForce Named to the 2025 CB Insights' List of the 50 Most Innovative Insurtech Startups",
  date: "October 16, 2025",
};

const LATEST_POSTS: BlogPreview[] = [
  {
    href: "/blog/coverforce-nowcerts-instant-cois",
    category: "News",
    title: "CoverForce Partners With NowCerts to Launch Instant COIs",
    date: "October 16, 2025",
  },
  {
    href: "/blog/coverforce-series-a-funding",
    category: "News",
    title: "CoverForce Secures $13 Million in Series A Funding Led by...",
    date: "October 16, 2025",
  },
  {
    href: "/blog/wholesalers-embrace-apis",
    category: "Insights",
    title: "Wholesalers Must Embrace APIs to Stay Competitive",
    date: "October 16, 2025",
  },
  {
    href: "/blog/true-bindability-commercial-quoting",
    category: "Insights",
    title: "True Bindability in Commercial Quoting: Why It Matters",
    date: "October 16, 2025",
  },
];

function LatestStoryItem({ post }: { post: BlogPreview }) {
  return (
    <Link href={post.href} className="group block py-5 first:pt-0 last:pb-0">
      <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-[#413CC0]">
        {post.category}
      </p>
      <h3 className="mt-2 font-heading text-sm font-medium leading-snug text-[#0a143b] transition-colors group-hover:text-[#413CC0] md:text-base">
        {post.title}
      </h3>
      <p className="mt-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
        {post.date}
      </p>
    </Link>
  );
}

const Hero = () => {
  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom>
        <HeroReveal className="w-full pb-10 pt-28 md:pb-14 md:pt-36 lg:pb-16 lg:pt-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,17.5rem)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] xl:gap-8">
            <Link href={FEATURED_POST.href} className="group block w-full min-w-0 max-lg:max-w-none">
              <div className="relative w-full overflow-hidden rounded-md bg-[#F7F7FB]">
                <div className="relative aspect-video w-full">
                  <Image
                    src={FEATURED_POST.image}
                    alt={FEATURED_POST.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1023px) 100vw, 65vw"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <EyebrowPill surface="light" className="m-0!">
                  {FEATURED_POST.category}
                </EyebrowPill>
                <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#6B7280]">
                  {FEATURED_POST.date}
                </p>
              </div>

              <h2 className="mt-4 max-w-none font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] transition-colors group-hover:text-[#413CC0] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:max-w-xl lg:text-[1.625rem] lg:leading-[1.12]">
                {FEATURED_POST.title}
              </h2>
            </Link>

            <aside className="hidden min-w-0 lg:block lg:pl-4 xl:pl-5">
              <h2 className="font-heading text-base font-medium tracking-tight text-[#0a143b] md:text-lg">
                Latest Stories
              </h2>

              <div className="mt-4 divide-y divide-dashed divide-[#D8D8E2]">
                {LATEST_POSTS.map((post) => (
                  <LatestStoryItem key={post.href} post={post} />
                ))}
              </div>
            </aside>
          </div>
        </HeroReveal>
      </Container>
    </section>
  );
};

export default Hero;
