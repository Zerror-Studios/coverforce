import React from "react";
import { CalculationResult } from "@/lib/calculations";
import { fmtM } from "@/lib/formatters";
import {
  calcSectionRow,
  calcTable,
  calcTableWrap,
  calcTd,
  calcTdMuted,
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

export default function FullModelTab({ results }: { results: CalculationResult }) {
  const {
    years,
    inputs,
    totalROI,
    totalCFSpend,
    doNothing,
    itSavingsTotal,
    commTotal,
  } = results;

  return (
    <div className="flex flex-col gap-5 duration-500 animate-in fade-in slide-in-from-bottom-4 md:gap-6">
      <CalculatorSection>
        <h3 className={calcHeading}>
          Full Financial Model — {inputs.projYears} Year Projection
        </h3>
        <p className={`mb-5 mt-1.5 ${calcPara}`}>
          Detailed breakdown of value drivers, costs, and compounding effects.
        </p>

        <div className={calcTableWrap}>
          <table className={`${calcTable} min-w-[920px]`}>
            <thead>
              <tr className={calcTheadRow}>
                <th className={`${calcTh} w-[260px] min-w-[240px] whitespace-nowrap text-left`}>
                  Metric
                </th>
                {years.map((y) => (
                  <th key={y.year} className={`${calcThRight} min-w-[100px]`}>
                    Year {y.year}
                  </th>
                ))}
                <th className={`${calcThRight} min-w-[100px]`}>Total</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm">
              <tr className={calcSectionRow}>
                <td
                  colSpan={years.length + 2}
                  className="px-4 py-3 font-mono text-sm font-medium text-[#414141] md:px-5"
                >
                  1. Revenue Growth
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={`${calcTdMuted} whitespace-nowrap`}>Net New Business Premium</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdMutedRight}>
                    {fmtM(y.newBizThisYear)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>
                  {fmtM(years.reduce((s, y) => s + y.newBizThisYear, 0))}
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={`${calcTdMuted} whitespace-nowrap`}>Compounding Renewals</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdMutedRight}>
                    {fmtM(y.renewalsThisYear)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>
                  {fmtM(years.reduce((s, y) => s + y.renewalsThisYear, 0))}
                </td>
              </tr>
              <tr className={calcTotalRow}>
                <td className={`${calcTd} whitespace-nowrap font-medium`}>
                  Commission on New Book
                </td>
                {years.map((y) => (
                  <td key={y.year} className={`${calcTdRight} font-medium`}>
                    {fmtM(y.commOnIncremental)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>{fmtM(commTotal)}</td>
              </tr>

              <tr className={calcSectionRow}>
                <td
                  colSpan={years.length + 2}
                  className="px-4 py-3 font-mono text-sm font-medium text-[#414141] md:px-5"
                >
                  2. Operational Efficiency
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={calcTdMuted}>Lift from Improved Bind Rate</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdMutedRight}>
                    {fmtM(y.addlRevBind)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>
                  {fmtM(years.reduce((s, y) => s + y.addlRevBind, 0))}
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={calcTdMuted}>Time Savings Value</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdMutedRight}>
                    {fmtM(y.timeSavingsVal)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>
                  {fmtM(years.reduce((s, y) => s + y.timeSavingsVal, 0))}
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={calcTdMuted}>Productivity Reinvestment</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdMutedRight}>
                    {fmtM(y.productivityReinvest)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>
                  {fmtM(years.reduce((s, y) => s + y.productivityReinvest, 0))}
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={calcTdMuted}>Error Reduction Savings</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdMutedRight}>
                    {fmtM(y.errorSavings)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>
                  {fmtM(years.reduce((s, y) => s + y.errorSavings, 0))}
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={calcTdMuted}>IT Maintenance Saved</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdMutedRight}>
                    {fmtM(y.itSavings)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>{fmtM(itSavingsTotal)}</td>
              </tr>

              <tr className={calcTotalRow}>
                <td className={`${calcTd} font-medium`}>Total Value Created</td>
                {years.map((y) => (
                  <td key={y.year} className={`${calcTdRight} font-medium`}>
                    {fmtM(y.totalValue)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>{fmtM(doNothing)}</td>
              </tr>

              <tr className={calcSectionRow}>
                <td
                  colSpan={years.length + 2}
                  className="px-4 py-3 font-mono text-sm font-medium text-[#414141] md:px-5"
                >
                  3. Investment
                </td>
              </tr>
              <tr className={calcTr}>
                <td className={calcTdMuted}>CoverForce Fee</td>
                {years.map((y) => (
                  <td key={y.year} className={calcTdRight}>
                    -{fmtM(y.cfCost)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>-{fmtM(totalCFSpend)}</td>
              </tr>

              <tr className="border-b-0 bg-[#FAF7FF]">
                <td className={`${calcTd} font-medium`}>Net ROI</td>
                {years.map((y) => (
                  <td key={y.year} className={`${calcTdRight} font-medium`}>
                    {fmtM(y.netROI)}
                  </td>
                ))}
                <td className={`${calcTdRight} font-medium`}>{fmtM(totalROI)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CalculatorSection>
    </div>
  );
}
