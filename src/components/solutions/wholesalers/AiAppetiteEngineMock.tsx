"use client";

import Image from "next/image";
import { RiArrowRightSLine, RiNodeTree } from "@remixicon/react";

function AppetiteHubGraphic() {
  return (
    <div className="relative mx-auto mt-3 h-[148px] w-full max-w-[220px] md:mt-4 md:h-[186px] md:max-w-[260px]">
      <Image
        src="/images/solution/orbit.svg"
        alt="orbit"
        fill
        className="object-contain"
        aria-hidden
      />
      <Image
        src="/images/solution/logo-network.svg"
        alt="logo-network"
        fill
        className="object-contain"
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/images/solution/ai-logo.svg"
          alt="ai-logo"
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
    <div className="relative mx-auto w-full max-w-[300px] overflow-visible sm:max-w-[320px]">
      <div className="rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5">
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
    </div>
  );
}
