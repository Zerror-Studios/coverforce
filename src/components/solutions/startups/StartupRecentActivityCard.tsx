"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MICRO_ENTRANCE_MS } from "@/lib/motion";

/**
 * Recent Activity card — matches the reference dashboard mock:
 * tab row (Total Submission active w/ underline), and a table with
 * Type (icon + carrier), Status, sparkline Graph, and relative Time.
 * Tabs auto-cycle; each tab shows its own activity list.
 */

type Tab = "Total Submission" | "Bind Rate" | "Policies Bound" | "Premium Volume";

const TABS: Tab[] = [
  "Total Submission",
  "Bind Rate",
  "Policies Bound",
  "Premium Volume",
];

const ROTATE_MS = 4000;

type Row = {
  carrier: string;
  icon: string;
  iconBg: string;
  status: string;
  time: string;
  color: string;
  points: number[]; // 0-100 sparkline values
};

const ROWS_BY_TAB: Record<Tab, Row[]> = {
  "Total Submission": [
    {
      carrier: "Markel",
      icon: "📊",
      iconBg: "#F3EFFB",
      status: "Appointment Submitted",
      time: "52m ago",
      color: "#5B4FE0",
      points: [30, 55, 40, 70, 45, 68, 50, 75, 55, 65],
    },
    {
      carrier: "Travelers",
      icon: "☂️",
      iconBg: "#FBEFEA",
      status: "Appointment Approved",
      time: "1h ago",
      color: "#3FA34D",
      points: [60, 30, 50, 35, 55, 40, 45, 42, 48, 44],
    },
    {
      carrier: "Chubb",
      icon: "🌲",
      iconBg: "#EAF6FA",
      status: "Documents Requested",
      time: "2h ago",
      color: "#E0453D",
      points: [50, 65, 40, 68, 42, 60, 38, 62, 45, 55],
    },
    {
      carrier: "The Hartford",
      icon: "🦌",
      iconBg: "#FBEFF1",
      status: "Appointment in review",
      time: "3h ago",
      color: "#8B6FE0",
      points: [55, 30, 58, 35, 60, 40, 62, 45, 58, 48],
    },
  ],
  "Bind Rate": [
    {
      carrier: "Liberty Mutual",
      icon: "🛡️",
      iconBg: "#EEF4FF",
      status: "Quote Bound",
      time: "18m ago",
      color: "#3FA34D",
      points: [40, 48, 52, 58, 55, 62, 68, 70, 74, 78],
    },
    {
      carrier: "Nationwide",
      icon: "🦅",
      iconBg: "#F3EFFB",
      status: "Bind Pending",
      time: "41m ago",
      color: "#5B4FE0",
      points: [55, 50, 58, 52, 60, 55, 63, 58, 65, 62],
    },
    {
      carrier: "CNA",
      icon: "📋",
      iconBg: "#EAF6FA",
      status: "Bound Confirmed",
      time: "1h ago",
      color: "#3FA34D",
      points: [35, 42, 48, 45, 55, 60, 58, 66, 70, 72],
    },
    {
      carrier: "Zurich",
      icon: "🌐",
      iconBg: "#FBEFEA",
      status: "Bind Declined",
      time: "2h ago",
      color: "#E0453D",
      points: [70, 65, 60, 55, 50, 48, 45, 42, 40, 38],
    },
  ],
  "Policies Bound": [
    {
      carrier: "Hiscox",
      icon: "🏛️",
      iconBg: "#F3EFFB",
      status: "Policy Issued",
      time: "12m ago",
      color: "#5B4FE0",
      points: [25, 35, 40, 48, 52, 58, 62, 68, 72, 80],
    },
    {
      carrier: "AmTrust",
      icon: "💼",
      iconBg: "#EEF4FF",
      status: "Policy Endorsed",
      time: "35m ago",
      color: "#8B6FE0",
      points: [45, 50, 48, 55, 52, 58, 60, 57, 63, 65],
    },
    {
      carrier: "Berkshire",
      icon: "📈",
      iconBg: "#EAF6FA",
      status: "Policy Renewed",
      time: "1h ago",
      color: "#3FA34D",
      points: [50, 55, 60, 58, 65, 70, 68, 74, 78, 82],
    },
    {
      carrier: "AIG",
      icon: "🔷",
      iconBg: "#FBEFF1",
      status: "Policy Cancelled",
      time: "4h ago",
      color: "#E0453D",
      points: [80, 75, 70, 65, 60, 55, 50, 48, 45, 42],
    },
  ],
  "Premium Volume": [
    {
      carrier: "Travelers",
      icon: "☂️",
      iconBg: "#FBEFEA",
      status: "$128K Written",
      time: "8m ago",
      color: "#3FA34D",
      points: [20, 30, 35, 45, 50, 55, 60, 68, 75, 85],
    },
    {
      carrier: "Chubb",
      icon: "🌲",
      iconBg: "#EAF6FA",
      status: "$94K Written",
      time: "27m ago",
      color: "#5B4FE0",
      points: [40, 45, 50, 48, 55, 60, 58, 65, 70, 72],
    },
    {
      carrier: "Markel",
      icon: "📊",
      iconBg: "#F3EFFB",
      status: "$76K Written",
      time: "55m ago",
      color: "#8B6FE0",
      points: [35, 40, 42, 48, 52, 50, 58, 62, 60, 66],
    },
    {
      carrier: "The Hartford",
      icon: "🦌",
      iconBg: "#FBEFF1",
      status: "$61K Written",
      time: "2h ago",
      color: "#E0453D",
      points: [55, 52, 58, 54, 60, 56, 62, 58, 64, 60],
    },
  ],
};

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const width = 72;
  const height = 20;
  const pad = 2;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((p - min) / range) * (height - pad * 2);
    return [x, y];
  });

  const path = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RecentActivityCard() {
  const [activeTab, setActiveTab] = useState<Tab>("Total Submission");
  const rows = ROWS_BY_TAB[activeTab];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setActiveTab((current) => {
        const index = TABS.indexOf(current);
        return TABS[(index + 1) % TABS.length];
      });
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-white p-3 shadow-[0_8px_30px_rgba(20,20,40,0.08)] sm:max-w-[390px] sm:p-3.5">
      {/* Header */}
      <h2 className="text-[13px] font-bold tracking-tight text-[#14141a] sm:text-sm">
        Recent Activity
      </h2>

      {/* Tabs */}
      <div className="mt-2 flex gap-2.5 overflow-hidden border-b border-[#ECECEF] sm:gap-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative shrink-0 pb-1.5 text-[9px] font-medium whitespace-nowrap transition-colors sm:text-[10px] ${
              activeTab === tab
                ? "text-[#5B4FE0]"
                : "text-[#9a9aa4] hover:text-[#14141a]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#5B4FE0]" />
            )}
          </button>
        ))}
      </div>

      {/* Table — overflow hidden so row entrance never shows a scrollbar */}
      <div className="mt-1 min-h-[188px] overflow-hidden sm:min-h-[200px]">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-[#F7F6FC]">
              <th className="w-[28%] px-1.5 py-1.5 text-[9px] font-semibold text-[#14141a] sm:px-2">
                Type
              </th>
              <th className="w-[32%] px-1.5 py-1.5 text-[9px] font-semibold text-[#14141a] sm:px-2">
                Status
              </th>
              <th className="w-[24%] px-1.5 py-1.5 text-center text-[9px] font-semibold text-[#14141a] sm:px-2">
                Graph
              </th>
              <th className="w-[16%] px-1.5 py-1.5 text-right text-[9px] font-semibold text-[#14141a] sm:px-2">
                Time
              </th>
            </tr>
          </thead>
          <tbody key={activeTab}>
            {rows.map((row, i) => (
              <motion.tr
                key={`${activeTab}-${row.carrier}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MICRO_ENTRANCE_MS / 1000,
                  delay: i * 0.07,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className={i !== rows.length - 1 ? "border-b border-[#ECECEF]" : ""}
              >
                <td className="px-1.5 py-2 sm:px-2 sm:py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px]"
                      style={{ backgroundColor: row.iconBg }}
                    >
                      {row.icon}
                    </span>
                    <span className="truncate text-[10px] font-semibold text-[#14141a]">
                      {row.carrier}
                    </span>
                  </div>
                </td>
                <td className="truncate px-1.5 py-2 text-[9px] text-[#9a9aa4] sm:px-2 sm:py-2.5 sm:text-[10px]">
                  {row.status}
                </td>
                <td className="px-1.5 py-2 sm:px-2 sm:py-2.5">
                  <div className="flex justify-center">
                    <Sparkline points={row.points} color={row.color} />
                  </div>
                </td>
                <td className="whitespace-nowrap px-1.5 py-2 text-right text-[9px] text-[#9a9aa4] sm:px-2 sm:py-2.5 sm:text-[10px]">
                  {row.time}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
