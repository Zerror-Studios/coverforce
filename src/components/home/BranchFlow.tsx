"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ReactNode } from "react";
import { RiCheckLine, RiStackLine } from "@remixicon/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type BranchFlowProps = {
  className?: string;
};

const LINE = "#FFFFFF";
const LINE_DIM = "#FFFFFF";
const MUTED = "#8A8A8A";
const DOTTED = "4 5";

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
            strokeDasharray={DOTTED}
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
            strokeDasharray={DOTTED}
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
  group,
}: {
  x: number;
  y: number;
  children: ReactNode;
  className?: string;
  group?: string;
}) {
  return (
    <div
      data-bf-group={group}
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

function prepDraw(el: SVGGeometryElement) {
  const length = el.getTotalLength();
  el.style.strokeDasharray = `${length}`;
  el.style.strokeDashoffset = `${length}`;
  return length;
}

function finishDotted(el: SVGGeometryElement) {
  el.style.strokeDasharray = DOTTED;
  el.style.strokeDashoffset = "0";
}

export default function BranchFlow({ className = "" }: BranchFlowProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const productionPill = root.querySelector<HTMLElement>("[data-bf='production-pill']");
      const prod1 = root.querySelector<SVGLineElement>("[data-bf='prod-1']");
      const prod2 = root.querySelector<SVGLineElement>("[data-bf='prod-2']");
      const prod3 = root.querySelector<SVGLineElement>("[data-bf='prod-3']");
      const prod4 = root.querySelector<SVGLineElement>("[data-bf='prod-4']");

      const previewCurve = root.querySelector<SVGPathElement>("[data-bf='preview-curve']");
      const previewLine = root.querySelector<SVGLineElement>("[data-bf='preview-line']");
      const testCurve = root.querySelector<SVGPathElement>("[data-bf='test-curve']");
      const testLine = root.querySelector<SVGLineElement>("[data-bf='test-line']");
      const devCurve = root.querySelector<SVGPathElement>("[data-bf='dev-curve']");
      const devLine = root.querySelector<SVGLineElement>("[data-bf='dev-line']");

      const time1 = root.querySelector<SVGTextElement>("[data-bf='time-1']");
      const time2 = root.querySelector<SVGTextElement>("[data-bf='time-2']");
      const time3 = root.querySelector<SVGTextElement>("[data-bf='time-3']");

      const previewUi = root.querySelectorAll<HTMLElement>("[data-bf-group='preview']");
      const testUi = root.querySelectorAll<HTMLElement>("[data-bf-group='test']");
      const devUi = root.querySelectorAll<HTMLElement>("[data-bf-group='dev']");

      const drawables = [
        prod1,
        prod2,
        prod3,
        prod4,
        previewCurve,
        previewLine,
        testCurve,
        testLine,
        devCurve,
        devLine,
      ].filter(Boolean) as SVGGeometryElement[];

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        drawables.forEach((el) => {
          if (
            el.hasAttribute("data-dotted") ||
            el.getAttribute("stroke-dasharray") === DOTTED
          ) {
            finishDotted(el);
          } else {
            el.style.strokeDasharray = "none";
            el.style.strokeDashoffset = "0";
          }
        });
        gsap.set([productionPill, ...previewUi, ...testUi, ...devUi, time1, time2, time3], {
          autoAlpha: 1,
        });
        return;
      }

      drawables.forEach(prepDraw);
      gsap.set([productionPill, ...previewUi, ...testUi, ...devUi, time1, time2, time3], {
        autoAlpha: 0,
      });

      const draw = (
        el: SVGGeometryElement | null,
        duration: number,
        dotted = false,
      ) => {
        if (!el) return { duration: 0 };
        return {
          strokeDashoffset: 0,
          duration,
          ease: "power1.inOut",
          onComplete: dotted ? () => finishDotted(el) : undefined,
        };
      };

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power1.inOut" },
      });

      const fadeIn = (targets: gsap.TweenTarget, at: number | string) => {
        tl.to(targets, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, at);
      };

      // 1) Production capsule + line draws toward 18:24
      fadeIn(productionPill, 0);
      if (prod1) tl.to(prod1, draw(prod1, 0.7), 0.15);

      // 2) 18:24 — preview branch draws
      fadeIn(time1, "-=0.1");
      if (previewCurve) tl.to(previewCurve, draw(previewCurve, 0.55, true), "-=0.05");
      if (previewLine) tl.to(previewLine, draw(previewLine, 0.7, true), "-=0.15");
      fadeIn(previewUi, "-=0.35");

      // 3) Production continues to 19:08
      if (prod2) tl.to(prod2, draw(prod2, 0.55), "-=0.1");

      // 4) 19:08 — test branch draws
      fadeIn(time2, "-=0.1");
      if (testCurve) tl.to(testCurve, draw(testCurve, 0.55, true), "-=0.05");
      if (testLine) tl.to(testLine, draw(testLine, 0.75, true), "-=0.15");
      fadeIn(testUi, "-=0.35");

      // 5) Production continues to 20:32
      if (prod3) tl.to(prod3, draw(prod3, 0.55), "-=0.1");

      // 6) 20:32 — dev branch draws
      fadeIn(time3, "-=0.1");
      if (devCurve) tl.to(devCurve, draw(devCurve, 0.55, true), "-=0.05");
      if (devLine) tl.to(devLine, draw(devLine, 0.65, true), "-=0.15");
      fadeIn(devUi, "-=0.35");

      // 7) Production finishes to the end
      if (prod4) tl.to(prod4, draw(prod4, 0.5), "-=0.15");

      const uiTargets = [
        productionPill,
        ...previewUi,
        ...testUi,
        ...devUi,
        time1,
        time2,
        time3,
      ];

      const resetAndReplay = () => {
        drawables.forEach(prepDraw);
        gsap.set(uiTargets, { autoAlpha: 0 });
        tl.restart();
      };

      tl.eventCallback("onComplete", () => {
        gsap.delayedCall(3, resetAndReplay);
      });

      const isTreeVisible = () => {
        let node: HTMLElement | null = root;
        while (node && node !== document.body) {
          const style = getComputedStyle(node);
          if (style.opacity === "0" || style.visibility === "hidden") return false;
          node = node.parentElement;
        }
        return true;
      };

      const playWhenVisible = () => {
        if (isTreeVisible()) {
          tl.play(0);
          return;
        }
        requestAnimationFrame(playWhenVisible);
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: playWhenVisible,
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
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
          {/* Production spine in segments for sequential draw */}
          <line
            data-bf="prod-1"
            x1="132"
            y1="210"
            x2="260"
            y2="210"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="butt"
          />
          <line
            data-bf="prod-2"
            x1="260"
            y1="210"
            x2="480"
            y2="210"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="butt"
          />
          <line
            data-bf="prod-3"
            x1="480"
            y1="210"
            x2="740"
            y2="210"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="butt"
          />
          <line
            data-bf="prod-4"
            x1="740"
            y1="210"
            x2="1100"
            y2="210"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="butt"
          />

          {/* Preview branch */}
          <path
            data-bf="preview-curve"
            data-dotted
            d="M260 210 C260 168 278 128 320 118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray={DOTTED}
          />
          <line
            data-bf="preview-line"
            data-dotted
            x1="320"
            y1="118"
            x2="620"
            y2="118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray={DOTTED}
          />

          {/* Test branch */}
          <path
            data-bf="test-curve"
            data-dotted
            d="M480 210 C480 252 498 292 540 302"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray={DOTTED}
          />
          <line
            data-bf="test-line"
            data-dotted
            x1="540"
            y1="302"
            x2="880"
            y2="302"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray={DOTTED}
          />

          {/* Dev branch */}
          <path
            data-bf="dev-curve"
            data-dotted
            d="M740 210 C740 168 758 128 800 118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray={DOTTED}
          />
          <line
            data-bf="dev-line"
            data-dotted
            x1="800"
            y1="118"
            x2="1020"
            y2="118"
            stroke={LINE_DIM}
            strokeWidth="1.5"
            strokeDasharray={DOTTED}
          />

          <text
            data-bf="time-1"
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
            data-bf="time-2"
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
            data-bf="time-3"
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
            data-bf="production-pill"
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
          <Pos group="preview" x={278} y={150}>
            <NodeBadge>
              <svg viewBox="0 0 16 16" className="size-3 sm:size-3.5" aria-hidden>
                <path fill="#fff" d="M8 1.5 14.5 13.5H1.5L8 1.5Z" />
              </svg>
            </NodeBadge>
          </Pos>
          <div
            data-bf-group="preview"
            className="absolute flex items-center gap-2 sm:gap-3"
            style={{
              left: `${(350 / 1100) * 100}%`,
              top: `${(118 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <BranchPill label="preview-branch" />
          </div>
          <Pos group="preview" x={540} y={118}>
            <StatusTickAbove label="PR open" />
          </Pos>
          <Pos group="preview" x={620} y={118}>
            <StatusTickAbove label="PR merged" />
          </Pos>
          <div
            data-bf-group="preview"
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
          <Pos group="test" x={498} y={270}>
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
            data-bf-group="test"
            className="absolute flex items-center gap-2 sm:gap-3"
            style={{
              left: `${(570 / 1100) * 100}%`,
              top: `${(302 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <BranchPill label="test-branch" />
          </div>
          <Pos group="test" x={740} y={302}>
            <StatusTickBelow label="tests running" />
          </Pos>
          <Pos group="test" x={880} y={302}>
            <StatusTickBelow label="checks passed" />
          </Pos>
          <div
            data-bf-group="test"
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
          <Pos group="dev" x={758} y={150}>
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
            data-bf-group="dev"
            className="absolute flex items-center gap-2 sm:gap-3"
            style={{
              left: `${(830 / 1100) * 100}%`,
              top: `${(118 / 420) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <BranchPill label="dev-branch" active />
          </div>
          <Pos group="dev" x={1020} y={118}>
            <StatusTickAbove label="dev in progress" />
          </Pos>
        </div>
      </div>
    </div>
  );
}
