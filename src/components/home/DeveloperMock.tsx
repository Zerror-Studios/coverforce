"use client";

import { useEffect, useRef, useState } from "react";
import { MICRO_EASE, MICRO_ENTRANCE_MS, microRevealStyle } from "@/lib/motion";

function CodeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M5 4L1 8l4 4"
        stroke="#5B35E0"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 4l4 4-4 4"
        stroke="#5B35E0"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ROWS = [
  { title: "API Key Generated", sub: "your API Key is ready to use" },
  { title: "Sandbox Connected", sub: "Connected to sandbox environment" },
  { title: "Test Qoute Successful", sub: "Test Quote returned from 40+ carrier" },
] as const;

export default function DeveloperMock() {
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
      className="absolute -bottom-20 right-52 z-10 w-full max-w-[420px] rounded-t-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.13)] will-change-[opacity,transform]"
      style={microRevealStyle(animate, { offsetY: "1rem" })}
    >
      <div
        className="flex items-center gap-3 px-5 py-12 pb-6"
        style={microRevealStyle(animate, { delay: 80 })}
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100"
          style={{
            transform: animate ? "scale(1)" : "scale(0.85)",
            opacity: animate ? 1 : 0,
            transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
            transitionDelay: "120ms",
          }}
        >
          <CodeIcon size={15} />
        </span>
        <div>
          <p className="text-[14px] font-bold leading-tight text-[#0a143b]">Developers</p>
          <p className="text-[10px] leading-tight text-neutral-400">
            Built with Coverforce AI
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 pb-4">
        {[
          { label: "All", active: false, delay: 180 },
          { label: "Integration", active: true, delay: 240 },
          { label: "Testing", active: false, delay: 300 },
        ].map((tab) => (
          <span
            key={tab.label}
            className={`rounded-full px-4 py-2 text-[11px] ${
              tab.active
                ? "flex items-center gap-1.5 font-semibold text-white"
                : "font-medium text-neutral-500 bg-neutral-100"
            }`}
            style={{
              background: tab.active ? "#5B35E0" : undefined,
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0) scale(1)" : "translateY(0.35rem) scale(0.96)",
              transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
              transitionDelay: `${tab.delay}ms`,
            }}
          >
            {tab.active ? (
              <>
                <CodeIcon size={11} />
                <span className="text-white">Integration</span>
              </>
            ) : (
              tab.label
            )}
          </span>
        ))}
      </div>

      <div className="border-t border-neutral-100">
        {ROWS.map((row, i) => (
          <div
            key={row.title}
            className="flex items-center justify-between px-5 py-5"
            style={{
              borderBottom: i < ROWS.length - 1 ? "1px solid #f3f4f6" : "none",
              ...microRevealStyle(animate, { delay: 380 + i * 90 }),
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-neutral-100"
                style={{
                  transform: animate ? "scale(1)" : "scale(0)",
                  transition: `transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                  transitionDelay: `${420 + i * 90}ms`,
                }}
              >
                <CodeIcon size={11} />
              </span>
              <div>
                <p className="text-[12px] font-bold leading-tight text-[#0a143b]">
                  {row.title}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-neutral-400">
                  {row.sub}
                </p>
              </div>
            </div>
            <span
              className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold"
              style={{
                background: "#dcfce7",
                color: "#16a34a",
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0.85)",
                transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                transitionDelay: `${480 + i * 90}ms`,
              }}
            >
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path
                  d="M1 3.5l2.5 2.5 5-5"
                  stroke="#16a34a"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Done
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
