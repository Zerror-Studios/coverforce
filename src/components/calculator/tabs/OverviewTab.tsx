import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmt, fmtM } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock, Sparkles, Timer, ShieldCheck, ArrowUpRight, BarChart as BarChartIcon } from 'lucide-react';

export default function OverviewTab({ results }: { results: CalculationResult }) {
  const { years, totalROI, roiMult, payback, totalCFSpend, inputs, commTotal } = results;
  const yr1 = years[0];

  const chartData = years.map(y => ({
    name: `Year ${y.year}`,
    commOnIncremental: y.commOnIncremental,
    addlRevBind: y.addlRevBind,
    timeSavingsVal: y.timeSavingsVal,
    errorSavings: y.errorSavings,
    productivityReinvest: y.productivityReinvest,
    totalValue: y.totalValue
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm text-sm font-sans">
          <p className="font-bold text-[#0a143b] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4 mb-1">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-semibold text-[#0a143b]">{fmtM(entry.value)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between gap-4 font-bold text-[#0a143b]">
            <span>Total Value</span>
            <span>{fmtM(payload[0].payload.totalValue)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">{inputs.projYears}-Year Net ROI</div>
            <div className="p-2 bg-[#f0f4ff] rounded-xl text-[#3834a4] group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fmtM(totalROI)}</div>
          <div className="text-xs font-semibold text-[#50617a] font-sans flex items-center gap-1.5 mt-2">
            <span className="text-[#3834a4] font-bold bg-[#f0f4ff] px-1.5 py-0.5 rounded">{roiMult.toFixed(1)}x</span> return per $1 invested
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Payback Period</div>
            <div className="p-2 bg-gray-50 rounded-xl text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{payback.toFixed(1)} mo</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">Months to full recovery</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Year 1 Value Created</div>
            <div className="p-2 bg-gray-50 rounded-xl text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fmtM(yr1?.totalValue)}</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">Before Year 2 compounding</div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#3834a4]/30 transition-all duration-300 text-center group">
          <div className="mx-auto w-10 h-10 bg-[#f0f4ff] rounded-full flex items-center justify-center mb-3 text-[#3834a4] group-hover:bg-[#3834a4] group-hover:text-white transition-colors duration-300">
            <Timer className="w-5 h-5" />
          </div>
          <div className="text-2xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1 group-hover:text-[#3834a4] transition-colors">{fmt(yr1?.hoursSaved)}h</div>
          <div className="text-[11px] font-bold text-[#50617a] uppercase tracking-widest font-heading">Hours Freed / Year</div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#3834a4]/30 transition-all duration-300 text-center group">
          <div className="mx-auto w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-[#0a143b] group-hover:bg-[#0a143b] group-hover:text-white transition-colors duration-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-2xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1 group-hover:text-[#3834a4] transition-colors">{fmtM(yr1?.errorSavings)}</div>
          <div className="text-[11px] font-bold text-[#50617a] uppercase tracking-widest font-heading">Error Cost Eliminated</div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#3834a4]/30 transition-all duration-300 text-center group">
          <div className="mx-auto w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-[#0a143b] group-hover:bg-[#0a143b] group-hover:text-white transition-colors duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div className="text-2xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1 group-hover:text-[#3834a4] transition-colors">{fmt((yr1?.addlBoundPerYear || 0) / 12, 0)}/mo</div>
          <div className="text-[11px] font-bold text-[#50617a] uppercase tracking-widest font-heading">Addl Bound Policies</div>
        </div>
        
        <div className="bg-[#f0f4ff] border border-[#3834a4]/20 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#3834a4]/50 transition-all duration-300 text-center group">
          <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 text-[#3834a4] group-hover:bg-[#3834a4] group-hover:text-white transition-colors duration-300">
            <BarChartIcon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-heading font-regular tracking-tight font-bold text-[#3834a4] mb-1 group-hover:scale-105 transition-transform">{fmtM(commTotal)}</div>
          <div className="text-[11px] font-bold text-[#3834a4] uppercase tracking-widest font-heading">{inputs.projYears}-Yr Comm. Growth</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#0a143b] font-heading">Total Value by Year — All Sources</h3>
        <p className="text-sm text-[#50617a] mb-6 font-sans">Stacked by value driver. Compounding premium commissions dominate as the renewal stack builds.</p>
        
        <div className="h-[300px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis tickFormatter={(val) => fmtM(val)} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px', color: '#374151' }} iconType="circle" />
              <Bar dataKey="commOnIncremental" name="Commission on Growth" stackId="a" fill="#0A143B" radius={[0, 0, 4, 4]} />
              <Bar dataKey="addlRevBind" name="Bind Rate Lift" stackId="a" fill="#293B73" />
              <Bar dataKey="timeSavingsVal" name="Time Savings" stackId="a" fill="#3834a4" />
              <Bar dataKey="errorSavings" name="Error Reduction" stackId="a" fill="#8296B0" />
              <Bar dataKey="productivityReinvest" name="Productivity Reinvest" stackId="a" fill="#BCC5D6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exec Narrative */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-sm text-[#50617a] leading-relaxed font-sans">
        <h3 className="text-lg font-bold text-[#0a143b] mb-3 font-heading">Executive Narrative</h3>
        <p className="mb-3">
          At a <strong className="text-[#0a143b]">{inputs.commissionRate}% commission rate</strong> on <strong className="text-[#0a143b]">{fmtM(inputs.annualPremium)}</strong> in current premium, 
          with <strong className="text-[#0a143b]">{inputs.newBizRate}% annual new business growth</strong> and <strong className="text-[#0a143b]">{inputs.renewalRate}% renewal retention</strong>, 
          deploying CoverForce creates <strong className="text-[#3834a4]">{fmtM(totalROI)} in net value</strong> for {inputs.companyName} over {inputs.projYears} years 
          at a total investment of <strong className="text-[#0a143b]">{fmtM(totalCFSpend)}</strong>.
        </p>
        <p className="mb-3">
          That is a <strong className="text-[#3834a4]">{roiMult.toFixed(1)}x return</strong> with payback in <strong className="text-[#0a143b]">{payback.toFixed(1)} months</strong>. 
          Year 1 alone generates <strong className="text-[#0a143b]">{fmtM(yr1?.totalValue)}</strong> — {((yr1?.totalValue / totalCFSpend) * 100).toFixed(0)}% of the total {inputs.projYears}-year investment recovered in the first year.
        </p>
        <p>
          The compounding renewal stack is the key driver: every dollar of new premium written this year renews at {inputs.renewalRate}%, 
          stacking on next year's new business to create an expanding annuity that grows automatically. Waiting 12 months to deploy means 
          <strong className="text-[#0a143b]"> {fmtM(yr1?.totalValue)}</strong> in Year 1 value is permanently foregone — not deferred.
        </p>
      </div>

    </div>
  );
}
