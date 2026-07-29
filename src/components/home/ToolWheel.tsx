"use client";

import { useId, useMemo } from "react";
import Image from "next/image";

type ToolWheelProps = {
  className?: string;
};

type Ramp = "purple" | "blue" | "amber" | "green";

type ToolNode = {
  name: string;
  category: string;
  iconSrc: string;
  ramp: Ramp;
};

const NODES: ToolNode[] = [
  {
    name: "Claude Code",
    category: "AI agent builder",
    iconSrc: "/images/icons/google_antigravity_icon.png",
    ramp: "purple",
  },
  {
    name: "n8n",
    category: "Workflow automation",
    iconSrc: "/images/icons/n8n_icon.png",
    ramp: "purple",
  },
  {
    name: "Send",
    category: "Decks",
    iconSrc: "/images/icons/send_icon.png",
    ramp: "purple",
  },
  {
    name: "Clay",
    category: "Data orchestration",
    iconSrc: "/images/icons/automation_icon.png",
    ramp: "blue",
  },
  {
    name: "Prospeo",
    category: "Enrichment",
    iconSrc: "/images/icons/prospeo_icon.png",
    ramp: "blue",
  },
  {
    name: "AI Ark",
    category: "Lookalike lists",
    iconSrc: "/images/icons/rainbow_hand_icon.png",
    ramp: "blue",
  },
  {
    name: "Hunter",
    category: "Cold email infra",
    iconSrc: "/images/icons/lightning_icon.png",
    ramp: "blue",
  },
  {
    name: "Instantly",
    category: "Cold email sending",
    iconSrc: "/images/icons/send_icon.png",
    ramp: "amber",
  },
  {
    name: "LinkedIn",
    category: "LinkedIn ads",
    iconSrc: "/images/icons/linkedin_icon.png",
    ramp: "amber",
  },
  {
    name: "HeyReach",
    category: "LinkedIn outreach",
    iconSrc: "/images/icons/linkedin_icon.png",
    ramp: "amber",
  },
  {
    name: "Trellus",
    category: "Cold call dialer",
    iconSrc: "/images/icons/lightning_icon.png",
    ramp: "green",
  },
  {
    name: "WhiteWhale",
    category: "Signal tracking",
    iconSrc: "/images/icons/hypertide_icon.png",
    ramp: "green",
  },
  {
    name: "RB2B",
    category: "Web visitor ID",
    iconSrc: "/images/icons/rainbow_hand_icon.png",
    ramp: "green",
  },
  {
    name: "Attio",
    category: "Notetaking",
    iconSrc: "/images/icons/attio_icon.png",
    ramp: "green",
  },
  {
    name: "Attio",
    category: "CRM",
    iconSrc: "/images/icons/attio_icon.png",
    ramp: "green",
  },
];

const CX = 50;
const CY = 50;
const R_LINE_START = 7; // meets outer edge of center hub (w-[14%] → r = 7)
const R_LINE_END = 38;
const R_ITEM = 38;
const R_LABEL = 33;

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function outerSide(angleDeg: number): "top" | "right" | "bottom" | "left" {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a >= 315 || a < 45) return "right";
  if (a < 135) return "bottom";
  if (a < 225) return "left";
  return "top";
}

const OUTER_LABEL_CLASS: Record<"top" | "right" | "bottom" | "left", string> = {
  top: "absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 text-center",
  right: "absolute top-1/2 left-full ml-1.5 -translate-y-1/2 text-left",
  bottom: "absolute top-full left-1/2 mt-1.5 -translate-x-1/2 text-center",
  left: "absolute top-1/2 right-full mr-1.5 -translate-y-1/2 text-right",
};

export default function ToolWheel({ className = "" }: ToolWheelProps) {
  const uid = useId().replace(/:/g, "");
  const items = useMemo(
    () =>
      NODES.map((node, i) => {
        const angle = -78 + i * 24;
        const start = polar(angle, R_LINE_START);
        const end = polar(angle, R_LINE_END);
        const pos = polar(angle, R_ITEM);
        const label = polar(angle, R_LABEL);
        const side = outerSide(angle);
        return { ...node, angle, start, end, pos, label, side };
      }),
    [],
  );

  return (
    <div
      className={`relative mx-auto aspect-square h-full w-full max-w-[720px] ${className}`}
      aria-label="Outbound tool stack radiating from a central AI hub"
    >
      {/* Spokes — CarrierResults-style lines + flowing dots toward center */}
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          {items.map((item, i) => (
            <path
              key={`def-${i}`}
              id={`wheel-dot-${uid}-${i}`}
              d={`M${item.end.x},${item.end.y} L${item.start.x},${item.start.y}`}
            />
          ))}
        </defs>

        {items.map((item, i) => {
          const dashed = i % 2 === 1;
          return (
            <path
              key={`line-${i}`}
              d={`M${item.start.x},${item.start.y} L${item.end.x},${item.end.y}`}
              fill="none"
              stroke={dashed ? "rgb(153,153,153)" : "#FFFFFF33"}
              strokeWidth={0.1}
              strokeLinecap="butt"
              strokeDasharray={dashed ? "0.25 0.9" : undefined}
              strokeOpacity={1}
            />
          );
        })}

        {items.map((_, i) => {
          const dur = `${(3 + (i % 3) * 0.3).toFixed(1)}s`;
          const begin = `${(i * 0.22).toFixed(2)}s`;
          return (
            <circle key={`dot-${i}`} r={0.22} fill="#FFFFFF">
              <animateMotion
                dur={dur}
                begin={begin}
                repeatCount="indefinite"
                rotate="none"
              >
                <mpath href={`#wheel-dot-${uid}-${i}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.08;0.72;1"
                dur={dur}
                begin={begin}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="0;0.22;0.22;0"
                keyTimes="0;0.08;0.75;1"
                dur={dur}
                begin={begin}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>

      {/* Hub — outer ring + inner logo circle */}
      <div className="absolute top-1/2 left-1/2 z-10 flex aspect-square w-[14%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ECE7FF] bg-white">
        <div className="flex aspect-square w-[72%] items-center justify-center rounded-full bg-[#ECE7FF]">
          <Image
            src="/images/startups/center-logo.svg"
            alt="CoverForce logo"
            width={36}
            height={36}
            className="h-[58%] w-[58%] object-contain"
          />
        </div>
      </div>

      {/* Names on connecting lines */}
      <div className="absolute inset-0 pointer-events-none">
        {items.map((item, i) => (
          <div
            key={`label-${i}`}
            className="absolute"
            style={{
              left: `${item.label.x}%`,
              top: `${item.label.y}%`,
              transform: `rotate(${item.angle + 180}deg)`,
            }}
          >
            <span className="absolute top-0 left-0 -translate-y-1/2 whitespace-nowrap text-xs font-medium leading-none text-white">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Tool nodes — square rounded-md badges with brand icons */}
      <div className="absolute inset-0">
        {items.map((item, i) => (
          <div
            key={i}
            className="absolute size-11 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${item.pos.x}%`, top: `${item.pos.y}%` }}
          >
            <div className="flex size-full items-center justify-center overflow-hidden rounded-md border border-[#D3D1C7] bg-white p-1.5">
              <Image
                src={item.iconSrc}
                alt=""
                width={28}
                height={28}
                className="size-full object-contain"
              />
            </div>
            <div
              className={`${OUTER_LABEL_CLASS[item.side]} max-w-[12rem] line-clamp-2 text-[11px] leading-tight text-white/70`}
            >
              {item.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
