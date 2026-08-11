import type { Metadata } from "next";
import { siteConfig, siteRoutes, type SiteRoute } from "@/config/site";
import { absoluteUrl, normalizePath } from "@/utils/url";

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

function resolveMetadataImage(image = siteConfig.ogImage): string {
  // Keep absolute CDN/external URLs as-is; keep site assets as path-only
  // (Next resolves relative paths via metadataBase).
  if (/^https?:\/\//i.test(image)) return image;
  return image.startsWith("/") ? image : `/${image}`;
}

function buildOgImages(alt: string, image = siteConfig.ogImage) {
  const imageUrl = resolveMetadataImage(image);

  return {
    imageUrl,
    openGraphImages: [
      {
        url: imageUrl,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt,
      },
    ],
    twitterImages: [imageUrl],
  };
}

export function getPageSeo(path = "/"): SiteRoute {
  const normalizedPath = normalizePath(path);
  return (
    siteRoutes.find((route) => route.path === normalizedPath) ?? {
      path: normalizedPath,
      title: siteConfig.name,
      description: siteConfig.description,
      priority: 0.5,
      label: siteConfig.name,
    }
  );
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  keywords = siteConfig.keywords,
  type = "website",
  noIndex = false,
}: CreateMetadataOptions = {}): Metadata {
  const url = absoluteUrl(path);
  const pageTitle = title || siteConfig.name;
  const { imageUrl, openGraphImages, twitterImages } = buildOgImages(
    pageTitle,
    image,
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description,
    keywords,
    authors: [{ name: "CoverForce" }],
    creator: "CoverForce",
    publisher: "CoverForce",
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
      },
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      siteName: "CoverForce",
      title: pageTitle,
      description,
      url,
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: twitterImages,
    },
    icons: {
      icon: "/favicon/favicon.png",
      shortcut: "/favicon/favicon.png",
    },
    other: {
      image_src: imageUrl,
    },
  };
}

export function createRootMetadata(): Metadata {
  return {
    ...createMetadata(),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
  };
}

export function createPageMetadata(path: string): Metadata {
  const page = getPageSeo(path);
  const meta = createMetadata({
    description: page.description,
    path: page.path,
    image: siteConfig.ogImage,
  });
  const { openGraphImages, twitterImages } = buildOgImages(page.title);

  return {
    ...meta,
    title: { absolute: page.title },
    openGraph: {
      ...meta.openGraph,
      title: page.title,
      description: page.description,
      images: openGraphImages,
    },
    twitter: {
      ...meta.twitter,
      title: page.title,
      description: page.description,
      images: twitterImages,
    },
  };
}

export function createArticleMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
}: Required<Pick<CreateMetadataOptions, "title" | "description" | "path">> &
  Pick<CreateMetadataOptions, "image">): Metadata {
  const meta = createMetadata({
    description,
    path,
    image: image ?? siteConfig.ogImage,
    type: "article",
  });
  const { openGraphImages, twitterImages } = buildOgImages(
    title,
    image ?? siteConfig.ogImage,
  );

  return {
    ...meta,
    title: { absolute: title },
    openGraph: {
      ...meta.openGraph,
      title,
      description,
      type: "article",
      images: openGraphImages,
    },
    twitter: {
      ...meta.twitter,
      title,
      description,
      images: twitterImages,
    },
  };
}
