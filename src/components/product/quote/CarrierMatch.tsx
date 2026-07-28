"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronDown } from "lucide-react";import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import EyebrowPill from "@/components/common/EyebrowPill";

const INDUSTRIES = [
  "Restaurant",
  "Contractor",
  "Retail Store",
  "Professional Services",
] as const;

const FORM_FIELDS = [
  {
    id: "revenue",
    label: "ANNUAL REVENUE",
    value: "$1M - $5M",
    options: ["Under $1M", "$1M - $5M", "$5M - $10M", "$10M+"],
    highlighted: true,
  },
  {
    id: "state",
    label: "STATE",
    value: "FL",
    options: ["FL", "CA", "TX", "NY"],
  },
  {
    id: "employees",
    label: "EMPLOYEES",
    value: "10 - 20",
    options: ["1 - 9", "10 - 20", "21 - 49", "50+"],
  },
] as const;

const ALSO_ELIGIBLE_LOGOS = [
  { src: "/images/product/carrier1.svg", alt: "Carrier 1" },
  { src: "/images/product/carrier2.svg", alt: "Carrier 2" },
  { src: "/images/product/carrier3.svg", alt: "Carrier 3" },
  { src: "/images/product/carrier4.svg", alt: "Carrier 4" },
  { src: "/images/product/carrier5.svg", alt: "Carrier 5" },
  { src: "/images/product/carrier6.svg", alt: "Carrier 6" },
  { src: "/images/product/carrier7.svg", alt: "Carrier 7" },
] as const;

