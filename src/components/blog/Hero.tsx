import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import HeroReveal from "@/components/common/HeroReveal";

const FEATURED_POST = {
  href: "/blog/coverforce-cb-insights-2025",
  image: "/images/blog/blog6.png",
  category: "News",
  title:
    "CoverForce Named to the 2025 CB Insights' List of the 50 Most Innovative Insurtech Startups",
  date: "October 16, 2025",
};

const Hero = () => {
  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom>
        <HeroReveal className="mx-auto w-full max-w-none pb-14 pt-28 md:pb-20 md:pt-36 lg:max-w-4xl lg:py-24">
          <Link
            href={FEATURED_POST.href}
            className="group mx-auto block w-full"
          >
            <div className="relative w-full overflow-hidden rounded-md bg-[#F7F7FB]">
              <div className="relative aspect-video w-full">
                <Image
                  src={FEATURED_POST.image}
                  alt={FEATURED_POST.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 1023px) 100vw, 48rem"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <EyebrowPill surface="light" className="!m-0">
                {FEATURED_POST.category}
              </EyebrowPill>
              <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#6B7280]">
                {FEATURED_POST.date}
              </p>
            </div>

            <h2 className="mt-4 w-full max-w-none font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] transition-colors sm:text-3xl sm:leading-[1.12] md:text-4xl lg:max-w-3xl lg:text-[1.625rem] lg:leading-[1.12]">
              {FEATURED_POST.title}
            </h2>
          </Link>
        </HeroReveal>
      </Container>
    </section>
  );
};

export default Hero;
