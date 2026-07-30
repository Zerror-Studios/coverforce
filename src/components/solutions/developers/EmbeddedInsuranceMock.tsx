"use client";

import {
  RiCarLine,
  RiCodeSSlashLine,
  RiFocus3Line,
  RiHomeSmileLine,
  RiNodeTree,
  RiShieldLine,
  RiSlackLine,
  RiStore2Line,
  RiTeamLine,
} from "@remixicon/react";

const SATELLITES = [
  {
    label: "HR",
    icon: RiTeamLine,
    top: "10%",
    left: "16%",
    bg: "#F3F0FF",
    color: "#5B35E0",
  },
  {
    label: "Fleet",
    icon: RiCarLine,
    top: "10%",
    left: "74%",
    bg: "#F3F0FF",
    color: "#5B35E0",
  },
  {
    label: "Property",
    icon: RiHomeSmileLine,
    top: "72%",
    left: "14%",
    bg: "#ECFDF3",
    color: "#6DAB4E",
  },
  {
    label: "POS",
    icon: RiStore2Line,
    top: "72%",
    left: "76%",
    bg: "#EFF6FF",
    color: "#4683E5",
  },
] as const;

const CONNECTIVITY_BADGES = [
  {
    title: "95%+",
    sub: "Extraction Accuracy",
    icon: RiFocus3Line,
    bg: "#F3F0FF",
    color: "#5B35E0",
  },
  {
    title: "Rest API",
    sub: "40+ Carriers",
    icon: RiCodeSSlashLine,
    bg: "#ECFDF3",
    color: "#7CB518",
  },
  {
    title: "Slack Support",
    sub: "Real humans. Real fast.",
    icon: RiSlackLine,
    bg: "#EFF6FF",
    color: "#4683E5",
  },
] as const;

function EmbeddedHubGraphic() {
  return (
    <div className="relative mx-auto mt-4 h-[156px] w-full max-w-[300px] md:mt-5 md:h-[168px]">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 300 168"
        fill="none"
        aria-hidden
      >
        <circle cx="150" cy="84" r="36" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="150" cy="84" r="54" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="150" cy="84" r="72" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
        <path
          d="M150 84 C120 52, 72 42, 54 28"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
        />
        <path
          d="M150 84 C180 52, 228 42, 246 28"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
        />
        <path
          d="M150 84 C118 112, 68 124, 52 140"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
        />
        <path
          d="M150 84 C182 112, 232 124, 248 140"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
        />
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#5B35E0] to-[#7C3AED] font-heading text-sm font-bold text-white shadow-[0_6px_20px_rgba(91,53,224,0.35)] md:size-16 md:text-base">
        API
      </div>

      {SATELLITES.map((node) => {
        const Icon = node.icon;

        return (
          <div
            key={node.label}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ top: node.top, left: node.left }}
          >
            <span
              className="flex size-9 items-center justify-center rounded-xl border border-[#EEF0F4] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:size-10"
            >
              <span
                className="flex size-6 items-center justify-center rounded-lg md:size-7"
                style={{ backgroundColor: node.bg, color: node.color }}
              >
                <Icon size={14} />
              </span>
            </span>
            <span className="font-heading text-[0.55rem] font-medium text-[#6B7280] md:text-[0.6rem]">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function EmbeddedInsuranceMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[340px] overflow-visible pb-6 md:min-h-[370px] md:pb-8">
      {/* Back card - top-left */}
      <div className="absolute left-0 top-0 z-0 w-[94%] rounded-2xl border border-[#E8EAEF] bg-white p-4 pb-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5 md:pb-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#9CA3AF]">
              <RiShieldLine size={16} />
            </span>
            <p className="truncate font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
              Embedded Insurance
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ECFDF3] px-2.5 py-1 font-heading text-[0.65rem] font-medium text-[#7CB518] md:text-xs">
            <span className="size-1.5 rounded-full bg-[#7CB518]" />
            Live
          </span>
        </div>

        <EmbeddedHubGraphic />
      </div>

      {/* Front card - bottom-right overlap */}
      <div className="absolute right-0 top-[8.5rem] z-10 w-[88%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:top-[9.25rem] md:w-[86%]">
        <div className="flex items-start justify-between gap-3 border-b border-[#F3F4F6] px-4 py-3 md:px-5">
          <p className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#5B35E0]">
              <RiNodeTree size={14} />
            </span>
            Carrier Connectivity
          </p>
          <span className="shrink-0 pt-0.5 font-heading text-[0.6rem] font-normal text-[#9CA3AF] md:text-xs">
            API, 40+ Carriers
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 px-3 py-4 md:gap-2.5 md:px-4 md:py-5">
          {CONNECTIVITY_BADGES.map((badge) => {
            const Icon = badge.icon;

            return (
              <div
                key={badge.title}
                className="rounded-xl px-2 py-2.5 md:px-2.5 md:py-3"
                style={{ backgroundColor: badge.bg }}
              >
                <Icon size={14} style={{ color: badge.color }} />
                <p
                  className="mt-2 font-heading text-[0.65rem] font-semibold leading-tight md:text-xs"
                  style={{ color: badge.color }}
                >
                  {badge.title}
                </p>
                <p className="mt-0.5 font-heading text-[0.5rem] font-normal leading-snug text-[#6B7280] md:text-[0.55rem]">
                  {badge.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
