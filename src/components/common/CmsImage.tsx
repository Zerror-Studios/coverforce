"use client";

import Image, {
  type ImageLoaderProps,
  type ImageProps,
} from "next/image";

type CmsImageProps = Omit<ImageProps, "src" | "loader"> & {
  src: string;
};

function decodeCmsSrc(src: string): string {
  let decoded = src;
  for (let i = 0; i < 5; i += 1) {
    try {
      const next = decodeURI(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

/**
 * Bypass Next `/_next/image` (7s hard timeout on large Webflow files).
 * Our `/api/cms-image` route resizes to WebP with a longer fetch window.
 */
function bucketWidth(width: number): number {
  const buckets = [384, 640, 828, 1080, 1280, 1920];
  return buckets.find((bucket) => bucket >= width) ?? buckets[buckets.length - 1]!;
}

function cmsImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const w = bucketWidth(width);
  return `/api/cms-image?url=${encodeURIComponent(decodeCmsSrc(src))}&w=${w}&q=${quality ?? 75}`;
}

export default function CmsImage({ src, alt, ...props }: CmsImageProps) {
  const isRemote = /^https?:\/\//i.test(src);

  return (
    <Image
      src={isRemote ? decodeCmsSrc(src) : src}
      alt={alt}
      loader={isRemote ? cmsImageLoader : undefined}
      {...props}
    />
  );
}
