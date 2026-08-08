import { NextResponse } from "next/server";
import { env } from "@/config/env";
import {
  getCoverforceAccessToken,
} from "@/lib/coverforceApi";

type AppetiteStatus = "IN_APPETITE" | "NOT_IN_APPETITE" | "MAYBE_IN_APPETITE";

type AppetiteInfo = {
  carrier?: string | null;
  hasAppetite?: AppetiteStatus | string | null;
  naicsCode?: string | null;
  policyType?: string | null;
  state?: string | null;
};

type CheckAppetiteBody = {
  carriers?: unknown;
  policyType?: unknown;
  state?: unknown;
  naicsCode?: unknown;
};

const KNOWN_STATUSES = new Set([
  "IN_APPETITE",
  "MAYBE_IN_APPETITE",
  "NOT_IN_APPETITE",
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckAppetiteBody;

    const carriers = Array.isArray(body.carriers)
      ? body.carriers.map((id) => String(id ?? "").trim()).filter(Boolean)
      : [];
    const policyType = String(body.policyType ?? "").trim();
    const state = String(body.state ?? "").trim();
    const naicsCode = String(body.naicsCode ?? "").trim();

    if (!carriers.length || !policyType || !state || !naicsCode) {
      return NextResponse.json(
        { error: "carriers, policyType, state, and naicsCode are required" },
        { status: 400 }
      );
    }

    const baseUrl = env.coverforce.apiBaseUrl;
    const token = await getCoverforceAccessToken();

    const response = await fetch(`${baseUrl}/api/check-appetite`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carriers,
        policyType,
        state,
        naicsCode,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Check appetite request failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      appetiteInfos?: AppetiteInfo[];
    };

    const appetiteInfos = payload.appetiteInfos ?? [];

    const checkedCarriers = appetiteInfos
      .map((info) => {
        const id = String(info.carrier ?? "").trim();
        const status = String(info.hasAppetite ?? "").trim();
        if (!id || !KNOWN_STATUSES.has(status)) return null;
        return { id, status };
      })
      .filter(
        (item): item is { id: string; status: string } => item !== null
      );

    return NextResponse.json({
      appetiteInfos,
      checkedCarriers,
    });
  } catch (error) {
    console.error("[check-appetite]", error);
    return NextResponse.json(
      {
        checkedCarriers: [],
        error: "Failed to check appetite",
      },
      { status: 500 }
    );
  }
}
