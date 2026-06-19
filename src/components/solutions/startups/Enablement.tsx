"use client";

import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Building2,
  Settings2,
  Diamond,
  Sparkle,
  FileText,
  ShieldCheck,
  Triangle,
  type LucideIcon,
} from "lucide-react";

type NodeAnchor = "top" | "bottom" | "left" | "right";

type NodeDef = {
  id: string;
  label: string;
  icon: LucideIcon;
  position: { x: number; y: number };
  anchor: NodeAnchor;
};

const NODES: NodeDef[] = [
  {
    id: "market-access",
    label: "MARKET ACCESS",
    icon: Building2,
    position: { x: 50, y: 14 },
    anchor: "bottom",
  },
  {
    id: "api-integration",
    label: "API INTEGRATION",
    icon: Settings2,
    position: { x: 86, y: 34 },
    anchor: "left",
  },
  {
    id: "custom-policy",
    label: "CUSTOM POLICY",
    icon: Diamond,
    position: { x: 83, y: 50 },
    anchor: "left",
  },
  {
    id: "distribution-layer",
    label: "DISTRIBUTION LAYER",
    icon: Sparkle,
    position: { x: 86, y: 66 },
    anchor: "left",
  },
  {
    id: "licensing-provider",
    label: "LICENSING PROVIDER",
    icon: FileText,
    position: { x: 14, y: 34 },
    anchor: "right",
  },
  {
    id: "compliance",
    label: "COMPLIANCE",
    icon: ShieldCheck,
    position: { x: 17, y: 50 },
    anchor: "right",
  },
  {
    id: "enablement-partner",
    label: "ENABLEMENT PARTNER",
    icon: Triangle,
    position: { x: 14, y: 66 },
    anchor: "right",
  },
];

const CENTER = { x: 50, y: 50 };

const anchorTransform = (anchor: NodeAnchor) => {
  switch (anchor) {
    case "right":
      return "translate(-100%, -50%)";
    case "left":
      return "translate(0%, -50%)";
    case "bottom":
      return "translate(-50%, -100%)";
    default:
      return "translate(-50%, 0%)";
  }
};

const NodeCard = ({
  label,
  icon: Icon,
  anchor,
}: {
  label: string;
  icon: LucideIcon;
  anchor: NodeAnchor;
}) => (
  <div
    className="absolute"
    style={{
      transform: anchorTransform(anchor),
    }}
  >
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7F0",
        borderRadius: 8,
        padding: "8px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        minWidth: 168,
        boxShadow: "0 1px 4px rgba(80,80,120,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          fontFamily: "monospace",
          letterSpacing: "0.08em",
          color: "#3D3D5C",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            flexShrink: 0,
            border: "1px solid #E5E7F0",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={10} strokeWidth={2} color="#8B8BAD" />
        </div>
        {label}
      </div>
      <div
        style={{
          width: "55%",
          height: 3,
          borderRadius: 2,
          background: "#E8E8F4",
        }}
      />
    </div>
  </div>
);

