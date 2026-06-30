"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { RiCheckLine, RiSearchEyeLine } from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";

gsap.registerPlugin(ScrollTrigger);

const LOGO_MAP: Record<string, string> = {
  AmTrust: "/images/integration/amtrust.svg",
  "Liberty Mutual": "/images/integration/liberty.svg",
  Travelers: "/images/integration/travelers.svg",
  Chubb: "/images/integration/chubb.svg",
  Nationwide: "/images/integration/nationwide.svg",
  Coalition: "/images/integration/coalition.svg",
};

type Market = "AD" | "ES";

type Carrier = {
  name: string;
  logoColor: string;
  updated: string;
  status: "Live" | "API available";
  lobs: string[];
  capabilities: string[];
  products: { market: Market; name: string }[];
};

type Tab = {
  id: string;
  label: string;
  count?: number;
};

const TABS: Tab[] = [
  { id: "carriers", label: "Carriers & MGAs", count: 20 },
  { id: "ams", label: "Agency Management" },
  { id: "finance", label: "Finance & Compliance", count: 3 },
  { id: "ai", label: "AI & Technology", count: 3 },
];

const LOB_FILTERS = ["All", "WC", "BOP", "GL", "Cyber", "Prof", "Auto"];
const STATUS_FILTERS = ["All", "Live", "API available"] as const;
type PillColors = { bg: string; text: string; border?: string };

const MARKET_FILTERS: { id: Market; label: string; colors: PillColors }[] = [
  { id: "AD", label: "Admitted", colors: { bg: "#E3F2FF", text: "#185FA5" } },
  { id: "ES", label: "Excess & Surplus", colors: { bg: "#FFDAB6", text: "#693300" } },
];

const STATUS_COLORS: Record<string, PillColors> = {
  Live: { bg: "#FCFFEA", text: "#74AD2B", border: "#EDF8AD" },
};

