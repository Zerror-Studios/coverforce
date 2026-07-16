"use client";

import Image from "next/image";
import {
  RiArrowDownSLine,
  RiGlobalLine,
  RiLayoutGridLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import ApiEndpointSummaryMock from "@/components/solutions/carrier/ApiEndpointSummaryMock";

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
  "/images/avatar1.png",
] as const;

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
      {AVATARS.map((src,idx) => (
        <span
          key={idx}
          className="relative size-5 overflow-hidden rounded-full border border-white md:size-6"
        >
          <Image src={src} alt="avatar" fill className="object-cover" sizes="24px" />
        </span>
      ))}
    </div>
  );
}

export default function ConnectedSourcesMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[340px] overflow-visible pb-6 md:min-h-[370px] md:pb-8">
      {/* Back card — top-left */}
      <div className="absolute left-0 top-0 z-0 w-[94%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5">
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
      <div className="absolute -right-4 top-[9.75rem] z-10 w-[72%] md:top-[13rem] md:w-[90%]">
        <ApiEndpointSummaryMock />
      </div>
    </div>
  );
}
