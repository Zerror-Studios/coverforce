"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  "Workers Comp",
  "General Liability",
  "BOP",
  "Cyber",
  "Umbrella",
] as const;

const INDUSTRIES = [
  "Restaurant",
  "Contractor",
  "Technology",
  "Plumbing & HVAC",
  "Healthcare",
  "Trucking",
] as const;

const STATES = ["FL", "CA", "TX", "NY", "IL", "GA"] as const;

type AppetiteStatus = "writing" | "selective" | "decline";

type CarrierRow = {
  name: string;
  wc: AppetiteStatus;
  gl: AppetiteStatus;
  bop: AppetiteStatus;
  cyber: AppetiteStatus;
  umbr: AppetiteStatus;
};

const QUICK_TRY_TAGS = [
  "722511 — Full-Service Restaurants",
  "236220 — Commercial Building Construction",
  "541511 — Custom Computer Programming",
  "238220 — Plumbing & HVAC",
  "621111 — Physician Offices",
  "484110 — General Freight Trucking",
] as const;

const CARRIER_ROWS: CarrierRow[] = [
  {
    name: "Hartford",
    wc: "writing",
    gl: "writing",
    bop: "selective",
    cyber: "decline",
    umbr: "writing",
  },
  {
    name: "Travelers",
    wc: "selective",
    gl: "writing",
    bop: "writing",
    cyber: "selective",
    umbr: "writing",
  },
  {
    name: "AmTrust",
    wc: "writing",
    gl: "selective",
    bop: "decline",
    cyber: "decline",
    umbr: "selective",
  },
  {
    name: "Nationwide",
    wc: "writing",
    gl: "writing",
    bop: "writing",
    cyber: "selective",
    umbr: "writing",
  },
  {
    name: "Employers",
    wc: "writing",
    gl: "decline",
    bop: "decline",
    cyber: "decline",
    umbr: "decline",
  },
  {
    name: "CNA",
    wc: "selective",
    gl: "writing",
    bop: "selective",
    cyber: "writing",
    umbr: "selective",
  },
  {
    name: "Liberty Mutual",
    wc: "writing",
    gl: "writing",
    bop: "selective",
    cyber: "decline",
    umbr: "writing",
  },
  {
    name: "Chubb",
    wc: "selective",
    gl: "writing",
    bop: "writing",
    cyber: "writing",
    umbr: "writing",
  },
];

const STATUS_DOT: Record<AppetiteStatus, string> = {
  writing: "bg-[#95E070]",
  selective: "bg-[#FBC76F]",
  decline: "bg-[#E7E7E7]",
};

const DEFAULT_QUICK_TRY = QUICK_TRY_TAGS[1];

function getQuickTryLabel(tag: string) {
  const description = tag.split(" — ")[1];
  return description ? description.toLowerCase() : tag.toLowerCase();
}

const LINE_COLUMNS = ["WC", "GL", "BOP", "CYBER", "UMBR."] as const;

const MOBILE_LINE_ITEMS: Array<{
  key: keyof Pick<CarrierRow, "wc" | "gl" | "bop" | "cyber" | "umbr">;
  label: (typeof LINE_COLUMNS)[number];
}> = [
  { key: "wc", label: "WC" },
  { key: "gl", label: "GL" },
  { key: "bop", label: "BOP" },
  { key: "cyber", label: "CYBER" },
  { key: "umbr", label: "UMBR." },
] as const;

function StatusDot({ status }: { status: AppetiteStatus }) {
  return (
    <span
      className={`mx-auto block size-3 rounded-full ${STATUS_DOT[status]}`}
      aria-hidden
    />
  );
}

