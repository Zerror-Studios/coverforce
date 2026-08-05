import Image from "next/image";
import Link from "next/link";
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiLinkedinFill,
} from "@remixicon/react";
import Container from "@/components/common/Container";
import HeroReveal from "@/components/common/HeroReveal";
import type { BlogAuthor } from "@/lib/webflow";

type Author = {
  name: string;
  avatar: string;
  breadcrumb: string;
  bio: string;
  socials: { label: string; href: string; icon: typeof RiTwitterXFill }[];
};

const DEFAULT_SOCIALS: Author["socials"] = [
  { label: "Facebook", href: "#", icon: RiFacebookFill },
  { label: "X (Twitter)", href: "#", icon: RiTwitterXFill },
  { label: "LinkedIn", href: "#", icon: RiLinkedinFill },
];

function toAuthor(author: BlogAuthor): Author {
  return {
    name: author.name,
    avatar: author.avatar || "/images/blog/author.png",
    breadcrumb: "Insights",
    bio:
      author.bio ||
      "Explore articles and insights from CoverForce on commercial insurance distribution, technology, and the future of the P&C industry.",
    socials: [
      { label: "Facebook", href: author.facebook || "#", icon: RiFacebookFill },
      { label: "X (Twitter)", href: author.twitter || "#", icon: RiTwitterXFill },
      { label: "LinkedIn", href: author.linkedin || "#", icon: RiLinkedinFill },
    ],
  };
}

const Hero = ({ author }: { author: BlogAuthor }) => {
  const profile = toAuthor(author);

  const visibleSocials = profile.socials.filter(
    ({ href }) => href && href !== "#"
  );

  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom>
        <HeroReveal className="mx-auto max-w-4xl pb-14 pt-28 md:py-20 lg:py-24">
          <nav className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
            <Link href="/blog" className="transition-colors hover:text-[#413CC0]">
              Blogs
            </Link>
            <span className="text-[#C4C4C4]">/</span>
            <Link href="/blog" className="transition-colors hover:text-[#413CC0]">
              {profile.breadcrumb}
            </Link>
            <span className="text-[#C4C4C4]">/</span>
            <span className="text-[#50617a]">Author</span>
          </nav>

          <div className="mt-8 flex flex-col items-center text-center">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={128}
              height={128}
              priority
              className="size-28 rounded-full object-cover md:size-32"
            />

            <h1 className="mt-6 font-heading text-3xl font-medium tracking-tight text-[#0a143b] md:text-4xl">
              {profile.name}
            </h1>

            {visibleSocials.length ? (
              <div className="mt-5 flex items-center justify-center gap-3">
                {visibleSocials.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-8 items-center justify-center rounded-full bg-[#0a143b] text-white transition-colors hover:bg-[#413CC0]"
                  >
                    <Icon className="size-4" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <p className="mt-10 text-[0.9375rem] leading-[1.75] text-[#444444]">
            {profile.bio}
          </p>
        </HeroReveal>
      </Container>
    </section>
  );
};

export default Hero;
