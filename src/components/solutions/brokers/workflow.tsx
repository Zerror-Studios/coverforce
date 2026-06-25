"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

// One arc = one step. Dots sit at the two base endpoints of the arc.
// The icon sits centered above the arc's peak.
const VISIBLE_STEPS = 3.5; // how many steps should be visible across the full container width
const ICON_RATIO = 0.1;    // icon radius as a fraction of ARC_W, keeps icon size proportional
const SIDE_PAD = 14;        // left/right breathing room so the first/last dot and icon aren't clipped flush against the edge
const DOT_R = 5;

// Colors
const ACTIVE_COLOR = "#2B409E";
const INACTIVE_TEXT = "#373737";
const INACTIVE_STROKE = "#a8adb4";
const INACTIVE_CIRCLE_FILL = "#eef0f3";
const INACTIVE_CIRCLE_STROKE = "#d7dae0";
const INACTIVE_ICON = "#5b6472";
const PARAGRAPH_GRAY = "#b9bfc9";

// Phase boundaries within a single step's local progress (0..1).
// 0 -> ARC_DRAW_END: the arc draws in
// ARC_DRAW_END -> COLOR_END: icon + circle + label crossfade to active color
// TEXT_START -> 1: paragraph letters fill from gray to blue
const ARC_DRAW_END = 0.35;
const COLOR_END = 0.55;
const TEXT_START = 0.55;
const PARAGRAPH_FADE_IN_END = 0.15;

const ICONS = {
  mail: (
    <path d="M3 6h18v12H3V6zm0 0l9 7 9-7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  doc: (
    <path d="M6 3h8l4 4v14H6V3zm8 0v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  refresh: (
    <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M4 4v5h5M20 20v-5h-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  clock: (
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  scale: (
    <path d="M12 3v18M5 7l-3 7a3 3 0 0 0 6 0L5 7zm14 0l-3 7a3 3 0 0 0 6 0l-3-7zM5 7h14M8 21h8" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  check: (
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
} as const;

type WorkflowIconKey = keyof typeof ICONS;

type WorkflowStep = {
  label: string;
  icon: WorkflowIconKey;
  text: string;
};

const steps: WorkflowStep[] = [
  {
    label: "Smart Intake",
    icon: "mail",
    text: "AI reads inbound emails, ACORDs, loss runs, and prior policies. Turns unstructured submissions into clean, structured applications. Auto-fills key policy, business, and risk details. Routes submissions to the right underwriter or desk.",
  },
  {
    label: "Manual Review",
    icon: "doc",
    text: "Underwriters comb through every submission by hand, checking for missing data, inconsistent formatting, and compliance gaps before a quote can even begin.",
  },
  {
    label: "Re-enter Data",
    icon: "refresh",
    text: "Producers retype the same applicant details into multiple carrier portals, copying values from PDFs and emails one field at a time.",
  },
  {
    label: "Wait for Quotes",
    icon: "clock",
    text: "Submissions sit in carrier queues for days while underwriters work through backlogs, leaving producers chasing status updates instead of clients.",
  },
  {
    label: "Manual Compare",
    icon: "scale",
    text: "Spreadsheets get built by hand to line up coverage limits, exclusions, and premiums across carriers before a recommendation can be made.",
  },
  {
    label: "Bind and Issue",
    icon: "check",
    text: "Once a quote is approved, policies are bound and issued instantly, with documents delivered straight to the producer and client in one connected flow.",
  },
];

// --- helpers -----------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = parseInt(h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function lerpColor(a: string, b: string, t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const r = Math.round(r1 + (r2 - r1) * clamped);
  const g = Math.round(g1 + (g2 - g1) * clamped);
  const bl = Math.round(b1 + (b2 - b1) * clamped);
  return `rgb(${r}, ${g}, ${bl})`;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

// --- letter-by-letter fill text -----------------------------------------

function FillText({ text, progress }: { text: string; progress: number }) {
  const filledCount = Math.floor(text.length * clamp01(progress));
  return (
    <>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            color: i < filledCount ? ACTIVE_COLOR : PARAGRAPH_GRAY,
            transition: "color 0.12s linear",
          }}
        >
          {ch}
        </span>
      ))}
    </>
  );
}

