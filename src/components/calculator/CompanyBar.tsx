"use client";

import React from "react";
import { CalculatorInputs, CalculationResult } from "@/lib/calculations";
import { exportToCSV, exportToPDF, copyShareText } from "@/lib/exportUtils";
import { Copy, FileSpreadsheet, FileText } from "lucide-react";
import EyebrowPill from "@/components/common/EyebrowPill";
import { calcLabel, calcSegmentIdle } from "./calculatorUi";
import { fmtM } from "@/lib/formatters";

interface Props {
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  results: CalculationResult;
}

export default function CompanyBar({ inputs, updateInput, results }: Props) {
  return (
    <div className="rounded-xl border border-[#E8E8EC] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)] md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <EyebrowPill surface="light" className="mb-4">
            ROI Calculator
          </EyebrowPill>
          <label className={calcLabel}>Company</label>
          <input
            type="text"
            className="w-full max-w-xl border-b border-[#535353]/15 bg-transparent pb-2 font-heading text-2xl font-medium tracking-tight text-[#444444] outline-none transition-colors placeholder:text-[#8A8A8A] focus:border-[#444444] md:text-3xl"
            placeholder="Company name"
            value={inputs.companyName}
            onChange={(e) => updateInput("companyName", e.target.value)}
          />
          <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-[#6B6B6B]">
            Model CoverForce value across your book — adjust inputs on the left,
            explore results below.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-end">
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 lg:min-w-[16rem]">
            <div>
              <p className="font-mono text-[0.625rem] font-medium tracking-normal text-[#8A8A8A]">
                Net ROI
              </p>
              <p className="mt-1 font-heading text-lg font-medium tracking-tight text-[#444444]">
                {fmtM(results.totalROI)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[0.625rem] font-medium tracking-normal text-[#8A8A8A]">
                Payback
              </p>
              <p className="mt-1 font-heading text-lg font-medium tracking-tight text-[#444444]">
                {results.payback.toFixed(1)} mo
              </p>
            </div>
            <div>
              <p className="font-mono text-[0.625rem] font-medium tracking-normal text-[#8A8A8A]">
                Multiple
              </p>
              <p className="mt-1 font-heading text-lg font-medium tracking-tight text-[#444444]">
                {results.roiMult.toFixed(1)}x
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => copyShareText(results, inputs.companyName)}
              title="Copy executive summary to clipboard"
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-heading text-xs font-medium tracking-tight transition-colors md:px-3.5 ${calcSegmentIdle} [&_svg]:text-[#6B7280]`}
            >
              <Copy className="size-3.5 shrink-0" aria-hidden />
              Copy
            </button>
            <button
              type="button"
              onClick={() => exportToCSV(results, inputs.companyName)}
              title="Export model to CSV"
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-heading text-xs font-medium tracking-tight transition-colors md:px-3.5 ${calcSegmentIdle} [&_svg]:text-[#6B7280]`}
            >
              <FileSpreadsheet className="size-3.5 shrink-0" aria-hidden />
              CSV
            </button>
            <button
              type="button"
              onClick={() => exportToPDF("calculator-main-view", inputs.companyName)}
              title="Print or save as PDF"
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-heading text-xs font-medium tracking-tight transition-colors md:px-3.5 ${calcSegmentIdle} [&_svg]:text-[#6B7280]`}
            >
              <FileText className="size-3.5 shrink-0" aria-hidden />
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
