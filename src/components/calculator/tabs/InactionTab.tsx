import React from 'react';
import { CalculationResult } from '@/lib/calculations';
import { fmtM } from '@/lib/formatters';
import { CalculatorKpiCard, CalculatorSection } from '../CalculatorKpiCard';
import { calcHeading, calcMetricLabel, calcPara, calcRowValue, calcSubheading, calcSubpara } from '../calculatorUi';

export default function InactionTab({ results }: { results: CalculationResult }) {
  const { years, inputs, totalROI } = results;
  const yr1 = years[0];

  const valueForegone = yr1?.totalValue || 0;
  const delayedROI = totalROI - valueForegone;
  
  const wait12Pct = (delayedROI / totalROI) * 100;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 md:gap-6">
      
      <CalculatorSection>
        <h3 className={calcHeading}>The Cost of Waiting 12 Months</h3>
        <p className={`mb-5 mt-1.5 ${calcPara}`}>Software implementations are often delayed due to competing priorities. But in insurance, deferring digitisation doesn't just defer revenue - it permanently erases it because the renewal compounding clock starts a year late.</p>
        
        <CalculatorKpiCard
          label="Total Value Lost to a 12-Month Delay"
          value={fmtM(valueForegone)}
          tone="rose"
          trend="permanently foregone"
          className="max-w-xl px-0 md:px-0"
        />
        <div className="mb-8" />

        <div className="mb-6 font-sans">
          <div className="mb-2 flex justify-between font-sans text-xs font-medium text-[#444444]">
            <span>Deploy Now - Full {inputs.projYears}-Year ROI</span>
            <span className="font-heading font-medium text-[#5B35E0]">{fmtM(totalROI)}</span>
          </div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-[#F0F0F4]">
            <div className="flex h-full w-full items-center justify-end rounded-full bg-gradient-to-r from-[#5B35E0] to-[#10B981] pr-2 transition-all duration-1000">
              <span className="text-[9px] font-medium text-white">100% captured</span>
            </div>
          </div>
        </div>
        
        <div className="font-sans">
          <div className="mb-2 flex justify-between font-sans text-xs font-medium text-[#444444]">
            <span>Wait 12 Months - Adjusted ROI</span>
            <span className="font-heading font-medium text-[#F43F5E]">{fmtM(delayedROI)}</span>
          </div>
          <div className="relative flex h-2.5 overflow-hidden rounded-full bg-[#F0F0F4]">
            <div
              className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-[#FB7185] to-[#F43F5E] pr-2 transition-all duration-1000"
              style={{ width: `${wait12Pct}%` }}
            >
              {wait12Pct > 18 ? (
                <span className="truncate text-[9px] font-medium text-white">
                  {wait12Pct.toFixed(0)}%
                </span>
              ) : null}
            </div>
            <div className={`flex flex-1 items-center justify-center px-2 font-sans text-xs font-medium text-[#F43F5E]`}>
              {fmtM(valueForegone)} lost
            </div>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection>
        <h4 className={`mb-4 border-b border-[#535353]/10 pb-2 ${calcSubheading}`}>Where the value bleeds out:</h4>
        <div className="grid grid-cols-1 divide-y divide-[#E8E8EC] font-sans sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          <div className="py-4 sm:px-5 sm:py-1 first:sm:pl-0">
            <p className={calcMetricLabel}>Lost Bind Lift</p>
            <div className={`mt-2 ${calcRowValue}`}>{fmtM(yr1?.addlRevBind)}</div>
            <div className={`mt-1 ${calcSubpara}`}>Quotes bound at current {inputs.bindCurrent}% instead of {inputs.bindCF}%</div>
          </div>
          <div className="py-4 sm:px-5 sm:py-1">
            <p className={calcMetricLabel}>Lost Productivity</p>
            <div className={`mt-2 ${calcRowValue}`}>{fmtM(yr1?.productivityReinvest)}</div>
            <div className={`mt-1 ${calcSubpara}`}>Time wasted on data entry instead of revenue-gen</div>
          </div>
          <div className="py-4 sm:px-5 sm:py-1">
            <p className={calcMetricLabel}>Lost Compounding</p>
            <div className={`mt-2 ${calcRowValue}`}>{fmtM(yr1?.commOnIncremental)}</div>
            <div className={`mt-1 ${calcSubpara}`}>Year 1 growth that won't renew in Year 2</div>
          </div>
          <div className="py-4 sm:px-5 sm:py-1 last:sm:pr-0">
            <p className={calcMetricLabel}>Lost IT Savings</p>
            <div className={`mt-2 ${calcRowValue}`}>{fmtM(yr1?.itSavings)}</div>
            <div className={`mt-1 ${calcSubpara}`}>12 months of continued in-house maintenance costs</div>
          </div>
        </div>
      </CalculatorSection>

    </div>
  );
}