function LegendItem({
  status,
  label,
}: {
  status: AppetiteStatus;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 font-heading text-sm text-[#393939]">
      <span className={`size-2.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden />
      {label}
    </span>
  );
}

function StatusPill({
  label,
  status,
}: {
  label: string;
  status: AppetiteStatus;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-[#F7F7FB] px-3 py-2">
      <span className="font-mono text-[0.6875rem] font-medium uppercase text-[#414141]">
        {label}
      </span>
      <span className={`size-2 rounded-full ${STATUS_DOT[status]}`} aria-hidden />
      <span className="font-heading text-[0.6875rem] text-[#6B7280]">
        {status === "writing"
          ? "Writing"
          : status === "selective"
            ? "Selective"
            : "Decline"}
      </span>
    </div>
  );
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
        <span className="truncate text-[#1A1A1A]">{selected}</span>
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
                  className={`flex w-full items-center px-4 py-3.5 text-left font-heading text-xs font-semibold uppercase tracking-[0.04em] transition-colors md:text-sm ${
                    index > 0 ? "border-t border-[#EEF1F5]" : ""
                  } ${
                    isSelected
                      ? "bg-[#F5F3FF] text-[#2A297C]"
                      : "text-[#111110] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const Appetite = () => {
  const [product, setProduct] = useState<string>(PRODUCTS[1]);
  const [industry, setIndustry] = useState<string>(INDUSTRIES[1]);
  const [state, setState] = useState<string>(STATES[0]);
  const [selectedQuickTry, setSelectedQuickTry] = useState<string>(DEFAULT_QUICK_TRY);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const container = resultsRef.current;
      if (!container) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-appetite-animate]");
      if (!items.length) return;

      const rows = items.filter((el) => el.tagName === "TR");
      const others = items.filter((el) => el.tagName !== "TR");

      const animateIn = () => {
        gsap.killTweensOf(items);
        gsap.set(rows, { opacity: 0, clearProps: "transform" });
        gsap.set(others, { opacity: 0, y: 20 });
        gsap.to(rows, {
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.07,
          overwrite: true,
        });
        gsap.to(others, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.07,
          overwrite: true,
        });
      };

      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.88;

      let st: ScrollTrigger | null = null;

      if (inView) {
        animateIn();
      } else {
        gsap.set(rows, { opacity: 0, clearProps: "transform" });
        gsap.set(others, { opacity: 0, y: 20 });
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
    { scope: resultsRef, dependencies: [selectedQuickTry] },
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
              Check carrier appetite for any class code — powered by 140K+
              proprietary carrier interactions.
            </p>
          </div>

          <div className="relative mx-auto mt-12 max-w-5xl overflow-visible md:mt-14 lg:mt-16">
            <SectionRadialGlow className="absolute left-1/2 top-[58%] z-0 hidden w-[145%] max-w-[76rem] -translate-x-1/2 -translate-y-[42%] blur-[4.5rem] opacity-90 md:block" />

            <div className="relative z-10 rounded-2xl bg-white p-5 text-[#0a143b] shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8 lg:p-10">
              <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
                <div className="relative z-20 grid gap-4 md:grid-cols-3">
                  <FormSelect
                    id="appetite-product"
                    label="Product"
                    value={product}
                    options={PRODUCTS}
                    onChange={setProduct}
                  />
                  <FormSelect
                    id="appetite-industry"
                    label="Industry"
                    value={industry}
                    options={INDUSTRIES}
                    onChange={setIndustry}
                  />
                  <FormSelect
                    id="appetite-state"
                    label="State"
                    value={state}
                    options={STATES}
                    onChange={setState}
                  />
                </div>

                <div>
                  <label
                    htmlFor="naics-search"
                    className="mb-2 block font-mono text-sm font-medium uppercase text-[#2A297C]"
                  >
                    Enter NAICS code or business type
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      id="naics-search"
                      type="text"
                      placeholder="722511 or Restaurant"
                      className="box-border min-h-10 h-10 max-h-10 min-w-0 flex-1 rounded-lg border border-[#E4E7EC] bg-white px-4 font-heading text-sm leading-none text-[#1A1A1A] outline-none transition-colors placeholder:text-[#9AA8BC] focus:border-[#5B35E0] focus:ring-1 focus:ring-[#5B35E0]/20"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex w-full shrink-0 justify-center text-center sm:w-auto"
                    >
                      Check Appetite
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-mono text-sm font-medium uppercase text-[#2A297C]">
                    Quick try
                  </p>
                  <div className="-mx-1 overflow-x-auto overflow-y-hidden pb-1 md:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex w-max gap-2 px-1">
                      {QUICK_TRY_TAGS.map((tag) => {
                        const isSelected = selectedQuickTry === tag;

                        return (
                          <button
                            key={tag}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelectedQuickTry(tag)}
                            className={`shrink-0 rounded-full border px-5 py-2 font-heading text-[0.6875rem] transition-colors md:text-xs ${
                              isSelected
                                ? "border-[#5B35E0]/30 bg-[#5B35E0]/8 text-[#3834A4]"
                                : "border-[#E4E7EC] bg-[#FAFBFC] text-[#6B7280] hover:border-[#C8CDD6]"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="hidden flex-wrap gap-2 md:flex">
                    {QUICK_TRY_TAGS.map((tag) => {
                      const isSelected = selectedQuickTry === tag;

                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedQuickTry(tag)}
                          className={`rounded-full border px-5 py-2 font-heading text-[0.6875rem] transition-colors md:text-xs ${
                            isSelected
                              ? "border-[#5B35E0]/30 bg-[#5B35E0]/8 text-[#3834A4]"
                              : "border-[#E4E7EC] bg-[#FAFBFC] text-[#6B7280] hover:border-[#C8CDD6]"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </form>

              <div
                ref={resultsRef}
                className="mt-8 overflow-hidden border-t border-[#ECEEF2] pt-6 md:mt-10 md:pt-8"
              >
                <div
                  data-appetite-animate
                  className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="font-mono text-sm font-medium uppercase text-[#414141]">
                    Appetite results — {getQuickTryLabel(selectedQuickTry)}
                  </p>
                  <div className="flex flex-wrap items-center gap-10">
                    <LegendItem status="writing" label="Writing" />
                    <LegendItem status="selective" label="Selective" />
                    <LegendItem status="decline" label="Decline" />
                  </div>
                </div>

                <div className="space-y-3 md:hidden">
                  {CARRIER_ROWS.map((carrier) => (
                    <article
                      key={`${carrier.name}-mobile`}
                      data-appetite-animate
                      className="rounded-xl border border-[#E6E6E6] bg-white p-4 shadow-[0_4px_18px_rgba(17,24,39,0.04)]"
                    >
                      <h3 className="font-heading text-xl font-medium leading-tight text-[#4D47C3]">
                        {carrier.name}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {MOBILE_LINE_ITEMS.map(({ key, label }) => (
                          <StatusPill
                            key={`${carrier.name}-${label}`}
                            label={label}
                            status={carrier[key]}
                          />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden overflow-x-auto overflow-y-hidden rounded-xl border border-[#E6E6E6] bg-white md:block">
                  <table className="w-full min-w-[36rem] border-collapse">
                    <thead>
                      <tr
                        data-appetite-animate
                        className="border-b border-[#E6E6E6] bg-[#FAF7FF]"
                      >
                        <th className="px-4 py-3.5 text-left font-mono text-sm font-medium uppercase text-[#414141] md:px-5 md:py-4">
                          Carrier
                        </th>
                        {LINE_COLUMNS.map((column) => (
                          <th
                            key={column}
                            className="px-3 py-3.5 text-center font-mono text-sm font-medium uppercase text-[#414141] md:px-4 md:py-4"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {CARRIER_ROWS.map((carrier) => (
                        <tr
                          key={carrier.name}
                          data-appetite-animate
                          className="border-b border-[#E6E6E6] last:border-b-0"
                        >
                          <td className="px-4 py-3.5 font-sans text-sm font-regular text-[#33259F] md:px-5 md:py-4">
                            {carrier.name}
                          </td>
                          <td className="px-3 py-3.5 md:px-4 md:py-4">
                            <StatusDot status={carrier.wc} />
                          </td>
                          <td className="px-3 py-3.5 md:px-4 md:py-4">
                            <StatusDot status={carrier.gl} />
                          </td>
                          <td className="px-3 py-3.5 md:px-4 md:py-4">
                            <StatusDot status={carrier.bop} />
                          </td>
                          <td className="px-3 py-3.5 md:px-4 md:py-4">
                            <StatusDot status={carrier.cyber} />
                          </td>
                          <td className="px-3 py-3.5 md:px-4 md:py-4">
                            <StatusDot status={carrier.umbr} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
