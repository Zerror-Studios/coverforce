import { siteConfig, siteRoutes } from "@/config/site";
import type { BlogDetail } from "@/lib/webflow";
import { absoluteUrl, normalizePath } from "@/utils/url";

export const ORG_NAME = "CoverForce";
export const ORG_ID = absoluteUrl("/#organization");

export type JsonLd = Record<string, unknown>;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

function absoluteImage(image?: string): string | undefined {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  return absoluteUrl(image.startsWith("/") ? image : `/${image}`);
}

function humanizeSegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Organization entity — include once sitewide (root layout). */
export function buildOrganizationJsonLd(): JsonLd {
  const sameAs = Object.values(siteConfig.socials).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    legalName: "CoverForce Inc.",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon/favicon.png"),
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        areaServed: "US",
        availableLanguage: ["English"],
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** WebSite entity — pairs with Organization for entity clarity. */
export function buildWebSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: ORG_NAME,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": ORG_ID },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Derive breadcrumbs from a path using siteRoutes labels when available. */
export function breadcrumbsForPath(path: string): BreadcrumbItem[] {
  const normalized = normalizePath(path);
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }];
  if (normalized === "/") return items;

  const segments = normalized.split("/").filter(Boolean);
  let acc = "";
  for (const segment of segments) {
    acc += `/${segment}`;
    const route = siteRoutes.find((r) => r.path === acc);
    items.push({
      name: route?.label ?? humanizeSegment(segment),
      path: acc,
    });
  }
  return items;
}

export function buildWebPageJsonLd(options: {
  path: string;
  title: string;
  description: string;
}): JsonLd {
  const url = absoluteUrl(options.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: options.title,
    description: options.description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": ORG_ID },
    inLanguage: siteConfig.language,
  };
}

export function buildArticleJsonLd(post: BlogDetail): JsonLd {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = absoluteImage(post.image);
  const authorUrl = post.authorHref
    ? absoluteUrl(post.authorHref)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.summary,
    url,
    mainEntityOfPage: url,
    ...(image ? { image: [image] } : {}),
    datePublished: post.publishedAt || undefined,
    dateModified: post.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: post.author,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    publisher: { "@id": ORG_ID },
    ...(post.tagName || post.category
      ? { articleSection: post.tagName || post.category }
      : {}),
    inLanguage: siteConfig.language,
  };
}

export function buildStaticArticleJsonLd(options: {
  title: string;
  description: string;
  path: string;
  image?: string;
  author: string;
  datePublished?: string;
  articleSection?: string;
}): JsonLd {
  const url = absoluteUrl(options.path);
  const image = absoluteImage(options.image);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: options.title,
    description: options.description,
    url,
    mainEntityOfPage: url,
    ...(image ? { image: [image] } : {}),
    datePublished: options.datePublished || undefined,
    dateModified: options.datePublished || undefined,
    author: {
      "@type": "Person",
      name: options.author,
    },
    publisher: { "@id": ORG_ID },
    ...(options.articleSection
      ? { articleSection: options.articleSection }
      : {}),
    inLanguage: siteConfig.language,
  };
}

export function buildProductJsonLd(options: {
  path: string;
  name: string;
  description: string;
  image?: string;
}): JsonLd {
  const url = absoluteUrl(options.path);
  const image = absoluteImage(options.image ?? siteConfig.ogImage);

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "SoftwareApplication"],
    "@id": `${url}#product`,
    name: options.name,
    description: options.description,
    url,
    ...(image ? { image } : {}),
    brand: {
      "@type": "Brand",
      name: ORG_NAME,
    },
    provider: { "@id": ORG_ID },
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/contact"),
      availability: "https://schema.org/OnlineOnly",
      priceCurrency: "USD",
      price: "0",
      description: "Contact CoverForce for pricing",
    },
  };
}

export function buildFaqPageJsonLd(
  faqs: Array<{ question: string; answer: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Convenience graph for a normal marketing page. */
export function buildMarketingPageJsonLd(path: string): JsonLd[] {
  const route = siteRoutes.find((r) => r.path === normalizePath(path));
  const title = route?.title ?? siteConfig.name;
  const description = route?.description ?? siteConfig.description;

  return [
    buildWebPageJsonLd({ path, title, description }),
    buildBreadcrumbJsonLd(breadcrumbsForPath(path)),
  ];
}
