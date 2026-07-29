"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CARD_ACCENT_COLORS,
  getSolutionGradientStops,
  THREE_WAYS_WHEEL_THEMES,
} from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

type ToolWheelProps = {
  className?: string;
  showBackground?: boolean;
  /** Scroll into view (integration) vs play when ready (hero). Defaults to showBackground. */
  animateOnScroll?: boolean;
  /** When animateOnScroll is false, play entrance only after this is true. */
  entranceReady?: boolean;
};

type Ramp = "wholesaler" | "broker" | "developer" | "startup" | "carrier";

type ToolNode = {
  name: string;
  category: string;
  iconSrc: string;
  ramp: Ramp;
};

const RAMP_COLOR: Record<Ramp, string> = {
  wholesaler: CARD_ACCENT_COLORS.wholesaler,
  broker: CARD_ACCENT_COLORS.broker,
  developer: CARD_ACCENT_COLORS.developer,
  startup: CARD_ACCENT_COLORS.startup,
  carrier: CARD_ACCENT_COLORS.carrier,
};

const WHEEL_SEGMENT_DEG = 360 / THREE_WAYS_WHEEL_THEMES.length;
const WHEEL_START_DEG = -90;
const WHEEL_WEDGE_PADDING_DEG = 14;

function wedgeAnglesForCount(wedgeIndex: number, count: number) {
  const start = WHEEL_START_DEG + wedgeIndex * WHEEL_SEGMENT_DEG + WHEEL_WEDGE_PADDING_DEG;
  const end =
    WHEEL_START_DEG + (wedgeIndex + 1) * WHEEL_SEGMENT_DEG - WHEEL_WEDGE_PADDING_DEG;

  if (count <= 0) return [];
  if (count === 1) return [(start + end) / 2];

  return Array.from(
    { length: count },
    (_, index) => start + (index / (count - 1)) * (end - start),
  );
}

function getNodeAngleByIndex(showBackground: boolean) {
  if (!showBackground) {
    return NODES.map((_, index) => -78 + index * 24);
  }

  const angles = new Array<number>(NODES.length);

  THREE_WAYS_WHEEL_THEMES.forEach((theme, wedgeIndex) => {
    const nodeIndices: number[] = [];
    NODES.forEach((node, index) => {
      if (node.ramp === theme) nodeIndices.push(index);
    });

    const wedgeAngles = wedgeAnglesForCount(wedgeIndex, nodeIndices.length);
    nodeIndices.forEach((nodeIndex, index) => {
      angles[nodeIndex] = wedgeAngles[index]!;
    });
  });

  return angles;
}

function wheelPolarPoint(deg: number, radius = 50, cx = 50, cy = 50) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function wheelWedgeArcPath(startDeg: number, endDeg: number, radius = 50, cx = 50, cy = 50) {
  const p1 = wheelPolarPoint(startDeg, radius, cx, cy);
  const p2 = wheelPolarPoint(endDeg, radius, cx, cy);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
}

