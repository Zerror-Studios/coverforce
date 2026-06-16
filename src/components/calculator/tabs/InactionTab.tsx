import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { CalculationResult } from '@/lib/calculations';
import { fmtM } from '@/lib/formatters';

export default function InactionTab({ results }: { results: CalculationResult }) {
  const { years, inputs, totalROI } = results;
  const yr1 = years[0];

  const valueForegone = yr1?.totalValue || 0;
  const delayedROI = totalROI - valueForegone;
  
  const deployNowPct = 100;
  const wait12Pct = (delayedROI / totalROI) * 100;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#0a143b] mb-1 font-heading">The Cost of Waiting 12 Months</h3>
        <p className="text-sm text-[#50617a] mb-6 font-sans">Software implementations are often delayed due to competing priorities. But in insurance, deferring digitisation doesn't just defer revenue — it permanently erases it because the renewal compounding clock starts a year late.</p>
        
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 text-center max-w-xl mx-auto shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-widest mb-2 font-sans">Total Value Lost to a 12-Month Delay</div>
          <div className="text-5xl font-heading font-regular tracking-tight font-bold text-[#0a143b]">{fmtM(valueForegone)}</div>
        </div>

        <div className="mb-6 font-sans">
          <div className="flex justify-between text-xs font-bold text-[#0a143b] mb-2">
            <span>Deploy Now — Full {inputs.projYears}-Year ROI</span>
            <span className="text-[#3834a4]">{fmtM(totalROI)}</span>
          </div>
          <div className="h-8 bg-gray-100 rounded-md overflow-hidden relative shadow-inner border border-gray-200">
            <div className="h-full bg-[#3834a4] transition-all duration-1000 flex items-center justify-center text-xs font-bold text-white" style={{ width: '100%' }}>
              100% Value Captured
            </div>
          </div>
        </div>
        
        <div className="mb-8 font-sans">
          <div className="flex justify-between text-xs font-bold text-[#0a143b] mb-2">
            <span>Wait 12 Months — Adjusted ROI</span>
            <span className="text-[#0a143b]">{fmtM(delayedROI)}</span>
          </div>
          <div className="h-8 bg-gray-100 rounded-md overflow-hidden relative flex shadow-inner border border-gray-200">
            <div className="h-full bg-[#8296B0] transition-all duration-1000 flex items-center justify-center text-xs font-bold text-white whitespace-nowrap overflow-hidden px-2" style={{ width: `${wait12Pct}%` }}>
              {wait12Pct.toFixed(0)}% Captured
            </div>
            <div className="flex-1 border-2 border-dashed border-gray-300 h-full flex items-center justify-center text-[10px] font-bold text-[#50617a] bg-gray-50">
              {fmtM(valueForegone)} Lost
            </div>
          </div>
        </div>

        <h4 className="text-sm font-bold text-[#0a143b] mb-4 border-b border-gray-200 pb-2 font-heading">Where the value bleeds out:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-bold text-[#0a143b] mb-1">{fmtM(yr1?.addlRevBind)}</div>
            <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-wide">Lost Bind Lift</div>
            <div className="text-[10px] text-gray-500 mt-1">Quotes bound at current {inputs.bindCurrent}% instead of {inputs.bindCF}%</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-bold text-[#0a143b] mb-1">{fmtM(yr1?.productivityReinvest)}</div>
            <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-wide">Lost Productivity</div>
            <div className="text-[10px] text-gray-500 mt-1">Time wasted on data entry instead of revenue-gen</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-bold text-[#0a143b] mb-1">{fmtM(yr1?.commOnIncremental)}</div>
            <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-wide">Lost Compounding</div>
            <div className="text-[10px] text-gray-500 mt-1">Year 1 growth that won't renew in Year 2</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-bold text-[#0a143b] mb-1">{fmtM(yr1?.itSavings)}</div>
            <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-wide">Lost IT Savings</div>
            <div className="text-[10px] text-gray-500 mt-1">12 months of continued in-house maintenance costs</div>
          </div>
        </div>
      </div>

    </div>
  );
}
