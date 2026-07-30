import React from "react";
import { CalculationResult } from "@/lib/calculations";
import { fmtM, pct } from "@/lib/formatters";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Lightbulb } from "lucide-react";
import {
  calcTable,
  calcTableWrap,
  calcTd,
  calcTdMutedRight,
  calcTdRight,
  calcTh,
  calcThRight,
  calcTheadRow,
  calcTotalRow,
  calcTr,
  calcHeading,
  calcPara,
} from "../calculatorUi";
import { CalculatorSection } from "../CalculatorKpiCard";

export default function CompoundingTab({ results }: { results: CalculationResult }) {
  const { years, commTotal, inputs } = results;

  const totNewBiz = years.reduce((s, y) => s + y.newBizThisYear, 0);
  const totRenew = years.reduce((s, y) => s + y.renewalsThisYear, 0);
  const totIncr = years.reduce((s, y) => s + y.incrementalPremium, 0);

  const chartData = years.map((y) => ({
    name: `Year ${y.year}`,
    renewalsThisYear: y.renewalsThisYear,
    newBizThisYear: y.newBizThisYear,
  }));

  const finalYr = years[years.length - 1];
  const renewalPercentage = finalYr
    ? finalYr.renewalsThisYear / (finalYr.renewalsThisYear + finalYr.newBizThisYear)
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].value + payload[1].value;
      return (
        <div className="rounded-lg border border-[#E6E6E6] bg-white p-3 font-sans text-sm">
          <p className="mb-2 font-heading font-medium text-[#444444]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mb-1 flex justify-between gap-4">
              <span className="font-sans" style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-heading font-medium text-[#444444]">{fmtM(entry.value)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between gap-4 border-t border-[#E6E6E6] pt-2 font-heading font-medium text-[#444444]">
            <span>Total Incremental</span>
            <span>{fmtM(total)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 duration-500 animate-in fade-in slide-in-from-bottom-4 md:gap-6">
      <CalculatorSection>
        <h3 className={calcHeading}>
          The Compounding Renewal Engine
        </h3>
        <p className={`mb-5 mt-1.5 ${calcPara}`}>
          Every policy written this year renews next year. That renewal stacks on top of next
          year&apos;s new business. This is the structural value of acting now vs. waiting - the
          compounding clock starts on day one.
        </p>

        <div className={calcTableWrap}>
          <table className={`${calcTable} min-w-[600px]`}>
            <thead>
              <tr className={calcTheadRow}>
                <th className={`${calcTh} text-left`}>Year</th>
                <th className={calcThRight}>New Business Added</th>
                <th className={calcThRight}>Renewals from Prior</th>
                <th className={calcThRight}>Total Incremental Premium</th>
                <th className={calcThRight}>Commission at {inputs.commissionRate}%</th>
                <th className={calcThRight}>Cumulative New Book</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {years.map((y) => (
                <tr key={y.year} className={calcTr}>
                  <td className={`${calcTd} font-medium`}>Year {y.year}</td>
                  <td className={calcTdMutedRight}>{fmtM(y.newBizThisYear)}</td>
                  <td className={calcTdRight}>{fmtM(y.renewalsThisYear)}</td>
                  <td className={calcTdRight}>{fmtM(y.incrementalPremium)}</td>
                  <td className={calcTdRight}>{fmtM(y.commOnIncremental)}</td>
                  <td className={`${calcTdRight} font-medium`}>{fmtM(y.cumNewPremium)}</td>
                </tr>
              ))}
              <tr className={calcTotalRow}>
                <td className={`${calcTd} font-medium`}>Total</td>
                <td className={`${calcTdRight} font-medium`}>{fmtM(totNewBiz)}</td>
                <td className={`${calcTdRight} font-medium`}>{fmtM(totRenew)}</td>
                <td className={`${calcTdRight} font-medium`}>{fmtM(totIncr)}</td>
                <td className={`${calcTdRight} font-medium`}>{fmtM(commTotal)}</td>
                <td className={`${calcTdRight} font-medium`}>{fmtM(finalYr?.cumNewPremium)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorSection>
        <h3 className={calcHeading}>
          New Business vs. Renewal Stack - Growing Annuity
        </h3>
        <p className={`mb-5 mt-1.5 ${calcPara}`}>
          The renewal band expands every year, demonstrating the annuity effect of acting now.
        </p>

        <div className="h-[280px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              barCategoryGap="28%"
              maxBarSize={32}
            >
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B6B6B", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickFormatter={(val) => fmtM(val)}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B6B6B", fontSize: 12 }}
              />
              <Tooltip cursor={{ fill: "#F6F2FF" }} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px", color: "#444444", fontSize: 12 }} iconType="circle" iconSize={8} />
              <Bar
                dataKey="renewalsThisYear"
                name="Renewals from Prior Years"
                stackId="a"
                fill="#A78BFA"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="newBizThisYear"
                name="Net New Business This Year"
                stackId="a"
                fill="#5B35E0"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CalculatorSection>

      <CalculatorSection className="flex items-start gap-4">
        <div className="shrink-0 rounded-full bg-[#FAF7FF] p-2 text-[#6B6B6B]">
          <Lightbulb className="size-5" />
        </div>
        <div className={calcPara}>
          <strong className="mb-1 block font-heading font-medium text-[#444444]">Key Insight:</strong>
          By Year {inputs.projYears}, the renewal book represents{" "}
          <strong className="text-[#444444]">{pct(renewalPercentage)}</strong> of total incremental
          premium - meaning growth is increasingly automatic. The total {inputs.projYears}-year
          commission on compounding new premium is{" "}
          <strong className="text-[#444444]">{fmtM(commTotal)}</strong>.
        </div>
      </CalculatorSection>
    </div>
  );
}