type LineSegment = {
  cx: number;
  cy: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const DOT_ANIM_DUR = 2.8;
const DOT_STAGGER = 0.35;

type LineMode = "diagonal" | "horizontal" | "vertical";

const getLineMode = (node: NodeDef): LineMode => {
  if (node.id === "market-access") return "vertical";
  if (node.position.y === 50) return "horizontal";
  return "diagonal";
};

const DIAGONAL_DEG = 40;
const CIRCLE_START_RATIO = 0.38;
const DIAGONAL_REACH = 0.42;
const LINE_END_RATIO = 0.9;
const HORIZONTAL_LINE_END_RATIO = 0.86;
const LINE_CARD_GAP = 28;

const computeLineEndpoints = (
  cx: number,
  cy: number,
  nx: number,
  ny: number,
  circleR: number,
  mode: LineMode,
  endRatio: number,
  startRatio: number,
  cardGap = 0,
) => {
  let ux: number;
  let uy: number;

  if (mode === "vertical") {
    ux = 0;
    uy = -1;
  } else if (mode === "horizontal") {
    ux = nx > cx ? 1 : -1;
    uy = 0;
  } else {
    const goRight = nx > cx;
    const goDown = ny > cy;
    const rad = (DIAGONAL_DEG * Math.PI) / 180;
    ux = (goRight ? 1 : -1) * Math.cos(rad);
    uy = (goDown ? 1 : -1) * Math.sin(rad);
  }

  const startDist = circleR * startRatio;
  const ex = cx + ux * startDist;
  const ey = cy + uy * startDist;
  const anchorDist = (nx - cx) * ux + (ny - cy) * uy;
  let endDist = startDist + (anchorDist - startDist) * endRatio;
  if (cardGap > 0) {
    endDist = Math.max(startDist + 12, endDist - cardGap);
  }
  const dx = cx + ux * endDist;
  const dy = cy + uy * endDist;

  return { ex, ey, dx, dy };
};

const Enablement = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<LineSegment[]>([]);
  const [cardPositions, setCardPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  useEffect(() => {
    const compute = () => {
      const wrap = wrapRef.current;
      const circle = circleRef.current;
      if (!wrap || !circle) return;

      const wrapRect = wrap.getBoundingClientRect();
      const circleRect = circle.getBoundingClientRect();
      const width = wrapRect.width;
      const height = wrapRect.height;

      const cx = circleRect.left + circleRect.width / 2 - wrapRect.left;
      const cy = circleRect.top + circleRect.height / 2 - wrapRect.top;

      const CIRCLE_R = circleRect.width / 2;
      const diagonalReach = Math.min(width, height) * DIAGONAL_REACH;
      const nextCardPositions: Record<string, { x: number; y: number }> = {};

      const computed = NODES.map((node) => {
        const mode = getLineMode(node);
        let nx = (node.position.x / 100) * width;
        let ny = (node.position.y / 100) * height;

        if (mode === "diagonal") {
          const goRight = nx > cx;
          const goDown = ny > cy;
          const rad = (DIAGONAL_DEG * Math.PI) / 180;
          const ux = (goRight ? 1 : -1) * Math.cos(rad);
          const uy = (goDown ? 1 : -1) * Math.sin(rad);
          nx = cx + ux * diagonalReach;
          ny = cy + uy * diagonalReach;
          nextCardPositions[node.id] = {
            x: (nx / width) * 100,
            y: (ny / height) * 100,
          };
        }

        const endRatio =
          mode === "horizontal" ? HORIZONTAL_LINE_END_RATIO : LINE_END_RATIO;
        const cardGap =
          mode === "horizontal"
            ? LINE_CARD_GAP
            : mode === "diagonal"
              ? 20
              : 16;

        const { ex, ey, dx, dy } = computeLineEndpoints(
          cx,
          cy,
          nx,
          ny,
          CIRCLE_R,
          mode,
          endRatio,
          CIRCLE_START_RATIO,
          cardGap,
        );

        return {
          cx,
          cy,
          x1: ex,
          y1: ey,
          x2: dx,
          y2: dy,
        };
      });

      setCardPositions(nextCardPositions);

      setLines(computed);
    };

    compute();
    const raf = requestAnimationFrame(compute);

    const wrap = wrapRef.current;
    if (!wrap) return () => cancelAnimationFrame(raf);

    const observer = new ResizeObserver(compute);
    observer.observe(wrap);

    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-10 lg:pb-12">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end space-y-5">
              <h2
                ref={headingRef}
                className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Interested in becoming a </span>
                <span data-split style={{ color: "#3933A1" }}>
                  program partner?
                </span>
              </h2>
              <Button href="/" variant="outline">
                Book a Call
              </Button>
            </div>

            <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                We partner with market access and enablement providers that help
                early-stage digital brokerages launch faster. If your business supports
                that journey, we&apos;d like to hear from you.
              </p>
            </div>
          </div>

          {/* Diagram area */}
          <div
            ref={wrapRef}
            className="relative mt-12 w-full md:mt-14 lg:mt-16 aspect-[16/12] max-h-[580px] min-h-[380px]"
          >
            <svg
              ref={svgRef}
              className="absolute inset-0 h-full w-full overflow-visible"
              style={{ pointerEvents: "none" }}
            >
              <defs>
                {lines.map((line, i) => (
                  <path
                    key={`path-${i}`}
                    id={`enablement-line-${i}`}
                    d={`M ${line.cx} ${line.cy} L ${line.x2} ${line.y2}`}
                    fill="none"
                  />
                ))}
              </defs>

              {lines.map((line, i) => (
                <g key={i}>
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#9488E4"
                    strokeWidth={1}
                    strokeDasharray="3 4"
                    opacity={0.8}
                  />
                  {!reduceMotion && (
                    <circle r={2.5} fill="#4A36CA">
                      <animateMotion
                        dur={`${DOT_ANIM_DUR}s`}
                        begin={`${i * DOT_STAGGER}s`}
                        repeatCount="indefinite"
                        rotate="none"
                      >
                        <mpath href={`#enablement-line-${i}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.06;0.88;1"
                        dur={`${DOT_ANIM_DUR}s`}
                        begin={`${i * DOT_STAGGER}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              ))}
            </svg>

            {/* Central circle */}
            <div
              ref={circleRef}
              className="absolute w-40 aspect-square border border-[#ECE7FF] bg-white rounded-full flex items-center justify-center"
              style={{
                left: `${CENTER.x}%`,
                top: `${CENTER.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div className="w-20 aspect-square bg-[#ECE7FF] rounded-full flex items-center justify-center">
                <Image
                  src="/footer-logo.svg"
                  alt="Coverforce"
                  width={36}
                  height={36}
                />
              </div>
            </div>

            {/* Node cards */}
            {NODES.map((node) => {
              const pos = cardPositions[node.id] ?? node.position;
              return (
                <div
                  key={node.id}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    zIndex: 20,
                  }}
                >
                  <NodeCard
                    label={node.label}
                    icon={node.icon}
                    anchor={node.anchor}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Enablement;