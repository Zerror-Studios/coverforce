import React, { useState } from 'react';
import { CalculatorInputs, SEGMENTS, CalculationResult } from '@/lib/calculations';
import { exportToCSV, exportToPDF, copyShareText } from '@/lib/exportUtils';
import { Copy, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';

interface Props {
  inputs: CalculatorInputs;
  updateInput: (key: keyof CalculatorInputs, value: any) => void;
  applySegment: (segment: keyof typeof SEGMENTS) => void;
  results: CalculationResult;
}

export default function CompanyBar({ inputs, updateInput, applySegment, results }: Props) {
  const [activeSegment, setActiveSegment] = useState<keyof typeof SEGMENTS>('mid');
  const [isExporting, setIsExporting] = useState(false);

  const handleSegmentClick = (seg: keyof typeof SEGMENTS) => {
    setActiveSegment(seg);
    applySegment(seg);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:px-10 mt-20">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="bg-transparent border-b border-gray-200 outline-none text-xl md:text-2xl font-bold text-[#0a143b] placeholder-gray-400 focus:border-[#3834a4] transition-colors pb-1 max-w-[300px]"
            placeholder="Company Name"
            value={inputs.companyName}
            onChange={e => updateInput('companyName', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs font-semibold text-[#50617a] uppercase tracking-widest font-heading">Company Size</div>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200/50">
          {(['startup', 'mid', 'enterprise'] as const).map(seg => (
            <button
              key={seg}
              onClick={() => handleSegmentClick(seg)}
              className={`px-3 py-1.5 text-[11.5px] font-semibold rounded-md transition-all ${activeSegment === seg
                ? 'bg-white text-[#0a143b] shadow-sm'
                : 'text-[#50617a] hover:text-[#0a143b] hover:bg-gray-200/50'
                }`}
            >
              {seg === 'startup' ? 'Startup' : seg === 'mid' ? 'Mid-Market' : 'Enterprise'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs font-semibold text-[#50617a] uppercase tracking-widest font-heading">Projection</div>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200/50">
          {[3, 5].map(years => (
            <button
              key={years}
              onClick={() => updateInput('projYears', years)}
              className={`px-3 py-1.5 text-[11.5px] font-semibold rounded-md transition-all ${inputs.projYears === years
                ? 'bg-white text-[#0a143b] shadow-sm'
                : 'text-[#50617a] hover:text-[#0a143b] hover:bg-gray-200/50'
                }`}
            >
              {years} Years
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 border-l border-gray-200 pl-4 md:pl-6 ml-2">
        <Button
          onClick={() => copyShareText(results, inputs.companyName)}
          variant="outline"
          size="sm"
          icon={Copy}
          title="Copy Executive Summary to Clipboard"
        >
          Copy
        </Button>
        <Button
          onClick={() => exportToCSV(results, inputs.companyName)}
          variant="outline"
          size="sm"
          icon={FileSpreadsheet}
          title="Export Model to CSV"
        >
          CSV
        </Button>
        <Button
          onClick={() => exportToPDF('calculator-main-view', inputs.companyName)}
          variant="outline"
          size="sm"
          icon={FileText}
          title="Print or Save as PDF"
          className="print:hidden"
        >
          PDF
        </Button>
      </div>
    </div>
  );
}
