"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { RiSearchEyeLine } from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import Button from "@/components/common/Button";
import ButtonArrowIcon from "@/components/common/ButtonArrowIcon";

gsap.registerPlugin(ScrollTrigger);

const LOGO_MAP: Record<string, string> = {
  AmTrust: "/images/integration/amtrust.svg",
  "Liberty Mutual": "/images/integration/liberty.svg",
  Travelers: "/images/integration/travelers.svg",
  Chubb: "/images/integration/chubb.svg",
  Nationwide: "/images/integration/nationwide.svg",
  Coalition: "/images/integration/coalition.svg",
};

const INTEGRATION_LOGOS = [
  "/images/integration/690221ad7f7ec7e8c24261dd_idw9JmZ4P2_1760337291940.png",
  "/images/integration/6902411b80a9ec9119a9eda8_images (1).jpeg",
  "/images/integration/690244d7a6cf2e74ae610747_61785058ade15b0495997231_logo-2.png",
  "/images/integration/690248d41320bee289fb3c57_idVR-g0Qe7_1760336063437.png",
  "/images/integration/690248d41320bee289fb3c57_idVR-g0Qe7_1760336063437-p-500.png",
  "/images/integration/6902494cbfbe5140228c9e2e_id4DBhSanf_logos.png",
  "/images/integration/69024beeb4a54e1e8af694a1_Property 1=Default.png",
  "/images/integration/69024fb9474b2bc566d2cc3f_idqg1Zo9QN_1760334704976 1 (1).png",
  "/images/integration/6902ff75299992a6dd5bf7f5_68fee642f92ceabc57f58dd8_b048bef1afb91101b299e837293d7343_great-american-1.jpg",
  "/images/integration/69036a8292f78c35c13b3d8c_seneca-insurance.jpg",
  "/images/integration/69037c006bbe13462d6eb495_State Auto Insurance Logo-p-500.webp",
  "/images/integration/69049c04b20f819f20cd98bb_USLI Logo.png",
  "/images/integration/6908d560e1380f5057ab841f_Axis.png",
  "/images/integration/6908d5a7170beafac67c95e9_HSB.png",
  "/images/integration/6908d5d4885aac68d28d7d43_The Hartford.png",
  "/images/integration/6908d5e9a0862b9e56c20ddb_GenStar.png",
  "/images/integration/6908d5f9b84be5d1b089325d_CoAction.png",
  "/images/integration/6908d60ee3d209f5f2b7b075_IFG.png",
  "/images/integration/6908d61acdc2647ebab0f38e_Accident Fund.png",
  "/images/integration/6908d632a3a3e1a9184683f7_Doe & Emuss.png",
  "/images/integration/6908d652c5416171f923064a_Killara.png",
  "/images/integration/6908d70807c1b5fef0eb9b65_Core Specialty.png",
  "/images/integration/6908d7241a971fabc9426e2b_Berley Net.png",
  "/images/integration/6908d7ade086956d67ae15d3_RSUI.png",
  "/images/integration/6908d813b05d9afef82c8174_Pathpoint.png",
  "/images/integration/6908d8290ffddd62a5e0f3a0_Northfield.png",
  "/images/integration/6908d8583440e9a4db98b649_Nautilus.png",
  "/images/integration/6908d87bdd15a178cf40b9c0_Music.png",
  "/images/integration/6908d8945638e8bda39aa30e_Main Street.png",
  "/images/integration/6908d8aa7e0ec88da82d68ec_IAT.png",
  "/images/integration/6908d8e447bcdc8846565b8c_Homesite.png",
  "/images/integration/6908d922efad82601a67ce66_Crum.png",
  "/images/integration/6908d93f3fa6d22abc9e2cb4_Counterpart.png",
  "/images/integration/6908d95a7cd78e6be5ea6c7e_Corvus.png",
  "/images/integration/6908d96ae1dd29eb1e8e2b61_CFC.png",
  "/images/integration/6908d98e5a55d49b356ea110_Blitz.png",
  "/images/integration/6908d99d1b574322357c44ca_Berley Management.png",
  "/images/integration/6908d9b13ae2393e0c1ab5d3_Beazley.png",
  "/images/integration/6908d9cc80bdc8768665723c_Atlantic.png",
  "/images/integration/6908d9dd1792cb25620b4942_Ategrity.png",
  "/images/integration/6908d9eea6df4552b10a4996_At Bay.png",
  "/images/integration/6908da00e7966d61a43fa980_Arch.png",
  "/images/integration/6908da1550edc74eff62af2b_Acuity.png",
  "/images/integration/6908da2f24aac126aa433fe8_Republic.png",
  "/images/integration/6908da4150c7b5be003f9986_Merchants.png",
  "/images/integration/6908da5285fe10fae78777a4_Guard.png",
  "/images/integration/6908da6aad8d8eaa56f41b59_First.png",
  "/images/integration/6908da7b931ed077a7209020_BiBerk.png",
  "/images/integration/6908da8cf4a35755bf097b10_Nationwide.png",
  "/images/integration/6908daa0623c6c715582aabf_Markel.png",
  "/images/integration/6908daba7d7eff694c6571d1_Liberty Mutual.png",
  "/images/integration/6908dad4cd1f0801fc8b8894_Hiscox.png",
  "/images/integration/6908db093440e9a4db99cccf_Employers.png",
  "/images/integration/6908db55757010dacb69744d_CNA.png",
  "/images/integration/6908db6adcca05fc2c46968b_Chubbs.png",
  "/images/integration/6908db8062b2d1f6547ebfc5_Coalition.png",
  "/images/integration/6908db8fa7a905334714f268_AmTrust.png",
  "/images/integration/69099c206d7a8bbc29dd1e7c_Westfield_Logo 1.png",
  "/images/integration/69099c3144a2ba3a25cf8973_Penn American GBLI Logo 1.png",
  "/images/integration/69099cbda97fb126ea005603_pie-logo 1.png",
  "/images/integration/69099d0df14f754619471063_Western World Logo 1.png",
] as const;

