import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmtM, pct } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Lightbulb } from 'lucide-react';

export default function CompoundingTab({ results }: { results: CalculationResult }) {
  const { years, commTotal, inputs } = results;

  const totNewBiz = years.reduce((s, y) => s + y.newBizThisYear, 0);
  const totRenew = years.reduce((s, y) => s + y.renewalsThisYear, 0);
  const totIncr = years.reduce((s, y) => s + y.incrementalPremium, 0);

  const chartData = years.map(y => ({
    name: `Year ${y.year}`,
    renewalsThisYear: y.renewalsThisYear,
    newBizThisYear: y.newBizThisYear,
  }));

  const finalYr = years[years.length - 1];
  const renewalPercentage = finalYr ? (finalYr.renewalsThisYear / (finalYr.renewalsThisYear + finalYr.newBizThisYear)) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].value + payload[1].value;
      return (
        <div className="bg-white p-3 border border-[#535353]/10 rounded-lg text-sm">
          <p className="font-bold text-[#0a143b] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4 mb-1">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-semibold text-[#0a143b]">{fmtM(entry.value)}</span>
            </div>
          ))}
          <div className="border-t border-[#535353]/10 mt-2 pt-2 flex justify-between gap-4 font-bold text-[#0a143b]">
            <span>Total Incremental</span>
            <span>{fmtM(total)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white border border-[#535353]/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#0a143b] mb-1 font-heading">The Compounding Renewal Engine</h3>
        <p className="text-sm text-[#50617a] mb-6 font-sans">Every policy written this year renews next year. That renewal stacks on top of next year's new business. This is the structural value of acting now vs. waiting — the compounding clock starts on day one.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] font-sans">
            <thead>
              <tr>
                <th className="py-3 px-4 text-xs font-bold text-[#50617a] uppercase tracking-wider border-b border-[#535353]/10 bg-[#F5F7FA] rounded-tl-lg">Year</th>
                <th className="py-3 px-4 text-xs font-bold text-[#50617a] uppercase tracking-wider text-right border-b border-[#535353]/10 bg-[#F5F7FA]">New Business Added</th>
                <th className="py-3 px-4 text-xs font-bold text-[#50617a] uppercase tracking-wider text-right border-b border-[#535353]/10 bg-[#F5F7FA]">Renewals from Prior</th>
                <th className="py-3 px-4 text-xs font-bold text-[#50617a] uppercase tracking-wider text-right border-b border-[#535353]/10 bg-[#F5F7FA]">Total Incremental Premium</th>
                <th className="py-3 px-4 text-xs font-bold text-[#50617a] uppercase tracking-wider text-right border-b border-[#535353]/10 bg-[#F5F7FA]">Commission at {inputs.commissionRate}%</th>
                <th className="py-3 px-4 text-xs font-bold text-[#50617a] uppercase tracking-wider text-right border-b border-[#535353]/10 bg-[#F5F7FA] rounded-tr-lg">Cumulative New Book</th>
              </tr>
            </thead>
            <tbody>
              {years.map(y => (
                <tr key={y.year} className="hover:bg-[#F5F7FA] border-b border-[#535353]/10 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-[#0a143b]">Year {y.year}</td>
                  <td className="py-3 px-4 text-sm text-[#50617a] text-right">{fmtM(y.newBizThisYear)}</td>
                  <td className="py-3 px-4 text-sm font-bold text-[#293B73] text-right">{fmtM(y.renewalsThisYear)}</td>
                  <td className="py-3 px-4 text-sm font-bold text-[#293B73] text-right">{fmtM(y.incrementalPremium)}</td>
                  <td className="py-3 px-4 text-sm font-bold text-[#293B73] text-right">{fmtM(y.commOnIncremental)}</td>
                  <td className="py-3 px-4 text-sm font-bold text-[#0a143b] text-right">{fmtM(y.cumNewPremium)}</td>
                </tr>
              ))}
              <tr className="bg-[#F5F7FA] border-t border-[#535353]/10 font-bold text-[#0a143b]">
                <td className="py-3 px-4 text-sm rounded-bl-lg">Total</td>
                <td className="py-3 px-4 text-sm text-right">{fmtM(totNewBiz)}</td>
                <td className="py-3 px-4 text-sm text-[#293B73] text-right">{fmtM(totRenew)}</td>
                <td className="py-3 px-4 text-sm text-[#293B73] text-right">{fmtM(totIncr)}</td>
                <td className="py-3 px-4 text-sm text-[#293B73] text-right">{fmtM(commTotal)}</td>
                <td className="py-3 px-4 text-sm text-[#0a143b] text-right rounded-br-lg">{fmtM(finalYr?.cumNewPremium)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#535353]/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#0a143b] mb-1 font-heading">New Business vs. Renewal Stack — Growing Annuity</h3>
        <p className="text-sm text-[#50617a] mb-6 font-sans">The green (renewals) band expands every year, demonstrating the annuity effect of acting now.</p>
        
        <div className="h-[280px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis tickFormatter={(val) => fmtM(val)} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px', color: '#374151' }} iconType="circle" />
              <Bar dataKey="renewalsThisYear" name="Renewals from Prior Years" stackId="a" fill="#293B73" radius={[0, 0, 4, 4]} />
              <Bar dataKey="newBizThisYear" name="Net New Business This Year" stackId="a" fill="#293B73" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#F5F7FA] border-l-4 border-[#293B73] rounded-r-xl p-6 text-sm text-[#0a143b] leading-relaxed font-sans flex gap-4 items-start group">
        <div className="p-2 bg-white rounded-full text-[#293B73] group-hover:scale-110 transition-transform duration-300 shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-[#0a143b] block mb-1">Key Insight:</strong> 
          By Year {inputs.projYears}, the renewal book represents <strong className="text-[#293B73]">{pct(renewalPercentage)}</strong> of total incremental premium — meaning growth is increasingly automatic. The total {inputs.projYears}-year commission on compounding new premium is <strong className="text-[#293B73]">{fmtM(commTotal)}</strong>.
        </div>
      </div>

    </div>
  );
}
