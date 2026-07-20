"use client";

import { Copy, FileSpreadsheet, FileText } from "lucide-react";
import { CalculationResult } from "@/lib/calculations";
import { exportToCSV, exportToPDF, copyShareText } from "@/lib/exportUtils";
import { fmtM } from "@/lib/formatters";
import { CalculatorSection } from "./CalculatorKpiCard";
import { calcSegmentIdle } from "./calculatorUi";

export default function TabSummaryCard({ results }: { results: CalculationResult }) {
  const companyName = results.inputs.companyName;

  return (
    <CalculatorSection className="print:hidden">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-3 gap-x-6 gap-y-2 sm:gap-x-8">
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

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => copyShareText(results, companyName)}
            title="Copy executive summary to clipboard"
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-heading text-xs font-medium tracking-tight transition-colors md:px-3.5 ${calcSegmentIdle} [&_svg]:text-[#6B7280]`}
          >
            <Copy className="size-3.5 shrink-0" aria-hidden />
            Copy
          </button>
          <button
            type="button"
            onClick={() => exportToCSV(results, companyName)}
            title="Export model to CSV"
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-heading text-xs font-medium tracking-tight transition-colors md:px-3.5 ${calcSegmentIdle} [&_svg]:text-[#6B7280]`}
          >
            <FileSpreadsheet className="size-3.5 shrink-0" aria-hidden />
            CSV
          </button>
          <button
            type="button"
            onClick={() => exportToPDF("calculator-main-view", companyName)}
            title="Print or save as PDF"
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-heading text-xs font-medium tracking-tight transition-colors md:px-3.5 ${calcSegmentIdle} [&_svg]:text-[#6B7280]`}
          >
            <FileText className="size-3.5 shrink-0" aria-hidden />
            PDF
          </button>
        </div>
      </div>
    </CalculatorSection>
  );
}