// --- single arc + dot + icon for one step -------------------------------

function ArcStep({
  step,
  x1,
  x2,
  cx,
  ARC_H,
  r,
  ICON_R,
  arcFill,
  colorActv,
}: {
  step: WorkflowStep;
  x1: number;
  x2: number;
  cx: number;
  ARC_H: number;
  r: number;
  ICON_R: number;
  arcFill: number;
  colorActv: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  const arcPath = `M ${x1} ${ARC_H} A ${r} ${r} 0 0 1 ${x2} ${ARC_H}`;
  const fillPath = `${arcPath} L ${x1} ${ARC_H} Z`;

  useLayoutEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [arcPath]);

  const dashOffset = length * (1 - clamp01(arcFill));
  const circleFill = lerpColor(INACTIVE_CIRCLE_FILL, ACTIVE_COLOR, colorActv);
  const circleStroke = lerpColor(INACTIVE_CIRCLE_STROKE, ACTIVE_COLOR, colorActv);
  const iconColor = lerpColor(INACTIVE_ICON, "#ffffff", colorActv);

  return (
    <g>
      {arcFill > 0 && <path d={fillPath} fill="url(#arcGradient)" opacity={clamp01(arcFill)} />}

      {/* background dashed track, always visible */}
      <path
        d={arcPath}
        fill="none"
        stroke={INACTIVE_STROKE}
        strokeWidth={1.5}
        strokeDasharray="3 6"
        strokeLinecap="round"
      />

      {/* foreground solid arc that draws in as arcFill increases */}
      <path
        ref={pathRef}
        d={arcPath}
        fill="none"
        stroke={ACTIVE_COLOR}
        strokeWidth={2}
        strokeLinecap="round"
        style={{
          strokeDasharray: length || undefined,
          strokeDashoffset: length ? dashOffset : undefined,
          opacity: length ? 1 : 0,
        }}
      />

      <circle cx={x1} cy={ARC_H} r={DOT_R} fill={ACTIVE_COLOR} />
      <circle cx={x2} cy={ARC_H} r={DOT_R} fill={ACTIVE_COLOR} />

      <circle
        cx={cx}
        cy={0}
        r={ICON_R}
        fill={circleFill}
        stroke={circleStroke}
        strokeOpacity={1 - colorActv}
      />
      <g transform={`translate(${cx - ICON_R * 0.46}, ${-ICON_R * 0.46})`} style={{ color: iconColor }}>
        <svg width={ICON_R * 0.92} height={ICON_R * 0.92} viewBox="0 0 24 24">
          {ICONS[step.icon]}
        </svg>
      </g>
    </g>
  );
}

// --- connector row (labels + svg arcs) ----------------------------------

