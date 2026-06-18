"use client";

import Image from "next/image";
import {
  RiArrowDownSLine,
  RiCodeSSlashLine,
  RiLineChartLine,
  RiUserFill,
} from "@remixicon/react";

const CARRIER_LOGOS = [
  { src: "/images/liverty.svg", alt: "Liberty Mutual" },
  { src: "/images/process/logo2.svg", alt: "Travelers" },
  { src: "/images/process/logo3.svg", alt: "The Hartford" },
  { src: "/images/chubb.svg", alt: "Chubb" },
  { src: "/images/Nationwide.svg", alt: "Nationwide" },
  { src: "/images/process/logo1.svg", alt: "AmTrust Financial" },
] as const;

const GROWTH_BARS = [
  { height: 38, solid: false },
  { height: 52, solid: false },
  { height: 68, solid: true },
  { height: 44, solid: false },
  { height: 82, solid: true },
  { height: 58, solid: false },
  { height: 72, solid: false },
] as const;

const CHART_MAX = 82;

export default function OperatingPlatformMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[300px] md:min-h-[340px]">
      <div className="absolute right-0 top-0 w-[94%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#5B35E0]">
              <RiCodeSSlashLine size={16} />
            </span>
            <p className="truncate font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
              Carrier Hub
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F3F0FF] px-2.5 py-1 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-xs">
            <RiUserFill size={11} />
            +35 more carriers
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] p-3 md:mt-5 md:p-3.5">
          <div className="grid grid-cols-3 gap-2 md:gap-2.5">
            {CARRIER_LOGOS.map((logo) => (
              <div
                key={logo.alt}
                className="flex aspect-[1.55/1] items-center justify-center rounded-lg border border-[#ECEEF2] bg-white px-2 py-3"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={96}
                  height={32}
                  className="h-5 w-auto max-w-full object-contain md:h-6"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-[84%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2.5 border-b border-[#F3F4F6] px-4 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#5B35E0]">
            <RiLineChartLine size={16} />
          </span>
          <p className="font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
            Carrier Growth
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 px-4 py-4 md:px-5 md:py-5">
          <div className="min-w-0 shrink-0">
            <p className="font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
              One submission
            </p>
            <p className="mt-1 font-heading text-[0.65rem] font-normal leading-snug text-[#6B7280] md:text-xs">
              One Workflow, 40+ carriers.
            </p>
          </div>

          <div className="relative flex shrink-0 items-end gap-1.5 border-b border-dashed border-[#D1D5DB] pb-0.5">
            <RiArrowDownSLine
              className="absolute -top-3 left-[38%] text-[#6DAB4E]"
              size={12}
              aria-hidden
            />
            {GROWTH_BARS.map((bar, index) => (
              <div
                key={index}
                className="flex w-[10px] items-end"
                style={{ height: `${CHART_MAX}px` }}
              >
                <div
                  className="w-full rounded-t-[3px]"
                  style={{
                    height: `${bar.height}px`,
                    background: bar.solid ? "#6DAB4E" : "rgba(109, 171, 78, 0.22)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
