"use client";

import { useRef, useState, useLayoutEffect } from "react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

// One arc = one step. Dots sit at the two base endpoints of the arc.
// The icon sits centered above the arc's peak.
const VISIBLE_STEPS = 3.5; // how many steps should be visible across the full container width
const ICON_RATIO = 0.1;    // icon radius as a fraction of ARC_W, keeps icon size proportional
const SIDE_PAD = 14;        // left/right breathing room so the first/last dot and icon aren't clipped flush against the edge
const DOT_R = 5;

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
  active: boolean;
  icon: WorkflowIconKey;
};

const steps: WorkflowStep[] = [
  { label: "Smart Intake", active: true, icon: "mail" },
  { label: "Manual Review", active: false, icon: "doc" },
  { label: "Re-enter Data", active: false, icon: "refresh" },
  { label: "Wait for Quotes", active: false, icon: "clock" },
  { label: "Manual Compare", active: false, icon: "scale" },
  { label: "Bind and Issue", active: false, icon: "check" },
];

function WorkflowConnector({ steps }: { steps: WorkflowStep[] }) {
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

  // ARC_W scales so that VISIBLE_STEPS arcs exactly fill the measured container width.
  const ARC_W = containerWidth > 0 ? containerWidth / VISIBLE_STEPS : 200;
  const ARC_H = ARC_W / 2;
  const ICON_R = Math.max(18, ARC_W * ICON_RATIO);
  const TOP_PAD = ICON_R + 16;

  const totalWidth = steps.length * ARC_W + SIDE_PAD * 2;
  const svgHeight = TOP_PAD + ARC_H + DOT_R + 4;

  return (
    <div ref={wrapperRef} className="w-full overflow-hidden">
      {/* Labels */}
      <div className="flex" style={{ width: totalWidth }}>
        <div style={{ width: SIDE_PAD, flexShrink: 0 }} />
        {steps.map((step) => (
          <div key={step.label} className="flex justify-center" style={{ width: ARC_W }}>
            <span
              className="text-sm md:text-base font-semibold whitespace-nowrap"
              style={{ color: step.active ? "#2B409E" : "#373737" }}
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
            <stop offset="0%" stopColor="#2B409E" stopOpacity="0" />
            <stop offset="100%" stopColor="#2B409E" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <g transform={`translate(${SIDE_PAD}, ${TOP_PAD})`}>
          {steps.map((step, i) => {
            const x1 = i * ARC_W;
            const x2 = x1 + ARC_W;
            const cx = x1 + ARC_W / 2;
            const r = ARC_W / 2;
            const arcPath = `M ${x1} ${ARC_H} A ${r} ${r} 0 0 1 ${x2} ${ARC_H}`;
            const fillPath = `${arcPath} L ${x1} ${ARC_H} Z`;

            return (
              <g key={step.label}>
                {step.active && <path d={fillPath} fill="url(#arcGradient)" />}
                <path
                  d={arcPath}
                  fill="none"
                  stroke={step.active ? "#2B409E" : "#a8adb4"}
                  strokeWidth={step.active ? 2 : 1.5}
                  strokeDasharray="3 6"
                  strokeLinecap="round"
                />
                {/* base dots for this arc */}
                <circle cx={x1} cy={ARC_H} r={DOT_R} fill="#2B409E" />
                <circle cx={x2} cy={ARC_H} r={DOT_R} fill="#2B409E" />
                {/* icon above the peak */}
                <circle
                  cx={cx}
                  cy={0}
                  r={ICON_R}
                  fill={step.active ? "#2B409E" : "#eef0f3"}
                  stroke={step.active ? "none" : "#d7dae0"}
                />
                <g
                  transform={`translate(${cx - ICON_R * 0.46}, ${-ICON_R * 0.46})`}
                  style={{ color: step.active ? "#ffffff" : "#5b6472" }}
                >
                  <svg width={ICON_R * 0.92} height={ICON_R * 0.92} viewBox="0 0 24 24">
                    {ICONS[step.icon]}
                  </svg>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

const Workflow = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  return (
    <section ref={sectionRef} className=" bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="py-16  md:py-20 lg:py-24 lg:pb-12 flex flex-col justify-between h-screen">
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
              <Button href="/" variant="outline">
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
            <WorkflowConnector steps={steps} />
          </div>

          <p
            className="max-w-2xl text-3xl font-heading font-medium leading-[1.12] tracking-tight md:text-4xl lg:text-2xl lg:leading-[1.12]"
          >AI reads inbound emails, ACORDs, loss runs, and prior policies. Turns unstructured submissions into clean, structured applications. Auto-fills key policy, business, and risk details. Routes submissions to the right underwriter or desk.</p>
        </div>
      </Container>
    </section>
  );
};

export default Workflow;