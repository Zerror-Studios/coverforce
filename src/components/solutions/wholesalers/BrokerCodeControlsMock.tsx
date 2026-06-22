"use client";

import Image from "next/image";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
  RiCodeSSlashLine,
  RiFileCopyLine,
  RiGlobalLine,
  RiGitBranchLine,
  RiLink,
  RiShieldCheckLine,
} from "@remixicon/react";

const BROKER_ROWS = [
  {
    name: "Nationwide",
    delegated: "Delegated to ABC Insurance Group",
    logo: "/images/solution/nationwide.svg",
    logoBg: "#F3F0FF",
  },
  {
    name: "Liberty Mutual",
    delegated: "Delegated to Johnson & Co.",
    logo: "/images/solution/liberty.svg",
    logoBg: "#ECFDF3",
  },
  {
    name: "Travelers",
    delegated: "Delegated to Smith Agency",
    logo: "/images/solution/travelers.svg",
    logoBg: "#FEF2F2",
  },
] as const;

const DELEGATION_ITEMS = [
  {
    title: "Delegate a network/agency",
    subtitle: "Granular control at every level",
    icon: RiGitBranchLine,
    bg: "#F3F0FF",
    color: "#5B35E0",
  },
  {
    title: "Carrier access & BOR controls",
    subtitle: "Secure access with BOR protection",
    icon: RiShieldCheckLine,
    bg: "#ECFDF3",
    color: "#6DAB4E",
  },
  {
    title: "One login, all carriers",
    subtitle: "Single sign-on across your carrier network",
    icon: RiGlobalLine,
    bg: "#F3F0FF",
    color: "#5B35E0",
  },
] as const;

function ControlDelegationCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-[#E5E7EB] px-4 py-4">
        <p className="font-heading text-sm font-semibold text-[#3C3B3B] md:text-xs">
          Control & delegation
        </p>
        <span className="inline-flex shrink-0 items-center gap-1 font-heading text-xs font-semibold text-[#5B35E0] md:text-xs">
          <RiCodeSSlashLine size={14} />
          200+
        </span>
      </div>

      <div className="px-3 py-1 md:px-4">
        {DELEGATION_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-start gap-3 py-3 md:py-2">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full md:size-8"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <Icon size={14} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-heading text-xs font-medium text-[#3C3B3B] md:text-xs">
                  {item.title}
                </p>
                <p className="mt-0.5 font-heading text-[0.6rem] font-normal text-[#9CA3AF] md:text-[0.6rem]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type BrokerCodeControlsMockProps = {
  showDelegationCard?: boolean;
};

export default function BrokerCodeControlsMock({
  showDelegationCard = false,
}: BrokerCodeControlsMockProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[440px] ${
        showDelegationCard
          ? "min-h-[360px] overflow-visible pb-6 md:min-h-[380px] md:pb-8"
          : ""
      }`}
    >
      {/* Broker card — back layer */}
      <div className="relative z-0 w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white px-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 border-b border-dashed border-[#000000]/10 py-4">
          <p className="font-heading text-lg font-semibold text-[#3C3B3B] md:text-base">
            Broker Code Controls
          </p>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#EFF6E7] px-3 py-1.5 font-heading text-[0.65rem] font-medium text-[#6DAB4E] md:text-xs"
          >
            <span className="flex size-3 items-center justify-center rounded-full bg-[#72AF23] text-white">
              <RiCheckLine size={10} />
            </span>
            Manage
          </button>
        </div>

        <div>
          {BROKER_ROWS.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 py-3.5 md:py-2"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full md:size-10">
                <Image
                  src={row.logo}
                  alt={row.name}
                  width={48}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </span>

              <div className="min-w-0">
                <p className="truncate font-sans text-xs font-medium text-[#111827] md:text-xs">
                  {row.name}
                </p>
                <p className="truncate font-sans text-[0.6rem] font-normal text-[#70747D] md:text-[0.65rem]">
                  {row.delegated}
                </p>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-0.5 font-heading text-[0.6rem] font-normal text-[#70747D] md:text-xs"
              >
                Agency access
                <RiArrowDownSLine size={14} className="text-[#33259F]" />
              </button>

              <button
                type="button"
                aria-label={`Remove ${row.name}`}
                className="flex size-3 shrink-0 items-center justify-center rounded-full bg-[#F92020] text-white"
              >
                <RiCloseLine size={10} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-dashed border-[#000000]/10 py-2 pb-5 md:gap-3 md:pb-6">
          <div className="flex min-w-0 w-fit items-center gap-2 rounded-sm bg-[#FAFBFC] px-3 py-2">
            <RiLink className="shrink-0 text-[#9CA3AF]" size={14} />
            <p className="truncate font-heading text-[0.4rem] font-normal text-[#9CA3AF] md:text-xs">
              brainwave.co/broker-access/k373nH
            </p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-[#ECE8FC] px-3 py-1.5 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-[0.6rem]"
          >
            <RiFileCopyLine size={10} />
            Copy link
          </button>
        </div>
      </div>

      {showDelegationCard ? (
        <div className="absolute -right-4 -bottom-10 z-10 w-[78%] md:-right-6 md:w-[65%]">
          <ControlDelegationCard />
        </div>
      ) : null}
    </div>
  );
}