const BASE_CARRIERS: Carrier[] = [
  {
    name: "AmTrust",
    logoColor: "#1F2A6B",
    updated: "Updated 2 days ago",
    status: "Live",
    lobs: ["WC", "BOP", "GL", "Cyber"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Business Owner's Policy" },
      { market: "AD", name: "Inland Marine" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Worker's Compensation" },
    ],
  },
  {
    name: "Liberty Mutual",
    logoColor: "#F2C200",
    updated: "Updated 3 days ago",
    status: "API available",
    lobs: ["WC", "BOP", "GL"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Business Policy" },
      { market: "AD", name: "Island Marine" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "Travelers",
    logoColor: "#D8232A",
    updated: "Updated 5 days ago",
    status: "API available",
    lobs: ["WC", "BOP", "GL"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Business Owner's Policy" },
    ],
  },
  {
    name: "Chubb",
    logoColor: "#111827",
    updated: "Updated 1 day ago",
    status: "Live",
    lobs: ["WC", "BOP", "GL", "Cyber"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Business Owner's Policy" },
      { market: "AD", name: "Inland Marine" },
      { market: "AD", name: "A&M" },
      { market: "AD", name: "Crime" },
    ],
  },
  {
    name: "Nationwide",
    logoColor: "#1A4FA0",
    updated: "Updated 4 days ago",
    status: "Live",
    lobs: ["WC", "BOP", "GL"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Business Policy" },
      { market: "AD", name: "Island Marine" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "Coalition",
    logoColor: "#5B3DF5",
    updated: "Updated 6 days ago",
    status: "API available",
    lobs: ["Cyber"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Cyber" },
      { market: "AD", name: "D&O" },
      { market: "AD", name: "EPLI" },
      { market: "ES", name: "Tech E&O" },
      { market: "ES", name: "Cyber" },
    ],
  },
  {
    name: "Liberty Mutual",
    logoColor: "#F2C200",
    updated: "Updated 3 days ago",
    status: "API available",
    lobs: ["WC", "BOP", "GL"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Business Owner's Policy" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "AmTrust",
    logoColor: "#1F2A6B",
    updated: "Updated 2 days ago",
    status: "Live",
    lobs: ["WC", "BOP", "GL", "Cyber"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Inland Marine" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "Travelers",
    logoColor: "#D8232A",
    updated: "Updated 5 days ago",
    status: "Live",
    lobs: ["WC", "BOP", "GL"],
    capabilities: ["Quote", "Bind", "Appetite"],
    products: [
      { market: "AD", name: "Business Owner's Policy" },
    ],
  },
];

// Repeat the base set to fill the directory (placeholder until real data lands).
const CARRIERS: Carrier[] = Array.from(
  { length: 20 },
  (_, i) => BASE_CARRIERS[i % BASE_CARRIERS.length],
);

const StatusBadge = ({ status }: { status: Carrier["status"] }) => {
  if (status === "Live") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#EDFF7A] px-5 py-1 text-[0.6875rem] font-sans font-semibold text-[#4F8A2E]">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#74AD2B] opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-[#74AD2B]" />
        </span>
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#DBE1FF] px-5 py-1 text-[0.6875rem] font-sans font-semibold text-[#2D3E9D]">
      API available
    </span>
  );
};

const CarrierCard = ({ carrier }: { carrier: Carrier }) => (
  <div data-carrier-card className="rounded-3xl border border-[#ECECEC] bg-white p-6">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center">
          <Image
            src={LOGO_MAP[carrier.name] ?? "/images/integration/amtrust.svg"}
            alt={carrier.name}
            width={40}
            height={40}
            className="h-full w-full object-contain"
          />
        </span>
        <div>
          <p className="text-xs font-sans font-bold leading-tight text-[#111110]">
            {carrier.name}
          </p>
          <p className="mt-0.5 font-sans font-regular text-sm text-[#9A9A96]">{carrier.updated}</p>
        </div>
      </div>
      <StatusBadge status={carrier.status} />
    </div>

    <div className="mt-5 flex flex-wrap gap-2.5">
      {carrier.lobs.map((lob) => (
        <span
          key={lob}
          className="rounded-full bg-[#EEF0F9] px-4 py-1 text-xs font-sans font-semibold text-[#2D3E9D]"
        >
          {lob}
        </span>
      ))}
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
      {carrier.capabilities.map((cap) => (
        <span
          key={cap}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#0130BE]"
        >
          <RiCheckLine className="size-4 text-[#0130BE]" />
          {cap}
        </span>
      ))}
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      {carrier.products.map((product, idx) => (
        <span
          key={`${product.name}-${idx}`}
          className="w-fit truncate rounded-full bg-[#E3F2FF] px-4 py-1 text-xs font-sans font-bold text-[#185FA5]"
        >
          {product.market} | {product.name}
        </span>
      ))}
    </div>
  </div>
);

const FilterPill = ({
  label,
  active,
  onClick,
  colors,
}: {
  label: React.ReactNode;
  active: boolean;
  onClick: () => void;
  colors?: PillColors;
}) => {
  if (colors) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          background: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border ?? "transparent"}`,
          boxShadow: active ? `0 0 0 2px ${colors.text}33` : undefined,
        }}
        className={`rounded-full px-4 py-1 text-xs font-sans font-medium transition-all ${
          active ? "" : "opacity-80 hover:opacity-100"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1 text-xs font-sans font-medium transition-colors ${
        active
          ? "bg-[#2D3E9D] text-white"
          : "bg-[#EEF0F9] text-[#2D3E9D] hover:bg-[#2D3E9D] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
};

const Integration = () => {
  const [activeTab, setActiveTab] = useState("carriers");
  const [lob, setLob] = useState("All");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [markets, setMarkets] = useState<Market[]>([]);

  const toggleMarket = (m: Market) =>
    setMarkets((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  const filtered = useMemo(
    () =>
      CARRIERS.filter((c) => {
        if (lob !== "All" && !c.lobs.includes(lob)) return false;
        if (status !== "All" && c.status !== status) return false;
        if (markets.length && !c.products.some((p) => markets.includes(p.market)))
          return false;
        return true;
      }),
    [lob, status, markets],
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-carrier-card]");
      if (!cards.length) return;

      gsap.set(cards, { opacity: 0, y: 40 });

      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });
    },
    { scope: gridRef, dependencies: [filtered] },
  );

  return (
    <>
    <section ref={sectionRef} className="relative overflow-hidden text-[#0a143b]">
      <Container borderColor="#53535333" borderBottom>
       <div className="pt-16 md:pt-24">
         {/* Header */}
         <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-12"
          >
          <div className="flex flex-col justify-end space-y-5">
            <EyebrowPill surface="light">Integration</EyebrowPill>
            <h2
              ref={headingRef}
              className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>One integration. The entire ecosystem.</span>
            </h2>
          </div>
          <p
            ref={descRef}
            className="max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:ml-auto lg:text-right"
          >
            Carriers, AMS systems, premium finance, E&amp;S compliance, and AI
            connected through CoverForce.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 pb-10 flex flex-wrap justify-between gap-x-10 gap-y-3">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative -mb-px pb-3 text-sm font-medium transition-colors ${
                  isActive ? "text-[#413CC0]" : "text-[#667085] hover:text-[#0a143b]"
                }`}
              >
                {tab.label}
                {typeof tab.count === "number" ? ` (${tab.count})` : ""}
                {/* Always-present gray baseline */}
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#E4E7EE]" />
                {/* Active line fills in from the left */}
                <span
                  className="absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-[#413CC0] transition-transform duration-500 ease-out"
                  style={{ transform: `scaleX(${isActive ? 1 : 0})` }}
                />
              </button>
            );
          })}
        </div>
       </div>
      </Container>
    </section>

    <section className="relative overflow-hidden text-[#0a143b] bg-[#FBFCFF]">
      <Container borderColor="#53535333">
       <div className="pb-16 pt-12 md:pb-24">
        {/* Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.6875rem] font-mono font-medium uppercase tracking-wide text-[#4F4F4F]/80">
              LOB :
            </span>
            {LOB_FILTERS.map((item) => (
              <FilterPill
                key={item}
                label={item}
                active={lob === item}
                onClick={() => setLob(item)}
              />
            ))}
            <span className="ml-20 mr-1 text-[0.6875rem] font-mono font-medium uppercase tracking-wide text-[#4F4F4F]/80">
              Market Type :
            </span>
            {MARKET_FILTERS.map((m) => (
              <FilterPill
                key={m.id}
                label={
                  <span>
                    <span className="font-semibold">{m.id}</span> | {m.label}
                  </span>
                }
                active={markets.includes(m.id)}
                onClick={() => toggleMarket(m.id)}
                colors={m.colors}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[0.6875rem] font-mono font-medium uppercase tracking-wide text-[#4F4F4F]/80">
                Status :
              </span>
              {STATUS_FILTERS.map((item) => (
                <FilterPill
                  key={item}
                  label={item}
                  active={status === item}
                  onClick={() => setStatus(item)}
                  colors={STATUS_COLORS[item]}
                />
              ))}
            </div>
            <span className="text-[0.6875rem] font-medium text-[#98A2B3]">
              {filtered.length} carriers shown
            </span>
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div
            ref={gridRef}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((carrier, idx) => (
              <CarrierCard key={`${carrier.name}-${idx}`} carrier={carrier} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#53535333]/60 bg-[#FBFCFF] px-6 py-20 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#EEF0F9] text-[#2D3E9D]">
              <RiSearchEyeLine className="size-7" />
            </span>
            <p className="mt-5 text-sm font-sans font-bold text-[#111110]">
              No carriers found
            </p>
            <p className="mt-1 max-w-xs text-xs font-sans font-regular leading-relaxed text-[#9A9A96]">
              No results match the selected filters. Try adjusting or clearing your
              filters to see more carriers.
            </p>
            <button
              type="button"
              onClick={() => {
                setLob("All");
                setStatus("All");
                setMarkets([]);
              }}
              className="mt-5 rounded-full bg-[#2D3E9D] px-5 py-2 text-xs font-sans font-semibold text-white transition-colors hover:bg-[#22307c]"
            >
              Clear filters
            </button>
          </div>
        )}
       </div>
      </Container>
    </section>
    </>
  );
};

export default Integration;
