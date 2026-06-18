"use client";

import {
  RiArrowRightSLine,
  RiAwardLine,
  RiCheckLine,
  RiCloseLine,
  RiFileTextLine,
  RiFocus3Line,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
} from "@remixicon/react";

const CARRIER_MATCHES = [
  {
    name: "Travelers",
    badge: "Best overall match",
    badgeBg: "#F3F0FF",
    badgeColor: "#5B35E0",
    barColor: "#5B35E0",
  },
  {
    name: "Chubb",
    badge: "Strong match",
    badgeBg: "#ECFDF3",
    badgeColor: "#6DAB4E",
    barColor: "#6DAB4E",
  },
  {
    name: "Liberty Mutual",
    badge: "Strong match",
    badgeBg: "#EFF6FF",
    badgeColor: "#4683E5",
    barColor: "#4683E5",
  },
] as const;

const AUTOMATION_STEPS = [
  { label: "Intake", icon: RiFileTextLine, bg: "#F3F0FF", color: "#5B35E0" },
  { label: "Match", icon: RiFocus3Line, bg: "#ECFDF3", color: "#6DAB4E" },
  { label: "Quote", icon: RiMoneyDollarCircleLine, bg: "#EDE9FE", color: "#7C3AED" },
  { label: "Bind", icon: RiShieldCheckLine, bg: "#EFF6FF", color: "#4683E5" },
  { label: "COI", icon: RiAwardLine, bg: "#FEF2F2", color: "#EF4444" },
] as const;

function MatchStatus({
  ok,
  label,
}: {
  ok: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-heading text-[0.55rem] font-normal md:text-[0.6rem] ${
        ok ? "text-[#6DAB4E]" : "text-[#EF4444]"
      }`}
    >
      {ok ? <RiCheckLine size={10} /> : <RiCloseLine size={10} />}
      {label}
    </span>
  );
}

export default function OperatingAiMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[320px] md:min-h-[360px]">
      <div className="absolute right-0 top-0 w-[94%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
            Top Carrier Matches
          </p>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 font-heading text-[0.65rem] font-medium text-[#6DAB4E] md:text-xs"
          >
            <RiCheckLine size={12} />
            Generate
          </button>
        </div>

        <div className="mt-4 divide-y divide-[#F3F4F6] md:mt-5">
          {CARRIER_MATCHES.map((carrier) => (
            <div
              key={carrier.name}
              className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="font-heading text-xs font-medium text-[#3C3B3B] md:text-sm">
                  {carrier.name}
                </p>
                <span
                  className="mt-1 inline-block rounded-full px-2 py-0.5 font-heading text-[0.55rem] font-medium md:text-[0.6rem]"
                  style={{
                    backgroundColor: carrier.badgeBg,
                    color: carrier.badgeColor,
                  }}
                >
                  {carrier.badge}
                </span>
              </div>

              <div className="min-w-0 pt-0.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F4]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: "62%", backgroundColor: carrier.barColor }}
                  />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                  <MatchStatus ok label="Appetite Fit" />
                  <MatchStatus ok={false} label="Loss History" />
                </div>
              </div>

              <p className="whitespace-nowrap pt-0.5 font-heading text-xs font-medium text-[#3C3B3B] md:text-sm">
                98% Match
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-[88%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#F3F4F6] px-4 py-3">
          <p className="font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
            End-to-end Automation
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-xs"
          >
            See all
            <RiArrowRightSLine size={14} />
          </button>
        </div>

        <div className="flex items-start justify-between px-3 py-4 md:px-4 md:py-5">
          {AUTOMATION_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.label} className="flex min-w-0 flex-1 items-start">
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl md:size-10"
                    style={{ backgroundColor: step.bg, color: step.color }}
                  >
                    <Icon size={16} />
                  </span>
                  <p className="mt-1.5 text-center font-heading text-[0.55rem] font-normal text-[#6B7280] md:text-[0.6rem]">
                    {step.label}
                  </p>
                </div>

                {index < AUTOMATION_STEPS.length - 1 ? (
                  <span
                    className="mx-0.5 mt-3 shrink-0 text-[#D1D5DB] md:mx-1"
                    aria-hidden
                  >
                    <svg width="14" height="6" viewBox="0 0 14 6" fill="none">
                      <path
                        d="M0 3h10M10 3l-2.5-2M10 3l-2.5 2"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="2 2"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
