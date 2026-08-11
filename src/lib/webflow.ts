import type { BlogCategory, BlogPost } from "@/data/blogPosts";
import { env } from "@/config/env";

const WEBFLOW_API = "https://api.webflow.com/v2";
const REVALIDATE_SECONDS = 3600;

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
};

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

async function webflowFetch<T>(path: string): Promise<T> {
  const token = env.webflow.token;
  const response = await fetch(`${WEBFLOW_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

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
    .replace(/&ldquo;|&rdquo;|"/g, '"')
    .replace(/&lsquo;|&rsquo;|'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
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
  };
}

export async function getBlogPosts(): Promise<BlogDetail[]> {
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
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogDetail | null> {
  const collectionId = env.webflow.blogCollectionId;
  const encoded = encodeURIComponent(slug);
  const [page, authors, tags] = await Promise.all([
    webflowFetch<{ items?: WebflowItem<BlogFieldData>[] }>(
      `/collections/${collectionId}/items/live?limit=1&slug=${encoded}`
    ),
    getAuthorsById(),
    getTagsById(),
  ]);

  const item = page.items?.[0];
  if (!item) return null;
  return mapBlogItem(item, authors, tags);
}

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
  };
}
