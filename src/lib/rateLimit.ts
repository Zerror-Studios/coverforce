type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

const buckets = new Map<string, number[]>();

export function isRateLimited(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const timestamps = (buckets.get(key) ?? []).filter((time) => time > windowStart);

  if (timestamps.length >= options.maxRequests) {
    buckets.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return false;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
