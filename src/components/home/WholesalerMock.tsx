"use client";

import { useEffect, useRef, useState } from "react";
import {
  MICRO_BAR_MS,
  MICRO_EASE,
  MICRO_ENTRANCE_MS,
  microRevealStyle,
} from "@/lib/motion";

const LIMIT_ROWS = [
  { label: "General Liability", value: "$1,000,000" },
  { label: "Automobile Liability", value: "$500,000" },
  { label: "Umbrella Liability", value: "$5,000,000" },
] as const;

export default function WholesalerMock() {
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
    <div ref={rootRef} className="relative -ml-32 w-full max-w-[290px]">
      <div
        className="absolute top-0 -right-32 z-20 w-full rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] will-change-[opacity,transform]"
        style={microRevealStyle(animate, { offsetX: "0.75rem", offsetY: "-0.35rem" })}
      >
        <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2.5">
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-neutral-100">
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="10"
                height="8"
                rx="1.5"
                stroke="#9ca3af"
                strokeWidth="0.9"
              />
              <path
                d="M0.5 2L5.5 5.5L10.5 2"
                stroke="#9ca3af"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold leading-tight text-[#0a143b]">
              Email Intake
            </p>
            <p className="truncate text-[9px] leading-tight text-neutral-400">
              submissions@coverforce.com
            </p>
          </div>
        </div>

        <div className="px-3 py-5">
          <div className="flex items-start justify-between gap-1">
            <p className="text-[10px] font-medium leading-[1.4] text-[#0a143b]">
              New submission from
              <br />
              Summit Risk Advisors
            </p>
            <span className="shrink-0 pt-0.5 text-[9px] text-neutral-400">9:14 AM</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 px-3 py-2">
          <div
            className="flex items-center gap-1 text-[9px] text-neutral-400"
            style={microRevealStyle(animate, { delay: 120 })}
          >
            <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
              <path
                d="M0.5 3.5C2 1 9 1 10.5 3.5C9 6 2 6 0.5 3.5Z"
                stroke="#9ca3af"
                strokeWidth="0.7"
              />
              <circle cx="5.5" cy="3.5" r="1.3" stroke="#9ca3af" strokeWidth="0.7" />
            </svg>
            5 attachments
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-1.5">
              {[
                { label: "A", className: "bg-amber-400" },
                { label: "B", className: "bg-blue-400" },
              ].map((avatar, i) => (
                <span
                  key={avatar.label}
                  className={`flex size-[18px] items-center justify-center overflow-hidden rounded-full border-[1.5px] border-white text-[7px] font-bold text-white ${avatar.className}`}
                  style={{
                    ...microRevealStyle(animate, { delay: 180 + i * 55 }),
                    transform: animate ? "scale(1)" : "scale(0)",
                    transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                    transitionDelay: `${180 + i * 55}ms`,
                  }}
                >
                  {avatar.label}
                </span>
              ))}
            </div>
            <span
              className="ml-1 flex size-[18px] items-center justify-center rounded-full bg-[#7C5CFC] text-[7px] font-bold text-white"
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0)",
                transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                transitionDelay: "290ms",
              }}
            >
              +2
            </span>
          </div>
        </div>
      </div>

      <div
        className="mt-[72px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] will-change-[opacity,transform]"
        style={microRevealStyle(animate, { delay: 140, offsetY: "0.65rem" })}
      >
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-2.5">
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-neutral-100">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="9"
                height="11"
                rx="1.5"
                stroke="#9ca3af"
                strokeWidth="0.9"
              />
              <path
                d="M2.5 4h5M2.5 6h5M2.5 8h3"
                stroke="#9ca3af"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-[13px] font-bold text-[#0a143b]">ACORD 25</span>
        </div>

        <div className="divide-y divide-neutral-100 border-b border-neutral-100">
          {[0, 1].map((n) => (
            <div
              key={n}
              className="grid grid-cols-2 gap-x-3 px-4 py-2"
              style={microRevealStyle(animate, { delay: 280 + n * 80 })}
            >
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">
                  Insured
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  <span
                    className="size-3 shrink-0 origin-left rounded-sm bg-neutral-200"
                    style={{
                      transform: animate ? "scaleX(1)" : "scaleX(0)",
                      transition: `transform ${MICRO_BAR_MS}ms ${MICRO_EASE}`,
                      transitionDelay: `${340 + n * 80}ms`,
                    }}
                  />
                  <p className="text-[9px] font-medium text-[#0a143b]">Construction LLC</p>
                </div>
              </div>
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">
                  Policy Number
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  <span
                    className="size-3 shrink-0 origin-left rounded-sm bg-neutral-200"
                    style={{
                      transform: animate ? "scaleX(1)" : "scaleX(0)",
                      transition: `transform ${MICRO_BAR_MS}ms ${MICRO_EASE}`,
                      transitionDelay: `${380 + n * 80}ms`,
                    }}
                  />
                  <p className="text-[9px] font-medium text-[#0a143b]">GL-2024-98</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-between px-4 pt-2.5 pb-1"
          style={microRevealStyle(animate, { delay: 460 })}
        >
          <p className="text-[10px] font-semibold text-[#0a143b]">Limits Summary</p>
          <span className="text-[9px] font-semibold text-[#5B35E0]">View All</span>
        </div>

        <div className="divide-y divide-neutral-100 px-4">
          {LIMIT_ROWS.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2"
              style={microRevealStyle(animate, { delay: 520 + i * 70 })}
            >
              <span className="text-[10px] text-neutral-500">{row.label}</span>
              <span
                className="text-[10px] font-semibold text-[#0a143b]"
                style={{
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateX(0)" : "translateX(0.35rem)",
                  transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                  transitionDelay: `${560 + i * 70}ms`,
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/70 px-4 py-2.5"
          style={microRevealStyle(animate, { delay: 720 })}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="flex size-[14px] shrink-0 items-center justify-center rounded-full bg-emerald-100"
              style={{
                transform: animate ? "scale(1)" : "scale(0)",
                transition: `transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                transitionDelay: "760ms",
              }}
            >
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path
                  d="M1 3l2 2 4-4"
                  stroke="#10B981"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-[8px] font-bold uppercase leading-tight tracking-wide text-emerald-600">
                Verified
              </p>
              <p className="text-[7px] leading-tight text-neutral-400">
                This certificate is valid.
              </p>
            </div>
          </div>
          <span className="text-[8px] text-neutral-400">ACORD 25 Standard</span>
        </div>
      </div>
    </div>
  );
}
