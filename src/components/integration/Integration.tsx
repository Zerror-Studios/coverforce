"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

type CategoryId = "carriers" | "ams" | "finance" | "ai";

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
  category: CategoryId;
  /** Used for LOB filters only — not shown on cards */
  lobs: string[];
  products: CarrierProduct[];
};

type Tab = {
  id: CategoryId;
  label: string;
  count?: number;
};

const TABS: Tab[] = [
  { id: "carriers", label: "Carriers & MGAs", count: 20 },
  { id: "ams", label: "Agency Management", count: 4 },
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
    category: "carriers",
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
    category: "carriers",
    lobs: ["WC", "BOP", "GL", "Auto"],
    products: [
      { market: "AD", name: "Business Policy" },
      { market: "AD", name: "Inland Marine", availability: "request" },
      { market: "AD", name: "General Liability" },
      { market: "AD", name: "Workers Compensation" },
      { market: "AD", name: "Commercial Auto", availability: "request" },
    ],
  },
  {
    name: "Travelers",
    logoColor: "#D8232A",
    status: "API available",
    category: "carriers",
    lobs: ["WC", "BOP", "GL"],
    products: [{ market: "AD", name: "Business Owner's Policy" }],
  },
  {
    name: "Chubb",
    logoColor: "#111827",
    status: "Live on CoverForce",
    category: "carriers",
    lobs: ["WC", "BOP", "GL", "Cyber", "Prof"],
    products: [
      { market: "AD", name: "Business Owner's Policy" },
      { market: "AD", name: "Inland Marine" },
      { market: "AD", name: "A&M" },
      { market: "AD", name: "Crime" },
      { market: "ES", name: "Professional Liability" },
    ],
  },
  {
    name: "Nationwide",
    logoColor: "#1A4FA0",
    status: "Live on CoverForce",
    category: "carriers",
    lobs: ["WC", "BOP", "GL", "Auto"],
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
    category: "carriers",
    lobs: ["Cyber", "Prof"],
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
    category: "carriers",
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
    category: "carriers",
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
    category: "carriers",
    lobs: ["WC", "BOP", "GL"],
    products: [{ market: "AD", name: "Business Owner's Policy" }],
  },
];

const AMS_PARTNERS: Carrier[] = [
  {
    name: "NowCerts",
    logoColor: "#1F2A6B",
    status: "Live on CoverForce",
    category: "ams",
    lobs: ["WC", "BOP", "GL"],
    products: [
      { market: "AD", name: "AMS Sync" },
      { market: "AD", name: "Policy Download" },
    ],
  },
  {
    name: "HawkSoft",
    logoColor: "#111827",
    status: "API available",
    category: "ams",
    lobs: ["WC", "BOP", "GL", "Auto"],
    products: [
      { market: "AD", name: "Agency Sync" },
      { market: "ES", name: "E&S Feed" },
    ],
  },
  {
    name: "Applied Epic",
    logoColor: "#1A4FA0",
    status: "Live on CoverForce",
    category: "ams",
    lobs: ["WC", "BOP", "GL", "Cyber"],
    products: [
      { market: "AD", name: "Submission Push" },
      { market: "AD", name: "Activity Sync" },
    ],
  },
  {
    name: "QQCatalyst",
    logoColor: "#5B3DF5",
    status: "API available",
    category: "ams",
    lobs: ["BOP", "GL", "Prof"],
    products: [{ market: "AD", name: "Client Sync", availability: "request" }],
  },
];

const FINANCE_PARTNERS: Carrier[] = [
  {
    name: "Premium Finance Co",
    logoColor: "#1F2A6B",
    status: "Live on CoverForce",
    category: "finance",
    lobs: ["WC", "BOP", "GL", "Auto"],
    products: [
      { market: "AD", name: "Premium Finance" },
      { market: "ES", name: "E&S Finance" },
    ],
  },
  {
    name: "Compliance Hub",
    logoColor: "#111827",
    status: "API available",
    category: "finance",
    lobs: ["GL", "Cyber", "Prof"],
    products: [
      { market: "AD", name: "License Check" },
      { market: "AD", name: "E&O Tracking", availability: "request" },
    ],
  },
  {
    name: "Surplus Lines Filing",
    logoColor: "#1A4FA0",
    status: "Live on CoverForce",
    category: "finance",
    lobs: ["GL", "Cyber"],
    products: [{ market: "ES", name: "SL Filing" }],
  },
];

const MARKET_ACCESS_PARTNERS: Carrier[] = [
  {
    name: "Clearance Exchange",
    logoColor: "#5B3DF5",
    status: "Live on CoverForce",
    category: "ai",
    lobs: ["WC", "BOP", "GL", "Cyber"],
    products: [
      { market: "AD", name: "Clearance API" },
      { market: "ES", name: "E&S Clearance" },
    ],
  },
  {
    name: "Appetite Graph",
    logoColor: "#F2C200",
    status: "API available",
    category: "ai",
    lobs: ["WC", "BOP", "GL", "Prof", "Auto"],
    products: [
      { market: "AD", name: "Appetite Match" },
      { market: "ES", name: "Wholesale Match", availability: "request" },
    ],
  },
  {
    name: "Bind Network",
    logoColor: "#D8232A",
    status: "Live on CoverForce",
    category: "ai",
    lobs: ["BOP", "GL", "Cyber"],
    products: [{ market: "AD", name: "Instant Bind Path" }],
  },
];

// Repeat the base set to fill the carriers directory (placeholder until real data lands).
const CARRIER_DIRECTORY: Carrier[] = Array.from(
  { length: 20 },
  (_, i) => BASE_CARRIERS[i % BASE_CARRIERS.length]!,
);