function IndustryTiles({
  value,
  onChange,
}: {
  value: (typeof INDUSTRIES)[number];
  onChange: (industry: (typeof INDUSTRIES)[number]) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 block font-mono text-sm font-medium uppercase text-[#413CC0]">
        Industry
      </legend>
      <div className="grid grid-cols-2 gap-2.5" role="listbox" aria-label="Industry">
        {INDUSTRIES.map((industry) => {
          const selected = industry === value;
          return (
            <button
              key={industry}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(industry)}
              className={`rounded-lg border px-3 py-3 text-left font-heading text-sm font-medium transition-colors ${
                selected
                  ? "border-[#E25E2F] bg-[#FFF4EF] text-[#E25E2F] ring-1 ring-[#E25E2F]/30"
                  : "border-[#DDDDDD] bg-white text-[#1A1A1A] hover:border-[#E25E2F]/50 hover:bg-[#FFF8F5]"
              }`}
            >
              {industry}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function formatDropdownLabel(option: string) {
  if (/[a-z]/.test(option)) return option;

  return option
    .toLowerCase()
    .replace(/(^|[\s\-/(])([a-z])/g, (_, prefix: string, char: string) => prefix + char.toUpperCase());
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
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = `${id}-listbox`;
  const selected = options.includes(value) ? value : options[0];
  const selectedLabel = formatDropdownLabel(selected);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
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
    <div ref={rootRef} className="relative block min-w-0">
      <span
        id={`${id}-label`}
        className="mb-2 block font-mono text-sm font-medium uppercase text-[#413CC0]"
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
        <span className="truncate text-[#1A1A1A]">{selectedLabel}</span>
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
          {options.map((option, index) => {
            const isSelected = option === value;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-3.5 text-left font-heading text-xs font-medium transition-colors md:text-sm ${
                    index > 0 ? "border-t border-[#EEF1F5]" : ""
                  } ${
                    isSelected
                      ? "bg-[#F5F3FF] text-[#2A297C]"
                      : "text-[#111110] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {formatDropdownLabel(option)}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function MatchResultsCard({
  industry,
  state,
  revenue,
  employees,
}: {
  industry: string;
  state: string;
  revenue: string;
  employees: string;
}) {  return (
    <div className="rounded-2xl border border-[#ECEEF2] bg-white p-5 md:p-6 lg:p-7">
      <div className="border-b border-[#ECEEF2] pb-5">
        <p className="font-sans text-lg font-regular text-[#2A297C]">
          8 carriers matched
        </p>
        <p className="mt-1 font-mono text-sm font-medium uppercase text-[#444444]">
          {industry} / {state} / {revenue} / {employees} employees
        </p>      </div>

      <div className="py-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="font-mono text-sm font-medium uppercase text-[#5F950C]">
            TOP MATCH
          </span>
          <span className="inline-flex items-center gap-1.5 font-heading text-xs font-medium text-[#5F950C] md:text-sm">
            <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
            92% appetite match
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-[#E66F35] to-[#D62B1C] p-4 md:gap-5 md:p-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white md:size-20">
            <Image
              src="/images/product/carrier8.svg"
              alt="Top match carrier"
              width={72}
              height={28}
              className="h-5 w-auto object-contain md:h-7"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-medium leading-tight text-white md:text-xl">
              AmTrust
            </p>
            <p className="mt-0.5 font-sans text-xs font-regular text-white/85 md:text-sm">
              Worker&apos;s Compensation
            </p>
          </div>
          <p className="shrink-0 font-heading text-lg font-medium leading-none text-white md:text-xl">
            $4,200–$5,800
          </p>
        </div>
      </div>

      <div className="border-t border-[#ECEEF2] pt-5">
        <p className="mb-3 font-mono text-sm font-medium uppercase text-[#393939]">
          ALSO ELIGIBLE
        </p>
        <div className="grid grid-cols-4 gap-2 md:gap-2.5">
          {ALSO_ELIGIBLE_LOGOS.map((logo) => (
            <div
              key={logo.src}
              className="flex items-center justify-center rounded-lg border border-[#ECEEF2] bg-white px-2 py-3"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={32}
                className="h-4 w-auto max-w-full object-contain md:h-10"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-[#ECEEF2] pt-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-sans text-sm font-regular text-[#2A297C] md:text-base">
            Estimated Response
          </p>
          <p className="mt-0.5 font-mono text-sm font-medium uppercase text-[#444444]">
            QUOTES AVAILABLE IN MINUTES
          </p>
        </div>
        <Button href="/" variant="primary" className="shrink-0">
          Get quotes
        </Button>
      </div>
    </div>
  );
}

const CarrierMatch = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [industry, setIndustry] = useState<(typeof INDUSTRIES)[number]>("Restaurant");
  const [revenue, setRevenue] = useState<string>(FORM_FIELDS[0].value);
  const [state, setState] = useState<string>(FORM_FIELDS[1].value);
  const [employees, setEmployees] = useState<string>(FORM_FIELDS[2].value);

  const fieldSetters: Record<(typeof FORM_FIELDS)[number]["id"], (value: string) => void> = {
    revenue: setRevenue,
    state: setState,
    employees: setEmployees,
  };

  const fieldValues: Record<(typeof FORM_FIELDS)[number]["id"], string> = {
    revenue,
    state,
    employees,
  };
  return (
    <section ref={sectionRef} className="bg-[#F6F8F9] text-[#0a143b]">
      <Container borderColor="#53535340">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="max-w-lg">
              <div className="mb-8">
                <EyebrowPill
                  surface="light"
                  background="linear-gradient(45deg, #E25E2F 0%, #DE5943 50%, #FC976B 100%)"
                  className="mb-4 shadow-[0_8px_24px_rgba(226,94,47,0.2)]"
                >
                  Interactive tool
                </EyebrowPill>
                <h3 className="font-heading text-xl font-semibold text-[#2A297C] md:text-2xl">
                  CoverForce Carrier Match
                </h3>
                <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-[#444444] md:text-base">
                  Adjust the risk details and find matching carriers — try it live
                  below.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => event.preventDefault()}
              >
                <IndustryTiles value={industry} onChange={setIndustry} />

                {FORM_FIELDS.map((field) => (
                  <FormSelect
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    value={fieldValues[field.id]}
                    options={field.options}
                    onChange={fieldSetters[field.id]}
                  />
                ))}
                <div className="mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="h-12 min-h-12 max-h-12 w-full justify-center border-transparent bg-gradient-to-r from-[#F0784A] to-[#E63946] text-white transition-opacity hover:opacity-95"
                  >
                    Find matching carriers
                  </Button>
                </div>
              </form>
            </div>

            <MatchResultsCard
              industry={industry}
              state={state}
              revenue={revenue}
              employees={employees}
            />          </div>
        </div>
      </Container>
    </section>
  );
};

export default CarrierMatch;