function WheelWedgeBackgrounds() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <clipPath id="tool-wheel-circle-clip">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        {THREE_WAYS_WHEEL_THEMES.map((theme) => (
          <linearGradient
            key={theme}
            id={`tool-wheel-wedge-${theme}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            {getSolutionGradientStops(theme).map(({ hex, pos }) => (
              <stop
                key={`${theme}-${pos}-${hex}`}
                offset={`${pos}%`}
                stopColor={`#${hex}`}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
      <g clipPath="url(#tool-wheel-circle-clip)">
        {THREE_WAYS_WHEEL_THEMES.map((theme, index) => {
          const startDeg = WHEEL_START_DEG + index * WHEEL_SEGMENT_DEG;
          const endDeg = startDeg + WHEEL_SEGMENT_DEG;

          return (
            <path
              key={theme}
              d={wheelWedgeArcPath(startDeg, endDeg)}
              fill={`url(#tool-wheel-wedge-${theme})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

const NODES: ToolNode[] = [
  {
    name: "Claude Code",
    category: "AI agent builder",
    iconSrc: "/images/icons/google_antigravity_icon.png",
    ramp: "broker",
  },
  {
    name: "n8n",
    category: "Workflow automation",
    iconSrc: "/images/icons/n8n_icon.png",
    ramp: "broker",
  },
  {
    name: "Send",
    category: "Decks",
    iconSrc: "/images/icons/send_icon.png",
    ramp: "broker",
  },
  {
    name: "Clay",
    category: "Data orchestration",
    iconSrc: "/images/icons/automation_icon.png",
    ramp: "wholesaler",
  },
  {
    name: "Prospeo",
    category: "Enrichment",
    iconSrc: "/images/icons/prospeo_icon.png",
    ramp: "wholesaler",
  },
  {
    name: "AI Ark",
    category: "Lookalike lists",
    iconSrc: "/images/icons/rainbow_hand_icon.png",
    ramp: "wholesaler",
  },
  {
    name: "Hunter",
    category: "Cold email infra",
    iconSrc: "/images/icons/lightning_icon.png",
    ramp: "developer",
  },
  {
    name: "Instantly",
    category: "Cold email sending",
    iconSrc: "/images/icons/send_icon.png",
    ramp: "carrier",
  },
  {
    name: "LinkedIn",
    category: "LinkedIn ads",
    iconSrc: "/images/icons/linkedin_icon.png",
    ramp: "carrier",
  },
  {
    name: "HeyReach",
    category: "LinkedIn outreach",
    iconSrc: "/images/icons/linkedin_icon.png",
    ramp: "carrier",
  },
  {
    name: "Trellus",
    category: "Cold call dialer",
    iconSrc: "/images/icons/lightning_icon.png",
    ramp: "startup",
  },
  {
    name: "WhiteWhale",
    category: "Signal tracking",
    iconSrc: "/images/icons/hypertide_icon.png",
    ramp: "startup",
  },
  {
    name: "RB2B",
    category: "Web visitor ID",
    iconSrc: "/images/icons/rainbow_hand_icon.png",
    ramp: "startup",
  },
  {
    name: "Attio",
    category: "Notetaking",
    iconSrc: "/images/icons/attio_icon.png",
    ramp: "developer",
  },
  {
    name: "Attio",
    category: "CRM",
    iconSrc: "/images/icons/attio_icon.png",
    ramp: "developer",
  },
];

const CX = 50;
const CY = 50;
const R_LINE_START = 7; // meets outer edge of center hub (w-[14%] → r = 7)
const R_LINE_END = 38;
const R_ITEM = 38;
const R_LABEL = 33;

function iconNameAbove(pos: { y: number }) {
  return pos.y < CY;
}

function nodePolar(angleDeg: number, radius: number, useWheelAngles: boolean) {
  if (useWheelAngles) {
    return wheelPolarPoint(angleDeg, radius, CX, CY);
  }

  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function signalDotColor(showBackground: boolean, rampColor: string, toHub: boolean) {
  if (showBackground) return rampColor;
  return toHub ? RAMP_COLOR.startup : RAMP_COLOR.carrier;
}

const ENTRANCE_START_NODE_NAME = "n8n";

function getClockwiseSortedIndices(
  items: { angle: number; name: string }[],
  startNodeName = ENTRANCE_START_NODE_NAME,
) {
  const sorted = items
    .map((item, index) => ({
      index,
      angle: ((item.angle % 360) + 360) % 360,
    }))
    .sort((a, b) => a.angle - b.angle)
    .map(({ index }) => index);

  const startIndex = items.findIndex((item) => item.name === startNodeName);
  if (startIndex < 0) return sorted;

  const startPos = sorted.indexOf(startIndex);
  if (startPos < 0) return sorted;

  return [...sorted.slice(startPos), ...sorted.slice(0, startPos)];
}

export default function ToolWheel({
  className = "",
  showBackground = false,
  animateOnScroll,
  entranceReady = true,
}: ToolWheelProps) {
  const shouldAnimateOnScroll = animateOnScroll ?? showBackground;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spokeProgressRef = useRef<number[]>([]);
  const signalsEnabledRef = useRef(false);
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);

  const items = useMemo(() => {
    const angles = getNodeAngleByIndex(showBackground);

    return NODES.map((node, i) => {
      const angle = angles[i]!;
      const start = nodePolar(angle, R_LINE_START, showBackground);
      const end = nodePolar(angle, R_LINE_END, showBackground);
      const pos = nodePolar(angle, R_ITEM, showBackground);
      const label = nodePolar(angle, R_LABEL, showBackground);

      return {
        ...node,
        angle,
        start,
        end,
        pos,
        label,
        color: RAMP_COLOR[node.ramp],
        isBelow: pos.y > CY,
      };
    });
  }, [showBackground]);

  useEffect(() => {
    spokeProgressRef.current = items.map(() => 0);
    signalsEnabledRef.current = false;
  }, [items]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clockwiseIndices = getClockwiseSortedIndices(items);
      const nodes = clockwiseIndices
        .map((index) => container.querySelector<HTMLElement>(`[data-tool-wheel-node="${index}"]`))
        .filter(Boolean) as HTMLElement[];

      const lineProgress = items.map(() => ({ value: 0 }));

      if (reducedMotion) {
        gsap.set(nodes, { opacity: 1, scale: 1 });
        lineProgress.forEach((entry) => {
          entry.value = 1;
        });
        spokeProgressRef.current = items.map(() => 1);
        signalsEnabledRef.current = true;
        return;
      }

      gsap.set(nodes, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      if (!entranceReady) return;

      const timeline = gsap.timeline({
        ...(shouldAnimateOnScroll
          ? {
              scrollTrigger: {
                trigger: container,
                start: "top 50%",
                once: true,
              },
            }
          : {}),
      });

      timeline.to(nodes, {
        opacity: 1,
        scale: 1,
        duration: 0.48,
        ease: "back.out(1.7)",
        stagger: 0.07,
      });

      timeline.to(
        clockwiseIndices.map((index) => lineProgress[index]!),
        {
          value: 1,
          duration: 0.42,
          ease: "power2.out",
          stagger: 0.05,
          onUpdate: () => {
            spokeProgressRef.current = lineProgress.map((entry) => entry.value);
          },
          onComplete: () => {
            signalsEnabledRef.current = true;
          },
        },
        ">+=0.05",
      );
    },
    {
      scope: containerRef,
      dependencies: [items, shouldAnimateOnScroll, entranceReady],
    },
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
        const lineProgress = spokeProgressRef.current[i] ?? 1;
        if (lineProgress <= 0) return;

        const nearNode = toPx(item.end.x, item.end.y);
        const nearHub = toPx(item.start.x, item.start.y);
        const lineX = nearHub.x + (nearNode.x - nearHub.x) * lineProgress;
        const lineY = nearHub.y + (nearNode.y - nearHub.y) * lineProgress;
        const dashed = i % 2 === 1;
        context.beginPath();
        context.moveTo(nearHub.x, nearHub.y);
        context.lineTo(lineX, lineY);
        context.strokeStyle = showBackground
          ? (dashed ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)")
          : (dashed ? "rgba(153,153,153,0.55)" : "rgba(255,255,255,0.2)");
        context.lineWidth = 1;
        context.setLineDash(dashed ? [3, 6] : []);
        context.stroke();

        // entrance dot travels center → icon for lower-half spokes
        if (item.isBelow && lineProgress < 1) {
          const dotColor = signalDotColor(showBackground, item.color, false);
          context.beginPath();
          context.arc(lineX, lineY, 2.2, 0, Math.PI * 2);
          context.fillStyle = showBackground
            ? "rgba(255,255,255,0.95)"
            : hexToRgba(dotColor, 0.95);
          context.fill();
        }
      });
      context.setLineDash([]);

      // flowing signals — lower icons: hub → node; upper icons: node → hub
      if (!reduceMotion && signalsEnabledRef.current) {
        particles.forEach((p) => {
          const item = items[p.itemIndex];
          const lineProgress = spokeProgressRef.current[p.itemIndex] ?? 1;
          if (lineProgress < 1) return;

          p.t += p.v * dt;
          const hubPt = toPx(item.start.x, item.start.y);
          const nodePt = toPx(item.end.x, item.end.y);
          const from = item.isBelow ? hubPt : nodePt;
          const to = item.isBelow ? nodePt : hubPt;

          const toHub = !item.isBelow;
          const dotColor = signalDotColor(showBackground, item.color, toHub);

          if (p.t >= 1) {
            p.t %= 1;
            p.v = 0.14 + Math.random() * 0.08;
            if (!item.isBelow) {
              pulses.push({ r: 0, a: 0.55, color: dotColor });
            }
          }
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
          grad.addColorStop(0, hexToRgba(dotColor, 0));
          grad.addColorStop(1, hexToRgba(dotColor, 0.9));
          context.beginPath();
          context.moveTo(tail.x, tail.y);
          context.lineTo(pt.x, pt.y);
          context.strokeStyle = grad;
          context.lineWidth = 1.6;
          context.stroke();

          context.beginPath();
          context.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          context.fillStyle = hexToRgba(dotColor, 0.95);
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
  }, [items, showBackground]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto aspect-square h-full w-full max-w-[720px] ${className}`}
      aria-label="Outbound tool stack radiating from a central AI hub"
    >
      {showBackground ? (
        <div className="absolute inset-0 overflow-hidden rounded-full" aria-hidden>
          <WheelWedgeBackgrounds />
        </div>
      ) : null}

      {/* Spokes + flowing signal particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />

      {/* Hub — outer ring + inner logo circle */}
      <div
        className={`absolute top-1/2 left-1/2 z-10 flex aspect-square w-[14%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ECE7FF] bg-white transition-transform duration-200 ${
          hoveredLogo !== null ? "scale-105" : ""
        }`}
      >
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

      {/* Tool nodes — square rounded-md badges with brand icons */}
      <div className="absolute inset-0">
        {items.map((item, i) => {
          const nameAbove = iconNameAbove(item.pos);

          return (
          <div
            key={i}
            data-tool-wheel-node={i}
            className="group absolute size-11 -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={{ left: `${item.pos.x}%`, top: `${item.pos.y}%` }}
            onMouseEnter={() => setHoveredLogo(i)}
            onMouseLeave={() => setHoveredLogo(null)}
          >
            <div className="flex size-full items-center justify-center overflow-hidden rounded-md border border-[#D3D1C7] bg-white p-1.5 transition-transform duration-200 group-hover:scale-110">
              <Image
                src={item.iconSrc}
                alt=""
                width={28}
                height={28}
                className="size-full object-contain"
              />
            </div>
            <span
              className={`pointer-events-none absolute left-1/2 max-w-none -translate-x-1/2 whitespace-nowrap text-center text-[10px] font-medium leading-tight text-white ${
                nameAbove ? "bottom-full mb-1.5" : "top-full mt-1.5"
              }`}
            >
              {item.name}
            </span>
          </div>
          );
        })}
      </div>
    </div>
  );
}