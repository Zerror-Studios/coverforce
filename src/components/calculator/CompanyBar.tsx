import React, { useState } from "react";
import { CalculatorInputs, SEGMENTS, CalculationResult } from "@/lib/calculations";
import { exportToCSV, exportToPDF, copyShareText } from "@/lib/exportUtils";
import { Copy, FileSpreadsheet, FileText } from "lucide-react";
import Button from "@/components/common/Button";
import { calcLabel, calcSegmentActive, calcSegmentIdle } from "./calculatorUi";

interface Props {
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  applySegment: (segment: keyof typeof SEGMENTS) => void;
  results: CalculationResult;
}

const SEGMENT_OPTIONS = [
  { id: "startup" as const, label: "Startup" },
  { id: "mid" as const, label: "Mid-Market" },
  { id: "enterprise" as const, label: "Enterprise" },
];

const PROJECTION_OPTIONS = [3, 5] as const;

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
      className={`rounded-lg border px-3.5 py-2 font-heading text-xs font-medium tracking-tight transition-colors md:px-4 ${
        active ? calcSegmentActive : calcSegmentIdle
      }`}
    >
      {children}
    </button>
  );
}

export default function CompanyBar({ inputs, updateInput, applySegment, results }: Props) {
  const [activeSegment, setActiveSegment] = useState<keyof typeof SEGMENTS>("mid");

  const handleSegmentClick = (seg: keyof typeof SEGMENTS) => {
    setActiveSegment(seg);
    applySegment(seg);
  };

  return (
    <div className="pt-24 pb-6 md:pt-28 md:pb-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 flex-1">
          <label className={calcLabel}>Company</label>
          <input
            type="text"
            className="w-full max-w-xl border-b border-[#535353]/15 bg-transparent pb-2 font-heading text-2xl font-medium tracking-tight text-[#0a143b] outline-none transition-colors placeholder:text-[#9AA8BC] focus:border-[#0a143b] md:text-3xl"
            placeholder="Company name"
            value={inputs.companyName}
            onChange={(e) => updateInput("companyName", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end lg:gap-8">
          <div>
            <span className={calcLabel}>Company size</span>
            <div className="flex flex-wrap gap-2">
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
            <div className="flex flex-wrap gap-2">
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

          <div className="flex flex-wrap items-center gap-3 sm:border-l sm:border-[#535353]/15 sm:pl-6">
            <Button
              onClick={() => copyShareText(results, inputs.companyName)}
              variant="outline"
              size="sm"
              icon={Copy}
              title="Copy executive summary to clipboard"
            >
              Copy
            </Button>
            <Button
              onClick={() => exportToCSV(results, inputs.companyName)}
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              title="Export model to CSV"
            >
              CSV
            </Button>
            <Button
              onClick={() => exportToPDF("calculator-main-view", inputs.companyName)}
              variant="outline"
              size="sm"
              icon={FileText}
              title="Print or save as PDF"
              className="print:hidden"
            >
              PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
