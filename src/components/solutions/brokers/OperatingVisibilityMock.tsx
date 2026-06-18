"use client";

import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";

const PIPELINE_BARS = [
  { label: "Submitted", width: "88%", color: "#33259F", count: "684" },
  { label: "Quoted", width: "68%", color: "#4683E5" },
  { label: "Bound", width: "48%", color: "#8BA849" },
  { label: "Stalled", width: "28%", color: "#C4B5FD" },
] as const;

const AXIS_LABELS = ["0K", "2K", "3K", "5K", "8K"] as const;

function DonutChart() {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.0815;

  return (
    <div className="relative size-14 shrink-0 md:size-16">
      <svg className="size-full -rotate-90" viewBox="0 0 44 44" aria-hidden>
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#EEF0F4"
          strokeWidth="5"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#33259F"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circumference * progress} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-heading text-[0.5rem] font-medium text-[#33259F] md:text-[0.55rem]">
        8.15%
      </span>
    </div>
  );
}

export default function OperatingVisibilityMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[340px] md:min-h-[380px]">
      <div className="absolute right-0 top-0 w-[94%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
            Pipeline Overview
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-1 font-heading text-[0.65rem] font-medium text-[#33259F] md:text-xs"
          >
            Weekly
            <RiArrowDownSLine size={14} />
          </button>
        </div>

        <div className="mt-4 md:mt-5">
          <p className="font-heading text-[0.65rem] font-normal text-[#9CA3AF] md:text-xs">
            Premium Tracked
          </p>
          <p className="mt-0.5 font-heading text-2xl font-medium text-[#3C3B3B] md:text-3xl">
            $4.2M
          </p>
        </div>

        <div className="relative mt-5 md:mt-6">
          <div className="space-y-3">
            {PIPELINE_BARS.map((bar) => (
              <div key={bar.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
                <p className="font-heading text-[0.65rem] font-normal text-[#6B7280] md:text-xs">
                  {bar.label}
                </p>
                <div className="relative h-3">
                  <div className="h-full overflow-hidden rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: bar.width, backgroundColor: bar.color }}
                    />
                  </div>

                  {"count" in bar ? (
                    <>
                      <div className="absolute -top-9 left-[42%] z-10 rounded-md bg-[#1F2937] px-2 py-1 shadow-md">
                        <p className="whitespace-nowrap font-heading text-[0.55rem] font-medium text-white md:text-[0.6rem]">
                          $2,850,913
                        </p>
                        <p className="font-heading text-[0.5rem] font-normal text-white/80">
                          {bar.count}
                        </p>
                        <span className="absolute -bottom-1 left-4 size-2 rotate-45 bg-[#1F2937]" />
                      </div>
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 font-heading text-[0.55rem] font-medium text-[#3C3B3B] md:text-[0.6rem]">
                        {bar.count}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-[4.5rem_1fr] gap-3">
            <div />
            <div className="grid grid-cols-5 border-t border-[#EEF0F4] pt-2">
              {AXIS_LABELS.map((label) => (
                <p
                  key={label}
                  className="text-center font-heading text-[0.55rem] font-normal text-[#9CA3AF] md:text-[0.6rem]"
                >
                  {label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-10 w-[72%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]">
        <div className="flex items-start justify-between gap-3 px-4 py-4 md:px-5 md:py-5">
          <div>
            <p className="font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
              Submissions
            </p>
            <p className="mt-3 font-heading text-3xl font-medium leading-none text-[#3C3B3B] md:mt-4 md:text-4xl">
              248
            </p>
            <p className="mt-2 inline-flex items-center gap-1 font-heading text-[0.65rem] font-normal text-[#6B7280] md:text-xs">
              <RiArrowUpSLine className="text-[#4683E5]" size={14} />
              12% vs last week
            </p>
          </div>

          <DonutChart />
        </div>
      </div>
    </div>
  );
}
