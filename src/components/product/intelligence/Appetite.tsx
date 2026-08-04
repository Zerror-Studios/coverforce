"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

type SelectOption = {
  value: string;
  label: string;
};

type AppetiteStatus =
  | "IN_APPETITE"
  | "MAYBE_IN_APPETITE"
  | "NOT_IN_APPETITE";

type AppetiteCarrier = {
  id?: string;
  name: string;
  logo?: string;
  badge?: "E&S";
  appetiteStatus?: AppetiteStatus;
};

let industryOptionsPromise: Promise<SelectOption[]> | null = null;
let carriersPromise: Promise<AppetiteCarrier[]> | null = null;

async function loadIndustryOptions() {
  if (!industryOptionsPromise) {
    industryOptionsPromise = fetch("/api/industry-codes", {
      cache: "force-cache",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Industry code request failed: ${response.status}`);
        }
        const payload = (await response.json()) as {
          industries?: SelectOption[];
        };
        return (payload.industries ?? []).filter(Boolean);
      })
      .catch((error) => {
        industryOptionsPromise = null;
        throw error;
      });
  }

  return industryOptionsPromise;
}

async function loadAppetiteCarriers() {
  if (!carriersPromise) {
    carriersPromise = fetch("/api/appetite-carriers", {
      cache: "force-cache",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Carrier request failed: ${response.status}`);
        }
        const payload = (await response.json()) as {
          carriers?: AppetiteCarrier[];
        };
        return payload.carriers ?? [];
      })
      .catch((error) => {
        carriersPromise = null;
        throw error;
      });
  }

  return carriersPromise;
}

const POLICY_TYPE_OPTIONS = [
  { value: "BR", label: "Builder's Risk" },
  { value: "BOP", label: "Business Owner's Policy" },
  { value: "CGL", label: "Commercial General Liability" },
  { value: "CP", label: "Commercial Property" },
  { value: "CYBER", label: "Cyber" },
  { value: "MPL", label: "Miscellaneous Professional Liability" },
  { value: "WC", label: "Worker's Compensation" },
] as const satisfies readonly SelectOption[];

const STATE_OPTIONS = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
] as const satisfies readonly SelectOption[];

const APPETITE_STATUS_ORDER: Record<AppetiteStatus, number> = {
  IN_APPETITE: 0,
  MAYBE_IN_APPETITE: 1,
  NOT_IN_APPETITE: 2,
};

function appetiteBadgeLabel(status: AppetiteStatus) {
  if (status === "MAYBE_IN_APPETITE") return "Maybe";
  if (status === "NOT_IN_APPETITE") return "Not In Appetite";
  return "In Appetite";
}

function appetiteBadgeClass(status: AppetiteStatus) {
  if (status === "MAYBE_IN_APPETITE") return "bg-[#5B8DEF] text-white";
  if (status === "NOT_IN_APPETITE") return "bg-[#E04B4B] text-white";
  return "bg-[#2A9D8F] text-white";
}

function CarrierLogoSkeleton() {
  return (
    <div
      className="h-5 w-18 animate-pulse rounded-md bg-linear-to-b from-[#F1F1F1] to-[#E4E4E4] sm:h-6 sm:w-24 md:h-10 md:w-32"
      aria-hidden
    />
  );
}

