"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { RiCheckLine, RiStackLine } from "@remixicon/react";

type BranchFlowProps = {
  className?: string;
};

const LINE = "#FFFFFF";
const LINE_DIM = "#FFFFFF";
const MUTED = "#8A8A8A";

function BranchPill({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] leading-none tracking-tight whitespace-nowrap sm:text-[11px] md:text-xs ${
        active
          ? "border-white/90 bg-white text-black"
          : "border-[#2E2E2E] bg-[#1C1C1C] text-[#D4D4D4]"
      }`}
    >
      <RiStackLine
        size={12}
        className={active ? "text-black/70" : "text-[#A3A3A3]"}
        aria-hidden
      />
      {label}
    </span>
  );
}

/** Check on the branch line, dashed stem up, label at top of stem. */
function StatusTickAbove({ label }: { label: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center">
        <span className="mb-1 whitespace-nowrap font-mono text-[9px] leading-none text-[#A3A3A3] sm:text-[10px] md:text-[11px]">
          {label}
        </span>
        <svg
          width="2"
          height="32"
          viewBox="0 0 2 32"
          className="h-7 w-[2px] overflow-visible sm:h-8"
          aria-hidden
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="32"
            stroke={LINE}
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeLinecap="butt"
          />
        </svg>
      </div>
      <span className="relative z-[1] inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#2EE6A6] sm:size-4">
        <RiCheckLine size={10} className="text-black" aria-hidden />
      </span>
    </div>
  );
}

/** Check on the branch line, dashed stem down, label at bottom of stem. */
function StatusTickBelow({ label }: { label: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <span className="relative z-[1] inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#2EE6A6] sm:size-4">
        <RiCheckLine size={10} className="text-black" aria-hidden />
      </span>
      <div className="absolute top-full left-1/2 flex -translate-x-1/2 flex-col items-center">
        <svg
          width="2"
          height="32"
          viewBox="0 0 2 32"
          className="h-7 w-[2px] overflow-visible sm:h-8"
          aria-hidden
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="32"
            stroke={LINE}
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeLinecap="butt"
          />
        </svg>
        <span className="mt-1 whitespace-nowrap font-mono text-[9px] leading-none text-[#A3A3A3] sm:text-[10px] md:text-[11px]">
          {label}
        </span>
      </div>
    </div>
  );
}

function NodeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-6 items-center justify-center overflow-hidden rounded-full border border-[#3A3A3A] bg-[#111] shadow-[0_0_0_3px_rgba(0,0,0,0.65)] sm:size-7 md:size-8">
      {children}
    </span>
  );
}

/** Positions as % of the 1100×420 artboard so overlays track the SVG. */
function Pos({
  x,
  y,
  children,
  className = "",
}: {
  x: number;
  y: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${(x / 1100) * 100}%`,
        top: `${(y / 420) * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {children}
    </div>
  );
}

export default function BranchFlow({ className = "" }: BranchFlowProps) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      aria-label="Deployment branch timeline"
    >
      <div className="relative aspect-1100/420 h-full w-full max-h-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1100 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          preserveAspectRatio="none"
        >
          {/* Production spine — starts at capsule (nothing to the left) */}
          <line
            x1="132"
            y1="210"
            x2="1100"
            y2="210"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="butt"
          />

          {/* Preview branch */}
          <path
            d="M260 210 C260 168 278 128 320 118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1="320"
            y1="118"
            x2="620"
            y2="118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />

          {/* Test branch */}
          <path
            d="M480 210 C480 252 498 292 540 302"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1="540"
            y1="302"
            x2="880"
            y2="302"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />

          {/* Dev branch */}
          <path
            d="M740 210 C740 168 758 128 800 118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1="800"
            y1="118"
            x2="1020"
            y2="118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />

          <text
            x="260"
            y="228"
            textAnchor="middle"
            fill={MUTED}
            fontSize="11"
            fontFamily="DM Mono, ui-monospace, monospace"
          >
            18:24:00
          </text>
          <text
            x="480"
            y="196"
            textAnchor="middle"
            fill={MUTED}
            fontSize="11"
            fontFamily="DM Mono, ui-monospace, monospace"
          >
            19:08:12
          </text>
          <text
            x="740"
            y="228"
            textAnchor="middle"
            fill={MUTED}
            fontSize="11"
            fontFamily="DM Mono, ui-monospace, monospace"
          >
            20:32:04
          </text>
        </svg>

        <div className="pointer-events-none absolute inset-0">
          {/* Production */}
          <div
            className="absolute"
            style={{
              left: `${(86 / 1100) * 100}%`,
              top: `${(210 / 420) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white px-2.5 py-1 font-mono text-[10px] leading-none tracking-tight text-black whitespace-nowrap sm:text-[11px] md:text-xs">
              <RiStackLine size={12} className="text-black/70" aria-hidden />
              production
            </span>
          </div>

          {/* Preview */}
          <Pos x={278} y={150}>
            <NodeBadge>
              <svg viewBox="0 0 16 16" className="size-3 sm:size-3.5" aria-hidden>
                <path fill="#fff" d="M8 1.5 14.5 13.5H1.5L8 1.5Z" />
              </svg>
            </NodeBadge>
          </Pos>
          <div
            className="absolute flex items-center gap-2 sm:gap-3"
            style={{
              left: `${(350 / 1100) * 100}%`,
              top: `${(118 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <BranchPill label="preview-branch" />
          </div>
          <Pos x={540} y={118}>
            <StatusTickAbove label="PR open" />
          </Pos>
          <Pos x={620} y={118}>
            <StatusTickAbove label="PR merged" />
          </Pos>
          <div
            className="absolute font-mono text-[9px] text-[#A3A3A3] sm:text-[10px] md:text-[11px]"
            style={{
              left: `${(648 / 1100) * 100}%`,
              top: `${(118 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            branch deleted
          </div>

          {/* Test */}
          <Pos x={498} y={270}>
            <NodeBadge>
              <svg viewBox="0 0 16 16" className="size-3 sm:size-3.5" aria-hidden>
                <path
                  fill="#fff"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                />
              </svg>
            </NodeBadge>
          </Pos>
          <div
            className="absolute flex items-center gap-2 sm:gap-3"
            style={{
              left: `${(570 / 1100) * 100}%`,
              top: `${(302 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <BranchPill label="test-branch" />
          </div>
          <Pos x={740} y={302}>
            <StatusTickBelow label="tests running" />
          </Pos>
          <Pos x={880} y={302}>
            <StatusTickBelow label="checks passed" />
          </Pos>
          <div
            className="absolute font-mono text-[9px] text-[#A3A3A3] sm:text-[10px] md:text-[11px]"
            style={{
              left: `${(908 / 1100) * 100}%`,
              top: `${(302 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            branch deleted
          </div>

          {/* Dev */}
          <Pos x={758} y={150}>
            <NodeBadge>
              <Image
                src="/images/avatar1.png"
                alt=""
                width={32}
                height={32}
                className="size-full object-cover"
              />
            </NodeBadge>
          </Pos>
          <div
            className="absolute flex items-center gap-2 sm:gap-3"
            style={{
              left: `${(830 / 1100) * 100}%`,
              top: `${(118 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <BranchPill label="dev-branch" active />
          </div>
          <Pos x={1020} y={118}>
            <StatusTickAbove label="dev in progress" />
          </Pos>
        </div>
      </div>
    </div>
  );
}
