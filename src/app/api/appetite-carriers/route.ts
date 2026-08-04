import { NextResponse } from "next/server";
import {
  COVERFORCE_REFERENCE_CACHE_SECONDS,
  coverforceCacheControlHeader,
  getCachedValue,
  getCoverforceAccessToken,
  getCoverforceApiBaseUrl,
  setCachedValue,
} from "@/lib/coverforceApi";

type CoverforceCarrier = {
  id?: string | null;
  displayName?: string | null;
  shortName?: string | null;
  amBestRating?: string | null;
  logoUrl?: string | null;
};

type AppetiteCarrier = {
  id: string;
  name: string;
  logo?: string;
  badge?: "E&S";
};

type CarriersCache = {
  carriers: AppetiteCarrier[];
};

let carriersCache: ReturnType<typeof setCachedValue<CarriersCache>> | null =
  null;

async function fetchCarriers(): Promise<AppetiteCarrier[]> {
  const baseUrl = getCoverforceApiBaseUrl();
  const token = await getCoverforceAccessToken();

  const response = await fetch(`${baseUrl}/api/get-carriers`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Carrier request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    carriers?: CoverforceCarrier[];
  };

  return (payload.carriers ?? [])
    .map((carrier) => {
      const id = String(carrier.id ?? "").trim();
      const name = String(
        carrier.shortName ?? carrier.displayName ?? ""
      ).trim();
      const logo = String(carrier.logoUrl ?? "").trim();
      if (!id || !name) return null;

      const mappedCarrier: AppetiteCarrier = {
        id,
        name,
        logo: logo || undefined,
        badge: /surplus|excess|e&s/i.test(name) ? "E&S" : undefined,
      };

      return mappedCarrier;
    })
    .filter((carrier): carrier is AppetiteCarrier => carrier !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function GET() {
  try {
    const cached = getCachedValue(carriersCache);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": coverforceCacheControlHeader(),
          "X-Cache": "HIT",
        },
      });
    }

    const carriers = await fetchCarriers();
    const payload = { carriers };
    carriersCache = setCachedValue(payload, COVERFORCE_REFERENCE_CACHE_SECONDS);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": coverforceCacheControlHeader(),
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("[appetite-carriers]", error);
    return NextResponse.json(
      { carriers: [], error: "Failed to load carriers" },
      { status: 500 }
    );
  }
}