const INTEGRATION_LINKS = [
  "https://www.accidentfund.com/",
  "https://www.acuity.com/",
  "https://amtrustfinancial.com/",
  "https://insurance.archgroup.com/",
  "https://www.at-bay.com/",
  "https://www.ategrity.com/",
  "https://atlanticcasualty.net/",
  "https://www.axiscapital.com/",
  "https://www.beazley.com/en-sg/",
  "https://www.berkleymp.com/",
  "https://berkleynet.com/",
  "https://www.biberk.com/",
  "https://www.blitzinsurance.com/",
  "https://marketplace.btisinc.com/",
  "https://www.ifgcompanies.com/",
  "https://www.centurysurety.com/",
  "https://www.cfc.com/en-gb/",
  "https://www.chubb.com/us-en/",
  "https://www.cna.com/",
  "https://www.coactionspecialty.com/",
  "https://www.coalitioninc.com/",
  "https://corespecialty.com/",
  "https://www.corvusinsurance.com/",
  "https://coterieinsurance.com/",
  "https://yourcounterpart.com/",
  "https://cowbell.insure/",
  "https://www.cfins.com/",
  "https://doeandemuss.com/",
  "https://www.elphasecure.com/",
  "https://www.employers.com/",
  "https://myfirstinsurance.com/",
  "https://myfirstinsurance.com/",
  "https://www.generalstar.com/",
  "https://www.thehartford.com/",
  "https://www.hiscox.com/",
  "https://go.homesite.com/",
  "https://www.munichre.com/hsb/en.html",
  "https://www.iatinsurancegroup.com/",
  "https://killaracyber.com/",
  "https://www.libertymutual.com/",
  "https://msainsurance.com/",
  "https://www.markel.com/",
  "https://www.merchantsgroup.com/",
  "https://www.music-ins.com/",
  "https://www.nationwide.com/",
  "https://www.nautilusinsgroup.com/",
  "https://www.northfieldins.com/",
  "https://www.pathpoint.com/",
  "https://penn-america.com/",
  "https://www.pieinsurance.com/",
  "https://www.pouchinsurance.com/",
  "https://www.republicindemnity.com/",
  "https://www.rsui.com/",
  "https://www.senecainsurance.com/",
  "https://www.stateauto.com/",
  "https://www.thimble.com/",
  "https://www.travelers.com/",
  "https://www.usli.com/",
  "https://www.westernworld.com/home",
  "https://www.westernworld.com/home",
  "https://www.westfieldinsurance.com/",
] as const;

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
  logoSrc?: string;
  website?: string;
  logoColor: string;
  status: "Live on CoverForce" | "API available";
  category: CategoryId;
  /** Used for LOB filters only - not shown on cards */
  lobs: string[];
  products: CarrierProduct[];
};

type Tab = {
  id: CategoryId;
  label: string;
  count?: number;
};

const INTEGRATION_COUNT = INTEGRATION_LOGOS.length;

