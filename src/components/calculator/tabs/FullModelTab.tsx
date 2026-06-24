import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmtM, fmt } from '@/lib/formatters';

export default function FullModelTab({ results }: { results: CalculationResult }) {
  const { years, inputs, totalROI, totalCFSpend, roiMult, payback, monthlyVal, doNothing, buildTotal, itSavingsTotal, commTotal } = results;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white border border-[#535353]/10 rounded-xl p-6 overflow-x-auto">
        <h3 className="text-lg font-bold text-[#0a143b] mb-1 font-heading">Full Financial Model — {inputs.projYears} Year Projection</h3>
        <p className="text-sm text-[#50617a] mb-6 font-sans">Detailed breakdown of value drivers, costs, and compounding effects.</p>

        <table className="w-full text-left border-collapse min-w-[800px] font-sans">
          <thead>
            <tr>
              <th className="py-2 px-3 text-[10px] font-bold text-[#50617a] uppercase tracking-wider border-b border-[#535353]/10 w-[200px]">Metric</th>
              {years.map(y => (
                <th key={y.year} className="py-2 px-3 text-[10px] font-bold text-[#50617a] uppercase tracking-wider text-right border-b border-[#535353]/10">Year {y.year}</th>
              ))}
              <th className="py-2 px-3 text-[10px] font-bold text-[#0a143b] uppercase tracking-wider text-right border-b border-[#535353]/10 bg-[#F5F7FA]">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            
            {/* Revenue Growth */}
            <tr className="bg-[#F5F7FA]">
              <td colSpan={years.length + 2} className="py-2 px-3 text-xs font-bold text-[#0a143b] uppercase tracking-widest border-t border-[#535353]/10">1. Revenue Growth</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">Net New Business Premium</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#9AA8BC]">{fmtM(y.newBizThisYear)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#0a143b]">{fmtM(years.reduce((s,y)=>s+y.newBizThisYear,0))}</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">Compounding Renewals</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#293B73]">{fmtM(y.renewalsThisYear)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#293B73]">{fmtM(years.reduce((s,y)=>s+y.renewalsThisYear,0))}</td>
            </tr>
            <tr className="border-t border-[#535353]/10 bg-[#F5F7FA]">
              <td className="py-2 px-3 font-semibold text-[#0a143b]">Commission on New Book</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right font-semibold text-[#293B73]">{fmtM(y.commOnIncremental)}</td>)}
              <td className="py-2 px-3 text-right font-bold bg-[#F5F7FA] text-[#293B73]">{fmtM(commTotal)}</td>
            </tr>

            {/* Operational Efficiency */}
            <tr className="bg-[#F5F7FA]">
              <td colSpan={years.length + 2} className="py-2 px-3 text-xs font-bold text-[#0a143b] uppercase tracking-widest border-t border-[#535353]/10">2. Operational Efficiency</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">Lift from Improved Bind Rate</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#9AA8BC]">{fmtM(y.addlRevBind)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#0a143b]">{fmtM(years.reduce((s,y)=>s+y.addlRevBind,0))}</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">Time Savings Value</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#9AA8BC]">{fmtM(y.timeSavingsVal)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#0a143b]">{fmtM(years.reduce((s,y)=>s+y.timeSavingsVal,0))}</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">Productivity Reinvestment</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#9AA8BC]">{fmtM(y.productivityReinvest)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#0a143b]">{fmtM(years.reduce((s,y)=>s+y.productivityReinvest,0))}</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">Error Reduction Savings</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#9AA8BC]">{fmtM(y.errorSavings)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#0a143b]">{fmtM(years.reduce((s,y)=>s+y.errorSavings,0))}</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">IT Maintenance Saved</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#9AA8BC]">{fmtM(y.itSavings)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#0a143b]">{fmtM(itSavingsTotal)}</td>
            </tr>

            {/* Total Value */}
            <tr className="border-t border-[#535353]/10 bg-[#F5F7FA]">
              <td className="py-3 px-3 font-bold text-[#0a143b]">Total Value Created</td>
              {years.map(y => <td key={y.year} className="py-3 px-3 text-right font-bold text-[#0a143b]">{fmtM(y.totalValue)}</td>)}
              <td className="py-3 px-3 text-right font-black text-[#0a143b]">{fmtM(doNothing)}</td>
            </tr>

            {/* Investment */}
            <tr className="bg-[#F5F7FA]">
              <td colSpan={years.length + 2} className="py-2 px-3 text-xs font-bold text-[#0a143b] uppercase tracking-widest border-t border-[#535353]/10">3. Investment</td>
            </tr>
            <tr className="border-t border-[#535353]/10 hover:bg-[#F5F7FA]">
              <td className="py-2 px-3 text-[#50617a]">CoverForce Fee</td>
              {years.map(y => <td key={y.year} className="py-2 px-3 text-right text-[#0a143b]">-{fmtM(y.cfCost)}</td>)}
              <td className="py-2 px-3 text-right font-semibold bg-[#F5F7FA] text-[#0a143b]">-{fmtM(totalCFSpend)}</td>
            </tr>

            {/* Net ROI */}
            <tr className="border-t border-[#535353]/10 bg-[#0a143b] text-white">
              <td className="py-3 px-3 font-bold">Net ROI</td>
              {years.map(y => <td key={y.year} className="py-3 px-3 text-right font-bold text-white">{fmtM(y.netROI)}</td>)}
              <td className="py-3 px-3 text-right font-black text-white">{fmtM(totalROI)}</td>
            </tr>
            
          </tbody>
        </table>
      </div>

    </div>
  );
}
