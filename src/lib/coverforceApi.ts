const COVERFORCE_API_BASE_URL_ENV = "COVERFORCE_API_BASE_URL";
const COVERFORCE_API_CLIENT_ID_ENV = "COVERFORCE_API_CLIENT_ID";
const COVERFORCE_API_CLIENT_SECRET_ENV = "COVERFORCE_API_CLIENT_SECRET";

/** Shared TTL for rarely changing CoverForce reference data. */
export const COVERFORCE_REFERENCE_CACHE_SECONDS = 60 * 60 * 6; // 6 hours

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

let accessTokenCache: CacheEntry<string> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getCoverforceApiBaseUrl(): string {
  return requireEnv(COVERFORCE_API_BASE_URL_ENV);
}

export function getCachedValue<T>(
  cache: CacheEntry<T> | null
): T | null {
  if (!cache) return null;
  if (Date.now() >= cache.expiresAt) return null;
  return cache.value;
}

export function setCachedValue<T>(
  value: T,
  ttlSeconds = COVERFORCE_REFERENCE_CACHE_SECONDS
): CacheEntry<T> {
  return {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };
}

export function coverforceCacheControlHeader(
  maxAgeSeconds = COVERFORCE_REFERENCE_CACHE_SECONDS
) {
  return `public, s-maxage=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 2}`;
}

export async function getCoverforceAccessToken() {
  const cached = getCachedValue(accessTokenCache);
  if (cached) return cached;

  const baseUrl = getCoverforceApiBaseUrl();
  const clientId = requireEnv(COVERFORCE_API_CLIENT_ID_ENV);
  const clientSecret = requireEnv(COVERFORCE_API_CLIENT_SECRET_ENV);
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/auth`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }).toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!payload.access_token) {
    throw new Error("Token response missing access_token");
  }

  const expiresIn = Number(payload.expires_in);
  const ttlSeconds =
    Number.isFinite(expiresIn) && expiresIn > 60
      ? Math.max(30, expiresIn - 60)
      : 50 * 60;

  accessTokenCache = setCachedValue(payload.access_token, ttlSeconds);
  return payload.access_token;
}
