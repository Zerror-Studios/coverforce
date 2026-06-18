"use client";

import Image from "next/image";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiLink,
} from "@remixicon/react";

const BROKER_ROWS = [
  {
    name: "Nationwide",
    delegated: "Delegated to ABC Insurance Group",
    logo: "/images/Nationwide.svg",
    logoBg: "#F3F0FF",
  },
  {
    name: "Liberty Mutual",
    delegated: "Delegated to Westwood Insurance",
    logo: "/images/liverty.svg",
    logoBg: "#ECFDF3",
  },
  {
    name: "Travelers",
    delegated: "Delegated to Anchor Insurance",
    logo: "/images/process/logo2.svg",
    logoBg: "#FEF2F2",
  },
] as const;

export default function BrokerCodeControlsMock() {
  return (
    <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-[#E5E7EB] px-4 py-4 md:px-5">
        <p className="font-heading text-sm font-medium text-[#3C3B3B] md:text-base">
          Broker Code Controls
        </p>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ECFDF3] px-3 py-1.5 font-heading text-[0.65rem] font-medium text-[#6DAB4E] md:text-xs"
        >
          <span className="flex size-4 items-center justify-center rounded-full bg-[#6DAB4E] text-white">
            <RiCheckLine size={10} />
          </span>
          Manage
        </button>
      </div>

      <div className="divide-y divide-dashed divide-[#E5E7EB]">
        {BROKER_ROWS.map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3.5 md:px-5 md:py-4"
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full md:size-11"
              style={{ backgroundColor: row.logoBg }}
            >
              <Image
                src={row.logo}
                alt={row.name}
                width={48}
                height={24}
                className="h-4 w-auto max-w-[2.25rem] object-contain md:h-5"
              />
            </span>

            <div className="min-w-0">
              <p className="truncate font-heading text-xs font-medium text-[#3C3B3B] md:text-sm">
                {row.name}
              </p>
              <p className="truncate font-heading text-[0.6rem] font-normal text-[#9CA3AF] md:text-[0.65rem]">
                {row.delegated}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-0.5 font-heading text-[0.6rem] font-normal text-[#6B7280] md:text-xs"
            >
              Agency access
              <RiArrowDownSLine size={14} className="text-[#33259F]" />
            </button>

            <button
              type="button"
              aria-label={`Remove ${row.name}`}
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EF4444] text-white"
            >
              <RiCloseLine size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-dashed border-[#E5E7EB] px-4 py-4 md:gap-3 md:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#FAFBFC] px-3 py-2">
          <RiLink className="shrink-0 text-[#9CA3AF]" size={14} />
          <p className="truncate font-heading text-[0.6rem] font-normal text-[#9CA3AF] md:text-xs">
            brainwave.co/broker-access/k373nH
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-2 font-heading text-[0.65rem] font-medium text-[#33259F] md:text-xs"
        >
          <RiFileCopyLine size={14} />
          Copy link
        </button>
      </div>
    </div>
  );
}
