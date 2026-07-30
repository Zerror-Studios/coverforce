"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CARD_ACCENT_COLORS,
  getSolutionGradientStops,
  INTEGRATION_WHEEL_THEMES,
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

const WHEEL_START_DEG = -90;
const WHEEL_WEDGE_PADDING_DEG = 14;

function getWheelThemes(showBackground: boolean) {
  // Integration wheel: blue wholesaler sits next to carrier as Carriers & MGAs.
  return showBackground ? INTEGRATION_WHEEL_THEMES : THREE_WAYS_WHEEL_THEMES;
}

function wedgeAnglesForCount(
  wedgeIndex: number,
  count: number,
  segmentDeg: number,
) {
  const start = WHEEL_START_DEG + wedgeIndex * segmentDeg + WHEEL_WEDGE_PADDING_DEG;
  const end =
    WHEEL_START_DEG + (wedgeIndex + 1) * segmentDeg - WHEEL_WEDGE_PADDING_DEG;

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

  const themes = getWheelThemes(true);
  const segmentDeg = 360 / themes.length;
  const angles = new Array<number>(NODES.length);
  const perWedge = Math.floor(NODES.length / themes.length);

  let cursor = 0;
  themes.forEach((theme, wedgeIndex) => {
    const nodeIndices = Array.from({ length: perWedge }, (_, i) => cursor + i);
    cursor += perWedge;

    const wedgeAngles = wedgeAnglesForCount(
      wedgeIndex,
      nodeIndices.length,
      segmentDeg,
    );
    nodeIndices.forEach((nodeIndex, index) => {
      angles[nodeIndex] = wedgeAngles[index]!;
    });
  });

  // Drop leftovers so each of the 4 cones stays equal.
  for (let i = cursor; i < NODES.length; i += 1) {
    angles[i] = Number.NaN;
  }

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

function WheelWedgeBackgrounds({ showBackground }: { showBackground: boolean }) {
  const themes = getWheelThemes(showBackground);
  const segmentDeg = 360 / themes.length;

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
        {themes.map((theme) => (
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
        {themes.map((theme, index) => {
          const startDeg = WHEEL_START_DEG + index * segmentDeg;
          const endDeg = startDeg + segmentDeg;

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

/** Carrier marks for upper-half / Carriers slots on the home wheel. */
const CARRIER_LOGO_FILES = [
  "68db80d8be07394c698f0c72_c5430f51b657bd0ff972da286c4be264_Property 1=Default (1).png",
  "68db80d8f3d6515c7918886d_b00e6284238df42cd9436e8ca7d7c035_Property 1=Default (2).png",
  "68db80d842a384de4eeb434d_54f8614075a66a7a30d1d5ea3a184be3_Property 1=Default (3).png",
  "68db80d8c913e0400ef47a59_dece8e498a38e9fea87f8104dc908d25_Property 1=Default (4).png",
  "68db80d84382bb971c6f7a8e_1fa88f07e585ca322412b4984775c7da_Property 1=Default (6).png",
  "68db80d8942c9cc3d4b47792_26d9f23a1158995569ca33a3d876e078_Property 1=Default (7).png",
  "68db80d82e3a92ff1556059d_39d8ff0956c32711b38e925748b36b6b_Property 1=Default (9).png",
  "68db80d8d771fa26b6dccfb6_d8043d2faf4a6ce6788b023065beaa51_Property 1=Default (10).png",
  "68db80d8a90ccfaf42bcc4be_ce9cdae545db4c26a0bebd1d9a452503_Property 1=Default (11).png",
  "68db80d8cbb7f8ab52d73e17_e1236caaacd3875d47c57c223e78b85a_Property 1=Default (12).png",
  "68db80d8e4545f315a582a23_d811604ed257bab6737348ed27d9411e_Property 1=Default.png",
  "68ec91d546c6c49acfcd13ff_ff44ae82233274e3313bf9ffdf1c2418_Great_American-dark.png",
] as const;

function carrierLogoSrc(index: number) {
  const file = CARRIER_LOGO_FILES[index % CARRIER_LOGO_FILES.length]!;
  return `/images/carrier-logos/${encodeURIComponent(file)}`;
}

const STARTUP_LOGO_SRCS = [
  "/images/startups/logos/anzen.png",
  "/images/startups/logos/broker.png",
  "/images/startups/logos/coverwatch.png",
  "/images/startups/logos/harper.png",
  "/images/startups/logos/latent.png",
  "/images/startups/logos/rosella.png",
  "/images/startups/logos/snapbind.png",
  "/images/startups/logos/switchboard.png",
] as const;

function startupLogoSrc(index: number) {
  return STARTUP_LOGO_SRCS[index % STARTUP_LOGO_SRCS.length]!;
}

/** Agency Management logos for the integration wheel (broker wedge). */
const AMS_LOGO_SRCS = [
  "/images/integration/6908d813b05d9afef82c8174_Pathpoint.png",
  "/images/integration/6908d99d1b574322357c44ca_Berley Management.png",
  "/images/integration/6908d7241a971fabc9426e2b_Berley Net.png",
  "/images/integration/69099cbda97fb126ea005603_pie-logo 1.png",
  "/images/integration/6908d87bdd15a178cf40b9c0_Music.png",
  "/images/integration/6908d98e5a55d49b356ea110_Blitz.png",
  "/images/integration/6908d8945638e8bda39aa30e_Main Street.png",
  "/images/integration/6902494cbfbe5140228c9e2e_id4DBhSanf_logos.png",
] as const;

function amsLogoSrc(index: number) {
  const src = AMS_LOGO_SRCS[index % AMS_LOGO_SRCS.length]!;
  const parts = src.split("/");
  const file = parts.pop()!;
  return `${parts.join("/")}/${encodeURIComponent(file)}`;
}

/** Finance & Compliance logos for the integration wheel (developer wedge). */
const FINANCE_LOGO_SRCS = [
  "/images/integration/6908d93f3fa6d22abc9e2cb4_Counterpart.png",
  "/images/integration/6908d96ae1dd29eb1e8e2b61_CFC.png",
  "/images/integration/6908da6aad8d8eaa56f41b59_First.png",
  "/images/integration/6908da4150c7b5be003f9986_Merchants.png",
  "/images/integration/6908da5285fe10fae78777a4_Guard.png",
  "/images/integration/6908da7b931ed077a7209020_BiBerk.png",
  "/images/integration/6908d8aa7e0ec88da82d68ec_IAT.png",
  "/images/integration/6908d8290ffddd62a5e0f3a0_Northfield.png",
] as const;

function financeLogoSrc(index: number) {
  const src = FINANCE_LOGO_SRCS[index % FINANCE_LOGO_SRCS.length]!;
  const parts = src.split("/");
  const file = parts.pop()!;
  return `${parts.join("/")}/${encodeURIComponent(file)}`;
}

const LOGO_ROTATE_MS = 4500;
const LOGO_FADE_MS = 400;

function wait(ms: number, signal: { cancelled: boolean }) {
  return new Promise<void>((resolve) => {
    const id = window.setTimeout(() => {
      if (!signal.cancelled) resolve();
    }, ms);
    if (signal.cancelled) {
      window.clearTimeout(id);
      resolve();
    }
  });
}

const CX = 50;
const CY = 50;
const R_LINE_START = 7; // meets outer edge of center hub (w-[14%] → r = 7)
const R_LINE_END = 38;
const R_ITEM = 38;

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

function signalDotColor(showBackground: boolean, rampColor: string, isBelow: boolean) {
  if (showBackground) return rampColor;
  // Match side legend: upper = Carriers, lower = Startups
  return isBelow ? RAMP_COLOR.startup : RAMP_COLOR.carrier;
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
  const [carrierOffset, setCarrierOffset] = useState(0);
  const [carrierOpaque, setCarrierOpaque] = useState(true);
  const [startupOffset, setStartupOffset] = useState(0);
  const [startupOpaque, setStartupOpaque] = useState(true);
  const [amsOffset, setAmsOffset] = useState(0);
  const [amsOpaque, setAmsOpaque] = useState(true);
  const [financeOffset, setFinanceOffset] = useState(0);
  const [financeOpaque, setFinanceOpaque] = useState(true);

  const items = useMemo(() => {
    const angles = getNodeAngleByIndex(showBackground);
    const themes = getWheelThemes(showBackground);
    const perWedge = showBackground
      ? Math.floor(NODES.length / themes.length)
      : NODES.length;

    let upperSlot = 0;
    let lowerSlot = 0;
    let amsSlotIndex = 0;
    let financeSlotIndex = 0;

    return NODES.map((node, i) => {
      const angle = angles[i]!;
      if (!Number.isFinite(angle)) return null;

      const start = nodePolar(angle, R_LINE_START, showBackground);
      const end = nodePolar(angle, R_LINE_END, showBackground);
      const pos = nodePolar(angle, R_ITEM, showBackground);
      const ramp = showBackground
        ? themes[Math.min(Math.floor(i / perWedge), themes.length - 1)]!
        : node.ramp;
      const isBelow = pos.y > CY;

      let iconSrc = node.iconSrc;
      let carrierSlot: number | null = null;
      let startupSlot: number | null = null;
      let amsSlot: number | null = null;
      let financeSlot: number | null = null;

      if (!showBackground) {
        if (isBelow) {
          startupSlot = lowerSlot++;
          iconSrc = startupLogoSrc(startupSlot);
        } else {
          carrierSlot = upperSlot++;
          iconSrc = carrierLogoSrc(carrierSlot);
        }
      } else if (ramp === "carrier") {
        carrierSlot = upperSlot++;
        iconSrc = carrierLogoSrc(carrierSlot);
      } else if (ramp === "startup") {
        startupSlot = lowerSlot++;
        iconSrc = startupLogoSrc(startupSlot);
      } else if (ramp === "broker") {
        // Agency Management
        amsSlot = amsSlotIndex++;
        iconSrc = amsLogoSrc(amsSlot);
      } else if (ramp === "developer") {
        // Finance & Compliance
        financeSlot = financeSlotIndex++;
        iconSrc = financeLogoSrc(financeSlot);
      }

      return {
        ...node,
        iconSrc,
        carrierSlot,
        startupSlot,
        amsSlot,
        financeSlot,
        ramp,
        angle,
        start,
        end,
        pos,
        color: RAMP_COLOR[ramp],
        isBelow,
      };
    }).filter(Boolean) as Array<{
      name: string;
      category: string;
      iconSrc: string;
      carrierSlot: number | null;
      startupSlot: number | null;
      amsSlot: number | null;
      financeSlot: number | null;
      ramp: Ramp;
      angle: number;
      start: { x: number; y: number };
      end: { x: number; y: number };
      pos: { x: number; y: number };
      color: string;
      isBelow: boolean;
    }>;
  }, [showBackground]);

  const upperCarrierCount = useMemo(
    () => items.filter((item) => item.carrierSlot !== null).length,
    [items],
  );

  const lowerStartupCount = useMemo(
    () => items.filter((item) => item.startupSlot !== null).length,
    [items],
  );

  const amsCount = useMemo(
    () => items.filter((item) => item.amsSlot !== null).length,
    [items],
  );

  const financeCount = useMemo(
    () => items.filter((item) => item.financeSlot !== null).length,
    [items],
  );

  useEffect(() => {
    if (upperCarrierCount === 0) return;
    if (CARRIER_LOGO_FILES.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const signal = { cancelled: false };
    const step =
      CARRIER_LOGO_FILES.length > upperCarrierCount ? upperCarrierCount : 1;

    async function runCycle() {
      while (!signal.cancelled) {
        await wait(LOGO_ROTATE_MS, signal);
        if (signal.cancelled) break;

        setCarrierOpaque(false);
        await wait(LOGO_FADE_MS, signal);
        if (signal.cancelled) break;

        setCarrierOffset(
          (offset) => (offset + step) % CARRIER_LOGO_FILES.length,
        );
        setCarrierOpaque(true);
      }
    }

    runCycle();

    return () => {
      signal.cancelled = true;
    };
  }, [upperCarrierCount]);

  useEffect(() => {
    if (lowerStartupCount === 0) return;
    if (STARTUP_LOGO_SRCS.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const signal = { cancelled: false };
    const step =
      STARTUP_LOGO_SRCS.length > lowerStartupCount ? lowerStartupCount : 1;

    async function runCycle() {
      while (!signal.cancelled) {
        await wait(LOGO_ROTATE_MS, signal);
        if (signal.cancelled) break;

        setStartupOpaque(false);
        await wait(LOGO_FADE_MS, signal);
        if (signal.cancelled) break;

        setStartupOffset(
          (offset) => (offset + step) % STARTUP_LOGO_SRCS.length,
        );
        setStartupOpaque(true);
      }
    }

    runCycle();

    return () => {
      signal.cancelled = true;
    };
  }, [lowerStartupCount]);

  useEffect(() => {
    if (amsCount === 0) return;
    if (AMS_LOGO_SRCS.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const signal = { cancelled: false };
    const step = AMS_LOGO_SRCS.length > amsCount ? amsCount : 1;

    async function runCycle() {
      while (!signal.cancelled) {
        await wait(LOGO_ROTATE_MS, signal);
        if (signal.cancelled) break;

        setAmsOpaque(false);
        await wait(LOGO_FADE_MS, signal);
        if (signal.cancelled) break;

        setAmsOffset((offset) => (offset + step) % AMS_LOGO_SRCS.length);
        setAmsOpaque(true);
      }
    }

    runCycle();

    return () => {
      signal.cancelled = true;
    };
  }, [amsCount]);

  useEffect(() => {
    if (financeCount === 0) return;
    if (FINANCE_LOGO_SRCS.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const signal = { cancelled: false };
    const step = FINANCE_LOGO_SRCS.length > financeCount ? financeCount : 1;

    async function runCycle() {
      while (!signal.cancelled) {
        await wait(LOGO_ROTATE_MS, signal);
        if (signal.cancelled) break;

        setFinanceOpaque(false);
        await wait(LOGO_FADE_MS, signal);
        if (signal.cancelled) break;

        setFinanceOffset((offset) => (offset + step) % FINANCE_LOGO_SRCS.length);
        setFinanceOpaque(true);
      }
    }

    runCycle();

    return () => {
      signal.cancelled = true;
    };
  }, [financeCount]);

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
  // both ways (icon → hub and hub → icon), with a soft pulse on hub arrival.
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

    type Particle = {
      itemIndex: number;
      t: number;
      v: number;
      /** true = icon → hub, false = hub → icon */
      toHub: boolean;
    };
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
      // Two signals per spoke so flow is bidirectional.
      particles = items.flatMap((_, i) => [
        {
          itemIndex: i,
          t: (i * 0.137) % 1,
          v: 0.14 + (i % 3) * 0.035,
          toHub: true,
        },
        {
          itemIndex: i,
          t: (i * 0.137 + 0.5) % 1,
          v: 0.13 + ((i + 1) % 3) * 0.035,
          toHub: false,
        },
      ]);
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
          const dotColor = signalDotColor(showBackground, item.color, item.isBelow);
          context.beginPath();
          context.arc(lineX, lineY, 2.2, 0, Math.PI * 2);
          context.fillStyle = showBackground
            ? "rgba(255,255,255,0.95)"
            : hexToRgba(dotColor, 0.95);
          context.fill();
        }
      });
      context.setLineDash([]);

      // flowing signals - every spoke runs both directions
      if (!reduceMotion && signalsEnabledRef.current) {
        particles.forEach((p) => {
          const item = items[p.itemIndex];
          const lineProgress = spokeProgressRef.current[p.itemIndex] ?? 1;
          if (lineProgress < 1) return;

          p.t += p.v * dt;
          const hubPt = toPx(item.start.x, item.start.y);
          const nodePt = toPx(item.end.x, item.end.y);
          const from = p.toHub ? nodePt : hubPt;
          const to = p.toHub ? hubPt : nodePt;
          const dotColor = signalDotColor(showBackground, item.color, item.isBelow);

          if (p.t >= 1) {
            p.t %= 1;
            p.v = 0.13 + Math.random() * 0.09;
            if (p.toHub) {
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
          <WheelWedgeBackgrounds showBackground />
        </div>
      ) : null}

      {/* Spokes + flowing signal particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />

      {/* Hub - outer ring + inner logo circle */}
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

      {/* Tool nodes - wide rounded badges so logos stay readable */}
      <div className="absolute inset-0">
        {items.map((item, i) => {
          const src =
            item.carrierSlot !== null
              ? carrierLogoSrc(item.carrierSlot + carrierOffset)
              : item.startupSlot !== null
                ? startupLogoSrc(item.startupSlot + startupOffset)
                : item.amsSlot !== null
                  ? amsLogoSrc(item.amsSlot + amsOffset)
                  : item.financeSlot !== null
                    ? financeLogoSrc(item.financeSlot + financeOffset)
                    : item.iconSrc;
          const fading =
            (item.carrierSlot !== null && !carrierOpaque) ||
            (item.startupSlot !== null && !startupOpaque) ||
            (item.amsSlot !== null && !amsOpaque) ||
            (item.financeSlot !== null && !financeOpaque);

          return (
            <div
              key={i}
              data-tool-wheel-node={i}
              className="group absolute h-10 w-16 -translate-x-1/2 -translate-y-1/2 opacity-0 sm:h-11 sm:w-[4.75rem] md:h-12 md:w-20"
              style={{ left: `${item.pos.x}%`, top: `${item.pos.y}%` }}
              onMouseEnter={() => setHoveredLogo(i)}
              onMouseLeave={() => setHoveredLogo(null)}
            >
              <div className="flex size-full items-center justify-center overflow-hidden rounded-md border border-[#D3D1C7] bg-white px-1.5 py-1 transition-transform duration-200 group-hover:scale-110">
                <Image
                  src={src}
                  alt=""
                  width={64}
                  height={36}
                  className={`h-full w-full object-contain transition-opacity duration-[400ms] ease-out ${
                    fading ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}