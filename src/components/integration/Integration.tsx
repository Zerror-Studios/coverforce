"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiSearchEyeLine } from "@remixicon/react";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import Button from "@/components/common/Button";
import { ChevronDown } from "lucide-react";
import ExternalArrowIcon from "../common/ExternalArrowIcon";
import {
  INTEGRATION_DATA,
  type Carrier,
  type CarrierProduct,
  type Market,
} from "@/data/integrationData";

gsap.registerPlugin(ScrollTrigger);

// ─── Sub-components ───────────────────────────────────────────────────────────

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

const CarrierCard = ({
  carrier,
  marketFilter,
  statusFilter,
}: {
  carrier: Carrier;
  marketFilter: Market | "all";
  statusFilter: "all" | "live" | "api";
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Filter products by market. When status is "live", keep every product on
  // that carrier (request products stay visible with a hollow ball). When
  // status is "api", only show request products.
  const displayProducts = useMemo(() => {
    return carrier.products.filter((p) => {
      const matchesMarket = marketFilter === "all" ? true : p.market === marketFilter;

      if (statusFilter === "api") {
        return matchesMarket && p.availability === "request";
      }

      // "all" and "live" — show all products that match the market
      return matchesMarket;
    });
  }, [carrier.products, marketFilter, statusFilter]);

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
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      data-carrier-card
      data-carrier-key={carrier.name}
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
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <span className="flex h-10 w-full max-w-44 items-center justify-start transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] sm:h-11 sm:max-w-48">
            {carrier.logoSrc ? (
              <Image
                src={carrier.logoSrc}
                alt={carrier.name}
                width={176}
                height={44}
                className="h-full w-full object-contain object-left"
              />
            ) : (
              <span className="font-heading text-sm font-semibold text-[#0a143b]">
                {carrier.name}
              </span>
            )}
          </span>
          <div className="shrink-0">
            <StatusBadge status={carrier.status} />
          </div>
        </div>

        {/* Products - only show filtered products */}
        {displayProducts.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
            {displayProducts.map((product: CarrierProduct, idx) => {
              const requestable = product.availability === "request";
              const isES = product.market === "ES";
              return (
                <span
                  key={`${product.market}-${product.name}-${idx}`}
                  title={requestable ? "Available to request" : "Live on CoverForce"}
                  className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full py-1 pl-2.5 pr-4 text-xs font-sans font-medium tracking-wide transition-colors duration-300 ${
                    isES
                      ? requestable
                        ? "border border-dashed border-[#C9B7F6] bg-[#F7F1FF] text-[#6F3CC3] group-hover:bg-[#EFE4FF]"
                        : "bg-[#F7F1FF] text-[#6F3CC3] group-hover:bg-[#EFE4FF]"
                      : requestable
                        ? "border border-dashed border-[#B8D4F2] bg-[#F2F8FC] text-[#185FA5]/95 group-hover:bg-[#E8F2FA]"
                        : "bg-[#F2F8FC] text-[#185FA5]/95 group-hover:bg-[#E8F2FA]"
                  }`}
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${
                      requestable
                        ? isES
                          ? "bg-transparent ring-1 ring-[#8B5CF6]"
                          : "bg-transparent ring-1 ring-[#185FA5]"
                        : isES
                          ? "bg-[#8B5CF6]"
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
        )}

        {/* Footer link — only when a logo is available */}
        {carrier.logoSrc ? (
          <Link
            href={carrier.website || "/contact"}
            target={carrier.website ? "_blank" : undefined}
            rel={carrier.website ? "noreferrer" : undefined}
            className="mt-auto ml-auto flex items-center gap-1 pt-5 text-right text-sm font-heading font-medium text-[#2D3E9D] transition-colors hover:text-[#151F4D] md:pt-6"
          >
            Website
            <ExternalArrowIcon className="h-2 w-3 shrink-0 text-current" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  id: string;
  label: string;
  value: string;
  options: readonly FormSelectOption[] | readonly string[];
  onChange: (value: string) => void;
};

function FormSelect({ id, label, value, options, onChange }: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const listId = `${id}-listbox`;

  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  const selected = normalized.find((option) => option.value === value) ?? normalized[0];

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
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
        className={`flex h-10 w-full items-center justify-between rounded-lg border bg-white px-4 text-left font-heading text-sm font-medium transition-colors ${
          open
            ? "border-[#5B35E0] ring-1 ring-[#5B35E0]/20"
            : "border-[#E4E7EC] hover:border-[#5B35E0]/40"
        }`}
      >
        <span className={`truncate ${value ? "text-[#1A1A1A]" : "text-[#98A2B3]"}`}>
          {selected?.label ?? "Select"}
        </span>

        <ChevronDown
          className={`h-4 w-4 text-[#98A2B3] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
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
                  className={`flex w-full items-center px-4 py-3.5 text-left font-heading text-xs font-semibold tracking-[0.04em] transition-colors md:text-sm ${
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
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Integration = () => {
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const revealedKeysRef = useRef<Set<string>>(new Set());

  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Product Type options are derived from the actual dataset so the dropdown
  // never lists a line of business that no carrier actually offers.
  const LOB_OPTIONS = useMemo(() => {
    const names = new Set<string>();
    INTEGRATION_DATA.forEach((carrier) =>
      carrier.products.forEach((p) => names.add(p.name)),
    );
    const sorted = Array.from(names).sort((a, b) => a.localeCompare(b));
    return [{ value: "all", label: "All" }, ...sorted.map((n) => ({ value: n, label: n }))];
  }, []);

  const MARKET_OPTIONS = [
    { value: "all", label: "All" },
    { value: "AD", label: "Admitted" },
    { value: "ES", label: "Excess & Surplus" },
  ] as const;

  const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "live", label: "Live on CoverForce" },
    { value: "api", label: "API Available" },
  ] as const;

  const [lob, setLob] = useState("all");
  const [market, setMarket] = useState("all");
  const [status, setStatus] = useState<"all" | "live" | "api">("all");

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

  // Carrier list from the static local dataset, sorted A→Z
  const directory = useMemo<Carrier[]>(() => {
    return [...INTEGRATION_DATA].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Product Type, Market Type, and Status filters
  const filteredDirectory = useMemo(() => {
    return directory.filter((carrier) => {
      const hasADProducts = carrier.products.some((p) => p.market === "AD");
      const hasESProducts = carrier.products.some((p) => p.market === "ES");

      // Product Type (LOB) filter
      const hasLob = lob === "all" ? true : carrier.products.some((p) => p.name === lob);

      // Market Type filter
      let hasMarket = true;
      if (market === "AD") {
        hasMarket = hasADProducts;
      } else if (market === "ES") {
        hasMarket = hasESProducts;
      }

      // Status filter — use the carrier's overall status badge.
      // "Live on CoverForce" shows those carriers with all of their products
      // (request products render with a hollow ball inside the card).
      let hasStatus = true;
      if (status === "live") {
        hasStatus = carrier.status === "Live on CoverForce";
      } else if (status === "api") {
        hasStatus = carrier.status === "API available";
      }

      return hasLob && hasMarket && hasStatus;
    });
  }, [directory, lob, market, status]);

  const visibleCards = filteredDirectory.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDirectory.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [lob, market, status]);

  const filtersKey = `${lob}|${market}|${status}`;
  const prevFiltersKeyRef = useRef(filtersKey);

  useGSAP(
    () => {
      // Reset reveal tracking whenever filters change (not on "Show more")
      if (prevFiltersKeyRef.current !== filtersKey) {
        revealedKeysRef.current = new Set();
        prevFiltersKeyRef.current = filtersKey;
      }

      const cards = gsap.utils.toArray<HTMLElement>("[data-carrier-card]");
      if (!cards.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { clearProps: "opacity,transform" });
        cards.forEach((card) => {
          const key = card.dataset.carrierKey;
          if (key) revealedKeysRef.current.add(key);
        });
        return;
      }

      // Cards already revealed (e.g. before "Show more") stay put.
      // Everything else is split so in-viewport cards animate immediately —
      // ScrollTrigger alone misses reused nodes that kept opacity: 0 after a filter.
      const inView: HTMLElement[] = [];
      const belowFold: HTMLElement[] = [];
      const threshold = window.innerHeight * 0.88;

      cards.forEach((card) => {
        const key = card.dataset.carrierKey ?? "";
        if (key && revealedKeysRef.current.has(key)) {
          gsap.set(card, { opacity: 1, y: 0 });
          return;
        }

        if (card.getBoundingClientRect().top < threshold) {
          inView.push(card);
        } else {
          belowFold.push(card);
        }
      });

      if (inView.length) {
        inView.forEach((card) => {
          const key = card.dataset.carrierKey;
          if (key) revealedKeysRef.current.add(key);
        });

        gsap.fromTo(
          inView,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.06,
            overwrite: true,
          },
        );
      }

      if (belowFold.length) {
        gsap.set(belowFold, { opacity: 0, y: 40 });

        ScrollTrigger.batch(belowFold, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((card) => {
              const key = (card as HTMLElement).dataset.carrierKey;
              if (key) revealedKeysRef.current.add(key);
            });

            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              overwrite: true,
            });
          },
        });
      }
    },
    { scope: gridRef, dependencies: [filtersKey, visibleCount] },
  );

  return (
    <section
      id="integration"
      ref={sectionRef}
      className="relative z-30 overflow-hidden bg-[#FBFCFF] text-[#0a143b]"
    >
      <div className="relative z-10 overflow-hidden">
        <Container borderColor="#53535380">
          <div className="pb-12 pt-16 md:pb-24 md:pt-24">
            {/* Header */}
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
                  <span data-split>2026 Carrier API Index</span>
                </h2>
                <p
                  ref={descRef}
                  className="max-w-lg font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
                >
                  The universal index of accessible integrations all in one place.
                </p>
              </div>
              <p className="hidden max-w-lg font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:ml-auto lg:block lg:text-right">
                The universal index of accessible integrations all in one place.
              </p>
            </div>

            {/* Filters */}
            <div className="relative z-20 mt-8 space-y-5 lg:mt-10 lg:space-y-3">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  id="integration-lob"
                  label="Product Type"
                  value={lob}
                  options={LOB_OPTIONS}
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
                  options={STATUS_OPTIONS}
                  onChange={(v) => setStatus(v as "all" | "live" | "api")}
                />
              </div>

              <div className="flex justify-end">
                <span className="text-[0.6875rem] font-medium text-[#98A2B3]">
                  {filteredDirectory.length} integrations shown
                </span>
              </div>
            </div>

            {/* Grid */}
            {filteredDirectory.length > 0 ? (
              <>
                <div
                  ref={gridRef}
                  className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-6 lg:grid-cols-3"
                >
                  {visibleCards.map((carrier, idx) => (
                    <CarrierCard
                      key={carrier.logoSrc ? `${carrier.name}-logo` : `${carrier.name}-${idx}`}
                      carrier={carrier}
                      marketFilter={market as Market | "all"}
                      statusFilter={status}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-6 flex justify-center lg:mt-8">
                    <Button
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="hover:scale-[1.02]"
                    >
                      Show more
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#53535380]/60 bg-[#FBFCFF] px-6 py-20 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#EEF0F9] text-[#2D3E9D]">
                  <RiSearchEyeLine className="size-7" />
                </span>
                <p className="mt-5 text-sm font-sans font-bold text-[#111110]">
                  No carriers found
                </p>
                <p className="mt-1 max-w-xs text-xs font-sans font-regular leading-relaxed text-[#9A9A96]">
                  No carrier data is available at this time. Please check back later.
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Integration;