function CarrierLogoCard({
  carrier,
}: {
  carrier: AppetiteCarrier;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [showSkeleton, setShowSkeleton] = useState(!carrier.logo);

  useEffect(() => {
    setShowSkeleton(!carrier.logo);
  }, [carrier.logo]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
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
    <article
      ref={cardRef}
      data-appetite-animate
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-[20px] bg-[#ECECEC] p-[1.5px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1 hover:scale-[1.015]"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        aria-hidden
      />
      <div className="relative z-10 flex h-22 items-center justify-center overflow-hidden rounded-[19px] bg-white px-4 py-4 transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-28px_rgba(10,20,59,0.45)] sm:h-24 md:h-28">
        {carrier.badge ? (
          <span className="absolute left-2 top-2 rounded bg-[#F4A261] px-1.5 py-0.5 font-mono text-[0.5625rem] font-semibold uppercase leading-none tracking-wide text-white">
            {carrier.badge}
          </span>
        ) : null}
        {carrier.appetiteStatus ? (
          <span
            className={`absolute right-2 top-2 rounded px-1.5 py-0.5 font-mono text-[0.625rem] font-normal uppercase leading-none tracking-wide ${appetiteBadgeClass(carrier.appetiteStatus)}`}
          >
            {appetiteBadgeLabel(carrier.appetiteStatus)}
          </span>
        ) : null}
        {showSkeleton || !carrier.logo ? (
          <CarrierLogoSkeleton />
        ) : (
          <img
            src={carrier.logo}
            alt={`${carrier.name} logo`}
            loading="lazy"
            onError={() => setShowSkeleton(true)}
            className="max-h-6 w-auto max-w-[75%] object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:max-h-7 md:max-h-8"
          />
        )}
      </div>
    </article>
  );
}

function formatDropdownLabel(option: string) {
  // Keep mixed-case labels (policy types, states) as-is.
  if (/[a-z]/.test(option)) return option;

  // Title-case all-caps labels (e.g. NAICS industry names).
  return option
    .toLowerCase()
    .replace(/(^|[\s\-/(])([a-z])/g, (_, prefix: string, char: string) => prefix + char.toUpperCase());
}

function normalizeOption(option: string | SelectOption): SelectOption {
  if (typeof option === "string") {
    return {
      value: option,
      label: formatDropdownLabel(option),
    };
  }
  return option;
}

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
  options: readonly (string | SelectOption)[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = `${id}-listbox`;
  const normalizedOptions = options.map(normalizeOption);
  const selected = normalizedOptions.find((option) => option.value === value);
  const selectedLabel = selected?.label ?? "";
  const search = query.trim().toLowerCase();
  const filteredOptions = search
    ? normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(search)
      )
    : normalizedOptions;

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
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
      <div
        className={`box-border flex h-10 min-h-10 max-h-10 w-full items-center rounded-lg border bg-white px-4 transition-colors ${
          open
            ? "border-[#5B35E0] ring-1 ring-[#5B35E0]/20"
            : "border-[#E4E7EC] hover:border-[#5B35E0]/40"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-labelledby={`${id}-label`}
          autoComplete="off"
          placeholder={`Select ${label}`}
          value={open ? query : selectedLabel}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            if (value) onChange("");
          }}
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
          className="min-w-0 flex-1 bg-transparent font-heading text-sm font-medium leading-none text-[#1A1A1A] outline-none placeholder:text-[#9AA8BC]"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Toggle ${label} options`}
          onClick={() => {
            if (open) {
              close();
            } else {
              setOpen(true);
              setQuery("");
              inputRef.current?.focus();
            }
          }}
          className="ml-2 shrink-0 text-[#9AA8BC]"
        >
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
      </div>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          data-lenis-prevent
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-y-auto rounded-xl border border-[#E8ECF0] bg-white py-1 shadow-[0_12px_32px_rgba(10,20,59,0.1)]"
        >
          {filteredOptions.length ? (
            filteredOptions.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onChange(option.value);
                      close();
                    }}
                    className={`flex w-full items-center px-4 py-3.5 text-left font-heading text-xs font-medium transition-colors md:text-sm ${
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
            })
          ) : (
            <li className="px-4 py-3.5 font-heading text-xs font-medium text-[#9AA8BC] md:text-sm">
              No matches
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}

const Appetite = () => {
  const [policyType, setPolicyType] = useState<string>("");
  const [industryOptions, setIndustryOptions] = useState<SelectOption[]>([]);
  const [industry, setIndustry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [carriers, setCarriers] = useState<AppetiteCarrier[]>([]);
  const [appetiteByCarrierId, setAppetiteByCarrierId] = useState<Record<
    string,
    AppetiteStatus
  > | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const canCheck =
    Boolean(policyType && industry && state) &&
    carriers.length > 0 &&
    !isChecking;

  const displayedCarriers =
    appetiteByCarrierId === null
      ? carriers
      : carriers
          .filter((carrier) =>
            Boolean(carrier.id && appetiteByCarrierId[carrier.id])
          )
          .map((carrier) => ({
            ...carrier,
            appetiteStatus: carrier.id
              ? appetiteByCarrierId[carrier.id]
              : undefined,
          }))
          .sort((a, b) => {
            const aOrder = a.appetiteStatus
              ? APPETITE_STATUS_ORDER[a.appetiteStatus]
              : 99;
            const bOrder = b.appetiteStatus
              ? APPETITE_STATUS_ORDER[b.appetiteStatus]
              : 99;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.name.localeCompare(b.name);
          });

  const availableCount =
    appetiteByCarrierId === null
      ? carriers.length
      : displayedCarriers.filter(
          (carrier) =>
            carrier.appetiteStatus === "IN_APPETITE" ||
            carrier.appetiteStatus === "MAYBE_IN_APPETITE"
        ).length;

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  useEffect(() => {
    setAppetiteByCarrierId(null);
    setCheckError(null);
  }, [policyType, industry, state]);

  useEffect(() => {
    let cancelled = false;

    const loadIndustryCodes = async () => {
      try {
        const nextOptions = await loadIndustryOptions();
        if (!nextOptions.length || cancelled) return;

        setIndustryOptions(nextOptions);
        setIndustry((current) =>
          nextOptions.some((option) => option.value === current) ? current : ""
        );
      } catch (error) {
        console.error("[appetite-industry-codes]", error);
      }
    };

    void loadIndustryCodes();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCarriers = async () => {
      try {
        const nextCarriers = await loadAppetiteCarriers();
        if (cancelled) return;
        setCarriers(nextCarriers);
      } catch (error) {
        console.error("[appetite-carriers]", error);
      }
    };

    void loadCarriers();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCheckAppetite = async () => {
    if (!canCheck) return;

    setIsChecking(true);
    setCheckError(null);

    try {
      const response = await fetch("/api/check-appetite", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carriers: carriers.map((carrier) => carrier.id).filter(Boolean),
          policyType,
          state,
          naicsCode: industry,
        }),
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        checkedCarriers?: { id: string; status: string }[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? `Check failed: ${response.status}`);
      }

      const nextStatusById: Record<string, AppetiteStatus> = {};
      for (const item of payload.checkedCarriers ?? []) {
        const id = String(item.id ?? "").trim();
        const status = String(item.status ?? "").trim();
        if (
          id &&
          (status === "IN_APPETITE" ||
            status === "MAYBE_IN_APPETITE" ||
            status === "NOT_IN_APPETITE")
        ) {
          nextStatusById[id] = status;
        }
      }

      setAppetiteByCarrierId(nextStatusById);
    } catch (error) {
      console.error("[check-appetite]", error);
      setCheckError("Unable to check appetite. Please try again.");
      setAppetiteByCarrierId(null);
    } finally {
      setIsChecking(false);
    }
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const container = resultsRef.current;
      if (!container) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-appetite-animate]");
      if (!items.length) return;

      const animateIn = () => {
        gsap.killTweensOf(items);
        gsap.set(items, { opacity: 0, y: 20 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.05,
          overwrite: true,
        });
      };

      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.88;

      let st: ScrollTrigger | null = null;

      if (inView) {
        animateIn();
      } else {
        gsap.set(items, { opacity: 0, y: 20 });
        st = ScrollTrigger.create({
          trigger: container,
          start: "top 88%",
          once: true,
          onEnter: animateIn,
        });
      }

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);

      return () => {
        st?.kill();
        lenis?.off("scroll", onLenisScroll);
        gsap.killTweensOf(items);
      };
    },
    { scope: resultsRef },
  );

  return (
    <section id="appetite" ref={sectionRef} className="relative bg-[#121C49] text-white">
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 58%, rgba(49, 78, 155, 0.55) 0%, rgba(18, 28, 73, 0.92) 52%, #121C49 100%)",
        }}
        aria-hidden
      />

      <Container borderColor="#FFFFFF33" className="relative z-10 border-t border-[#FFFFFF1A]">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="relative z-10 mx-auto max-w-3xl text-center"
          >
            <h2
              ref={headingRef}
              className="mx-auto max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>CoverForce </span>
              <span data-split className="text-[#413CC0]">
                Appetite Engine
              </span>
            </h2>

            <p
              ref={descRef}
              className="mx-auto mt-5 max-w-xl font-sans font-regular text-sm leading-[1.4] text-white/80 md:text-[1.125rem]"
            >
              Check carrier appetite for any class code - powered by 140K+
              proprietary carrier interactions.
            </p>
          </div>

          <div className="relative mx-auto mt-12 max-w-6xl overflow-visible md:mt-14 lg:mt-16">
            <SectionRadialGlow className="absolute left-1/2 top-[58%] z-0 hidden w-[145%] max-w-[76rem] -translate-x-1/2 -translate-y-[42%] blur-[4.5rem] opacity-90 md:block" />

            <div className="relative z-10 rounded-2xl bg-white p-5 text-[#0a143b] shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8 lg:p-10">
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleCheckAppetite();
                }}
              >
                <div className="relative z-20 grid items-end gap-4 md:grid-cols-4">
                  <FormSelect
                    id="appetite-policy-type"
                    label="Policy Type"
                    value={policyType}
                    options={POLICY_TYPE_OPTIONS}
                    onChange={setPolicyType}
                  />
                  <FormSelect
                    id="appetite-industry"
                    label="Industry"
                    value={industry}
                    options={industryOptions}
                    onChange={setIndustry}
                  />
                  <FormSelect
                    id="appetite-state"
                    label="State"
                    value={state}
                    options={STATE_OPTIONS}
                    onChange={setState}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!canCheck}
                    className={`flex h-10 min-h-10 max-h-10 w-full items-center justify-center text-center ${
                      !canCheck ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {isChecking ? "Checking..." : "Check Appetite"}
                  </Button>
                </div>
                {checkError ? (
                  <p className="font-heading text-sm font-medium text-[#D64545]">
                    {checkError}
                  </p>
                ) : null}
              </form>

              <div
                ref={resultsRef}
                className="mt-8 overflow-visible border-t border-[#ECEEF2] pt-6 md:mt-10 md:pt-8"
              >
                <p
                  data-appetite-animate
                  className="mb-5 font-heading text-base font-medium text-[#1A1A1A] md:text-lg"
                >
                  {availableCount} Carriers available
                </p>

                <div className="grid grid-cols-2 gap-3 px-1 py-1 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                  {displayedCarriers.map((carrier, index) => (
                    <CarrierLogoCard
                      key={
                        carrier.id ??
                        `${carrier.name}-${carrier.badge ?? "admitted"}-${index}`
                      }
                      carrier={carrier}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Appetite;
