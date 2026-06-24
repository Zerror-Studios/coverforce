"use client";

import React, { useState } from "react";
import { CalculatorInputs, LOB_COMMERCIAL, LOB_PERSONAL } from "@/lib/calculations";
import {
  BarChart3,
  Blocks,
  CheckCircle2,
  ChevronDown,
  FolderGit2,
  PlusCircle,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  calcCard,
  calcEyebrow,
  calcInputWrap,
  calcLabel,
} from "./calculatorUi";

interface Props {
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  toggleCommercialLob: (id: string) => void;
  setCommercialLobPct: (id: string, pct: number) => void;
  setPersonalLobPct: (id: string, pct: number) => void;
}

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
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-xl ${calcCard}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F5F7FA]"
      >
        <span className="flex items-center gap-2.5 font-heading text-sm font-medium tracking-tight text-[#0a143b]">
          <Icon className="size-4 shrink-0 text-[#50617a]" aria-hidden />
          {title}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#9AA8BC] transition-transform duration-300 ease-out ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#535353]/10 px-4 pb-4 pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  inputs,
  updateInput,
  toggleCommercialLob,
  setCommercialLobPct,
  setPersonalLobPct,
}: Props) {
  const [openSection, setOpenSection] = useState<SectionId | null>("business-mix");

  const toggleSection = (id: SectionId) => {
    setOpenSection((prev) => (prev === id ? null : id));
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
          <span className="pl-3 pr-1 font-heading text-sm font-medium text-[#9AA8BC]">
            {prefix}
          </span>
        ) : null}
        <input
          type={type}
          className="w-full border-none bg-transparent px-3 py-2.5 font-heading text-sm font-medium text-[#0a143b] outline-none"
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
          <span className="pl-1 pr-3 font-heading text-sm font-medium text-[#9AA8BC]">
            {suffix}
          </span>
        ) : null}
      </div>
      {note ? <p className="mt-1 font-sans text-[10px] leading-relaxed text-[#9AA8BC]">{note}</p> : null}
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
        <span className="text-[#0a143b]">{leftLabel}</span>
        <span className="text-[#9AA8BC]">{rightLabel}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#F5F7FA] accent-[#0a143b] [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#0a143b] [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0a143b]"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    </div>
  );

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 print:w-full md:w-[340px] lg:w-[360px]">
      <SidebarAccordion
        title="Business Mix"
        icon={FolderGit2}
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

        <p className={`mb-2 flex items-center ${calcEyebrow}`}>
          <CheckCircle2 className="mr-1.5 size-3.5" aria-hidden />
          Commercial lines — CF can help
        </p>
        <div className="mb-4 flex flex-col gap-1.5 font-sans">
          {LOB_COMMERCIAL.map((lob) => {
            const st = inputs.commercialLobs[lob.id] || { on: true, pct: lob.pct };
            return (
              <label
                key={lob.id}
                className={`flex cursor-pointer select-none items-center gap-2 rounded-md border p-1.5 transition-colors ${
                  st.on
                    ? "border-[#0a143b]/30 bg-[#0a143b]/6"
                    : "border-[#535353]/10 bg-[#F5F7FA]"
                }`}
              >
                <div
                  className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    st.on
                      ? "border-[#0a143b] bg-[#0a143b] text-white"
                      : "border-[#535353]/15 bg-white"
                  }`}
                >
                  {st.on ? <span className="text-[10px]">✓</span> : null}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={st.on}
                  onChange={() => toggleCommercialLob(lob.id)}
                />
                <span
                  className={`flex-1 text-xs font-semibold ${st.on ? "text-[#0a143b]" : "text-[#8296B0]"}`}
                >
                  {lob.label}
                </span>
                <div className="flex items-center gap-1 border-l border-[#535353]/10 pl-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-8 border-none bg-transparent p-0 text-right text-xs font-bold text-[#0a143b] outline-none"
                    value={st.pct}
                    onChange={(e) => setCommercialLobPct(lob.id, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[10px] font-bold text-[#8296B0]">%</span>
                </div>
              </label>
            );
          })}
        </div>

        <p className={`mb-2 mt-4 flex items-center ${calcEyebrow}`}>
          <BarChart3 className="mr-1.5 size-3.5" aria-hidden />
          Personal lines — quantify pain only
        </p>
        <div className="flex flex-col gap-1.5 font-sans">
          {LOB_PERSONAL.map((lob) => {
            const st = inputs.personalLobs[lob.id] || { on: true, pct: lob.pct };
            return (
              <label
                key={lob.id}
                className={`flex cursor-pointer select-none items-center gap-2 rounded-md border p-1.5 transition-colors ${
                  st.on ? "border-[#50617a]/30 bg-[#F5F7FA]" : "border-[#535353]/10 bg-[#F5F7FA]"
                }`}
              >
                <div
                  className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    st.on
                      ? "border-[#50617a] bg-[#50617a] text-white"
                      : "border-[#535353]/15 bg-white"
                  }`}
                >
                  {st.on ? <span className="text-[10px]">✓</span> : null}
                </div>
                <input type="checkbox" className="hidden" checked={st.on} onChange={() => {}} />
                <span
                  className={`flex-1 text-xs font-semibold ${st.on ? "text-[#0a143b]" : "text-[#8296B0]"}`}
                >
                  {lob.label}
                </span>
                <div className="flex items-center gap-1 border-l border-[#535353]/15 pl-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-8 border-none bg-transparent p-0 text-right text-xs font-bold text-[#0a143b] outline-none"
                    value={st.pct}
                    onChange={(e) => setPersonalLobPct(lob.id, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[10px] font-bold text-[#8296B0]">%</span>
                </div>
              </label>
            );
          })}
        </div>

        <p className={`mb-2 mt-4 flex items-center ${calcEyebrow}`}>
          <PlusCircle className="mr-1.5 size-3.5" aria-hidden />
          Other line of business
        </p>
        <div className="flex items-center gap-2 font-sans">
          <input
            type="text"
            placeholder="e.g. Marine Cargo..."
            className="flex-1 rounded-lg border border-[#535353]/10 bg-white p-2 text-xs text-[#0a143b] outline-none transition-colors placeholder:text-[#8296B0] focus:border-[#0a143b]"
            value={inputs.otherLobName}
            onChange={(e) => updateInput("otherLobName", e.target.value)}
          />
          <div className="flex items-center gap-1 rounded-lg border border-[#535353]/10 bg-white px-2 py-1 focus-within:border-[#0a143b]">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              className="w-6 border-none bg-transparent p-0 text-right text-xs font-bold text-[#0a143b] outline-none"
              value={inputs.otherLobPct || ""}
              onChange={(e) => updateInput("otherLobPct", parseFloat(e.target.value) || 0)}
            />
            <span className="text-[10px] font-bold text-[#8296B0]">%</span>
          </div>
        </div>
        <label className="mt-2 flex cursor-pointer items-center gap-1.5 font-sans text-xs text-[#50617a]">
          <input
            type="checkbox"
            className="accent-[#0a143b]"
            checked={inputs.otherLobCF}
            onChange={(e) => updateInput("otherLobCF", e.target.checked)}
          />
          CF helps
        </label>
      </SidebarAccordion>

      <SidebarAccordion
        title="Business Profile"
        icon={BarChart3}
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
        icon={Zap}
        open={openSection === "quoting-ops"}
        onToggle={() => toggleSection("quoting-ops")}
      >
        <InputRow label="Monthly quote volume" prop="quoteVol" step={50} />
        <InputRow label="Current bind rate" prop="bindCurrent" suffix="%" step={1} />
        <InputRow label="Bind rate with CoverForce" prop="bindCF" suffix="%" step={1} />
        <InputRow label="Minutes per quote — current" prop="minCurrent" suffix="min" step={5} />
        <InputRow label="Minutes per quote — CoverForce" prop="minCF" suffix="min" step={1} />
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
        icon={Wrench}
        open={openSection === "quality"}
        onToggle={() => toggleSection("quality")}
      >
        <InputRow label="Manual error rate — current" prop="errorCurrent" suffix="%" step={0.5} />
        <InputRow label="Manual error rate — CoverForce" prop="errorCF" suffix="%" step={0.5} />
        <InputRow label="Cost per error / rework event" prop="costPerError" prefix="$" step={25} />
      </SidebarAccordion>

      <SidebarAccordion
        title="Technology Investment"
        icon={Blocks}
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
