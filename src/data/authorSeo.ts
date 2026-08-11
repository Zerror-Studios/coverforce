import { absoluteUrl } from "@/utils/url";
import type { BlogAuthor } from "@/lib/webflow";

export type AuthorProfile = {
  title: string;
  description: string;
  role?: string;
  jobTitle?: string;
  worksFor?: string;
  alumniOf?: string[];
  knowsAbout?: string[];
  sameAs?: string[];
};

export const authorsSeo: Record<string, AuthorProfile> = {
  "cyrus-karai": {
    title: "Cyrus Karai | CEO & Co-Founder at CoverForce",
    description:
      "Cyrus Karai is CEO and Co-Founder of CoverForce. Wharton MBA. Previously PwC, Credit Suisse, and BlackRock. Writing on commercial insurance distribution, APIs, and insurtech.",
    role: "CEO & Co-Founder",
    jobTitle: "CEO & Co-Founder",
    worksFor: "CoverForce",
    alumniOf: [
      "The Wharton School",
      "PwC",
      "Credit Suisse",
      "BlackRock",
    ],
    knowsAbout: [
      "Commercial insurance",
      "Insurance distribution",
      "Insurtech",
      "Insurance APIs",
      "P&C insurance",
    ],
  },
};

/** @deprecated Prefer Object.keys(authorsSeo) or CMS slugs via getBlogAuthorSlugs() */
export const authorSlugs = Object.keys(authorsSeo);

export function getAuthorSeo(slug: string): AuthorProfile {
  return (
    authorsSeo[slug] ?? {
      title: "Authors | CoverForce Blog",
      description:
        "Explore articles and insights from CoverForce authors on commercial insurance distribution, technology, and the future of the P&C industry.",
    }
  );
}

export function buildAuthorPersonJsonLd(
  author: BlogAuthor,
  profile: AuthorProfile
): Record<string, unknown> {
  const url = absoluteUrl(`/author/${author.pageSlug}`);
  const image = author.avatar
    ? author.avatar.startsWith("http")
      ? author.avatar
      : absoluteUrl(author.avatar)
    : undefined;

  const sameAs = [
    ...(profile.sameAs ?? []),
    author.linkedin,
    author.twitter,
    author.facebook,
  ].filter((value): value is string => Boolean(value && value !== "#"));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url,
    ...(image ? { image } : {}),
    description: author.bio || profile.description,
    ...(profile.jobTitle ? { jobTitle: profile.jobTitle } : {}),
    ...(profile.worksFor
      ? {
          worksFor: {
            "@type": "Organization",
            name: profile.worksFor,
            url: absoluteUrl("/"),
          },
        }
      : {}),
    ...(profile.alumniOf?.length
      ? {
          alumniOf: profile.alumniOf.map((name) => ({
            "@type": "Organization",
            name,
          })),
        }
      : {}),
    ...(profile.knowsAbout?.length ? { knowsAbout: profile.knowsAbout } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
