import { NextResponse } from "next/server";
import {
  coverforceCacheControlHeader,
  getCachedValue,
  getCoverforceAccessToken,
  getCoverforceApiBaseUrl,
  setCachedValue,
  COVERFORCE_REFERENCE_CACHE_SECONDS,
} from "@/lib/coverforceApi";

type CoverforceIndustryItem = {
  naicsCode?: string | number | null;
  description?: string | null;
  naics_code?: string | number | null;
  naics?: string | number | null;
  code?: string | number | null;
  industryCode?: string | number | null;
  industry_code?: string | number | null;
  title?: string | null;
  label?: string | null;
  name?: string | null;
};

type IndustryOption = {
  value: string;
  label: string;
};

type IndustryCache = {
  industries: IndustryOption[];
};

let industryCodesCache: ReturnType<typeof setCachedValue<IndustryCache>> | null =
  null;

function toLabel(item: CoverforceIndustryItem): string | null {
  const code = String(
    item.naicsCode ??
      item.naics_code ??
      item.naics ??
      item.code ??
      item.industryCode ??
      item.industry_code ??
      ""
  ).trim();
  const description = String(
    item.description ?? item.title ?? item.label ?? item.name ?? ""
  ).trim();
  if (!code || !description) return null;
  return `${code} - ${description}`;
}

function toValue(item: CoverforceIndustryItem): string {
  return String(
    item.naicsCode ??
      item.naics_code ??
      item.naics ??
      item.code ??
      item.industryCode ??
      item.industry_code ??
      ""
  ).trim();
}

function getIndustryDescription(label: string): string {
  const parts = label.split(" - ");
  return (parts[1] ?? label).trim();
}

function findIndustryArray(value: unknown): CoverforceIndustryItem[] {
  if (Array.isArray(value)) {
    return value as CoverforceIndustryItem[];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  for (const nested of Object.values(value)) {
    const match = findIndustryArray(nested);
    if (match.length) return match;
  }

  return [];
}

async function fetchIndustryCodes(): Promise<IndustryOption[]> {
  const baseUrl = getCoverforceApiBaseUrl();
  const token = await getCoverforceAccessToken();

  const response = await fetch(`${baseUrl}/api/get-industry-codes`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Industry code request failed: ${response.status}`);
  }

  const payload = await response.json();
  const rawItems = findIndustryArray(payload);

  return rawItems
    .map((item: CoverforceIndustryItem) => {
      const label = toLabel(item);
      const value = toValue(item);
      if (!label || !value) return null;
      return { value, label } satisfies IndustryOption;
    })
    .filter((item): item is IndustryOption => Boolean(item))
    .sort((a, b) =>
      getIndustryDescription(a.label).localeCompare(
        getIndustryDescription(b.label)
      )
    );
}

export async function GET() {
  try {
    const cached = getCachedValue(industryCodesCache);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": coverforceCacheControlHeader(),
          "X-Cache": "HIT",
        },
      });
    }

    const industries = await fetchIndustryCodes();
    const payload = { industries };
    industryCodesCache = setCachedValue(
      payload,
      COVERFORCE_REFERENCE_CACHE_SECONDS
    );

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": coverforceCacheControlHeader(),
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("[industry-codes]", error);
    return NextResponse.json(
      { industries: [], error: "Failed to load industry codes" },
      { status: 500 }
    );
  }
}
