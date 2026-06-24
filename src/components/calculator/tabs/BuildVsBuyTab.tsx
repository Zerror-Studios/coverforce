import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmtM } from '@/lib/formatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plug, Briefcase, PiggyBank } from 'lucide-react';

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#535353]/10 rounded-lg text-sm">
          <p className="font-bold text-[#0a143b] mb-2">{label} (Cumulative Cost)</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4 mb-1">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-semibold text-[#0a143b]">{fmtM(entry.value)}</span>
            </div>
          ))}
          <div className="border-t border-[#535353]/10 mt-2 pt-2 flex justify-between gap-4 font-bold text-[#0a143b]">
            <span>Cost Avoided</span>
            <span>{fmtM(payload[0].value - payload[1].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-[#535353]/10 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r "></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Total Cost of Ownership ({inputs.projYears} Yr)</h3>
            <div className="p-2 bg-[#F5F7FA] rounded-xl text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-6 mt-2">
            <div>
              <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-widest mb-1 font-sans">In-House Build</div>
              <div className="text-3xl font-heading font-regular tracking-tight text-[#0a143b] font-bold">{fmtM(buildTotal)}</div>
            </div>
            <div className="text-xl font-bold text-gray-300 mb-1">vs</div>
            <div>
              <div className="text-[10px] font-bold text-[#293B73] uppercase tracking-widest mb-1 font-sans">CoverForce</div>
              <div className="text-3xl font-heading font-regular tracking-tight text-[#293B73] font-bold">{fmtM(totalCFSpend)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#535353]/10 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r "></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Cost Avoidance</h3>
            <div className="p-2 bg-[#F5F7FA] rounded-xl text-[#293B73] group-hover:scale-110 transition-transform duration-300">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-[#293B73] uppercase tracking-widest mb-1 font-sans">Capital Saved by Buying</div>
          <div className="text-4xl font-heading font-regular tracking-tight text-[#293B73] font-bold mt-2 mb-2">{fmtM(buildTotal - totalCFSpend)}</div>
          <div className="text-xs text-[#50617a] font-sans">Free cash flow available for revenue-generating investments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Carrier Integrations Logic */}
        <div className="md:col-span-1 bg-white border border-[#535353]/10 rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#0a143b] mb-4 flex items-center gap-2 font-heading">
            <Plug className="w-4 h-4 text-[#50617a]" /> The Integration Trap
          </h3>
          <div className="text-xs text-[#50617a] leading-relaxed mb-4 font-sans">
            Building <strong className="text-[#0a143b]">{inputs.carrierIntegrations} carrier integrations</strong> isn't just {inputs.carrierIntegrations}x the work. Each new API exponentially increases the maintenance burden due to differing data standards, auth methods, and constant schema changes.
          </div>
          <div className="bg-[#F5F7FA] rounded-lg p-3 border border-[#535353]/10 font-sans">
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-[#50617a]">Complexity Multiplier</span>
              <span className="font-bold text-[#0a143b]">{integrationComplexityMultiplier.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-[#50617a]">Year 1 Integration Cost</span>
              <span className="font-bold text-[#0a143b]">{fmtM(integrationBuildCost)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#50617a]">Annual API Maintenance</span>
              <span className="font-bold text-[#0a143b]">{fmtM(integrationAnnualCost)}</span>
            </div>
          </div>
          <div className="mt-4 text-[10px] text-[#50617a] leading-relaxed italic font-sans">
            "We thought we could build it for $100k. We spent $500k just keeping the APIs connected when the carriers updated their systems."
          </div>
        </div>

        {/* Chart */}
        <div className="md:col-span-2 bg-white border border-[#535353]/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#0a143b] mb-1 font-heading">Cumulative Cash Outflow</h3>
          <p className="text-sm text-[#50617a] mb-6 font-sans">Visualizing the capital efficiency of renting infrastructure vs. building it.</p>
          
          <div className="h-[250px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInHouse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A143B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0A143B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#293B73" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#293B73" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis tickFormatter={(val) => fmtM(val)} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px', color: '#374151' }} iconType="circle" />
                <Area type="monotone" dataKey="inHouseCumulative" name="In-House Build & Maintain" stroke="#0A143B" strokeWidth={3} fillOpacity={1} fill="url(#colorInHouse)" />
                <Area type="monotone" dataKey="cfCumulative" name="CoverForce Subscription" stroke="#293B73" strokeWidth={3} fillOpacity={1} fill="url(#colorCF)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
