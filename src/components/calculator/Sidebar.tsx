"use client";

import React, { useState } from "react";
import {
  CalculatorInputs,
  LOB_COMMERCIAL,
  LOB_PERSONAL,
  SEGMENTS,
} from "@/lib/calculations";
import {
  ChevronDown,
} from "lucide-react";
import {
  calcEyebrow,
  calcInputWrap,
  calcLabel,
  calcSegmentActive,
  calcSegmentIdle,
} from "./calculatorUi";

interface Props {
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  applySegment: (segment: keyof typeof SEGMENTS) => void;
  toggleCommercialLob: (id: string) => void;
  setCommercialLobPct: (id: string, pct: number) => void;
  setPersonalLobPct: (id: string, pct: number) => void;
}

const SEGMENT_OPTIONS = [
  { id: "startup" as const, label: "Startup" },
  { id: "mid" as const, label: "Mid-Market" },
  { id: "enterprise" as const, label: "Enterprise" },
];

const PROJECTION_OPTIONS = [3, 5] as const;

type SectionId =
  | "business-mix"
  | "business-profile"
  | "quoting-ops"
  | "quality"
  | "technology";

type InputRowProps = {
  label: string;
  prop: keyof CalculatorInputs;
  suffix?: string;
  prefix?: string;
  note?: string;
  step?: number | string;
  type?: "number" | "text";
};

function ControlLabel({ children }: { children: React.ReactNode }) {
  return <span className={calcLabel}>{children}</span>;
}

function SidebarAccordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden border-b border-[#535353]/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-1 py-3.5 text-left transition-colors hover:bg-[#F7F7F7]/80"
      >
        <span className="font-heading text-sm font-medium tracking-tight text-[#444444]">
          {title}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#8A8A8A] transition-transform duration-300 ease-out ${open ? "rotate-180" : ""
            }`}
          aria-hidden
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="overflow-hidden">
          <div className="px-1 pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1.5 font-heading text-xs font-medium tracking-tight transition-colors ${active ? calcSegmentActive : calcSegmentIdle
        }`}
    >
      {children}
    </button>
  );
}

