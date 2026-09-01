import type { BlogCategory, BlogPost } from "@/data/blogPosts";
import type { FaqEntry } from "@/data/faqs/types";
import type {
  CaseStudyHeroData,
  HeroMetaField,
} from "@/data/staticBlogDetails";
import type { ContentStat } from "@/components/blogDets/StaticBlogContent";
import type { ReportContextData } from "@/components/blogDets/ReportContext";
import type { ReportFindingCard } from "@/components/blogDets/ReportFindings";
import type { ReportHeroData } from "@/components/blogDets/ReportHero";
import type { ReportMilestonesData } from "@/data/staticBlogDetails";
import { cache } from "react";
import { env } from "@/config/env";
import {
  REPORT_BAR_COLORS,
  REPORT_BAR_THEMES,
} from "@/data/wayCardStyles";

const WEBFLOW_API = "https://api.webflow.com/v2";
const WEBFLOW_FETCH_REVALIDATE_SECONDS =
  process.env.NODE_ENV === "development" ? 0 : 60;

type WebflowImage = {
  url?: string;
  alt?: string | null;
};

type WebflowItem<T> = {
  id: string;
  fieldData: T;
  /** Webflow system timestamp when the item was last published. */
  lastPublished?: string | null;
  createdOn?: string | null;
  isDraft?: boolean;
  isArchived?: boolean;
};

function isPublishedCmsItem(item: WebflowItem<unknown>): boolean {
  return Boolean(item.lastPublished) && !item.isArchived;
}

type BlogFieldData = {
  name?: string;
  slug?: string;
  "post-body"?: string | null;
  "post-summary"?: string | null;
  "thumbnail-image"?: WebflowImage | null;
  featured?: boolean;
  "highlight-on-startup-page"?: boolean;
  author?: string | null;
  tag?: string | null;
  "created-at-manual"?: string;
  "published-at-manual"?: string;
  /** Rich text: repeating <h3> question + <p> answer pairs. */
  faqs?: string | null;
};

type AuthorFieldData = {
  name?: string;
  slug?: string;
  bio?: string | null;
  picture?: WebflowImage | null;
  facebook?: string | null;
  "facebook-url"?: string | null;
  linkedin?: string | null;
  "linkedin-url"?: string | null;
  "linked-in"?: string | null;
  twitter?: string | null;
  "twitter-url"?: string | null;
  x?: string | null;
  "x-url"?: string | null;
};

type TagFieldData = {
  name?: string;
  slug?: string;
  "chip-color"?: string | null;
};

type CaseStudyFieldData = {
  name?: string;
  slug?: string;
  "post-summary"?: string | null;
  "post-body"?: string | null;
  "client-name"?: string | null;
  industry?: string | null;
  solution?: string | null;
  focus?: string | null;
  stat1?: string | null;
  stat2?: string | null;
  stat3?: string | null;
  stat4?: string | null;
  stat5?: string | null;
  stat6?: string | null;
  "grid-thumbnail"?: WebflowImage | null;
  "hero-banner-background"?: WebflowImage | null;
};

export type CaseStudyDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bodyHtml: string;
  image: string;
  date: string;
  publishedAt: string;
  author: string;
  readTime: string;
  caseStudyHero: CaseStudyHeroData;
  heroMeta: HeroMetaField[];
  stickyStats: ContentStat[];
  tags: string[];
};

type ReportFieldData = {
  name?: string;
  slug?: string;
  "post-summary"?: string | null;
  documents?: string | null;
  report?: string | null;
  "report-pdf"?: WebflowImage | null;
  "context-title"?: string | null;
  "context-description"?: string | null;
  "bar-data-1"?: string | null;
  "bar-data-2"?: string | null;
  "bar-data-3"?: string | null;
  "bar-data-4"?: string | null;
  "report-label-1"?: string | null;
  "report-label-2"?: string | null;
  "report-label-3"?: string | null;
  /** Display: Report Title 1–3 (Webflow slugs unchanged). */
  "challenge-title"?: string | null;
  "shift-title"?: string | null;
  "opportunity-title"?: string | null;
  /** Display: Report Desc 1–3 (Webflow slugs unchanged). */
  "challenge-desc"?: string | null;
  "shift-desc"?: string | null;
  "opportunity-desc"?: string | null;
  "section-title"?: string | null;
  "label-1"?: string | null;
  "tagline-1"?: string | null;
  "image-1"?: WebflowImage | null;
  "label-2"?: string | null;
  "tagline-2"?: string | null;
  "image-2"?: WebflowImage | null;
  "grid-thumbnail"?: WebflowImage | null;
};

