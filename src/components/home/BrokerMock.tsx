"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatedFortyPlus,
  AnimatedSixtyPercent,
} from "@/components/common/AnimatedPercent";
import {
  MICRO_CHART_MS,
  MICRO_CHART_STAGGER_MS,
  MICRO_EASE,
  MICRO_WORKFLOW_DELAY_MS,
  MICRO_WORKFLOW_MS,
} from "@/lib/motion";

const CHART_BARS = [15, 25, 35, 45, 55, 65, 75, 85] as const;
const WORKFLOW_FILL_PERCENT = 62;

export default function BrokerMock() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setAnimate(true);
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      style={{ height: "260px", maxWidth: "300px" }}
    >
      <div
        className="absolute top-0 -right-20 w-full overflow-hidden rounded-2xl bg-white"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
      >
        <div className="px-5 pt-4 pb-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Quotes Returned Today
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-1 text-[#0a143b]">
            <AnimatedFortyPlus className="text-[22px] font-bold leading-tight" />
            <span className="text-[22px] font-bold leading-tight"> carriers</span>
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        <div className="flex items-end gap-3 px-5 pt-3 pb-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[#0a143b]">AI pre-filled application</p>
            <p className="mt-0.5 text-[10px] text-neutral-400">Pipeline visible</p>
          </div>

          <div className="flex shrink-0 items-end gap-[5px]">
            {CHART_BARS.map((targetHeight, i) => (
              <div
                key={i}
                className="origin-bottom rounded-t-[3px] will-change-transform"
                style={{
                  width: "10px",
                  height: `${targetHeight}px`,
                  background: "#5B35E0",
                  opacity: animate ? 0.35 + i * 0.09 : 0.2,
                  transform: animate ? "scaleY(1)" : "scaleY(0)",
                  transition: [
                    `transform ${MICRO_CHART_MS}ms ${MICRO_EASE}`,
                    `opacity ${MICRO_CHART_MS}ms ${MICRO_EASE}`,
                  ].join(", "),
                  transitionDelay: `${i * MICRO_CHART_STAGGER_MS}ms`,
                }}
              />
            ))}
            <div className="ml-0.5 flex items-center self-stretch">
              <span
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "7px",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#a3a3a3",
                  lineHeight: 1,
                }}
              >
                Time
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 -left-20 z-10 w-full overflow-hidden rounded-2xl bg-white"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <span
            className="flex shrink-0 items-center justify-center rounded-full bg-neutral-100"
            style={{ width: "32px", height: "32px" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="5" r="2.8" stroke="#9ca3af" strokeWidth="1" />
              <path
                d="M2 13c0-3.038 2.462-5.5 5.5-5.5S13 9.962 13 13"
                stroke="#9ca3af"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-[13px] font-bold leading-tight text-[#0a143b]">
              Broker Workflow
            </p>
            <p className="text-[10px] leading-tight text-neutral-400">
              One workflow for every producer
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1.5px dashed #e5e7eb",
            marginLeft: "16px",
            marginRight: "16px",
          }}
        />

        <div className="px-4 pt-3 pb-4">
          <AnimatedSixtyPercent className="text-[34px] font-bold leading-none text-[#0a143b]" />
          <div className="flex items-start gap-4 pt-3">
            <div className="shrink-0">
              <p
                className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "#5B35E0" }}
              >
                Faster Quoting
              </p>
              <p className="mt-0.5 text-[9px] text-neutral-400">Quote time reduction</p>
            </div>

            <div className="flex-1 pt-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Intake
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Bind
                </span>
              </div>
              <div
                className="relative overflow-hidden rounded-full"
                style={{ height: "8px", background: "#e5e7eb" }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full will-change-[width]"
                  style={{
                    width: animate ? `${WORKFLOW_FILL_PERCENT}%` : "0%",
                    background:
                      "linear-gradient(90deg, #5B35E0 0%, #A78BFA 100%)",
                    transition: `width ${MICRO_WORKFLOW_MS}ms ${MICRO_EASE}`,
                    transitionDelay: `${MICRO_WORKFLOW_DELAY_MS}ms`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