const DIRECTORY: Carrier[] = [
  ...CARRIER_DIRECTORY,
  ...AMS_PARTNERS,
  ...FINANCE_PARTNERS,
  ...MARKET_ACCESS_PARTNERS,
];

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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = `${id}-listbox`;

  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  const selected = normalized.find((option) => option.value === value) ?? normalized[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative block min-w-0 flex-1">
      <span
        id={`${id}-label`}
        className="mb-2 block font-mono text-sm font-medium uppercase text-[#2A297C]"
      >
        {label}
      </span>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((prev) => !prev)}
        className={`box-border flex h-10 min-h-10 max-h-10 w-full items-center justify-between rounded-lg border bg-white px-4 text-left font-heading text-sm font-medium leading-none outline-none transition-colors ${
          open
            ? "border-[#5B35E0] text-[#1A1A1A] ring-1 ring-[#5B35E0]/20"
            : "border-[#E4E7EC] text-[#1A1A1A] hover:border-[#5B35E0]/40"
        }`}
      >
        <span className={`truncate ${value ? "text-[#1A1A1A]" : "text-[#9AA8BC]"}`}>
          {selected?.label ?? "Select"}
        </span>
        <ChevronDown
          className={`ml-3 size-4 shrink-0 text-[#9AA8BC] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          data-lenis-prevent
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-y-auto rounded-xl border border-[#E8ECF0] bg-white py-1 shadow-[0_12px_32px_rgba(10,20,59,0.1)]"
        >
          {normalized.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-3.5 text-left font-heading text-xs font-semibold uppercase tracking-[0.04em] transition-colors md:text-sm ${
                    index > 0 ? "border-t border-[#EEF1F5]" : ""
                  } ${
                    isSelected
                      ? "bg-[#F5F3FF] text-[#2A297C]"
                      : "text-[#111110] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const Integration = () => {
  const [activeTab, setActiveTab] = useState<CategoryId>("carriers");
  const [lob, setLob] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [market, setMarket] = useState<string>("All");

  const filtered = useMemo(() => {
    return DIRECTORY.reduce<Carrier[]>((acc, entry) => {
      if (entry.category !== activeTab) return acc;
      if (lob !== "All" && !entry.lobs.includes(lob)) return acc;
      if (status !== "All" && entry.status !== status) return acc;

      const products =
        market === "All"
          ? entry.products
          : entry.products.filter((product) => product.market === market);

      if (market !== "All" && products.length === 0) return acc;

      acc.push(market === "All" ? entry : { ...entry, products });
      return acc;
    }, []);
  }, [activeTab, lob, status, market]);

  const resultLabel =
    activeTab === "carriers"
      ? "carriers shown"
      : activeTab === "ams"
        ? "AMS partners shown"
        : activeTab === "finance"
          ? "finance partners shown"
          : "market access partners shown";

  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

  useGSAP(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const section = sectionRef.current;
    if (!container || !overlay || !section) return;

    gsap.set(container, {
      y: 0,
      scale: 1,
      force3D: true,
      transformOrigin: "50% 50%",
      backfaceVisibility: "hidden",
    });
    gsap.set(overlay, { opacity: 0, pointerEvents: "none" });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallDevice = window.matchMedia("(max-width: 1023px)").matches;
    if (reducedMotion || isSmallDevice) return;

    const getShift = () => container.offsetHeight/3;
    const scrollEnd = "bottom -100%";
    const scrollConfig = {
      trigger: section,
      scrub: 0.35,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    };

    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        ...scrollConfig,
        start: "bottom bottom",
        end: scrollEnd,
      },
    });

    parallaxTl.to(container, {
      y: getShift,
      scale: 0.8,
      ease: "none",
      force3D: true,
    });

    const overlayTl = gsap.timeline({
      scrollTrigger: {
        ...scrollConfig,
        start: "bottom center",
        end: scrollEnd,
      },
    });

    overlayTl.to(overlay, {
      opacity: 0.85,
      ease: "none",
    });

    const lenis = window.lenis;
    let scrollPending = false;
    const onLenisScroll = () => {
      if (scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(() => {
        ScrollTrigger.update();
        scrollPending = false;
      });
    };
    lenis?.on("scroll", onLenisScroll);

    ScrollTrigger.refresh();

    return () => {
      lenis?.off("scroll", onLenisScroll);
      parallaxTl.scrollTrigger?.kill();
      parallaxTl.kill();
      overlayTl.scrollTrigger?.kill();
      overlayTl.kill();
    };
  }, { scope: sectionRef });

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
      className="relative z-30 overflow-hidden bg-[#FBFCFF] text-[#0a143b]"
    >
      <div ref={containerRef} className="relative z-10 overflow-hidden lg:will-change-transform">
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

            <div className="relative z-20 mt-8 space-y-5 lg:mt-10 lg:space-y-3">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormSelect
                  id="integration-category"
                  label="Category"
                  value={activeTab}
                  options={TABS.map((tab) => ({
                    value: tab.id,
                    label: getTabLabel(tab),
                  }))}
                  onChange={(value) => setActiveTab(value as CategoryId)}
                />
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
                  {filtered.length} {resultLabel}
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
                  No results found
                </p>
                <p className="mt-1 max-w-xs text-xs font-sans font-regular leading-relaxed text-[#9A9A96]">
                  No results match the selected filters. Try adjusting or clearing
                  your filters to see more partners.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("carriers");
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
      </div>
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 bg-[#080808]"
        aria-hidden
      />
    </section>
  );
};

export default Integration;