export type ReportDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  publishedAt: string;
  author: string;
  reportHero: ReportHeroData;
  context: ReportContextData;
  reportMilestones: ReportMilestonesData;
  findingsTitle: string;
  findings: ReportFindingCard[];
};

export type CarrierFieldData = {
  name?: string;
  slug?: string;
  logo?: WebflowImage | null;
  "company-url"?: string | null;
  "products-ad"?: string | null;
  "products-es"?: string | null;
  "products-admitted"?: string | null;
  "products-surplus"?: string | null;
};

export type WebflowCarrier = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  companyUrl?: string;
  productsAd?: string;
  productsEs?: string;
};

export type BlogAuthor = {
  id: string;
  name: string;
  slug: string;
  pageSlug: string;
  bio: string;
  avatar?: string;
  href?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
};

export type BlogDetail = BlogPost & {
  id: string;
  bodyHtml: string;
  summary: string;
  featured: boolean;
  highlightOnStartupPage: boolean;
  publishedAt: string;
  authorRole: string;
  authorBio: string;
  authorAvatar?: string;
  authorHref?: string;
  tagName?: string;
  tagSlug?: string;
  faqs: FaqEntry[];
};


/**
 * Webflow CDN URLs are often already percent-encoded (`Article%204.png`),
 * sometimes double-encoded (`%2520`). Decode path segments fully so
 * next/image only encodes once when building `/_next/image?url=...`.
 */
function normalizeWebflowAssetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname
      .split("/")
      .map((segment) => {
        if (!segment) return segment;
        let decoded = segment;
        for (let i = 0; i < 5; i += 1) {
          try {
            const next = decodeURIComponent(decoded);
            if (next === decoded) break;
            decoded = next;
          } catch {
            break;
          }
        }
        return decoded;
      })
      .join("/");

    // Avoid URL.href — it re-encodes spaces and causes Next to double-encode.
    return `${parsed.protocol}//${parsed.host}${pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}

function encodeWebflowAssetUrlForHtml(url: string): string {
  const decoded = normalizeWebflowAssetUrl(url) ?? url;
  try {
    return new URL(decoded).href;
  } catch {
    return url;
  }
}

async function webflowFetch<T>(path: string, attempt = 0): Promise<T> {
  const token = env.webflow.token;
  const response = await fetch(`${WEBFLOW_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    ...(WEBFLOW_FETCH_REVALIDATE_SECONDS === 0
      ? { cache: "no-store" as const }
      : { next: { revalidate: WEBFLOW_FETCH_REVALIDATE_SECONDS } }),
  });

  if (response.status === 429 && attempt < 2) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    return webflowFetch<T>(path, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Webflow API ${path} failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchAllLiveItems<T>(
  collectionId: string
): Promise<WebflowItem<T>[]> {
  const items: WebflowItem<T>[] = [];
  let offset = 0;

  while (true) {
    const page = await webflowFetch<{
      items?: WebflowItem<T>[];
      pagination?: { total?: number };
    }>(`/collections/${collectionId}/items/live?limit=100&offset=${offset}`);

    const batch = page.items ?? [];
    items.push(...batch);
    if (batch.length < 100) break;
    offset += 100;
  }

  return items;
}

async function fetchAllCmsItems<T>(
  collectionId: string
): Promise<WebflowItem<T>[]> {
  const items: WebflowItem<T>[] = [];
  let offset = 0;

  while (true) {
    const page = await webflowFetch<{ items?: WebflowItem<T>[] }>(
      `/collections/${collectionId}/items?limit=100&offset=${offset}`
    );
    const batch = page.items ?? [];
    items.push(...batch);
    if (batch.length < 100) break;
    offset += 100;
  }

  return items;
}

function toWebflowBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "true" || value === "1";
}

function formatBlogDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function normalizeAuthorName(name: string): string {
  return name.replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function authorPageSlug(webflowSlug: string): string {
  return webflowSlug.replace(/-author$/, "");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ldquo;|&rdquo;|"/g, '"')
    .replace(/&lsquo;|&rsquo;|'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse Webflow Rich Text FAQs: repeating <h3> question + following <p> answer(s).
 */
export function parseFaqsFromRichText(html?: string | null): FaqEntry[] {
  if (!html?.trim()) return [];

  const faqs: FaqEntry[] = [];
  const sections = html.split(/<h3\b[^>]*>/i).slice(1);

  for (const section of sections) {
    const closeIdx = section.search(/<\/h3>/i);
    if (closeIdx === -1) continue;

    const question = stripHtml(section.slice(0, closeIdx));
    if (!question) continue;

    const afterHeading = section.slice(closeIdx).replace(/^<\/h3>/i, "");
    const paragraphs: string[] = [];
    const pRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
    let match: RegExpExecArray | null;
    while ((match = pRegex.exec(afterHeading)) !== null) {
      const text = stripHtml(match[1] ?? "");
      if (text) paragraphs.push(text);
    }

    const answer = paragraphs.join("\n\n");
    if (!answer) continue;

    faqs.push({
      id: `faq-${faqs.length + 1}`,
      question,
      answer,
    });
  }

  return faqs;
}

function pickFirstString(
  record: Record<string, unknown>,
  candidates: string[]
): string | undefined {
  for (const key of candidates) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function pickFirstMatchingString(
  record: Record<string, unknown>,
  matcher: (key: string) => boolean
): string | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (!matcher(key)) continue;
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    return trimmed;
  }
  return undefined;
}

function pickSocialLink(
  record: Record<string, unknown>,
  exactCandidates: string[],
  fuzzyCandidates: string[]
): string | undefined {
  const exact = pickFirstString(record, exactCandidates);
  if (exact) return exact;

  const normalizedCandidates = fuzzyCandidates.map((candidate) =>
    candidate.toLowerCase()
  );

  return pickFirstMatchingString(record, (key) => {
    const normalizedKey = key.toLowerCase();
    return normalizedCandidates.some((candidate) =>
      normalizedKey.includes(candidate)
    );
  });
}

function mapCategory(tagName?: string): BlogCategory {
  const normalized = (tagName ?? "").trim().toLowerCase();
  if (normalized === "case study") return "Case Study";
  if (normalized === "news") return "News";
  return "Insights";
}

function rewriteBlogLinks(html: string): string {
  return html
    .replace(/https?:\/\/(www\.)?coverforce\.com\/blog\//gi, "/blog/")
    .replace(
      /src="(https:\/\/cdn\.prod\.website-files\.com[^"]+)"/gi,
      (_match, src: string) =>
        `src="${encodeWebflowAssetUrlForHtml(src)}"`
    );
}

async function getAuthorsById(): Promise<Map<string, BlogAuthor>> {
  const collectionId = env.webflow.authorCollectionId;
  const items = await fetchAllCmsItems<AuthorFieldData>(collectionId);
  const map = new Map<string, BlogAuthor>();

  for (const item of items) {
    const name = normalizeAuthorName(item.fieldData.name ?? "CoverForce");
    const slug = item.fieldData.slug ?? item.id;
    const pageSlug = authorPageSlug(slug);
    const bioHtml = item.fieldData.bio ?? "";
    const bio = bioHtml ? stripHtml(bioHtml) : "";
    const socialFields = item.fieldData as Record<string, unknown>;

    map.set(item.id, {
      id: item.id,
      name,
      slug,
      pageSlug,
      bio,
      avatar: normalizeWebflowAssetUrl(item.fieldData.picture?.url),
      href: `/author/${pageSlug}`,
      facebook: pickSocialLink(socialFields, [
        "facebook",
        "facebook-url",
      ], [
        "facebook",
        "fb",
      ]),
      linkedin: pickSocialLink(socialFields, [
        "linkedin",
        "linkedin-url",
        "linked-in",
      ], [
        "linkedin",
        "linked-in",
      ]),
      twitter: pickSocialLink(socialFields, [
        "twitter",
        "twitter-url",
        "x",
        "x-url",
      ], [
        "twitter",
        "x-url",
        "x-link",
        "x-twitter",
      ]),
    });
  }

  return map;
}

export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const authors = await getAuthorsById();
  return Array.from(authors.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBlogAuthorBySlug(
  slug: string
): Promise<BlogAuthor | null> {
  const authors = await getBlogAuthors();
  return authors.find((author) => author.pageSlug === slug) ?? null;
}

export async function getBlogAuthorSlugs(): Promise<string[]> {
  const authors = await getBlogAuthors();
  return authors.map((author) => author.pageSlug).filter(Boolean);
}

async function getTagsById(): Promise<
  Map<string, { name: string; slug: string }>
> {
  const collectionId = env.webflow.tagCollectionId;
  const items = await fetchAllCmsItems<TagFieldData>(collectionId);
  const map = new Map<string, { name: string; slug: string }>();

  for (const item of items) {
    map.set(item.id, {
      name: item.fieldData.name ?? "Insights",
      slug: item.fieldData.slug ?? item.id,
    });
  }

  return map;
}

function mapBlogItem(
  item: WebflowItem<BlogFieldData>,
  authors: Map<string, BlogAuthor>,
  tags: Map<string, { name: string; slug: string }>
): BlogDetail {
  const fields = item.fieldData;
  const author = fields.author ? authors.get(fields.author) : undefined;
  const tag = fields.tag ? tags.get(fields.tag) : undefined;
  const summary =
    fields["post-summary"]?.trim() ||
    stripHtml(fields["post-body"] ?? "").slice(0, 180);
  const publishedAt = fields["published-at-manual"] || "";
  const date = formatBlogDate(publishedAt);

  return {
    id: item.id,
    slug: fields.slug ?? item.id,
    title: fields.name ?? "Untitled",
    image:
      normalizeWebflowAssetUrl(fields["thumbnail-image"]?.url) ||
      "/images/blog/blog1.png",
    date,
    author: author?.name ?? "CoverForce",
    category: mapCategory(tag?.name),
    bodyHtml: rewriteBlogLinks(fields["post-body"] ?? ""),
    summary,
    featured: toWebflowBoolean(fields.featured),
    highlightOnStartupPage: toWebflowBoolean(fields["highlight-on-startup-page"]),
    publishedAt,
    authorRole: "",
    authorBio: author?.bio ?? "",
    authorAvatar: author?.avatar,
    authorHref: author?.href,
    tagName: tag?.name,
    tagSlug: tag?.slug,
    faqs: parseFaqsFromRichText(fields.faqs),
  };
}

export const getBlogPosts = cache(async function getBlogPosts(): Promise<BlogDetail[]> {
  const collectionId = env.webflow.blogCollectionId;
  const [items, cmsItems, authors, tags] = await Promise.all([
    fetchAllLiveItems<BlogFieldData>(collectionId),
    // Live Items API currently omits `highlight-on-startup-page`; CMS items include it.
    fetchAllCmsItems<BlogFieldData>(collectionId).catch(() => [] as WebflowItem<BlogFieldData>[]),
    getAuthorsById(),
    getTagsById(),
  ]);

  const highlightById = new Map<string, boolean>();
  for (const item of cmsItems) {
    highlightById.set(
      item.id,
      toWebflowBoolean(item.fieldData["highlight-on-startup-page"]),
    );
  }

  return items
    .map((item) => {
      const post = mapBlogItem(item, authors, tags);
      if (highlightById.has(item.id)) {
        post.highlightOnStartupPage = highlightById.get(item.id)!;
      }
      return post;
    })
    .filter((post) => Boolean(post.slug))
    .sort(
      (a, b) =>
        (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0)
    );
});

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(
  slug: string
): Promise<BlogDetail | null> {
  const posts = await getBlogPosts();
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) return null;

  const collectionId = env.webflow.blogCollectionId;
  const encoded = encodeURIComponent(slug);
  const cmsPage = await webflowFetch<{ items?: WebflowItem<BlogFieldData>[] }>(
    `/collections/${collectionId}/items?limit=1&slug=${encoded}`
  ).catch(() => ({ items: [] as WebflowItem<BlogFieldData>[] }));

  const cmsFaqs = parseFaqsFromRichText(cmsPage.items?.[0]?.fieldData.faqs);
  if (cmsFaqs.length) {
    return { ...post, faqs: cmsFaqs };
  }

  return post;
});

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((post) => post.slug);
}

