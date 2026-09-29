"use client";

import Image from "next/image";

/**
 * API Connection card — matches the reference dashboard mock:
 * header + "View Report" button, left illustration (provided SVG),
 * right "Top Performing Partners" ranked list, and action badges.
 * Sized to match other ThreeWays mock cards (e.g. Recent Activity).
 */

type Partner = {
  name: string;
  score: number;
};

type Badge = {
  label: string;
  icon: string;
  bg: string;
  text: string;
};

const PARTNERS: Partner[] = [
  { name: "Amwins", score: 92 },
  { name: "Access Insurance Group", score: 88 },
  { name: "Alera Group", score: 85 },
  { name: "EPIC Insurance", score: 78 },
];

const BADGES: Badge[] = [
  { label: "Quote", icon: "📄", bg: "#EFEDFB", text: "#5B4FE0" },
  { label: "Bind", icon: "✅", bg: "#EAF6EC", text: "#3FA34D" },
  { label: "Rate", icon: "⭐", bg: "#F3EFFB", text: "#8B6FE0" },
  { label: "Issue", icon: "📦", bg: "#FBEAEA", text: "#E0453D" },
];

export default function ApiConnectionCard() {
  return (
    <div className="mx-auto flex h-[16.5rem] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white px-3.5 py-3.5 shadow-[0_8px_30px_rgba(20,20,40,0.08)] sm:h-auto sm:max-w-none sm:px-3 sm:py-2.5 lg:h-[19rem] lg:max-w-[440px] lg:px-4 lg:py-5 xl:h-[19rem]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-[13px] font-bold tracking-tight text-[#14141a] sm:text-sm lg:text-[0.80rem] xl:text-sm">
          API Connection
        </h2>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded-md border border-[#ECECEF] px-2 py-1 text-[10px] font-medium text-[#5B4FE0] transition-colors hover:bg-[#F7F6FC] lg:text-[0.55rem] xl:text-[10px]"
        >
          View Report
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
          </svg>
        </button>
      </div>

      <div className="mt-2.5 grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] items-center gap-2.5 sm:mt-2 sm:gap-2 lg:mt-2.5">
        {/* Left: illustration — vertically centered */}
        <div className="flex h-full max-h-full items-center justify-center self-center overflow-hidden">
          <Image
            src="/images/threeway/api-connection.svg"
            alt="API connection diagram"
            width={180}
            height={180}
            className="h-auto max-h-full w-full object-contain sm:max-h-[7.5rem] lg:max-h-full"
            priority
          />
        </div>

        {/* Right: partners + badges */}
        <div className="flex min-h-0 min-w-0 flex-col justify-center">
          <h3 className="text-[10px] font-semibold text-[#14141a] sm:text-[11px] lg:text-[0.60rem] xl:text-[11px]">
            Top Performing Partners
          </h3>

          <div className="mt-1 flex flex-col">
            {PARTNERS.map((p, i) => (
              <div
                key={p.name}
                className={`flex items-center justify-between gap-1 py-1.5 sm:py-1 lg:py-2 ${
                  i !== PARTNERS.length - 1 ? "border-b border-[#ECECEF]" : ""
                }`}
              >
                <span className="truncate text-[9px] text-[#14141a] sm:text-[10px] lg:text-[0.55rem] xl:text-[10px]">
                  {p.name}
                </span>
                <span className="shrink-0 text-[9px] text-[#9a9aa4] sm:text-[10px] lg:text-[0.55rem] xl:text-[10px]">
                  {p.score}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-1 sm:mt-1.5 lg:mt-3">
            {BADGES.map((b) => (
              <span
                key={b.label}
                className="flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[9px] font-medium lg:text-[0.50rem] xl:text-[9px]"
                style={{ backgroundColor: b.bg, color: b.text }}
              >
                <span className="text-[8px] lg:text-[7px] xl:text-[8px]">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
