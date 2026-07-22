"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { RiSearchEyeLine } from "@remixicon/react";
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

/** live = integrated & quotable now · request = available to request while carrier is live */
type ProductAvailability = "live" | "request";

type CarrierProduct = {
  market: Market;
  name: string;
  /** Defaults to "live". Use "request" for products not yet integrated on a live carrier. */
  availability?: ProductAvailability;
};

type Carrier = {
  name: string;
  logoColor: string;
  status: "Live on CoverForce" | "API available";
  /** Used for LOB filters only — not shown on cards */
  lobs: string[];
  products: CarrierProduct[];
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
  { id: "ai", label: "Market Access", count: 3 },
];

function getTabLabel(tab: Tab) {
  return `${tab.label}${typeof tab.count === "number" ? ` (${tab.count})` : ""}`;
}

const LOB_FILTERS = ["All", "WC", "BOP", "GL", "Cyber", "Prof", "Auto"] as const;
const STATUS_FILTERS = ["All", "Live on CoverForce", "API available"] as const;
const MARKET_OPTIONS = [
  { value: "All", label: "All" },
  { value: "AD", label: "AD | Admitted" },
  { value: "ES", label: "ES | Excess & Surplus" },
] as const;

const BASE_CARRIERS: Carrier[] = [
  {
    name: "AmTrust",
    logoColor: "#1F2A6B",
    status: "Live on CoverForce",
    lobs: ["WC", "BOP", "GL", "Cyber"],
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
    status: "API available",
    lobs: ["WC", "BOP", "GL"],
    products: [
      { market: "AD", name: "Business Policy" },
      { market: "AD", name: "Inland Marine", availability: "request" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "Travelers",
    logoColor: "#D8232A",
    status: "API available",
    lobs: ["WC", "BOP", "GL"],
    products: [{ market: "AD", name: "Business Owner's Policy" }],
  },
  {
    name: "Chubb",
    logoColor: "#111827",
    status: "Live on CoverForce",
    lobs: ["WC", "BOP", "GL", "Cyber"],
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
    status: "Live on CoverForce",
    lobs: ["WC", "BOP", "GL"],
    products: [
      { market: "AD", name: "Business Policy" },
      { market: "AD", name: "Inland Marine", availability: "request" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "Coalition",
    logoColor: "#5B3DF5",
    status: "API available",
    lobs: ["Cyber"],
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
    status: "API available",
    lobs: ["WC", "BOP", "GL"],
    products: [
      { market: "AD", name: "Business Owner's Policy" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "AmTrust",
    logoColor: "#1F2A6B",
    status: "Live on CoverForce",
    lobs: ["WC", "BOP", "GL", "Cyber"],
    products: [
      { market: "AD", name: "Inland Marine" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Workers Compensation" },
    ],
  },
  {
    name: "Travelers",
    logoColor: "#D8232A",
    status: "Live on CoverForce",
    lobs: ["WC", "BOP", "GL"],
    products: [{ market: "AD", name: "Business Owner's Policy" }],
  },
];

// Repeat the base set to fill the directory (placeholder until real data lands).
const CARRIERS: Carrier[] = Array.from(
  { length: 20 },
  (_, i) => BASE_CARRIERS[i % BASE_CARRIERS.length],
);

const StatusBadge = ({ status }: { status: Carrier["status"] }) => {
  if (status === "Live on CoverForce") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6E7] px-5 py-1 text-[0.6875rem] font-sans font-semibold text-[#4F8A2E]">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6DAB4E] opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-[#6DAB4E]" />
        </span>
        Live on CoverForce
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#DBE1FF] px-5 py-1 text-[0.6875rem] font-sans font-semibold text-[#2D3E9D]">
      API available
    </span>
  );
};

const CarrierCard = ({ carrier }: { carrier: Carrier }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const glowSize = Math.max(rect.width, rect.height) * 1.75;

    glow.style.background = `radial-gradient(${glowSize}px circle at ${x}px ${y}px, rgba(1, 48, 190, 1) 0%, rgba(45, 62, 157, 0.65) 14%, rgba(45, 62, 157, 0.22) 32%, transparent 58%)`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      data-carrier-card
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-[20px] bg-[#ECECEC] p-[1.5px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1 hover:scale-[1.015]"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col rounded-[19px] bg-white p-4 transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-28px_rgba(10,20,59,0.45)] md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:size-11">
              <Image
                src={LOGO_MAP[carrier.name] ?? "/images/integration/amtrust.svg"}
                alt={carrier.name}
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </span>
            <p className="text-sm font-sans font-bold leading-tight text-[#111110]">
              {carrier.name}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={carrier.status} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
          {carrier.products.map((product, idx) => {
            const requestable = product.availability === "request";
            return (
              <span
                key={`${product.name}-${idx}`}
                title={
                  requestable
                    ? "Available to request — not yet live on CoverForce"
                    : "Live on CoverForce"
                }
                className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full py-1 pl-2.5 pr-4 text-xs font-sans font-medium tracking-wide transition-colors duration-300 ${
                  requestable
                    ? "border border-dashed border-[#C9B27A] bg-[#FBF6EC] text-[#8A6A22]"
                    : "bg-[#F2F8FC] text-[#185FA5]/95 group-hover:bg-[#E8F2FA]"
                }`}
              >
                <span
                  className={`size-1.5 shrink-0 rounded-full ${
                    requestable
                      ? "bg-transparent ring-1 ring-[#C08A2B]"
                      : "bg-[#4F8A2E]"
                  }`}
                  aria-hidden
                />
                <span className="truncate">
                  {product.market} | {product.name}
                </span>
              </span>
            );
          })}
        </div>

      </div>
    </div>
  );
};

function FormSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  onChange: (value: string) => void;
}) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-2 block font-mono text-sm font-medium uppercase text-[#2A297C]">
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="box-border h-10 min-h-10 max-h-10 w-full appearance-none rounded-lg border border-[#E4E7EC] bg-white px-4 pr-10 font-heading text-sm font-medium leading-none text-[#1A1A1A] outline-none transition-colors hover:border-[#5B35E0]/40 focus:border-[#5B35E0] focus:ring-1 focus:ring-[#5B35E0]/20"
        >
          {normalized.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9AA8BC]"
          aria-hidden
        />
      </div>
    </label>
  );
}

const Integration = () => {
  const [activeTab, setActiveTab] = useState("carriers");
  const [lob, setLob] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [market, setMarket] = useState<string>("All");

  const filtered = useMemo(
    () =>
      CARRIERS.filter((c) => {
        if (lob !== "All" && !c.lobs.includes(lob)) return false;
        if (status !== "All" && c.status !== status) return false;
        if (
          market !== "All" &&
          !c.products.some((p) => p.market === market)
        ) {
          return false;
        }
        return true;
      }),
    [lob, status, market],
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
    <section
      id="integration"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FBFCFF] text-[#0a143b]"
    >
      <Container borderColor="#53535380">
        <div className="pb-12 pt-16 md:pb-24 md:pt-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end">
              <EyebrowPill surface="light">Universal Integrations Index</EyebrowPill>
              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>One integration. The entire ecosystem.</span>
              </h2>
              <p
                ref={descRef}
                className="max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
              >
                The universal index of CoverForce integrations — carriers, AMS,
                premium finance, E&amp;S compliance, and AI in one place.
              </p>
            </div>
            <p className="hidden max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:ml-auto lg:block lg:text-right">
              The universal index of CoverForce integrations — carriers, AMS,
              premium finance, E&amp;S compliance, and AI in one place.
            </p>
          </div>

          <div className="mt-8 pb-8 lg:mt-10 lg:pb-10">
            <div
              className="-mx-1 overflow-x-auto overflow-y-hidden pb-1 lg:mx-0 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Integration category"
            >
              <div className="flex w-max gap-2 px-1 lg:w-full lg:justify-between lg:gap-3 lg:px-0">
                {TABS.map((tab) => {
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 rounded-full border px-5 py-2 font-heading text-[0.6875rem] transition-colors md:text-xs ${
                        isActive
                          ? "border-[#413CC0] bg-[#FAFBFC] text-[#3834A4]"
                          : "border-[#E4E7EC] bg-[#FAFBFC] text-[#6B7280] hover:border-[#C8CDD6]"
                      }`}
                    >
                      {getTabLabel(tab)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:space-y-3">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormSelect
                id="integration-lob"
                label="LOB"
                value={lob}
                options={LOB_FILTERS}
                onChange={setLob}
              />
              <FormSelect
                id="integration-market"
                label="Market Type"
                value={market}
                options={MARKET_OPTIONS}
                onChange={setMarket}
              />
              <FormSelect
                id="integration-status"
                label="Status"
                value={status}
                options={STATUS_FILTERS}
                onChange={setStatus}
              />
            </div>

            <div className="flex justify-end">
              <span className="text-[0.6875rem] font-medium text-[#98A2B3]">
                {filtered.length} carriers shown
              </span>
            </div>
          </div>

            {filtered.length > 0 ? (
              <div
                ref={gridRef}
                className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-8 lg:grid-cols-3"
              >
                {filtered.map((carrier, idx) => (
                  <CarrierCard key={`${carrier.name}-${idx}`} carrier={carrier} />
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#53535380]/60 bg-[#FBFCFF] px-6 py-20 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#EEF0F9] text-[#2D3E9D]">
                  <RiSearchEyeLine className="size-7" />
                </span>
                <p className="mt-5 text-sm font-sans font-bold text-[#111110]">
                  No carriers found
                </p>
                <p className="mt-1 max-w-xs text-xs font-sans font-regular leading-relaxed text-[#9A9A96]">
                  No results match the selected filters. Try adjusting or clearing
                  your filters to see more carriers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLob("All");
                    setStatus("All");
                    setMarket("All");
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
  );
};

export default Integration;
