"use client";

import MockWithCardHover from "@/components/common/MockWithCardHover";
import { PeriodicIncrementalStat } from "@/components/common/AnimatedPercent";
import { MICRO_EASE, MICRO_TAB_COLOR_MS } from "@/lib/motion";
import { RiArrowDownSLine, RiArrowUpLine } from "@remixicon/react";

const ROTATE_MS = 8000;
const CHART_TRACK_HEIGHT = 96;
const CHART_BAR_WIDTH = 12;

/** [purple base height, green cap height] per bar, in px */
const CHART_BARS_REST = [
  [18, 6],
  [26, 6],
  [28, 6],
  [37, 6],
  [32, 5],
  [44, 6],
  [52, 7],
  [48, 6],
  [63, 7],
  [74, 8],
] as const;

const CHART_BARS_HOVER = [
  [16, 6],
  [28, 6],
  [32, 6],
  [32, 5],
  [39, 5],
  [41, 6],
  [59, 7],
  [54, 6],
  [70, 8],
  [81, 8],
] as const;

const HEIGHT_TRANSITION = `height ${MICRO_TAB_COLOR_MS}ms ${MICRO_EASE}`;

const POLICY_ROWS = [
  { label: "General Liability", status: "Active" },
  { label: "Professional Liability", status: "Active" },
  { label: "Umbrella Liability", status: "Pending" },
  { label: "Workers Compensation", status: "Active" },
] as const;

const CARRIER_BADGES = [
  { label: "NE", className: "bg-[#0B1E4B]" },
  { label: "LM", className: "bg-[#123A6B]" },
  { label: "TR", className: "bg-[#1F6E43]" },
] as const;

type BrokerMockProps = {
  cardHovered?: boolean;
};

export default function BrokerMock({ cardHovered = false }: BrokerMockProps) {
  const chartBars = cardHovered ? CHART_BARS_HOVER : CHART_BARS_REST;

  return (
    <div className="relative mx-auto w-full max-md:mt-6 max-md:max-w-[280px] max-md:overflow-visible md:pointer-events-none md:max-w-[280px]">
      {/* Quotes returned today — chart + policy status */}
      <div className="relative z-10 ml-auto mt-16 w-[92%] translate-x-5 max-md:mt-12 max-md:translate-x-3 md:mt-20 md:translate-x-16 md:w-full">
        <div className="w-full overflow-hidden rounded-md bg-white shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
          <div className="flex items-start justify-between px-4 pt-3.5">
            <div>
              <p className="text-[9px] font-mono font-medium uppercase tracking-wide text-[#6B7280]">
                Quotes returned today
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-1 text-[#111827]">
                <PeriodicIncrementalStat
                  start={40}
                  step={1}
                  max={47}
                  intervalMs={ROTATE_MS}
                  suffix="+"
                  suffixClassName="text-lg font-sans font-semibold leading-none text-[#111827]"
                  className="text-lg font-sans font-semibold leading-none text-[#111827]"
                />
                <span className="text-lg font-sans font-semibold leading-none text-[#111827]">
                  carriers
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
              <span className="flex items-center gap-1 text-[9px] font-sans font-medium text-[#6B7280]">
                <span className="size-1.5 rounded-full bg-[#4CAF50]" />
                Open
              </span>
              <span className="flex items-center gap-1 text-[9px] font-sans font-medium text-[#6B7280]">
                <span className="size-1.5 rounded-full bg-[#5B35E0]" />
                Closed
              </span>
            </div>
          </div>

          <div className="px-4 pt-2">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-[#EAF6EA] px-2 py-0.5 text-[9px] font-sans font-semibold text-[#22C55E]">
              <RiArrowUpLine className="size-2.5" />
              28%
            </span>
          </div>

          <div
            className="flex items-end justify-between px-4 pt-2.5 pb-1.5"
            style={{ height: CHART_TRACK_HEIGHT }}
          >
            {chartBars.map(([base, cap], i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-end"
                style={{ width: CHART_BAR_WIDTH, height: CHART_TRACK_HEIGHT }}
              >
                <div
                  className="w-full rounded-t-[2px]"
                  style={{ height: `${cap}px`, background: "#4CAF50", transition: HEIGHT_TRANSITION }}
                />
                <div
                  className="w-full"
                  style={{ height: `${base}px`, background: "#5B35E0", transition: HEIGHT_TRANSITION }}
                />
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100" />

          {/* Policy Status — inside Quotes card, below graph */}
          <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
            <p className="text-[11px] font-heading font-semibold text-[#3C3B3B]">Policy Status</p>
            <span className="flex items-center gap-1 rounded-full border border-[#E5E7EB] px-2 py-0.5 text-[9px] font-medium text-[#6B7280]">
              Jul 2026
              <RiArrowDownSLine className="size-2.5" />
            </span>
          </div>
          <div className="divide-y divide-neutral-100 px-4 pb-3">
            {POLICY_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1">
                <span className="text-[10px] font-sans font-normal text-[#4B5563]">{row.label}</span>
                <span
                  className={`text-[10px] font-sans font-medium ${
                    row.status === "Active" ? "text-[#22C55E]" : "text-[#9CA3AF]"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* One API. 40+ Carriers. — overlaps lower-left of Quotes card */}
      <div className="relative z-20 -mt-18 w-[70%] max-md:-mt-20 max-md:w-[85%] md:-ml-6">
        <div className="w-full overflow-hidden rounded-md bg-white p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.16)]">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-heading font-semibold leading-snug text-[#111827]">
              One API. 40+ Carriers.
            </p>
            <span className="shrink-0 rounded-md bg-[#EEF2FF] px-2 py-1 text-[9px] font-sans font-semibold text-[#4683E5]">
              API
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            {CARRIER_BADGES.map((carrier) => (
              <span
                key={carrier.label}
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white shadow-sm ${carrier.className}`}
              >
                {carrier.label}
              </span>
            ))}
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[8px] font-bold text-[#4B5563]">
              35+
            </span>
          </div>

          <p className="mt-2.5 text-[10px] font-sans font-normal leading-tight text-[#6B7280]">
            Instant access to top-rated carriers
          </p>
        </div>
      </div>
    </div>
  );
}

export function BrokerMockWithCardHover() {
  return (
    <MockWithCardHover>
      {(cardHovered) => <BrokerMock cardHovered={cardHovered} />}
    </MockWithCardHover>
  );
}