const TABS: Tab[] = [
  { id: "carriers", label: "Carriers & MGAs", count: INTEGRATION_COUNT },
  { id: "ams", label: "Agency Management", count: INTEGRATION_COUNT },
  { id: "finance", label: "Finance & Compliance", count: INTEGRATION_COUNT },
  { id: "ai", label: "Market Access", count: INTEGRATION_COUNT },
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

const DIRECTORY: Carrier[] = INTEGRATION_LOGOS.map((logoSrc, i) => ({
  ...BASE_CARRIERS[i % BASE_CARRIERS.length]!,
  logoSrc,
  website: INTEGRATION_LINKS[i],
}));

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

function getCategoryCardDescription(category: CategoryId, carrier: Carrier) {
  switch (category) {
    case "ams":
      return `${carrier.name} supports agency management workflows for submissions, quoting, and downstream operational sync.`;
    case "finance":
      return `${carrier.name} fits into finance and compliance workflows for billing, premium finance, and filing operations.`;
    case "ai":
      return `${carrier.name} plugs into market access workflows to speed appetite checks, routing, and partner distribution.`;
    default:
      return "";
  }
}

const CarrierCard = ({
  carrier,
  activeTab,
}: {
  carrier: Carrier;
  activeTab: CategoryId;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const showCarrierCapsule = activeTab === "carriers";
  const cardDescription = getCategoryCardDescription(activeTab, carrier);

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
          <div className="flex min-w-0 items-center">
            <span className="flex h-10 w-full max-w-44 items-center justify-start transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] sm:h-11 sm:max-w-48">
              <Image
                src={carrier.logoSrc ?? LOGO_MAP[carrier.name] ?? "/images/integration/amtrust.svg"}
                alt={carrier.name}
                width={176}
                height={44}
                className="h-full w-full object-contain object-left"
              />
            </span>
          </div>
          <div className="shrink-0">
            <StatusBadge status={carrier.status} />
          </div>
        </div>

        {!showCarrierCapsule ? (
          <p className="mt-4 line-clamp-2 min-h-11 max-w-88 font-sans text-sm leading-[1.4] text-[#50617a]">
            {cardDescription}
          </p>
        ) : null}

        {showCarrierCapsule ? (
          <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
            {carrier.products.map((product, idx) => {
              const requestable = product.availability === "request";
              const isExcessSurplus = product.market === "ES";
              return (
                <span
                  key={`${product.name}-${idx}`}
                  title={
                    requestable
                      ? "Available to request - not yet live on CoverForce"
                      : "Live on CoverForce"
                  }
                  className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full py-1 pl-2.5 pr-4 text-xs font-sans font-medium tracking-wide transition-colors duration-300 ${
                    isExcessSurplus
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
                        ? isExcessSurplus
                          ? "bg-transparent ring-1 ring-[#8B5CF6]"
                          : "bg-transparent ring-1 ring-[#185FA5]"
                        : isExcessSurplus
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
        ) : null}

        <Link
          href={carrier.website ?? "/contact"}
          target={carrier.website ? "_blank" : undefined}
          rel={carrier.website ? "noreferrer" : undefined}
          className="mt-auto ml-auto flex items-center gap-2 pt-5 text-right text-sm font-heading font-medium text-[#2D3E9D] transition-colors hover:text-[#151F4D] md:pt-6"
        >
          Know more
          <ButtonArrowIcon className="h-2 w-3 shrink-0 text-current" />
        </Link>
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
  const PAGE_SIZE = 12;
  const [activeTab, setActiveTab] = useState<CategoryId>("carriers");
  const [lob, setLob] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [market, setMarket] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return DIRECTORY.reduce<Carrier[]>((acc, entry) => {
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
  }, [lob, status, market]);

  const resultLabel = "integrations shown";
  const visibleCards = filtered.slice(0, visibleCount);
  const hasMoreCards = visibleCount < filtered.length;

  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef });

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, lob, status, market]);

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
      <div className="relative z-10 overflow-hidden">
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
                  <span data-split>2026 Carrier API Index</span>
                </h2>
                <p
                  ref={descRef}
                  className="max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
                >
                  The universal index of CoverForce integrations - carriers, AMS,
                  premium finance, E&amp;S compliance, and AI in one place.
                </p>
              </div>
              <p className="hidden max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:ml-auto lg:block lg:text-right">
                The universal index of CoverForce integrations - carriers, AMS,
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
              <>
                <div
                  ref={gridRef}
                  className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-8 lg:grid-cols-3"
                >
                  {visibleCards.map((carrier, idx) => (
                    <CarrierCard
                      key={carrier.logoSrc ?? `${carrier.name}-${idx}`}
                      carrier={carrier}
                      activeTab={activeTab}
                    />
                  ))}
                </div>
                {hasMoreCards ? (
                  <div className="mt-6 flex justify-center lg:mt-8">
                    <Button
                      onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
                      className="hover:scale-[1.02]"
                    >
                      Show more
                    </Button>
                  </div>
                ) : null}
              </>
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
    </section>
  );
};

export default Integration;
