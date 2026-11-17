import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmtM } from '@/lib/formatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plug } from 'lucide-react';
import { CalculatorKpiCard, CalculatorKpiRow, CalculatorSection } from '../CalculatorKpiCard';
import { calcHeading, calcPara, calcSubheading, calcSubpara } from '../calculatorUi';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#535353]/10 bg-white p-3 font-sans text-sm">
        <p className="mb-2 font-heading font-medium text-[#444444]">{label} (Cumulative Cost)</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="mb-1 flex justify-between gap-4">
            <span className="font-sans" style={{ color: entry.color }}>{entry.name}</span>
            <span className="font-heading font-medium text-[#444444]">{fmtM(entry.value)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between gap-4 border-t border-[#535353]/10 pt-2 font-heading font-medium text-[#444444]">
          <span>Cost Avoided</span>
          <span>{fmtM(payload[0].value - payload[1].value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function BuildVsBuyTab({ results }: { results: CalculationResult }) {
  const { years, totalCFSpend, buildTotal, inputs, integrationBuildCost, integrationAnnualCost, integrationComplexityMultiplier } = results;

  const chartData = years.map(y => {
    // We want cumulative costs to show the expanding gap
    const prevInHouse = y.year === 1 ? 0 : years.slice(0, y.year - 1).reduce((s, prev) => s + prev.buildCost, 0);
    const prevCF = y.year === 1 ? 0 : years.slice(0, y.year - 1).reduce((s, prev) => s + prev.cfCost, 0);
    
    return {
      name: `Year ${y.year}`,
      inHouseCumulative: prevInHouse + y.buildCost,
      cfCumulative: prevCF + y.cfCost,
      inHouseAnnual: y.buildCost,
      cfAnnual: y.cfCost
    };
  });

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 md:gap-6">
      
      {/* KPIs */}
      <CalculatorSection>
        <CalculatorKpiRow cols={2}>
          <CalculatorKpiCard
            label={`Total Cost of Ownership (${inputs.projYears} Yr)`}
            tone="indigo"
            value={
              <span className="flex flex-wrap items-baseline gap-2 font-heading text-[1.75rem] md:text-[2rem]">
                <span>{fmtM(buildTotal)}</span>
                <span className="font-sans text-base font-medium text-[#C4C4C4]">vs</span>
                <span className="text-[#4338CA]">{fmtM(totalCFSpend)}</span>
              </span>
            }
            trend="in-house vs CoverForce"
          />
          <CalculatorKpiCard
            label="Cost Avoidance"
            value={fmtM(buildTotal - totalCFSpend)}
            tone="green"
            trend="free cash flow unlocked"
          />
        </CalculatorKpiRow>
      </CalculatorSection>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        
        {/* Carrier Integrations Logic */}
        <CalculatorSection className="md:col-span-1">
          <h3 className={`mb-4 flex items-center gap-2 ${calcSubheading}`}>
            <Plug className="size-4 text-[#6B6B6B]" /> The Integration Trap
          </h3>
          <div className={`mb-4 ${calcPara}`}>
            Building <strong className="text-[#444444]">{inputs.carrierIntegrations} carrier integrations</strong> isn&apos;t just {inputs.carrierIntegrations}x the work. Each new API exponentially increases the maintenance burden due to differing data standards, auth methods, and constant schema changes.
          </div>
          <div className="space-y-2 border-y border-[#535353]/10 py-3">
            <div className="mb-2 flex justify-between font-sans text-xs">
              <span className="text-[#6B6B6B]">Complexity Multiplier</span>
              <span className="font-heading font-medium text-[#444444]">{integrationComplexityMultiplier.toFixed(2)}x</span>
            </div>
            <div className="mb-2 flex justify-between font-sans text-xs">
              <span className="text-[#6B6B6B]">Year 1 Integration Cost</span>
              <span className="font-heading font-medium text-[#444444]">{fmtM(integrationBuildCost)}</span>
            </div>
            <div className="flex justify-between font-sans text-xs">
              <span className="text-[#6B6B6B]">Annual API Maintenance</span>
              <span className="font-heading font-medium text-[#444444]">{fmtM(integrationAnnualCost)}</span>
            </div>
          </div>
          <div className={`mt-4 italic ${calcSubpara}`}>
            &quot;We thought we could build it for $100k. We spent $500k just keeping the APIs connected when the carriers updated their systems.&quot;
          </div>
        </CalculatorSection>

        {/* Chart */}
        <CalculatorSection className="md:col-span-2">
          <h3 className={calcHeading}>Cumulative Cash Outflow</h3>
          <p className={`mb-5 mt-1.5 ${calcPara}`}>Visualizing the capital efficiency of renting infrastructure vs. building it.</p>
          
          <div className="h-[250px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInHouse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.28}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B35E0" stopOpacity={0.32}/>
                    <stop offset="95%" stopColor="#5B35E0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis tickFormatter={(val) => fmtM(val)} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip cursor={{ stroke: '#E4D9FF', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px', color: '#374151', fontSize: 12 }} iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="inHouseCumulative" name="In-House Build & Maintain" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorInHouse)" />
                <Area type="monotone" dataKey="cfCumulative" name="CoverForce Subscription" stroke="#5B35E0" strokeWidth={2} fillOpacity={1} fill="url(#colorCF)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CalculatorSection>

      </div>

    </div>
  );
}
