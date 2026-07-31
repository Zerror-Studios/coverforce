import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set([
  "cdn.prod.website-files.com",
  "uploads-ssl.webflow.com",
  "images.unsplash.com",
]);

const MAX_WIDTH = 3840;
const FETCH_TIMEOUT_MS = 45_000;

type CacheEntry = { body: Buffer; createdAt: number };
const memoryCache = new Map<string, CacheEntry>();
const MEMORY_TTL_MS = 1000 * 60 * 60; // 1 hour

function decodeUntilStable(value: string): string {
  let decoded = value;
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
}

function normalizeUpstreamUrl(raw: string): string | null {
  try {
    const url = new URL(decodeUntilStable(raw));
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_HOSTS.has(url.hostname)) return null;
    // `.href` re-encodes path spaces once — safe for fetch.
    return url.href;
  } catch {
    return null;
  }
}

function getCached(key: string): Buffer | null {
  const hit = memoryCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.createdAt > MEMORY_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return hit.body;
}

function setCached(key: string, body: Buffer) {
  memoryCache.set(key, { body, createdAt: Date.now() });
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const upstreamHref = normalizeUpstreamUrl(rawUrl);
  if (!upstreamHref) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const width = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("w") || 640) || 640, 16),
    MAX_WIDTH
  );
  const quality = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("q") || 75) || 75, 1),
    100
  );

  const cacheKey = `${upstreamHref}|${width}|${quality}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Cms-Image-Cache": "HIT",
      },
    });
  }

  try {
    const upstreamResponse = await fetch(upstreamHref, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        "User-Agent": "CoverForceCmsImage/1.0",
      },
      cache: "force-cache",
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstreamResponse.status}` },
        { status: 502 }
      );
    }

    const input = Buffer.from(await upstreamResponse.arrayBuffer());
    const output = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    setCached(cacheKey, output);

    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Cms-Image-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("[cms-image]", upstreamHref, error);
    return NextResponse.json(
      { error: "Image optimization failed" },
      { status: 500 }
    );
  }
}
