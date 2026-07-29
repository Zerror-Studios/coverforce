"use client";

import { useEffect, useMemo, useRef } from "react";
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

// Ramp -> signal color. Tuned to sit next to the existing purple hub
// (#ECE7FF) without introducing a new palette family.
const RAMP_COLOR: Record<Ramp, string> = {
  purple: "#8B7CF6",
  blue: "#4F8EF7",
  amber: "#F5A623",
  green: "#34D399",
};

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

function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function ToolWheel({ className = "" }: ToolWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const items = useMemo(
    () =>
      NODES.map((node, i) => {
        const angle = -78 + i * 24;
        const start = polar(angle, R_LINE_START); // near hub
        const end = polar(angle, R_LINE_END); // near node
        const pos = polar(angle, R_ITEM);
        const label = polar(angle, R_LABEL);
        const side = outerSide(angle);
        return {
          ...node,
          angle,
          start,
          end,
          pos,
          label,
          side,
          color: RAMP_COLOR[node.ramp],
        };
      }),
    [],
  );

  // Canvas-driven signal flow: gradient-trailed particles travel each spoke
  // toward the hub, with a soft pulse ring firing on arrival. Same technique
  // as the reference band (rAF loop, resize + intersection handling, reduced
  // motion support) but drawn onto the existing radial layout instead of a
  // top/bottom band, and colored per tool "ramp" instead of in/outbound.
  useEffect(() => {
    const containerEl = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!containerEl || !canvasEl) return;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const container: HTMLDivElement = containerEl;
    const canvas: HTMLCanvasElement = canvasEl;
    const context: CanvasRenderingContext2D = ctx;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    type Particle = { itemIndex: number; t: number; v: number };
    type Pulse = { r: number; a: number; color: string };

    let W = 0;
    let H = 0;
    let dpr = 1;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];

    function initParticles() {
      particles = items.map((_, i) => ({
        itemIndex: i,
        t: (i * 0.137) % 1,
        v: 0.14 + (i % 3) * 0.035,
      }));
    }

    function toPx(pctX: number, pctY: number) {
      return { x: (pctX / 100) * W, y: (pctY / 100) * H };
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(dt: number) {
      context.clearRect(0, 0, W, H);
      const hub = toPx(CX, CY);
      const hubR = W * 0.07; // matches w-[14%] hub diameter

      // static spokes, same styling as the original SVG version
      items.forEach((item, i) => {
        const nearNode = toPx(item.end.x, item.end.y);
        const nearHub = toPx(item.start.x, item.start.y);
        const dashed = i % 2 === 1;
        context.beginPath();
        context.moveTo(nearNode.x, nearNode.y);
        context.lineTo(nearHub.x, nearHub.y);
        context.strokeStyle = dashed
          ? "rgba(153,153,153,0.55)"
          : "rgba(255,255,255,0.2)";
        context.lineWidth = 1;
        context.setLineDash(dashed ? [3, 6] : []);
        context.stroke();
      });
      context.setLineDash([]);

      // flowing signals, node -> hub, gradient trail per ramp color
      if (!reduceMotion) {
        particles.forEach((p) => {
          const item = items[p.itemIndex];
          p.t += p.v * dt;
          if (p.t >= 1) {
            p.t %= 1;
            p.v = 0.14 + Math.random() * 0.08;
            pulses.push({ r: 0, a: 0.55, color: item.color });
          }
          const from = toPx(item.end.x, item.end.y); // node
          const to = toPx(item.start.x, item.start.y); // hub
          const pt = {
            x: from.x + (to.x - from.x) * p.t,
            y: from.y + (to.y - from.y) * p.t,
          };
          const tailT = Math.max(0, p.t - 0.12);
          const tail = {
            x: from.x + (to.x - from.x) * tailT,
            y: from.y + (to.y - from.y) * tailT,
          };

          const grad = context.createLinearGradient(tail.x, tail.y, pt.x, pt.y);
          grad.addColorStop(0, hexToRgba(item.color, 0));
          grad.addColorStop(1, hexToRgba(item.color, 0.9));
          context.beginPath();
          context.moveTo(tail.x, tail.y);
          context.lineTo(pt.x, pt.y);
          context.strokeStyle = grad;
          context.lineWidth = 1.6;
          context.stroke();

          context.beginPath();
          context.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          context.fillStyle = hexToRgba(item.color, 0.95);
          context.fill();
        });
      }

      // arrival pulses on the hub
      pulses = pulses.filter((p) => p.a > 0.02);
      pulses.forEach((p) => {
        p.r += 34 * dt;
        p.a *= 1 - 2.2 * dt;
        context.beginPath();
        context.arc(hub.x, hub.y, hubR + p.r, 0, Math.PI * 2);
        context.strokeStyle = hexToRgba(p.color, p.a);
        context.lineWidth = 1;
        context.stroke();
      });
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible) draw(reduceMotion ? 0 : dt);
      raf = requestAnimationFrame(frame);
    }

    resize();
    initParticles();
    last = performance.now();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [items]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto aspect-square h-full w-full max-w-[720px] ${className}`}
      aria-label="Outbound tool stack radiating from a central AI hub"
    >
      {/* Spokes + flowing signal particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />

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