export function toListingPost(post: BlogDetail): BlogPost {
  return {
    slug: post.slug,
    category: post.category,
    title: post.title,
    image: post.image,
    date: post.date,
    author: post.author,
    href: `/blog/${post.slug}`,
    publishedAt: post.publishedAt,
  };
}

function parseCaseStudyStat(value?: string | null): ContentStat | null {
  if (!value?.trim()) return null;

  const [statValue, ...labelParts] = value.split(";");
  const label = labelParts.join(";").trim();
  if (!statValue?.trim() || !label) return null;

  return {
    value: statValue.trim(),
    label,
  };
}

function estimateReadTime(html: string): string {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function mapCaseStudyItem(item: WebflowItem<CaseStudyFieldData>): CaseStudyDetail {
  const fields = item.fieldData;
  const publishedAt = item.lastPublished ?? item.createdOn ?? "";
  const date = formatBlogDate(publishedAt);
  const bodyHtml = rewriteBlogLinks(fields["post-body"] ?? "");
  const summary =
    fields["post-summary"]?.trim() ||
    stripHtml(bodyHtml).slice(0, 180);
  const readTime = estimateReadTime(bodyHtml);

  const heroMeta: HeroMetaField[] = [
    { label: "Client Name", value: fields["client-name"]?.trim() ?? "" },
    { label: "Industry", value: fields.industry?.trim() ?? "" },
    { label: "Solution", value: fields.solution?.trim() ?? "" },
    { label: "Focus", value: fields.focus?.trim() ?? "" },
  ].filter((field) => field.value);

  const stickyStats = [
    fields.stat1,
    fields.stat2,
    fields.stat3,
    fields.stat4,
    fields.stat5,
    fields.stat6,
  ]
    .map(parseCaseStudyStat)
    .filter((stat): stat is ContentStat => stat !== null);

  return {
    id: item.id,
    slug: fields.slug ?? item.id,
    title: fields.name ?? "Untitled",
    summary,
    bodyHtml,
    image:
      normalizeWebflowAssetUrl(fields["grid-thumbnail"]?.url) ||
      "/images/casestudy.png",
    date,
    publishedAt,
    author: "CoverForce",
    readTime,
    caseStudyHero: {
      label: "Case Study",
      title: fields.name ?? "Untitled",
      tagline: summary,
      date,
      readTime,
      backgroundImage:
        normalizeWebflowAssetUrl(fields["hero-banner-background"]?.url) ||
        "/images/casestudy-bg.png",
      logo: "/images/startups/center-logo.svg",
    },
    heroMeta,
    stickyStats,
    tags: ["Case Study"],
  };
}

export const getCaseStudyPosts = cache(async function getCaseStudyPosts(): Promise<CaseStudyDetail[]> {
  const collectionId = env.webflow.caseStudyCollectionId;
  if (!collectionId) return [];

  // Staged CMS items reflect deletes immediately; Live Items can keep removed entries
  // until the whole Webflow site is republished.
  const items = await fetchAllCmsItems<CaseStudyFieldData>(collectionId);

  return items
    .filter(isPublishedCmsItem)
    .map(mapCaseStudyItem)
    .filter((study) => Boolean(study.slug))
    .sort(
      (a, b) =>
        (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0),
    );
});

export const getCaseStudyBySlug = cache(async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudyDetail | null> {
  const studies = await getCaseStudyPosts();
  return studies.find((study) => study.slug === slug) ?? null;
});

export async function getCaseStudySlugs(): Promise<string[]> {
  const studies = await getCaseStudyPosts();
  return studies.map((study) => study.slug);
}

const DEFAULT_REPORT_DOWNLOAD_MODAL: ReportHeroData["downloadModal"] = {
  title: "Download the Full Report for More Insights",
  bullets: [
    "Why over a quarter of underwriting effort is spent on unwinnable deals",
    "How misaligned submissions impact reinsurance costs and win rates",
    "What gaps in data, tools, and portfolio visibility are costing you",
    "How teams are using AI to outperform their competition",
  ],
  formTitle:
    "Go Beyond the Headlines and Discover the Latest Insights into Underwriting",
  consentLabel: "I agree to receive other communications from CoverForce.",
  consentFinePrint:
    "By clicking submit below, you consent to allow CoverForce to store and process the personal information submitted above to provide you the content requested.",
  submitLabel: "Submit message",
};

function formatReportPublishedLabel(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatReportYear(value?: string | null): string {
  if (!value) return String(new Date().getUTCFullYear());
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(new Date().getUTCFullYear());
  return String(date.getUTCFullYear());
}

function parseReportBarData(
  value: string | null | undefined,
  barColor: string,
): ReportContextData["stats"][number] | null {
  if (!value?.trim()) return null;

  const [labelPart, valuePart] = value.split(";");
  const label = labelPart?.trim();
  const statValue = valuePart?.trim();
  if (!label || !statValue) return null;

  return {
    label,
    value: statValue.includes("%") ? statValue : `${statValue}%`,
    barColor,
  };
}

function splitContextParagraphs(description?: string | null): string[] {
  if (!description?.trim()) return [];

  return description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function mapReportFinding(
  badge: string | null | undefined,
  title: string | null | undefined,
  image: WebflowImage | null | undefined,
  fallbackAlt: string,
): ReportFindingCard | null {
  if (!badge?.trim() || !title?.trim()) return null;

  return {
    badge: badge.trim(),
    title: title.trim(),
    image: normalizeWebflowAssetUrl(image?.url) ?? "/images/tech.png",
    imageAlt: image?.alt?.trim() || fallbackAlt,
  };
}

const REPORT_MILESTONE_FIELD_GROUPS = [
  {
    labelKey: "report-label-1",
    titleKey: "challenge-title",
    descKey: "challenge-desc",
    defaults: { label: "The Challenge", title: "The Challenge" },
  },
  {
    labelKey: "report-label-2",
    titleKey: "shift-title",
    descKey: "shift-desc",
    defaults: { label: "The Shift", title: "The Shift" },
  },
  {
    labelKey: "report-label-3",
    titleKey: "opportunity-title",
    descKey: "opportunity-desc",
    defaults: { label: "The Opportunity", title: "The Opportunity" },
  },
] as const;

function mapReportMilestoneSlide(
  fields: ReportFieldData,
  group: (typeof REPORT_MILESTONE_FIELD_GROUPS)[number],
): ReportMilestonesData["slides"][number] | null {
  const label = fields[group.labelKey]?.trim() || group.defaults.label;
  const title = fields[group.titleKey]?.trim() || group.defaults.title;
  const description = fields[group.descKey]?.trim() ?? "";

  if (!description && !title) return null;

  return { label, title, description };
}

function mapReportItem(item: WebflowItem<ReportFieldData>): ReportDetail {
  const fields = item.fieldData;
  const publishedAt = item.lastPublished ?? item.createdOn ?? "";
  const date = formatBlogDate(publishedAt);
  const summary = fields["post-summary"]?.trim() ?? "";
  const publishedLabel = formatReportPublishedLabel(publishedAt);

  const stats = [
    fields["bar-data-1"],
    fields["bar-data-2"],
    fields["bar-data-3"],
    fields["bar-data-4"],
  ]
    .map((value, index) =>
      parseReportBarData(value, REPORT_BAR_COLORS[index]!),
    )
    .filter((stat): stat is ReportContextData["stats"][number] => stat !== null);

  const milestoneSlides = REPORT_MILESTONE_FIELD_GROUPS.map((group) =>
    mapReportMilestoneSlide(fields, group),
  ).filter((slide): slide is ReportMilestonesData["slides"][number] => slide !== null);

  const findings = [
    mapReportFinding(
      fields["label-1"],
      fields["tagline-1"],
      fields["image-1"],
      "Report finding one",
    ),
    mapReportFinding(
      fields["label-2"],
      fields["tagline-2"],
      fields["image-2"],
      "Report finding two",
    ),
  ].filter((finding): finding is ReportFindingCard => finding !== null);

  const listingImage =
    normalizeWebflowAssetUrl(fields["grid-thumbnail"]?.url) ??
    normalizeWebflowAssetUrl(fields["image-1"]?.url) ??
    "/images/casestudy.png";

  return {
    id: item.id,
    slug: fields.slug ?? item.id,
    title: fields.name ?? "Untitled",
    summary,
    image: listingImage,
    date,
    publishedAt,
    author: "CoverForce",
    reportHero: {
      breadcrumbLabel: "Research Report",
      year: formatReportYear(publishedAt),
      title: fields.name ?? "Untitled",
      summary,
      ctaLabel: "Download the full report",
      ctaHref: "/contact",
      downloadModal: DEFAULT_REPORT_DOWNLOAD_MODAL,
      meta: [
        ...(publishedLabel
          ? [{ label: "Published", value: publishedLabel }]
          : []),
        ...(fields.documents?.trim()
          ? [{ label: "Documents", value: fields.documents.trim() }]
          : []),
        ...(fields.report?.trim()
          ? [{ label: "Report", value: fields.report.trim() }]
          : []),
      ],
    },
    context: {
      title: fields["context-title"]?.trim() || "The Context Behind the Research",
      paragraphs: splitContextParagraphs(fields["context-description"]),
      stats,
    },
    reportMilestones: {
      sectionTitle: "Why This Research Matters",
      slides: milestoneSlides,
    },
    findingsTitle: fields["section-title"]?.trim() || "The Big Findings",
    findings,
  };
}

export const getReportPosts = cache(async function getReportPosts(): Promise<ReportDetail[]> {
  const collectionId = env.webflow.reportCollectionId;
  if (!collectionId) return [];

  // Report custom fields are not exposed on Live Items; CMS items include them.
  const items = await fetchAllCmsItems<ReportFieldData>(collectionId);

  return items
    .filter(isPublishedCmsItem)
    .map(mapReportItem)
    .filter((report) => Boolean(report.slug))
    .sort(
      (a, b) =>
        (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0),
    );
});

export const getReportBySlug = cache(async function getReportBySlug(
  slug: string,
): Promise<ReportDetail | null> {
  const reports = await getReportPosts();
  return reports.find((report) => report.slug === slug) ?? null;
});

function extractReportPdfUrl(fields: ReportFieldData): string | undefined {
  return normalizeWebflowAssetUrl(fields["report-pdf"]?.url);
}

/** Server-only: resolve PDF URL from CMS by slug (never expose via page props). */
export async function getReportPdfBySlug(
  slug: string,
): Promise<{ title: string; pdfUrl: string } | null> {
  const collectionId = env.webflow.reportCollectionId;
  const normalizedSlug = slug.trim();
  if (!collectionId || !normalizedSlug) return null;

  const items = await fetchAllCmsItems<ReportFieldData>(collectionId);
  const item = items.find(
    (entry) =>
      isPublishedCmsItem(entry) && (entry.fieldData.slug ?? entry.id) === normalizedSlug,
  );

  if (!item) return null;

  const pdfUrl = extractReportPdfUrl(item.fieldData);
  if (!pdfUrl) return null;

  return {
    title: item.fieldData.name?.trim() || "CoverForce Report",
    pdfUrl,
  };
}

export type BlogPageContent =
  | { type: "case-study"; study: CaseStudyDetail }
  | { type: "report"; report: ReportDetail }
  | { type: "blog"; post: BlogDetail };

export const getBlogPageBySlug = cache(async function getBlogPageBySlug(
  slug: string,
): Promise<BlogPageContent | null> {
  const [caseStudy, report, blogPost] = await Promise.all([
    getCaseStudyBySlug(slug),
    getReportBySlug(slug),
    getBlogPostBySlug(slug),
  ]);

  if (caseStudy) return { type: "case-study", study: caseStudy };
  if (report) return { type: "report", report };
  if (blogPost) return { type: "blog", post: blogPost };
  return null;
});

export function toCaseStudyListingPost(study: CaseStudyDetail): BlogPost {
  return {
    slug: study.slug,
    category: "Case Study",
    title: study.title,
    image: study.image,
    date: study.date,
    author: study.author,
    href: `/blog/${study.slug}`,
    publishedAt: study.publishedAt,
  };
}

export function toReportListingPost(report: ReportDetail): BlogPost {
  return {
    slug: report.slug,
    category: "News",
    title: report.title,
    image: report.image,
    date: report.date,
    author: report.author,
    href: `/blog/${report.slug}`,
    publishedAt: report.publishedAt,
  };
}

export const getBlogListingPosts = cache(async function getBlogListingPosts(): Promise<BlogPost[]> {
  const [blogPosts, caseStudies, reports] = await Promise.all([
    getBlogPosts(),
    getCaseStudyPosts(),
    getReportPosts(),
  ]);

  const merged = new Map<string, BlogPost>();
  for (const post of blogPosts.map(toListingPost)) {
    // Case studies come from the dedicated collection, not blog tags.
    if (post.category === "Case Study") continue;
    merged.set(post.slug, post);
  }
  for (const post of reports.map(toReportListingPost)) {
    merged.set(post.slug, post);
  }
  for (const post of caseStudies.map(toCaseStudyListingPost)) {
    merged.set(post.slug, post);
  }

  return Array.from(merged.values()).sort(
    (a, b) =>
      (Date.parse(b.publishedAt ?? b.date) || 0) -
      (Date.parse(a.publishedAt ?? a.date) || 0),
  );
});
