import React, { useState } from "react";
import { CalculationResult } from "@/lib/calculations";

import RevenueMapTab from "./tabs/RevenueMapTab";
import OverviewTab from "./tabs/OverviewTab";
import CompoundingTab from "./tabs/CompoundingTab";
import ProductivityTab from "./tabs/ProductivityTab";
import BuildVsBuyTab from "./tabs/BuildVsBuyTab";
import InactionTab from "./tabs/InactionTab";
import FullModelTab from "./tabs/FullModelTab";
import { Map, TrendingUp, RefreshCw, Zap, Scale, Coins, Table } from "lucide-react";

interface Props {
  results: CalculationResult;
}

export type TabId = "revmap" | "overview" | "compounding" | "productivity" | "buildvbuy" | "inaction" | "model";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "revmap", label: "Revenue Map", icon: <Map className="size-3.5 shrink-0" aria-hidden /> },
  { id: "overview", label: "Overview", icon: <TrendingUp className="size-3.5 shrink-0" aria-hidden /> },
  { id: "compounding", label: "Compounding Growth", icon: <RefreshCw className="size-3.5 shrink-0" aria-hidden /> },
  { id: "productivity", label: "Productivity Unlock", icon: <Zap className="size-3.5 shrink-0" aria-hidden /> },
  { id: "buildvbuy", label: "Build vs. Buy", icon: <Scale className="size-3.5 shrink-0" aria-hidden /> },
  { id: "inaction", label: "Cost of Inaction", icon: <Coins className="size-3.5 shrink-0" aria-hidden /> },
  { id: "model", label: "Full Model", icon: <Table className="size-3.5 shrink-0" aria-hidden /> },
];

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 font-heading text-xs font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B35E0] md:px-4 ${
        active
          ? "border-[#3834a4] bg-[#3834a4] text-white shadow-sm [&_svg]:text-white"
          : "border-[#3834a4] bg-white text-[#121C49] hover:bg-[#121C49]/5 [&_svg]:text-[#5B35E0]"
      }`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export default function Tabs({ results }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-w-0 flex-1 w-full">
      <div
        className="mb-6 border-b border-neutral-200 pb-4 print:hidden"
        role="tablist"
        aria-label="Calculator views"
      >
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>
      </div>

      <div className="tab-content" role="tabpanel">
        {activeTab === "revmap" && <RevenueMapTab results={results} />}
        {activeTab === "overview" && <OverviewTab results={results} />}
        {activeTab === "compounding" && <CompoundingTab results={results} />}
        {activeTab === "productivity" && <ProductivityTab results={results} />}
        {activeTab === "buildvbuy" && <BuildVsBuyTab results={results} />}
        {activeTab === "inaction" && <InactionTab results={results} />}
        {activeTab === "model" && <FullModelTab results={results} />}
      </div>
    </div>
  );
}
