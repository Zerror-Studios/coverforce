"use client";

import Image from "next/image";
import {
  RiArrowDownSLine,
  RiCodeSSlashLine,
  RiLineChartLine,
  RiUserFill,
} from "@remixicon/react";

const CARRIER_LOGOS = [
  { src: "/images/solutions/brokers/platform-logo-1.svg", alt: "AmTrust" },
  { src: "/images/solutions/brokers/platform-logo-2.svg", alt: "AccidentFund" },
  { src: "/images/solutions/brokers/platform-logo-3.svg", alt: "CompWest" },
  { src: "/images/solutions/brokers/platform-logo-4.svg", alt: "Chubb" },
  { src: "/images/solutions/brokers/platform-logo-5.svg", alt: "Coalition" },
  { src: "/images/solutions/brokers/platform-logo-6.svg", alt: "Cowbell" },
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

type OperatingPlatformMockProps = {
  variant?: "hero" | "section";
};

export default function OperatingPlatformMock({
  variant = "section",
}: OperatingPlatformMockProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "relative mx-auto flex w-full max-w-[480px] flex-col items-center gap-4 md:max-w-[520px] md:gap-5"
          : "relative mx-auto w-full max-w-[480px] min-h-[300px] md:max-w-[520px] md:min-h-[340px]"
      }
    >
      <div
        className={
          isHero
            ? "w-[90%] overflow-hidden rounded-2xl border border-[#F3F3F3] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5"
            : "absolute right-0 top-0 z-0 w-[90%] overflow-hidden rounded-2xl border border-[#F3F3F3] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5"
        }
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#5B35E0]">
              <RiCodeSSlashLine size={16} />
            </span>
            <p className="truncate font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
              Carrier Hub
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#EDE9FC] px-2.5 py-1 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-xs">
            <RiUserFill size={11} />
            +35 more carriers
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-[#EEF0F4] border-dashed p-3.5 md:mt-5 md:p-4">
          <div className="grid grid-cols-3 gap-2.5 md:gap-3">
            {CARRIER_LOGOS.map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white px-3 py-4 md:py-2"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={40}
                  className="h-7 w-auto max-w-full object-contain md:h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={
          isHero
            ? "-mr-[60%] w-[72%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
            : "absolute -bottom-10 -left-10 z-10 w-[72%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
        }
      >
        <div className="flex items-center gap-2.5 px-4 pt-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#5B35E0]">
            <RiLineChartLine size={16} />
          </span>
          <p className="font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            Carrier Growth
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 px-4 py-4 md:px-5 md:py-5">
          <div className="min-w-0 shrink-0">
            <p className="font-heading text-sm font-semibold text-[#3C3B3B] md:text-sm">
              One submission
            </p>
            <p className="mt-1 font-heading text-[0.65rem] font-normal leading-snug text-[#6B7280] md:text-xs">
              One Workflow, 60+ carrier products.
            </p>
          </div>

          <div className="relative flex shrink-0 items-end gap-1.5">
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
                    background: bar.solid ? "#72AF23" : "#EFF6E7",
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
