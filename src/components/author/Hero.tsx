import Link from "next/link";
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiLinkedinFill,
} from "@remixicon/react";
import CmsImage from "@/components/common/CmsImage";
import Container from "@/components/common/Container";
import HeroReveal from "@/components/common/HeroReveal";
import type { AuthorProfile } from "@/data/authorSeo";
import type { BlogAuthor } from "@/lib/webflow";

type Social = {
  label: string;
  href: string;
  icon: typeof RiTwitterXFill;
};

function socialsFor(author: BlogAuthor): Social[] {
  return [
    { label: "Facebook", href: author.facebook ?? "", icon: RiFacebookFill },
    { label: "X (Twitter)", href: author.twitter ?? "", icon: RiTwitterXFill },
    { label: "LinkedIn", href: author.linkedin ?? "", icon: RiLinkedinFill },
  ].filter((item) => Boolean(item.href) && item.href !== "#");
}

type HeroProps = {
  author: BlogAuthor;
  profile?: AuthorProfile;
};

const Hero = ({ author, profile }: HeroProps) => {
  const avatar = author.avatar || "/images/blog/author.png";
  const bio =
    author.bio ||
    profile?.description ||
    "Explore articles and insights from CoverForce on commercial insurance distribution, technology, and the future of the P&C industry.";
  const socials = socialsFor(author);
  const role = profile?.role;

  return (
    <section className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom>
        <HeroReveal className="mx-auto max-w-4xl pb-14 pt-28 md:py-20 lg:py-24">
          <nav className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
            <Link href="/blog" className="transition-colors hover:text-[#413CC0]">
              Blog
            </Link>
            <span className="text-[#C4C4C4]">/</span>
            <span className="text-[#50617a]">Author</span>
          </nav>

          <div className="mt-8 flex flex-col items-center text-center">
            <div className="relative size-28 overflow-hidden rounded-full bg-[#F7F7FB] md:size-32">
              <CmsImage
                src={avatar}
                alt={author.name}
                fill
                priority
                className="object-cover"
                sizes="128px"
              />
            </div>

            <h1 className="mt-6 font-heading text-3xl font-medium tracking-tight text-[#0a143b] md:text-4xl">
              {author.name}
            </h1>

            {role ? (
              <p className="mt-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#413CC0]">
                {role}
                {profile?.worksFor ? ` · ${profile.worksFor}` : ""}
              </p>
            ) : null}

            {socials.length ? (
              <div className="mt-5 flex items-center justify-center gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
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
            {bio}
          </p>
        </HeroReveal>
      </Container>
    </section>
  );
};

export default Hero;
