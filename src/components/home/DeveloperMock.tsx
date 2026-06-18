"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MICRO_EASE,
  MICRO_ROLL_STAGGER_MS,
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

const ROTATE_MS = 10_000;

const TABS = [
  { label: "All", icon: RiApps2Line },
  { label: "Integration", icon: RiCodeSSlashLine },
  { label: "Testing", icon: RiFlaskLine },
] as const;

type TabLabel = (typeof TABS)[number]["label"];

const TAB_ORDER: TabLabel[] = ["All", "Integration", "Testing"];

const TAB_ROWS: Record<
  TabLabel,
  readonly { title: string; sub: string; icon: RemixiconComponentType }[]
> = {
  All: [
    {
      title: "API Key Generated",
      sub: "Your API key is ready to use",
      icon: RiCodeSSlashLine,
    },
    {
      title: "Sandbox Connected",
      sub: "Connected to sandbox environment",
      icon: RiApps2Line,
    },
    {
      title: "Test Quote Successful",
      sub: "Test quote returned from 40+ carriers",
      icon: RiFlaskLine,
    },
  ],
  Integration: [
    {
      title: "Webhook Registered",
      sub: "Events streaming to your endpoint",
      icon: RiCodeSSlashLine,
    },
    {
      title: "OAuth Connected",
      sub: "Secure token exchange enabled",
      icon: RiApps2Line,
    },
    {
      title: "Schema Mapped",
      sub: "ACORD fields aligned to your model",
      icon: RiCodeSSlashLine,
    },
  ],
  Testing: [
    {
      title: "Sandbox Quote Sent",
      sub: "Mock carrier response in 1.2s",
      icon: RiFlaskLine,
    },
    {
      title: "Error Rate 0%",
      sub: "All validation checks passed",
      icon: RiCheckLine,
    },
    {
      title: "Load Test Passed",
      sub: "1,000 req/min sustained",
      icon: RiFlaskLine,
    },
  ],
};

function DevTabButton({
  label,
  icon: Icon,
  active,
  onSelect,
}: {
  label: TabLabel;
  icon: RemixiconComponentType;
  active: boolean;
  onSelect: (label: TabLabel) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(label)}
      className={`flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-sans leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A483FE] ${
        active
          ? "bg-[#121C49] font-normal text-white"
          : "bg-[#F3F4F6] font-medium text-neutral-500 hover:bg-[#E8EAED] hover:text-[#374151]"
      }`}
      style={{
        transition: `background-color ${MICRO_TAB_COLOR_MS}ms ${MICRO_EASE}, color ${MICRO_TAB_COLOR_MS}ms ${MICRO_EASE}`,
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

function AnimatedDevRows({ tab, listKey }: { tab: TabLabel; listKey: number }) {
  const rows = TAB_ROWS[tab];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const id = window.setTimeout(() => setVisible(true), 50);
    return () => window.clearTimeout(id);
  }, [listKey, tab]);

  return (
    <>
      {rows.map((row, index) => {
        const RowIcon = row.icon;
        return (
          <div
            key={`${listKey}-${row.title}`}
            className="flex items-center justify-between py-4"
            style={microRevealStyle(visible, {
              delay: index * MICRO_ROLL_STAGGER_MS,
              offsetY: "1.25rem",
            })}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#F1F1F1]/30">
                <RowIcon color="#494646" size={11} />
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
              style={{ background: "#dcfce7" }}
            >
              <RiCheckLine color="#81B56A" size={11} />
              Done
            </span>
          </div>
        );
      })}
    </>
  );
}

export default function DeveloperMock() {
  const [activeTab, setActiveTab] = useState<TabLabel>("All");
  const [listKey, setListKey] = useState(0);

  const selectTab = useCallback((label: TabLabel) => {
    setActiveTab((current) => {
      if (current === label) return current;
      setListKey((key) => key + 1);
      return label;
    });
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setActiveTab((current) => {
        const index = TAB_ORDER.indexOf(current);
        const next = TAB_ORDER[(index + 1) % TAB_ORDER.length];
        setListKey((key) => key + 1);
        return next;
      });
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute -bottom-7 right-52 z-10 w-full max-w-[420px] rounded-t-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.13)]">
      <div className="flex items-center gap-3 border-b border-dashed border-[#CCCCCC] px-5 py-6">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF]">
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
              onSelect={selectTab}
            />
          ))}
        </div>

        <div className="overflow-hidden border-t border-dashed border-[#CCCCCC] pt-4">
          <AnimatedDevRows tab={activeTab} listKey={listKey} />
        </div>
      </div>
    </div>
  );
}