export default function Sidebar({
  inputs,
  updateInput,
  applySegment,
  toggleCommercialLob,
  setCommercialLobPct,
  setPersonalLobPct,
}: Props) {
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [activeSegment, setActiveSegment] = useState<keyof typeof SEGMENTS>("mid");

  const toggleSection = (id: SectionId) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const handleSegmentClick = (seg: keyof typeof SEGMENTS) => {
    setActiveSegment(seg);
    applySegment(seg);
  };

  const InputRow = ({
    label,
    prop,
    suffix,
    prefix,
    note,
    step = 1,
    type = "number",
  }: InputRowProps) => (
    <div className="mb-3.5">
      <ControlLabel>{label}</ControlLabel>
      <div className={calcInputWrap}>
        {prefix ? (
          <span className="pl-3 pr-1 font-heading text-sm font-medium text-[#8A8A8A]">
            {prefix}
          </span>
        ) : null}
        <input
          type={type}
          className="w-full border-none bg-transparent px-3 py-2.5 font-heading text-sm font-medium text-[#444444] outline-none"
          value={inputs[prop] as string | number}
          onChange={(e) => {
            const val = type === "number" ? parseFloat(e.target.value) : e.target.value;
            updateInput(
              prop,
              (type === "number" && Number.isNaN(val as number) ? 0 : val) as CalculatorInputs[typeof prop],
            );
          }}
          step={step}
        />
        {suffix ? (
          <span className="pl-1 pr-3 font-heading text-sm font-medium text-[#8A8A8A]">
            {suffix}
          </span>
        ) : null}
      </div>
      {note ? <p className="mt-1 font-sans text-[10px] leading-relaxed text-[#8A8A8A]">{note}</p> : null}
    </div>
  );

  const RangeField = ({
    label,
    value,
    onChange,
    leftLabel,
    rightLabel,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    leftLabel: string;
    rightLabel: string;
  }) => (
    <div className="mb-5">
      <ControlLabel>{label}</ControlLabel>
      <div className="mb-2 flex justify-between font-sans text-[11px] font-semibold">
        <span className="text-[#444444]">{leftLabel}</span>
        <span className="text-[#8A8A8A]">{rightLabel}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#F0F0F0] accent-[#444444] [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#444444] [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#444444]"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    </div>
  );

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-xl border border-[#E8E8EC] bg-white p-4 print:w-full md:sticky md:top-24 md:w-[260px] md:self-start md:p-5 lg:w-[280px]">
      <div className="mb-4 border-b border-[#535353]/10 pb-4">
        <ControlLabel>Company</ControlLabel>
        <div className={calcInputWrap}>
          <input
            type="text"
            className="w-full border-none bg-transparent px-3 py-2.5 font-heading text-sm font-medium text-[#444444] outline-none placeholder:text-[#8A8A8A]"
            placeholder="Company name"
            value={inputs.companyName}
            onChange={(e) => updateInput("companyName", e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 space-y-4 border-b border-[#535353]/10 pb-4">
        <div>
          <span className={calcLabel}>Company size</span>
          <div className="flex flex-wrap gap-1.5">
            {SEGMENT_OPTIONS.map(({ id, label }) => (
              <SegmentButton
                key={id}
                active={activeSegment === id}
                onClick={() => handleSegmentClick(id)}
              >
                {label}
              </SegmentButton>
            ))}
          </div>
        </div>

        <div>
          <span className={calcLabel}>Projection</span>
          <div className="flex flex-wrap gap-1.5">
            {PROJECTION_OPTIONS.map((years) => (
              <SegmentButton
                key={years}
                active={inputs.projYears === years}
                onClick={() => updateInput("projYears", years)}
              >
                {years} years
              </SegmentButton>
            ))}
          </div>
        </div>
      </div>

      <SidebarAccordion
        title="Business Mix"
        open={openSection === "business-mix"}
        onToggle={() => toggleSection("business-mix")}
      >
        <RangeField
          label="Commercial vs personal lines"
          value={inputs.commPct}
          onChange={(v) => updateInput("commPct", v)}
          leftLabel={`Commercial ${inputs.commPct}%`}
          rightLabel={`Personal ${100 - inputs.commPct}%`}
        />

        <RangeField
          label="Admitted vs E&S (commercial only)"
          value={inputs.admittedPct}
          onChange={(v) => updateInput("admittedPct", v)}
          leftLabel={`Admitted ${inputs.admittedPct}%`}
          rightLabel={`E&S ${100 - inputs.admittedPct}%`}
        />

        <div className="my-4 border-t border-[#535353]/10" />

        <p className={`mb-2 ${calcEyebrow}`}>
          Commercial lines - CF can help
        </p>
        <div className="mb-4 flex flex-col  font-sans">
          {LOB_COMMERCIAL.map((lob) => {
            const st = inputs.commercialLobs[lob.id] || { on: true, pct: lob.pct };
            return (
              <label
                key={lob.id}
                className="flex cursor-pointer select-none items-center gap-2 rounded-sm p-1.5 hover:bg-[#F7F7F7]"
              >
                <input
                  type="checkbox"
                  className="size-3.5 shrink-0 rounded border-[#535353]/25 accent-[#444444]"
                  checked={st.on}
                  onChange={() => toggleCommercialLob(lob.id)}
                />
                <span className="flex-1 text-xs font-medium text-[#444444]">
                  {lob.label}
                </span>
                <div className="flex items-center gap-1 border border-[#535353]/10 px-1 py-0.5 rounded-xs">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-8 border-none bg-transparent p-0 text-right text-xs font-medium text-[#444444] outline-none"
                    value={st.pct}
                    onChange={(e) => setCommercialLobPct(lob.id, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[10px] font-medium text-[#8A8A8A]">%</span>
                </div>
              </label>
            );
          })}
        </div>

        <p className={`mb-2 mt-4 ${calcEyebrow}`}>
          Personal lines - quantify pain only
        </p>
        <div className="flex flex-col  font-sans">
          {LOB_PERSONAL.map((lob) => {
            const st = inputs.personalLobs[lob.id] || { on: true, pct: lob.pct };
            return (
              <label
                key={lob.id}
                className="flex cursor-pointer select-none items-center gap-2 rounded-sm p-1.5 hover:bg-[#F7F7F7]"
              >
                <input
                  type="checkbox"
                  className="size-3.5 shrink-0 rounded border-[#535353]/25 accent-[#444444]"
                  checked={st.on}
                  onChange={() => { }}
                />
                <span className="flex-1 text-xs font-medium text-[#444444]">
                  {lob.label}
                </span>
                <div className="flex items-center gap-1 border border-[#535353]/15 px-1 py-0.5 rounded-xs">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-8 border-none bg-transparent p-0 text-right text-xs font-medium text-[#444444] outline-none"
                    value={st.pct}
                    onChange={(e) => setPersonalLobPct(lob.id, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[10px] font-medium text-[#8A8A8A]">%</span>
                </div>
              </label>
            );
          })}
        </div>

        <p className={`mb-2 mt-4 ${calcEyebrow}`}>
          Other line of business
        </p>
        <div className=" w-full   grid grid-cols-7 gap-x-1 font-sans">
          <input
            type="text"
            placeholder="e.g. Marine Cargo..."
            className=" col-span-5  rounded-sm border border-[#535353]/10 bg-white p-2 text-xs text-[#444444] outline-none transition-colors placeholder:text-[#8A8A8A] focus:border-[#444444]"
            value={inputs.otherLobName}
            onChange={(e) => updateInput("otherLobName", e.target.value)}
          />
          <div className=" col-span-2 flex items-center   pr-2  rounded-sm border border-[#535353]/10 bg-white  focus-within:border-[#444444]">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              className=" w-[90%] pl-2  border-none bg-transparent  text-xs font-bold text-[#444444] outline-none"
              value={inputs.otherLobPct || ""}
              onChange={(e) => updateInput("otherLobPct", parseFloat(e.target.value) || 0)}
            />
            <span className="text-[10px] font-bold text-[#8A8A8A]">%</span>
          </div>
        </div>
        <label className="mt-2 flex cursor-pointer items-center gap-1.5 font-sans text-xs text-[#6B6B6B]">
          <input
            type="checkbox"
            className="accent-[#444444]"
            checked={inputs.otherLobCF}
            onChange={(e) => updateInput("otherLobCF", e.target.checked)}
          />
          CoverForce helps
        </label>
      </SidebarAccordion>

      <SidebarAccordion
        title="Business Profile"
        open={openSection === "business-profile"}
        onToggle={() => toggleSection("business-profile")}
      >
        <InputRow
          label="Annual premium volume"
          prop="annualPremium"
          prefix="$"
          step="1000000"
          note="Total bound premium written today"
        />
        <InputRow label="Commission / net revenue rate" prop="commissionRate" suffix="%" step={0.5} />
        <InputRow
          label="Annual new business growth rate"
          prop="newBizRate"
          suffix="%"
          step={1}
          note="% of current book added as new business each year"
        />
        <InputRow
          label="Policy renewal retention rate"
          prop="renewalRate"
          suffix="%"
          step={1}
          note="Industry avg 75–85%"
        />
      </SidebarAccordion>

      <SidebarAccordion
        title="Quoting Operations"
        open={openSection === "quoting-ops"}
        onToggle={() => toggleSection("quoting-ops")}
      >
        <InputRow label="Monthly quote volume" prop="quoteVol" step={50} />
        <InputRow label="Current bind rate" prop="bindCurrent" suffix="%" step={1} />
        <InputRow label="Bind rate with CoverForce" prop="bindCF" suffix="%" step={1} />
        <InputRow label="Minutes per quote - current" prop="minCurrent" suffix="min" step={5} />
        <InputRow label="Minutes per quote - CoverForce" prop="minCF" suffix="min" step={1} />
        <InputRow label="Blended staff hourly cost" prop="hourlyCost" prefix="$" step={5} />
        <InputRow
          label="Number of producers / underwriters"
          prop="staffCount"
          step={1}
          note="Used to calculate capacity unlock"
        />
      </SidebarAccordion>

      <SidebarAccordion
        title="Quality & Compliance"
        open={openSection === "quality"}
        onToggle={() => toggleSection("quality")}
      >
        <InputRow label="Manual error rate - current" prop="errorCurrent" suffix="%" step={0.5} />
        <InputRow label="Manual error rate - CoverForce" prop="errorCF" suffix="%" step={0.5} />
        <InputRow label="Cost per error / rework event" prop="costPerError" prefix="$" step={25} />
      </SidebarAccordion>

      <SidebarAccordion
        title="Technology Investment"
        open={openSection === "technology"}
        onToggle={() => toggleSection("technology")}
      >
        <InputRow label="CoverForce implementation fee" prop="implFee" prefix="$" step={1000} />
        <InputRow label="CoverForce monthly fee" prop="monthlyFee" prefix="$" step={500} />
        <div className="my-4 border-t border-[#535353]/10" />
        <InputRow label="In-house build cost (year 1)" prop="buildYear1" prefix="$" step={50000} />
        <InputRow label="In-house annual maintenance" prop="buildAnnual" prefix="$" step={10000} />
        <InputRow label="IT staff hourly rate" prop="itRate" prefix="$" step={5} />
        <InputRow
          label="IT hours/month on maintenance"
          prop="itHours"
          step={5}
          note="Ongoing hours to maintain in-house connections"
        />
        <div className="my-4 border-t border-[#535353]/10" />
        <InputRow
          label="Carrier API integrations (current)"
          prop="carrierIntegrations"
          step={1}
          note="Each integration = dev + annual maintenance cost. Complexity scales with every carrier added."
        />
      </SidebarAccordion>
    </aside>
  );
}
