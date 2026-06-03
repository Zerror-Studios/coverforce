"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MICRO_EASE,
  MICRO_ENTRANCE_MS,
  MICRO_TAB_COLOR_MS,
  microRevealStyle,
} from "@/lib/motion";
import {
  RiApps2Line,
  RiCheckLine,
  RiCodeSSlashLine,
  RiFlaskLine,
} from "@remixicon/react";
import type { RemixiconComponentType } from "@remixicon/react";

const ROWS = [
  { title: "API Key Generated", sub: "your API Key is ready to use" },
  { title: "Sandbox Connected", sub: "Connected to sandbox environment" },
  { title: "Test Qoute Successful", sub: "Test Quote returned from 40+ carrier" },
] as const;

const TABS = [
  { label: "All", icon: RiApps2Line, delay: 180 },
  { label: "Integration", icon: RiCodeSSlashLine, delay: 240 },
  { label: "Testing", icon: RiFlaskLine, delay: 300 },
] as const;

type TabLabel = (typeof TABS)[number]["label"];

function DevTabButton({
  label,
  icon: Icon,
  active,
  delay,
  panelAnimate,
  onHover,
}: {
  label: TabLabel;
  icon: RemixiconComponentType;
  active: boolean;
  delay: number;
  panelAnimate: boolean;
  onHover: (label: TabLabel) => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(label)}
      className={`flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-sans leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A483FE] ${
        active
          ? "bg-[#A483FE] font-normal text-white shadow-[0_4px_14px_rgba(164,131,254,0.35)]"
          : "bg-[#F3F4F6] font-medium text-neutral-500 hover:bg-[#E8EAED] hover:text-[#374151]"
      }`}
      style={{
        opacity: panelAnimate ? 1 : 0,
        transform: panelAnimate ? undefined : "translateY(0.35rem) scale(0.96)",
        transition: panelAnimate
          ? `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, background-color ${MICRO_TAB_COLOR_MS}ms ${MICRO_EASE}, color ${MICRO_TAB_COLOR_MS}ms ${MICRO_EASE}, box-shadow ${MICRO_TAB_COLOR_MS}ms ${MICRO_EASE}`
          : `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
        transitionDelay: panelAnimate ? "0ms" : `${delay}ms`,
      }}
    >
      <Icon
        size={11}
        className="shrink-0 text-current transition-colors duration-[480ms] ease-[cubic-bezier(0.33,1,0.68,1)]"
        aria-hidden
      />
      <span>{label}</span>
    </button>
  );
}

export default function DeveloperMock() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [panelAnimate, setPanelAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState<TabLabel>("Integration");
  const [listAnimate, setListAnimate] = useState(false);
  const hasPanelAnimated = useRef(false);
  const skipListReplay = useRef(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasPanelAnimated.current) return;
        hasPanelAnimated.current = true;
        setPanelAnimate(true);
        setListAnimate(true);
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!panelAnimate) return;
    if (skipListReplay.current) {
      skipListReplay.current = false;
      return;
    }

    setListAnimate(false);
    const id = window.setTimeout(() => setListAnimate(true), 48);
    return () => window.clearTimeout(id);
  }, [activeTab, panelAnimate]);

  const handleTabHover = useCallback((label: TabLabel) => {
    setActiveTab((current) => (current === label ? current : label));
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute -bottom-20 right-52 z-10 w-full max-w-[420px] rounded-t-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.13)] will-change-[opacity,transform]"
      style={microRevealStyle(panelAnimate, { offsetY: "1rem" })}
    >
      <div
        className="flex items-center gap-3 border-b border-dashed border-[#CCCCCC] px-5 py-6"
        style={microRevealStyle(panelAnimate, { delay: 80 })}
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF]"
          style={{
            transform: panelAnimate ? "scale(1)" : "scale(0.85)",
            opacity: panelAnimate ? 1 : 0,
            transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
            transitionDelay: "120ms",
          }}
        >
          <RiCodeSSlashLine color="#494646" size={15} />
        </span>
        <div>
          <p className="text-lg font-heading font-medium leading-relaxed text-[#3C3B3B]">
            Developers
          </p>
          <p className="text-xs font-heading font-normal leading-tight text-[#6B7280]">
            Built with Coverforce AI
          </p>
        </div>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-2 py-6">
          {TABS.map((tab) => (
            <DevTabButton
              key={tab.label}
              label={tab.label}
              icon={tab.icon}
              active={activeTab === tab.label}
              delay={tab.delay}
              panelAnimate={panelAnimate}
              onHover={handleTabHover}
            />
          ))}
        </div>

        <div
          key={activeTab}
          className="border-t border-dashed border-[#CCCCCC] pt-4"
        >
          {ROWS.map((row, i) => (
            <div
              key={`${activeTab}-${row.title}`}
              className="flex items-center justify-between py-4"
              style={microRevealStyle(listAnimate, { delay: 80 + i * 90 })}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#F1F1F1]/30"
                  style={{
                    transform: listAnimate ? "scale(1)" : "scale(0)",
                    transition: `transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                    transitionDelay: `${120 + i * 90}ms`,
                  }}
                >
                  <RiCodeSSlashLine color="#494646" size={11} />
                </span>
                <div>
                  <p className="text-sm font-sans font-medium leading-relaxed text-[#595959]">
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-[10px] font-sans font-normal leading-tight text-[#939393]">
                    {row.sub}
                  </p>
                </div>
              </div>
              <span
                className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-sans font-medium leading-tight tracking-wide text-[#81B56A]"
                style={{
                  background: "#dcfce7",
                  opacity: listAnimate ? 1 : 0,
                  transform: listAnimate ? "scale(1)" : "scale(0.85)",
                  transition: `opacity ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}, transform ${MICRO_ENTRANCE_MS}ms ${MICRO_EASE}`,
                  transitionDelay: `${180 + i * 90}ms`,
                }}
              >
                <RiCheckLine color="#81B56A" size={11} />
                Done
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
