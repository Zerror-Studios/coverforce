"use client";

import Image from "next/image";
import {
  RiArrowRightSLine,
  RiBuilding2Line,
  RiFileTextLine,
  RiMapPinLine,
  RiNodeTree,
  RiShieldCheckLine,
} from "@remixicon/react";

const MATCH_BADGES = [
  { label: "State checked", icon: RiMapPinLine, bg: "#F8F2FF", color: "#B87AFF" },
  { label: "NAICS verified", icon: RiBuilding2Line, bg: "#EFF6E7", color: "#72AF23" },
  { label: "E&S fallback", icon: RiShieldCheckLine, bg: "#E3EDFD", color: "#1B78FB" },
] as const;

const AVATARS = [
  "/images/avatar1.png",
  "/images/avatar2.png",
  "/images/avatar1.png",
] as const;

function AppetiteHubGraphic() {
  return (
    <div className="relative mx-auto mt-3 h-[148px] w-full max-w-[220px] md:mt-4 md:h-[186px] md:max-w-[260px]">
      <Image
        src="/images/solution/orbit.svg"
        alt=""
        fill
        className="object-contain"
        aria-hidden
      />
      <Image
        src="/images/solution/logo-network.svg"
        alt=""
        fill
        className="object-contain"
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/images/solution/ai-logo.svg"
          alt=""
          width={57}
          height={57}
          className="relative z-10 size-11 md:size-14"
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function AiAppetiteEngineMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[300px] overflow-visible pb-2 md:min-h-[330px] md:pb-4">
      {/* Back card — top-left */}
      <div className="absolute left-0 top-0 z-0 w-[78%] rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F0FF] text-[#5B35E0]">
              <RiNodeTree size={14} />
            </span>
            <p className="truncate font-heading text-sm font-semibold text-[#3C3B3B] md:text-sm">
              AI Appetite Engine
            </p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-0.5 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-xs"
          >
            See all
            <RiArrowRightSLine size={14} />
          </button>
        </div>

        <AppetiteHubGraphic />

        <div className="mt-2 md:mt-3">
          <p className="font-heading text-2xl font-semibold leading-tight text-[#3C3B3B] md:text-xs">
            8 Carriers Matched
          </p>
          <p className="mt-0.5 font-sans text-xs font-normal text-[#111827]/60 md:text-xs">
            Submission pre-qualified
          </p>
        </div>
      </div>

      {/* Front card — bottom-right overlap */}
      <div className="absolute -right-4 top-[9rem] z-10 w-[80%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:-right-8 md:top-[16rem] md:w-[80%]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#3C3B3B] md:text-sm">
            <span className="flex size-7 items-center justify-center text-[#5B35E0]">
              <RiFileTextLine size={14} />
            </span>
            Best Match
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="font-sans text-[0.65rem] font-normal text-[#111827]/60 md:text-xs">45+</span>
            <div className="flex -space-x-1">
              {AVATARS.map((src,idx) => (
                <span
                  key={idx}
                  className="relative size-6 overflow-hidden rounded-full border-2 border-white md:size-7"
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="28px" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 px-4 py-4 md:py-5">
          {MATCH_BADGES.map((badge) => {
            const Icon = badge.icon;

            return (
              <span
                key={badge.label}
                className="inline-flex items-center whitespace-nowrap gap-0.5  rounded-md px-3 py-3 font-heading text-[0.65rem] font-medium md:text-[0.65rem]"
                style={{ backgroundColor: badge.bg, color: badge.color }}
              >
                <Icon size={12} />
                {badge.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
