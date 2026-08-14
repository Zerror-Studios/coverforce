"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
} from "recharts";
import { MICRO_EASE, MICRO_TAB_COLOR_MS } from "@/lib/motion";

/**
 * Performance Overview card — matches the reference dashboard mock:
 * title + range selector, 4 metric tiles (cycling highlight),
 * and a dotted line/area chart with a black tooltip.
 */

type DeveloperMockProps = {
  /** Modal preview is smaller and right-aligned; card uses absolute right layout. */
  align?: "card" | "modal";
};

type Metric = {
  label: string;
  value: string;
  delta: string;
};

type Point = {
  date: string;
  day: number;
  submissions: number;
};

const ROTATE_MS = 4000;

const METRICS: Metric[] = [
  { label: "Submissions", value: "4,283", delta: "↑ 26.3%" },
  { label: "Bind Rate", value: "42.6%", delta: "↑ 32.5%" },
  { label: "Policies Bound", value: "1,876", delta: "↑ 25.8%" },
  { label: "Premium Volume", value: "$12.6M", delta: "↑ 25.8%" },
];

/** Chart points to park the always-visible tooltip on while tabs cycle */
const TOOLTIP_POINTS = [11, 16, 22, 27] as const;

const DATA: Point[] = [
  40, 52, 44, 60, 46, 62, 48, 58, 66, 50, 63, 71, 55, 72, 78, 60, 46, 55, 68,
  49, 61, 57, 63, 55, 66, 61, 72, 65, 74, 80,
].map((submissions, i) => ({
  day: i + 1,
  date: `June ${String(i + 1).padStart(2, "0")}`,
  submissions,
}));

const BORDER_TRANSITION = `border-color ${MICRO_TAB_COLOR_MS}ms ${MICRO_EASE}`;

function BlackTooltip({ date, value, label }: { date: string; value: number; label: string }) {
  return (
    <div className="rounded-md bg-[#14141a] px-2.5 py-1.5 text-white shadow-lg">
      <p className="text-[11px] font-semibold leading-tight">{date}</p>
      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/70">
        <span className="inline-block size-1 rounded-full bg-[#7C6CF6]" />
        {value} {label}
      </p>
    </div>
  );
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as Point;
  return <BlackTooltip date={point.date} value={point.submissions} label="Submissions" />;
}

export default function DeveloperMock({ align = "card" }: DeveloperMockProps) {
  const isModal = align === "modal";
  const [range] = useState("Last 30 Days");
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setActiveMetric((current) => (current + 1) % METRICS.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, []);

  const metric = METRICS[activeMetric];
  const tipPoint = DATA[TOOLTIP_POINTS[activeMetric]] ?? DATA[TOOLTIP_POINTS[0]];
  /** Rough left % along the chart so the parked tooltip sits near the active point */
  const tipLeftPct = ((TOOLTIP_POINTS[activeMetric] + 1) / DATA.length) * 100;

  return (
    <div
      className={
        isModal
          ? "absolute top-1/2 right-6 z-10 w-[min(78%,460px)] -translate-y-1/2 sm:w-[500px] md:right-10"
          : "relative z-10 mx-auto w-full max-w-[460px] max-sm:mt-2 max-sm:w-[108%] max-sm:max-w-none max-sm:left-1/2 max-sm:-translate-x-1/2 sm:ml-auto sm:mr-10 sm:max-w-[min(92%,420px)] sm:translate-x-0 sm:left-auto lg:absolute lg:top-1/2 lg:right-20 lg:mx-0 lg:mr-0 lg:max-w-[500px] lg:-translate-y-1/2"
      }
    >
      <div className="w-full rounded-xl bg-white p-3.5 shadow-[0_8px_30px_rgba(20,20,40,0.08)] max-sm:p-2.5 lg:p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold tracking-tight text-[#14141a] lg:text-base">
            Performance Overview
          </h2>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#6b6b76] transition-colors hover:text-[#14141a]"
          >
            {range}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Metric tiles — highlight cycles next → next */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 max-sm:mt-2 max-sm:gap-1.5 sm:grid-cols-4">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className={`rounded-lg border p-2 max-sm:p-1.5 ${
                i === activeMetric
                  ? "border-[#7C6CF6] bg-white"
                  : "border-[#ECECEF] bg-white"
              }`}
              style={{ transition: BORDER_TRANSITION }}
            >
              <p className="text-[10px] text-[#9a9aa4]">{m.label}</p>
              <div className="mt-0.5 flex items-center gap-1 whitespace-nowrap">
                <span className="text-[12px] font-bold leading-none text-[#14141a]">{m.value}</span>
                <span className="rounded bg-[#EFF6EE] px-1 py-0.5 text-[8px] font-medium leading-none text-[#4C9A5B]">
                  {m.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + always-visible black tooltip */}
        <div className="relative mt-2.5 h-36 w-full max-sm:mt-1.5 max-sm:h-24 lg:h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="submissionsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C6CF6" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#7C6CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EFEFF2" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={false}
                height={8}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[25, 50, 75, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#B4B4BD", fontSize: 10 }}
                width={28}
                orientation="right"
              />
              <Tooltip
                content={ChartTooltip}
                cursor={{ stroke: "#D6D2FB", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stroke="none"
                fill="url(#submissionsFill)"
              />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="#7C6CF6"
                strokeWidth={2}
                strokeDasharray="1 5"
                strokeLinecap="round"
                dot={false}
                activeDot={{ r: 4, fill: "#7C6CF6", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Parked black tooltip — moves as metric tabs cycle */}
          <div
            className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 transition-[left] duration-500 ease-out"
            style={{ left: `clamp(72px, ${tipLeftPct}%, calc(100% - 72px))` }}
          >
            <BlackTooltip
              date={tipPoint.date}
              value={tipPoint.submissions}
              label={metric.label}
            />
            <div className="mx-auto mt-0.5 size-2 rounded-full border-2 border-white bg-[#7C6CF6] shadow-sm" />
          </div>
        </div>

        {/* Axis end labels */}
        <div className="mt-0.5 flex items-center justify-between px-0.5 text-[11px] text-[#14141a]">
          <span>Jun 1</span>
          <span>Jun 30</span>
        </div>
      </div>
    </div>
  );
}
