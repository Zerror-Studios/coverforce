"use client";

import { RiFlagLine, RiInformationLine } from "@remixicon/react";

const CHART_BARS = [42, 58, 48, 36, 64, 52, 70] as const;
const Y_LABELS = ["600K", "400K", "300K", "200K"] as const;
const TIME_RANGES = ["7D", "30D", "90D"] as const;

function ApiRequestsChart() {
  return (
    <div className="relative mt-4 md:mt-5">
      <div className="absolute left-0 top-0 flex h-[9.5rem] flex-col justify-between py-1 font-heading text-[0.5rem] text-[#D1D5DB] md:h-40 md:text-[0.55rem]">
        {Y_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="ml-7 border-l border-b border-[#F3F4F6] pl-2 pr-1 pb-5 md:ml-8">
        <div className="relative flex h-[9.5rem] items-end justify-between gap-1.5 md:h-40 md:gap-2">
          {CHART_BARS.map((height, index) => (
            <div key={index} className="relative flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[#5B35E0] to-[#9B8AFB]"
                style={{ height: `${height}%` }}
              />
              {index === 3 ? (
                <div className="absolute -top-11 left-1/2 z-10 w-[5.5rem] -translate-x-1/2 rounded-lg border border-[#E8EAEF] bg-white px-2 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:-top-12 md:w-24">
                  <p className="font-heading text-[0.55rem] font-semibold text-[#3C3B3B] md:text-[0.6rem]">
                    June 04
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 font-heading text-[0.5rem] text-[#6B7280] md:text-[0.55rem]">
                    <span className="size-1 rounded-full bg-[#5B35E0]" />
                    24 Submissions
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-end gap-6 pr-1 font-heading text-[0.5rem] text-[#D1D5DB] md:text-[0.55rem]">
          <span>Jun 05</span>
          <span>Jun 06</span>
        </div>
      </div>
    </div>
  );
}

export default function AiApiRequestsMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[340px] overflow-visible pb-4 md:min-h-[370px] md:pb-6">
      {/* Back card - top-right */}
      <div className="absolute right-0 top-0 z-0 w-[94%] rounded-2xl border border-[#E8EAEF] bg-white p-4 pb-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5 md:pb-12">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
            API Requests Over time
            <RiInformationLine size={14} className="text-[#D1D5DB]" />
          </p>
          <div className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#F9FAFB] p-0.5">
            {TIME_RANGES.map((range) => (
              <span
                key={range}
                className={`rounded-md px-2 py-0.5 font-heading text-[0.55rem] font-medium md:text-[0.6rem] ${
                  range === "7D" ? "bg-white text-[#5B35E0] shadow-sm" : "text-[#9CA3AF]"
                }`}
              >
                {range}
              </span>
            ))}
          </div>
        </div>

        <ApiRequestsChart />
      </div>

      {/* Front card - bottom-left overlap */}
      <div className="absolute left-0 top-[9.5rem] z-10 w-[86%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:top-[10.25rem] md:w-[84%]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
          <p className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#5B35E0]">
              <RiFlagLine size={14} />
            </span>
            Professional Plan
          </p>
          <button
            type="button"
            className="rounded-md border border-[#D1FAE5] px-2.5 py-1 font-heading text-[0.65rem] font-medium text-[#7CB518] md:text-xs"
          >
            Manage
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 md:px-5">
          <p className="font-heading text-[0.6rem] font-normal text-[#9CA3AF] md:text-xs">
            API Requests this month
          </p>
          <p className="font-heading text-[0.6rem] font-normal text-[#9CA3AF] md:text-xs">
            Resets on Jun 1, 2026
          </p>
        </div>

        <div className="px-4 py-4 md:px-5 md:py-5">
          <div className="flex h-9 overflow-hidden rounded-full md:h-10">
            <div className="relative flex w-[60%] items-center justify-center bg-gradient-to-r from-[#5B35E0] to-[#7C3AED]">
              <span className="font-heading text-[0.65rem] font-semibold text-white md:text-xs">
                Progress 60%
              </span>
            </div>
            <div
              className="w-[40%] bg-[#F9FAFB]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #E5E7EB 0, #E5E7EB 1px, transparent 1px, transparent 6px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
