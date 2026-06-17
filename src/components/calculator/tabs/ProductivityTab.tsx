import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmt, fmtM } from '@/lib/formatters';
import { Timer, Unlock, ShieldCheck } from 'lucide-react';

export default function ProductivityTab({ results }: { results: CalculationResult }) {
  const { inputs, years } = results;
  const yr1 = years[0];

  const minCurrent = inputs.minCurrent;
  const minCF = inputs.minCF;
  const savingsPct = ((minCurrent - minCF) / minCurrent) * 100;
  
  const totalStaff = inputs.staffCount || 1;
  const totalHoursAvailable = totalStaff * 40 * 48; // assuming 48 working weeks
  const percentCapacityUnlocked = (yr1?.hoursSaved / totalHoursAvailable) * 100;
  const fullTimeEquiv = yr1?.hoursSaved / (40 * 48);

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Hours Freed / Year</div>
            <div className="p-2 bg-gray-50 rounded-xl text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
              <Timer className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fmt(yr1?.hoursSaved)}</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">Across {inputs.quoteVol * 12} quotes annually</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Capacity Unlocked</div>
            <div className="p-2 bg-[#f0f4ff] rounded-xl text-[#3834a4] group-hover:scale-110 transition-transform duration-300">
              <Unlock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fullTimeEquiv.toFixed(1)} FTEs</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">{percentCapacityUnlocked.toFixed(1)}% of {totalStaff}-person team</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Error & Rework Savings</div>
            <div className="p-2 bg-gray-50 rounded-xl text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fmtM(yr1?.errorSavings)}</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">From manual data entry reduction</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Time Tracking */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0a143b] mb-1 font-heading">Where the Time Goes</h3>
          <p className="text-sm text-[#50617a] mb-6 font-sans">Time spent quoting vs. CoverForce time</p>
          
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-[#0a143b] mb-2 font-sans">
              <span>Current Process</span>
              <span>{minCurrent} min / quote</span>
            </div>
            <div className="h-6 bg-gray-100 rounded-md overflow-hidden relative border border-gray-200">
              <div className="h-full bg-gray-300" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs font-bold text-[#0a143b] mb-2 font-sans">
              <span>With CoverForce</span>
              <span className="text-[#3834a4]">{minCF} min / quote</span>
            </div>
            <div className="h-6 bg-gray-100 rounded-md overflow-hidden relative flex border border-gray-200">
              <div className="h-full bg-[#3834a4] flex items-center justify-center text-[10px] font-bold text-white px-2" style={{ width: `${(minCF / minCurrent) * 100}%` }}>
                {((minCF / minCurrent) * 100).toFixed(0)}%
              </div>
              <div className="flex-1 border-2 border-dashed border-gray-300 h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                {savingsPct.toFixed(0)}% Savings
              </div>
            </div>
          </div>
        </div>

        {/* Reinvestment Model */}
        <div className="bg-[#f0f4ff] border border-[#3834a4]/30 ring-2 ring-[#3834a4]/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#3834a4]"></div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#3834a4] font-sans">The Reinvestment Model</h3>
          </div>
          <h3 className="text-lg font-bold text-[#0a143b] mb-2 font-heading">Turning Time into Revenue</h3>
          <p className="text-sm text-[#50617a] mb-6 leading-relaxed font-sans">
            Time saved has two values: the <strong className="text-[#0a143b]">raw cost</strong> of the labor, and the <strong className="text-[#0a143b]">productivity value</strong> if those hours are redeployed to revenue-generating activities (like relationship building and proactive cross-selling).
          </p>

          <div className="bg-white rounded-lg p-4 border border-[#3834a4]/30 mb-4 font-sans shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-[#50617a]">Raw Time Value</span>
              <span className="font-bold text-[#0a143b]">{fmtM(yr1?.timeSavingsVal)}</span>
            </div>
            <div className="text-[10px] text-gray-500">({fmt(yr1?.hoursSaved)} hrs × {fmtM(inputs.hourlyCost)}/hr)</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#3834a4]/30 shadow-sm font-sans">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-[#3834a4]">Productivity Uplift Value</span>
              <span className="font-bold text-[#3834a4]">{fmtM(yr1?.productivityReinvest)}</span>
            </div>
            <div className="text-[10px] text-gray-500 leading-relaxed">
              Assuming 40% of freed time is redeployed to revenue generation at a 50% premium over base hourly cost.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