function WorkflowConnector({ steps, rawIndex }: { steps: WorkflowStep[]; rawIndex: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ARC_W = containerWidth > 0 ? containerWidth / VISIBLE_STEPS : 200;
  const ARC_H = ARC_W / 2;
  const ICON_R = Math.max(18, ARC_W * ICON_RATIO);
  const TOP_PAD = ICON_R + 16;

  const totalWidth = steps.length * ARC_W + SIDE_PAD * 2;
  const svgHeight = TOP_PAD + ARC_H + DOT_R + 4;

  const activeIndex = Math.min(steps.length - 1, Math.floor(rawIndex));
  const stepProgress = clamp01(rawIndex - activeIndex);

  // Keep the first three circles in place, then slide the strip left so
  // later steps scroll into view. The shift is scaled so it lands exactly
  // on maxShift (last circle flush against the right edge) at rawIndex ===
  // steps.length, instead of overshooting past it.
  const SHIFT_START = 2;
  const maxShift = containerWidth > 0 ? Math.max(0, totalWidth - containerWidth) : 0;
  const shiftRange = Math.max(0.0001, steps.length - SHIFT_START);
  const shiftProgress = clamp01((rawIndex - SHIFT_START) / shiftRange);
  const shift = shiftProgress * maxShift;

  const getArcFill = (i: number) => {
    if (i < activeIndex) return 1;
    if (i > activeIndex) return 0;
    return stepProgress / ARC_DRAW_END;
  };
  const getColorActv = (i: number) => {
    if (i < activeIndex) return 1;
    if (i > activeIndex) return 0;
    return (stepProgress - ARC_DRAW_END) / (COLOR_END - ARC_DRAW_END);
  };

  return (
    <div ref={wrapperRef} className="w-full overflow-hidden">
      {/* Labels */}
      <div className="flex" style={{ width: totalWidth, transform: `translateX(-${shift}px)` }}>
        <div style={{ width: SIDE_PAD, flexShrink: 0 }} />
        {steps.map((step, i) => (
          <div key={step.label} className="flex justify-center" style={{ width: ARC_W }}>
            <span
              className="text-sm md:text-base font-semibold whitespace-nowrap"
              style={{ color: lerpColor(INACTIVE_TEXT, ACTIVE_COLOR, getColorActv(i)) }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Arcs */}
      <svg width={totalWidth} height={svgHeight} viewBox={`0 0 ${totalWidth} ${svgHeight}`}>
        <defs>
          <linearGradient id="arcGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={ACTIVE_COLOR} stopOpacity="0" />
            <stop offset="100%" stopColor={ACTIVE_COLOR} stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <g transform={`translate(${SIDE_PAD - shift}, ${TOP_PAD})`}>
          {steps.map((step, i) => {
            const x1 = i * ARC_W;
            const x2 = x1 + ARC_W;
            const cx = x1 + ARC_W / 2;
            const r = ARC_W / 2;

            return (
              <ArcStep
                key={step.label}
                step={step}
                x1={x1}
                x2={x2}
                cx={cx}
                ARC_H={ARC_H}
                r={r}
                ICON_R={ICON_R}
                arcFill={getArcFill(i)}
                colorActv={getColorActv(i)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// --- main section --------------------------------------------------------

const Workflow = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [rawIndex, setRawIndex] = useState(0);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setRawIndex(0);
        return;
      }
      const scrolled = Math.min(scrollable, Math.max(0, -rect.top));
      const progress = scrolled / scrollable;
      setRawIndex(progress * steps.length);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = Math.min(steps.length - 1, Math.floor(rawIndex));
  const stepProgress = clamp01(rawIndex - activeIndex);
  const paragraphOpacity = Math.min(1, stepProgress / PARAGRAPH_FADE_IN_END);
  const textFill = clamp01((stepProgress - TEXT_START) / (1 - TEXT_START));
  const activeStep = steps[activeIndex];

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom={true}>
        {/* Tall scroll track. Its height determines how much scroll distance
            it takes to move through all steps while the content stays pinned. */}
        <div ref={trackRef} style={{ height: `${(steps.length + 1) * 100}vh` }} className="relative">
          <div className="sticky top-0 h-screen py-16 md:py-20 lg:py-24 lg:pb-12 flex flex-col justify-between overflow-hidden">
            <div
              ref={headerRef}
              className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
            >
              <div className="flex flex-col justify-end space-y-5">
                <h2
                  ref={headingRef}
                  className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                >
                  <span data-split>From intake to bind, <br />
                    reimagined
                  </span>
                  <span data-split>.</span>
                </h2>
                <Button href="/">
                  Start a quote
                </Button>
              </div>

              <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
                <p
                  ref={descRef}
                  className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
                >
                  See how manual workflows compare to CoverForce — from smart intake
                  through bind, in one connected platform built for every producer.
                </p>
              </div>
            </div>

            <div className="w-full">
              <WorkflowConnector steps={steps} rawIndex={rawIndex} />
            </div>

            <div className="flex min-h-44 items-end md:min-h-52 lg:min-h-28">
              <p
                key={activeIndex}
                className="max-w-2xl text-3xl font-heading font-medium leading-[1.12] tracking-tight md:text-4xl lg:text-2xl lg:leading-[1.12]"
                style={{ opacity: paragraphOpacity, transition: "opacity 0.3s ease" }}
              >
                <FillText text={activeStep.text} progress={textFill} />
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Workflow;