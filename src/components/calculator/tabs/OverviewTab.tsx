import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmt, fmtM } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock, Sparkles, Timer, ShieldCheck, ArrowUpRight, BarChart as BarChartIcon } from 'lucide-react';
import { CalculatorKpiCard, CalculatorPanel } from '../CalculatorKpiCard';

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
        <div className="rounded-lg border border-[#535353]/10 bg-white p-3 text-sm font-sans">
          <p className="font-bold text-[#0a143b] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4 mb-1">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-semibold text-[#0a143b]">{fmtM(entry.value)}</span>
            </div>
          ))}
          <div className="border-t border-[#535353]/10 mt-2 pt-2 flex justify-between gap-4 font-bold text-[#0a143b]">
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <CalculatorKpiCard
          label={`${inputs.projYears}-Year Net ROI`}
          value={fmtM(totalROI)}
          icon={TrendingUp}
          sub={
            <span className="flex items-center gap-1.5">
              <span className="rounded bg-[#F5F7FA] px-1.5 py-0.5 font-semibold text-[#0a143b]">
                {roiMult.toFixed(1)}x
              </span>
              return per $1 invested
            </span>
          }
        />
        <CalculatorKpiCard
          label="Payback Period"
          value={`${payback.toFixed(1)} mo`}
          icon={Clock}
          sub="Months to full recovery"
        />
        <CalculatorKpiCard
          label="Year 1 Value Created"
          value={fmtM(yr1?.totalValue)}
          icon={Sparkles}
          sub="Before Year 2 compounding"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[#535353]/10 bg-white p-5 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#F5F7FA] text-[#0a143b]">
            <Timer className="size-5" />
          </div>
          <div className="mb-1 font-heading text-2xl font-medium tracking-tight text-[#0a143b]">{fmt(yr1?.hoursSaved)}h</div>
          <div className="font-heading text-[11px] font-medium uppercase tracking-widest text-[#50617a]">Hours Freed / Year</div>
        </div>

        <div className="rounded-xl border border-[#535353]/10 bg-white p-5 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#F5F7FA] text-[#0a143b]">
            <ShieldCheck className="size-5" />
          </div>
          <div className="mb-1 font-heading text-2xl font-medium tracking-tight text-[#0a143b]">{fmtM(yr1?.errorSavings)}</div>
          <div className="font-heading text-[11px] font-medium uppercase tracking-widest text-[#50617a]">Error Cost Eliminated</div>
        </div>

        <div className="rounded-xl border border-[#535353]/10 bg-white p-5 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#F5F7FA] text-[#0a143b]">
            <ArrowUpRight className="size-5" />
          </div>
          <div className="mb-1 font-heading text-2xl font-medium tracking-tight text-[#0a143b]">{fmt((yr1?.addlBoundPerYear || 0) / 12, 0)}/mo</div>
          <div className="font-heading text-[11px] font-medium uppercase tracking-widest text-[#50617a]">Addl Bound Policies</div>
        </div>

        <div className="rounded-xl border border-[#535353]/10 bg-[#F5F7FA] p-5 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-white text-[#0a143b]">
            <BarChartIcon className="size-5" />
          </div>
          <div className="mb-1 font-heading text-2xl font-medium tracking-tight text-[#0a143b]">{fmtM(commTotal)}</div>
          <div className="font-heading text-[11px] font-medium uppercase tracking-widest text-[#50617a]">{inputs.projYears}-Yr Comm. Growth</div>
        </div>
      </div>

      {/* Chart */}
      <CalculatorPanel
        title="Total Value by Year — All Sources"
        description="Stacked by value driver. Compounding premium commissions dominate as the renewal stack builds."
      >
        <div className="h-[300px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis tickFormatter={(val) => fmtM(val)} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px', color: '#374151' }} iconType="circle" />
              <Bar dataKey="commOnIncremental" name="Commission on Growth" stackId="a" fill="#0A143B" radius={[0, 0, 4, 4]} />
              <Bar dataKey="addlRevBind" name="Bind Rate Lift" stackId="a" fill="#293B73" />
              <Bar dataKey="timeSavingsVal" name="Time Savings" stackId="a" fill="#50617a" />
              <Bar dataKey="errorSavings" name="Error Reduction" stackId="a" fill="#8296B0" />
              <Bar dataKey="productivityReinvest" name="Productivity Reinvest" stackId="a" fill="#BCC5D6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CalculatorPanel>

      <CalculatorPanel title="Executive Narrative" className="text-sm leading-relaxed text-[#50617a]">
        <p className="mb-3 font-sans">
          At a <strong className="text-[#0a143b]">{inputs.commissionRate}% commission rate</strong> on <strong className="text-[#0a143b]">{fmtM(inputs.annualPremium)}</strong> in current premium, 
          with <strong className="text-[#0a143b]">{inputs.newBizRate}% annual new business growth</strong> and <strong className="text-[#0a143b]">{inputs.renewalRate}% renewal retention</strong>, 
          deploying CoverForce creates <strong className="text-[#0a143b]">{fmtM(totalROI)} in net value</strong> for {inputs.companyName} over {inputs.projYears} years 
          at a total investment of <strong className="text-[#0a143b]">{fmtM(totalCFSpend)}</strong>.
        </p>
        <p className="mb-3">
          That is a <strong className="text-[#0a143b]">{roiMult.toFixed(1)}x return</strong> with payback in <strong className="text-[#0a143b]">{payback.toFixed(1)} months</strong>. 
          Year 1 alone generates <strong className="text-[#0a143b]">{fmtM(yr1?.totalValue)}</strong> — {((yr1?.totalValue / totalCFSpend) * 100).toFixed(0)}% of the total {inputs.projYears}-year investment recovered in the first year.
        </p>
        <p>
          The compounding renewal stack is the key driver: every dollar of new premium written this year renews at {inputs.renewalRate}%, 
          stacking on next year's new business to create an expanding annuity that grows automatically. Waiting 12 months to deploy means 
          <strong className="text-[#0a143b]"> {fmtM(yr1?.totalValue)}</strong> in Year 1 value is permanently foregone — not deferred.
        </p>
      </CalculatorPanel>
    </div>
  );
}
