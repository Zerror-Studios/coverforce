"use client";

import {
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseLine,
  RiGlobalLine,
  RiRefreshLine,
} from "@remixicon/react";

const SYSTEM_EVENTS = [
  {
    title: "SOC 2 Audit Verified",
    subtitle: "Annual review cycle complete",
    progress: 60,
    time: "2h ago",
    icon: RiCheckLine,
    bg: "#F3F0FF",
    color: "#5B35E0",
    bar: "#5B35E0",
  },
  {
    title: "PDB Batch Processing",
    subtitle: "1.2k licenses synchronized",
    progress: 29,
    time: "",
    icon: RiRefreshLine,
    bg: "#ECFDF3",
    color: "#7CB518",
    bar: "#7CB518",
  },
  {
    title: "License Expiry Warning",
    subtitle: "Carrier #492 (TX, FL)",
    progress: 85,
    time: "",
    icon: RiCloseLine,
    bg: "#FEF2F2",
    color: "#EF4444",
    bar: "#EF4444",
  },
] as const;

const SECURITY_ITEMS = [
  {
    title: "Data Encryption",
    subtitle: "AES-256 PROTOCOL",
    progress: 25,
    color: "#5B35E0",
  },
  {
    title: "Identity Core",
    subtitle: "MFA + OKTA INTEGRATION",
    progress: 48,
    color: "#7CB518",
  },
  {
    title: "Fine-grained RBAC",
    subtitle: "ROLE-BASED ACCESS",
    progress: 85,
    color: "#5B35E0",
  },
] as const;

function LinearProgress({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function RingProgress({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex size-9 shrink-0 items-center justify-center md:size-10">
      <svg className="-rotate-90" width="36" height="36" viewBox="0 0 36 36" aria-hidden>
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="absolute font-heading text-[0.45rem] font-semibold md:text-[0.5rem]"
        style={{ color }}
      >
        {value}%
      </span>
    </div>
  );
}

export default function ComplianceInfrastructureMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[360px] overflow-visible pb-6 md:min-h-[390px] md:pb-8">
      {/* Back card - top-left */}
      <div className="absolute left-0 top-0 z-0 w-[94%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white p-4 pb-12 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5 md:pb-14">
        <div className="flex items-center justify-between gap-3">
          <p className="font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            System Events
          </p>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-0.5 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-xs"
          >
            Full Audit
            <RiArrowRightSLine size={14} />
          </button>
        </div>

        <div className="mt-3 md:mt-4">
          {SYSTEM_EVENTS.map((event) => {
            const Icon = event.icon;

            return (
              <div
                key={event.title}
                className="border-b border-dashed border-[#E5E7EB] py-3 last:border-b-0 md:py-3.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full md:size-9"
                    style={{ backgroundColor: event.bg, color: event.color }}
                  >
                    <Icon size={15} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-heading text-xs font-semibold text-[#3C3B3B] md:text-sm">
                          {event.title}
                        </p>
                        <p className="mt-0.5 font-heading text-[0.6rem] font-normal text-[#9CA3AF] md:text-xs">
                          {event.subtitle}
                        </p>
                      </div>
                      {event.time ? (
                        <span className="shrink-0 font-heading text-[0.55rem] text-[#9CA3AF] md:text-[0.6rem]">
                          {event.time}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="shrink-0 font-heading text-[0.55rem] text-[#9CA3AF] md:text-[0.6rem]">
                        {event.progress}% completed
                      </span>
                      <div className="min-w-0 flex-1">
                        <LinearProgress value={event.progress} color={event.bar} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Front card - bottom-right overlap */}
      <div className="absolute right-0 top-[10.5rem] z-10 w-[72%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:top-[11.25rem] md:w-[70%]">
        <div className="border-b border-[#F3F4F6] px-4 py-3 md:px-5">
          <p className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            <RiGlobalLine size={16} className="text-[#5B35E0]" />
            Security Infrastructure
          </p>
        </div>

        <div className="divide-y divide-dashed divide-[#E5E7EB] px-3 md:px-4">
          {SECURITY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-3 py-3 md:py-3.5"
            >
              <div className="min-w-0">
                <p className="font-heading text-xs font-semibold text-[#3C3B3B] md:text-sm">
                  {item.title}
                </p>
                <p className="mt-0.5 font-heading text-[0.55rem] font-medium tracking-wide text-[#9CA3AF] md:text-[0.6rem]">
                  {item.subtitle}
                </p>
              </div>
              <RingProgress value={item.progress} color={item.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
