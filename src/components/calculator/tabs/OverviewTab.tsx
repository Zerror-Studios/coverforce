import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmt, fmtM } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalculatorBadge, CalculatorKpiCard, CalculatorKpiRow, CalculatorPanel, CalculatorSection, CalculatorStatCard } from '../CalculatorKpiCard';
import { calcPara } from '../calculatorUi';

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
        <div className="rounded-lg border border-[#535353]/10 bg-white p-3 font-sans text-sm">
          <p className="mb-2 font-heading font-medium text-[#444444]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mb-1 flex justify-between gap-4">
              <span className="font-sans" style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-heading font-medium text-[#444444]">{fmtM(entry.value)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between gap-4 border-t border-[#535353]/10 pt-2 font-heading font-medium text-[#444444]">
            <span>Total Value</span>
            <span>{fmtM(payload[0].payload.totalValue)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 md:gap-6">
      
      {/* Top KPIs */}
      <CalculatorSection>
        <CalculatorKpiRow cols={3}>
          <CalculatorKpiCard
            label={`${inputs.projYears}-Year Net ROI`}
            value={fmtM(totalROI)}
            tone="purple"
            trend={
              <span className="inline-flex items-center gap-1.5">
                <CalculatorBadge tone="purple">{roiMult.toFixed(1)}x</CalculatorBadge>
                <span className="font-sans font-normal text-[#8A8A8A]">per $1</span>
              </span>
            }
          />
          <CalculatorKpiCard
            label="Payback Period"
            value={`${payback.toFixed(1)} mo`}
            tone="teal"
            trend="full recovery"
          />
          <CalculatorKpiCard
            label="Year 1 Value Created"
            value={fmtM(yr1?.totalValue)}
            tone="orange"
            trend="pre-compounding"
          />
        </CalculatorKpiRow>
      </CalculatorSection>

      {/* Secondary KPIs */}
      <CalculatorSection>
        <CalculatorKpiRow cols={4}>
          <CalculatorStatCard
            label="Hours Freed / Year"
            value={`${fmt(yr1?.hoursSaved)}h`}
            tone="indigo"
          />
          <CalculatorStatCard
            label="Error Cost Eliminated"
            value={fmtM(yr1?.errorSavings)}
            tone="green"
          />
          <CalculatorStatCard
            label="Addl Bound Policies"
            value={`${fmt((yr1?.addlBoundPerYear || 0) / 12, 0)}/mo`}
            tone="rose"
          />
          <CalculatorStatCard
            label={`${inputs.projYears}-Yr Comm. Growth`}
            value={fmtM(commTotal)}
            tone="slate"
          />
        </CalculatorKpiRow>
      </CalculatorSection>

      {/* Chart */}
      <CalculatorPanel
        title="Total Value by Year - All Sources"
        description="Stacked by value driver. Compounding premium commissions dominate as the renewal stack builds."
      >
        <div className="h-[300px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              barCategoryGap="28%"
              maxBarSize={32}
            >
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis tickFormatter={(val) => fmtM(val)} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#F6F2FF' }} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px', color: '#374151', fontSize: 12 }} iconType="circle" iconSize={8} />
              <Bar dataKey="commOnIncremental" name="Commission on Growth" stackId="a" fill="#5B35E0" radius={[0, 0, 4, 4]} />
              <Bar dataKey="addlRevBind" name="Bind Rate Lift" stackId="a" fill="#10B981" />
              <Bar dataKey="timeSavingsVal" name="Time Savings" stackId="a" fill="#0D9488" />
              <Bar dataKey="errorSavings" name="Error Reduction" stackId="a" fill="#F97316" />
              <Bar dataKey="productivityReinvest" name="Productivity Reinvest" stackId="a" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CalculatorPanel>

      <CalculatorPanel title="Executive Narrative" className={calcPara}>
        <p className="mb-3 font-sans">
          At a <strong className="text-[#444444]">{inputs.commissionRate}% commission rate</strong> on <strong className="text-[#444444]">{fmtM(inputs.annualPremium)}</strong> in current premium, 
          with <strong className="text-[#444444]">{inputs.newBizRate}% annual new business growth</strong> and <strong className="text-[#444444]">{inputs.renewalRate}% renewal retention</strong>, 
          deploying CoverForce creates <strong className="text-[#444444]">{fmtM(totalROI)} in net value</strong> for {inputs.companyName} over {inputs.projYears} years 
          at a total investment of <strong className="text-[#444444]">{fmtM(totalCFSpend)}</strong>.
        </p>
        <p className="mb-3">
          That is a <strong className="text-[#444444]">{roiMult.toFixed(1)}x return</strong> with payback in <strong className="text-[#444444]">{payback.toFixed(1)} months</strong>. 
          Year 1 alone generates <strong className="text-[#444444]">{fmtM(yr1?.totalValue)}</strong> - {((yr1?.totalValue / totalCFSpend) * 100).toFixed(0)}% of the total {inputs.projYears}-year investment recovered in the first year.
        </p>
        <p>
          The compounding renewal stack is the key driver: every dollar of new premium written this year renews at {inputs.renewalRate}%, 
          stacking on next year's new business to create an expanding annuity that grows automatically. Waiting 12 months to deploy means 
          <strong className="text-[#444444]"> {fmtM(yr1?.totalValue)}</strong> in Year 1 value is permanently foregone - not deferred.
        </p>
      </CalculatorPanel>
    </div>
  );
}
