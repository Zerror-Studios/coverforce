"use client";

import Image from "next/image";
import {
  RiArrowDownSLine,
  RiArrowUpLine,
  RiGlobalLine,
  RiLayoutGridLine,
  RiSparkling2Line,
  type RemixiconComponentType,
} from "@remixicon/react";

type IconSourceRow = {
  name: string;
  count: string;
  icon: RemixiconComponentType;
  iconBg: string;
  iconColor: string;
};

type ExcelSourceRow = {
  name: string;
  count: string;
  excel: true;
};

type SourceRow = IconSourceRow | ExcelSourceRow;

const SOURCE_ROWS: SourceRow[] = [
  {
    name: "Clarion Door",
    count: "45+",
    icon: RiLayoutGridLine,
    iconBg: "#F3F0FF",
    iconColor: "#5B35E0",
  },
  {
    name: "Excel Sheet",
    count: "62+",
    excel: true,
  },
  {
    name: "Carrier Portal",
    count: "38+",
    icon: RiGlobalLine,
    iconBg: "#EFF6FF",
    iconColor: "#4683E5",
  },
];

const AVATARS = [
  "/images/avatar1.png",
  "/images/avatar2.png",
  "/images/network/logo (1).png",
  "/images/network/logo (2).png",
] as const;

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

function ConnectedBadge() {
  return (
    <span className="inline-flex shrink-0 rounded-full bg-[#ECFDF3] px-2 py-0.5 font-heading text-[0.55rem] font-medium text-[#7CB518] md:text-[0.6rem]">
      Connected
    </span>
  );
}

function AvatarStack() {
  return (
    <div className="flex -space-x-1.5">
      {AVATARS.map((src) => (
        <span
          key={src}
          className="relative size-5 overflow-hidden rounded-full border border-white md:size-6"
        >
          <Image src={src} alt="" fill className="object-cover" sizes="24px" />
        </span>
      ))}
    </div>
  );
}

function EndpointChart() {
  return (
    <div className="relative mt-2 h-[4.5rem] w-full overflow-hidden rounded-lg bg-gradient-to-b from-[#F3F0FF]/80 to-white md:h-20">
      <svg
        viewBox="0 0 160 64"
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="carrierEndpointFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B35E0" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#5B35E0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 42 C20 38, 28 48, 48 34 S88 18, 108 28 S136 12, 160 22 L160 64 L0 64 Z"
          fill="url(#carrierEndpointFill)"
        />
        <path
          d="M0 42 C20 38, 28 48, 48 34 S88 18, 108 28 S136 12, 160 22"
          fill="none"
          stroke="#5B35E0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="108" cy="28" r="4" fill="#5B35E0" />
        <circle cx="108" cy="28" r="7" fill="#5B35E0" fillOpacity="0.18" />
      </svg>
      <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 font-heading text-[0.45rem] text-[#D1D5DB] md:text-[0.5rem]">
        {WEEK_DAYS.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
    </div>
  );
}

export default function ConnectedSourcesMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[340px] overflow-visible pb-6 md:min-h-[370px] md:pb-8">
      {/* Back card — top-left */}
      <div className="absolute left-0 top-0 z-0 w-[94%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white p-4 pb-12 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5 md:pb-14">
        <div className="flex items-center justify-between gap-3">
          <p className="font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            Connected Sources
          </p>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-0.5 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-xs"
          >
            This Month
            <RiArrowDownSLine size={14} />
          </button>
        </div>

        <div className="mt-3 md:mt-4">
          {SOURCE_ROWS.map((row) => (
            <div
              key={row.name}
              className="flex items-center gap-2 border-b border-dashed border-[#E5E7EB] py-3 last:border-b-0 md:gap-3 md:py-3.5"
            >
              {"excel" in row ? (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF3] font-heading text-xs font-bold text-[#7CB518] md:size-9">
                  X
                </span>
              ) : (
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg md:size-9"
                  style={{
                    backgroundColor: row.iconBg,
                    color: row.iconColor,
                  }}
                >
                  <row.icon size={16} />
                </span>
              )}

              <span className="min-w-0 flex-1 truncate font-heading text-xs font-medium text-[#3C3B3B] md:text-sm">
                {row.name}
              </span>

              <span className="shrink-0 font-heading text-[0.65rem] font-semibold text-[#5B35E0] md:text-xs">
                {row.count}
              </span>

              <AvatarStack />
              <ConnectedBadge />
            </div>
          ))}
        </div>
      </div>

      {/* Front card — bottom-right overlap */}
      <div className="absolute right-0 top-[9.75rem] z-10 w-[72%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:top-[10.5rem] md:w-[70%]">
        <div className="px-4 pt-4 md:px-5 md:pt-5">
          <p className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            <RiSparkling2Line size={14} className="text-[#5B35E0]" />
            API Endpoint Summary
          </p>

          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3 md:mt-4">
            <div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ECFDF3] text-[#7CB518]">
                  <RiArrowUpLine size={12} />
                </span>
                <p className="font-heading text-[0.6rem] font-normal leading-relaxed text-[#9CA3AF] md:text-[0.65rem]">
                  Your bindrate is up 5.23% VS last month
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-heading text-2xl font-semibold leading-none text-[#5B35E0] md:text-[1.75rem]">
                24%
              </p>
              <p className="mt-1 font-heading text-[0.55rem] font-medium text-[#7CB518] md:text-[0.6rem]">
                ↑ 5.23 from last month
              </p>
            </div>
          </div>

          <EndpointChart />
        </div>

        <div className="h-3 md:h-4" />
      </div>
    </div>
  );
}
