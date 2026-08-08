import { NextRequest, NextResponse } from "next/server";

type GeoPayload = {
  city: string | null;
  country: string | null;
  countryCode: string | null;
};

const COUNTRY_SHORT: Record<string, string> = {
  US: "USA",
  GB: "UK",
  AE: "UAE",
};

function isPrivateIp(ip: string) {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

function clientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "";
}

function formatCountry(country: string | null, countryCode: string | null) {
  if (countryCode && COUNTRY_SHORT[countryCode]) return COUNTRY_SHORT[countryCode];
  if (country) return country;
  return countryCode;
}

function buildLocation(city: string | null, countryLabel: string | null) {
  if (city && countryLabel) return `${city}, ${countryLabel}`;
  return city || countryLabel || null;
}

async function reverseGeocode(lat: number, lon: number): Promise<GeoPayload> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "json");
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "CoverForceWebsite/1.0 (contact greeting; https://coverforce.com)",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return { city: null, country: null, countryCode: null };
  }

  const data = (await res.json()) as {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      municipality?: string;
      county?: string;
      state_district?: string;
      country?: string;
      country_code?: string;
    };
  };

  const address = data.address;
  if (!address) {
    return { city: null, country: null, countryCode: null };
  }

  const city =
    address.city?.trim() ||
    address.town?.trim() ||
    address.municipality?.trim() ||
    address.village?.trim() ||
    address.state_district?.trim() ||
    address.county?.trim() ||
    null;

  return {
    city,
    country: address.country?.trim() || null,
    countryCode: address.country_code?.trim().toUpperCase() || null,
  };
}

async function lookupIpCountry(ip: string): Promise<GeoPayload> {
  const url = ip && !isPrivateIp(ip) ? `https://ipwho.is/${encodeURIComponent(ip)}` : "https://ipwho.is/";
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    return { city: null, country: null, countryCode: null };
  }

  const data = (await res.json()) as {
    success?: boolean;
    country?: string;
    country_code?: string;
  };

  if (data.success === false) {
    return { city: null, country: null, countryCode: null };
  }

  // IP city data is often wrong (e.g. nearby ISP hubs). Prefer country only.
  return {
    city: null,
    country: data.country?.trim() || null,
    countryCode: data.country_code?.trim().toUpperCase() || null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const latParam = req.nextUrl.searchParams.get("lat");
    const lonParam = req.nextUrl.searchParams.get("lon");
    const lat = latParam != null ? Number(latParam) : NaN;
    const lon = lonParam != null ? Number(lonParam) : NaN;

    if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      const precise = await reverseGeocode(lat, lon);
      const countryLabel = formatCountry(precise.country, precise.countryCode);
      return NextResponse.json({
        city: precise.city,
        country: countryLabel,
        countryCode: precise.countryCode,
        location: buildLocation(precise.city, countryLabel),
        source: "device",
      });
    }

    const vercelCountry = req.headers.get("x-vercel-ip-country");
    let countryCode = vercelCountry?.toUpperCase() || null;
    let country: string | null = null;

    if (!countryCode) {
      const lookedUp = await lookupIpCountry(clientIp(req));
      country = lookedUp.country;
      countryCode = lookedUp.countryCode;
    }

    const countryLabel = formatCountry(country, countryCode);

    return NextResponse.json({
      city: null,
      country: countryLabel,
      countryCode,
      location: countryLabel,
      source: "ip",
    });
  } catch {
    return NextResponse.json(
      { city: null, country: null, countryCode: null, location: null, source: null },
      { status: 200 },
    );
  }
}
