import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CalculationResult } from '@/lib/calculations';
import { fmtM } from '@/lib/formatters';
import { CalculatorKpiCard, CalculatorKpiRow, CalculatorSection } from '../CalculatorKpiCard';
import { calcEyebrow, calcHeading, calcMetricLabel, calcMetricValueSm, calcPara, calcRowLabel, calcRowValue, calcSubheading, calcSubpara } from '../calculatorUi';

const LOB_COLORS_COMM_SOLID = [
  "#5B35E0",
  "#10B981",
  "#0D9488",
  "#F97316",
  "#6366F1",
  "#F43F5E",
  "#8B5CF6",
  "#06B6D4",
];
const LOB_COLORS_PERS_SOLID = ["#A78BFA", "#FB923C", "#67E8F9", "#F9A8D4"];


export default function RevenueMapTab({ results }: { results: CalculationResult }) {
  const { inputs, lobBreakdown, totalROI } = results;
  const ap = inputs.annualPremium;

  const commMax = Math.max(...lobBreakdown.commLOBs.map(l => l.premium), 1);
  const persMax = Math.max(...lobBreakdown.persLOBs.map(l => l.premium), 1);

  const commOffPremium = lobBreakdown.commLOBs.filter(l => !l.on).reduce((s,l) => s + l.premium, 0);

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 md:gap-6">
      
      <CalculatorSection>
        <CalculatorKpiRow cols={3}>
          <CalculatorKpiCard
            label="Premium in Reach"
            value={fmtM(lobBreakdown.cfReachable)}
            tone="purple"
            trend={`${(lobBreakdown.cfReachable / ap * 100).toFixed(0)}% of book`}
          />
          <CalculatorKpiCard
            label="Commercial Premium"
            value={fmtM(lobBreakdown.commTotal)}
            tone="teal"
            trend={`${inputs.commPct}% of book`}
          />
          <CalculatorKpiCard
            label="Personal Lines"
            value={fmtM(lobBreakdown.persTotal)}
            tone="slate"
            trend="Pain quantified only"
          />
        </CalculatorKpiRow>
      </CalculatorSection>

      {/* Full Book - segmented premium mix */}
      <CalculatorSection>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className={`${calcEyebrow} text-[#6B5BB5]`}>
              Premium Mix
            </p>
            <h3 className={`mt-0.5 ${calcHeading}`}>
              Your Full Book
            </h3>
            <p className={`mt-1.5 ${calcPara}`}>
              Segmented by line of business - sized to your premium mix.
            </p>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className={calcMetricLabel}>
              Total Premium
            </p>
            <p className={`mt-0.5 ${calcMetricValueSm}`}>
              {fmtM(ap)}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2 sm:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EFE8FF] px-2 py-1 font-mono text-[0.6875rem] font-semibold text-[#4C2FC9]">
                <span className="size-1.5 rounded-full bg-[#5B35E0]" aria-hidden />
                Commercial {inputs.commPct}%
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F4F4F5] px-2 py-1 font-mono text-[0.6875rem] font-semibold text-[#3F3F46]">
                <span className="size-1.5 rounded-full bg-[#A1A1AA]" aria-hidden />
                Personal {100 - inputs.commPct}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {lobBreakdown.commLOBs.map((l, i) => {
            const w = (l.premium / ap) * 100;
            if (w < 0.5) return null;
            const col = l.on
              ? LOB_COLORS_COMM_SOLID[i % LOB_COLORS_COMM_SOLID.length]
              : "#D4D4D8";
            return (
              <div
                key={l.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: col }}
                    aria-hidden
                  />
                  <span className={`truncate ${calcRowLabel}`}>{l.label}</span>
                  {!l.on ? (
                    <span className="rounded bg-[#F3F3F6] px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-normal text-[#8A8A8A]">
                      Off
                    </span>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-baseline gap-2">
                  <span className={calcRowValue}>
                    {fmtM(l.premium)}
                  </span>
                  <span className="w-10 text-right font-mono text-[10px] tabular-nums text-[#8A8A8A]">
                    {w.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
          {lobBreakdown.persLOBs.map((l, i) => {
            const w = (l.premium / ap) * 100;
            if (w < 0.5) return null;
            return (
              <div
                key={l.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full border border-[#D4D4D8]"
                    style={{
                      background: LOB_COLORS_PERS_SOLID[i % LOB_COLORS_PERS_SOLID.length],
                    }}
                    aria-hidden
                  />
                  <span className={`truncate ${calcRowLabel}`}>{l.label}</span>
                  <span className="rounded bg-[#F4F4F5] px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-normal text-[#8A8A8A]">
                    Personal
                  </span>
                </div>
                <div className="flex shrink-0 items-baseline gap-2">
                  <span className={calcRowValue}>
                    {fmtM(l.premium)}
                  </span>
                  <span className="w-10 text-right font-mono text-[10px] tabular-nums text-[#8A8A8A]">
                    {w.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CalculatorSection>

      {/* Spilt Layout */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {/* Commercial Lines */}
        <CalculatorSection>
          <div className="mb-6 font-sans">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className={calcEyebrow}>
                Admitted vs E&amp;S
              </div>
              <span className="rounded-full bg-[#EFE8FF] px-2 py-0.5 text-[9px] font-medium text-[#4C2FC9]">
                Commercial {inputs.commPct}%
              </span>
            </div>
            <div className="mb-2 flex h-2.5 overflow-hidden rounded-full bg-[#F0F0F4]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5B35E0] to-[#7B5CFF]"
                style={{ width: `${inputs.admittedPct}%` }}
                title={`Admitted ${inputs.admittedPct}%`}
              />
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#2DD4BF]"
                style={{ width: `${100 - inputs.admittedPct}%` }}
                title={`E&S ${100 - inputs.admittedPct}%`}
              />
            </div>
            <div className="flex gap-4 font-sans text-xs">
              <span className="font-medium text-[#5B35E0]">{fmtM(lobBreakdown.admTotal)} Admitted</span>
              <span className="font-medium text-[#0D9488]">{fmtM(lobBreakdown.ensTotal)} E&amp;S</span>
            </div>
          </div>

          <hr className="my-4 border-[#535353]/10" />

          <div className="flex flex-col gap-4 font-sans">
            {lobBreakdown.commLOBs.map((l, i) => {
              const barW = (l.premium / commMax * 100).toFixed(1);
              const col = l.on
                ? LOB_COLORS_COMM_SOLID[i % LOB_COLORS_COMM_SOLID.length]
                : "#E5E7EB";
              return (
                <div key={l.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 ${calcRowLabel}`}>
                      {l.on 
                        ? <span className="rounded bg-[#EFE8FF] px-1.5 py-0.5 font-mono text-[8px] font-medium tracking-wider text-[#4C2FC9]">CF ✓</span> 
                        : <span className="font-mono text-[8px] font-medium tracking-wider text-[#8A8A8A]">OFF</span>
                      }
                      {l.label}
                    </div>
                    <div className={calcRowValue}>{fmtM(l.premium)}</div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#F0F0F4]">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barW}%`, background: col }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CalculatorSection>

        {/* Personal Lines */}
        <CalculatorSection>
          <div className={`mb-6 ${calcPara}`}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <strong className="text-[#444444]">Pain quantification only.</strong>
              <span className="shrink-0 rounded-full bg-[#F4F4F5] px-2 py-0.5 text-[9px] font-medium text-[#3F3F46]">
                Personal {100 - inputs.commPct}%
              </span>
            </div>
            CoverForce does not currently serve personal lines - but showing this premium helps executives see the full scope of the digital transformation gap.
          </div>

          <div className="flex flex-col gap-4 font-sans">
            {lobBreakdown.persLOBs.map((l, i) => {
              const barW = (l.premium / persMax * 100).toFixed(1);
              return (
                <div key={l.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 ${calcRowLabel}`}>
                      <span className="rounded bg-[#FFEDD5] px-1.5 py-0.5 font-mono text-[8px] font-medium tracking-normal text-[#C2410C]">Pain Only</span>
                      {l.label}
                    </div>
                    <div className={calcRowValue}>{fmtM(l.premium)}</div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#F0F0F4]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barW}%`,
                        background: LOB_COLORS_PERS_SOLID[i % LOB_COLORS_PERS_SOLID.length],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CalculatorSection>
      </div>

      {/* Pain Callouts */}
      <CalculatorSection className="flex flex-col gap-5 font-sans">
        {lobBreakdown.persTotal > 0 && (
          <div className={calcPara}>
            <div className={`mb-1 flex items-center gap-1.5 ${calcSubheading}`}><Lightbulb className="size-4 text-[#6B6B6B]" /> {fmtM(lobBreakdown.persTotal)} in Personal Lines - the size of the gap</div>
            <div className={calcSubpara}>
              {inputs.companyName} is managing <strong className="text-[#444444]">{fmtM(lobBreakdown.persTotal)}</strong> ({100 - inputs.commPct}% of book) in personal lines without a CoverForce equivalent. While CoverForce can't help here today, this premium represents the scale of the digital workflow problem you're solving in commercial - and it signals how much operational leverage is still on the table.
            </div>
          </div>
        )}
        {commOffPremium > 0 && (
          <div className={calcPara}>
            <div className={`mb-1 flex items-center gap-1.5 ${calcSubheading}`}><AlertCircle className="size-4 text-[#444444]" /> {fmtM(commOffPremium)} in commercial lines not yet in scope</div>
            <div className={calcSubpara}>
              You've toggled off some commercial LOBs - that's <strong className="text-[#444444]">{fmtM(commOffPremium)}</strong> in commercial premium still handled manually. Turning these on expands the CoverForce opportunity to the full <strong className="text-[#444444]">{fmtM(lobBreakdown.commTotal)}</strong> commercial book.
            </div>
          </div>
        )}
        {lobBreakdown.cfReachable > 0 && (
          <div className={calcPara}>
            <div className={`mb-1 flex items-center gap-1.5 ${calcSubheading}`}>
              <CheckCircle2 className="size-4 text-[#6B6B6B]" /> {fmtM(lobBreakdown.cfReachable)} in premium CoverForce can transform today
            </div>
            <div className={calcSubpara}>
              At a {inputs.commissionRate}% commission rate, <strong className="text-[#444444]">{fmtM(lobBreakdown.cfReachable)}</strong> in addressable premium represents <strong className="text-[#444444]">{fmtM(lobBreakdown.cfReachable * inputs.commissionRate / 100)}</strong> in annual commission - the base that compounds with every new policy written.
            </div>
          </div>
        )}
      </CalculatorSection>

      {/* ROI Tie-In */}
      <CalculatorSection>
        <h3 className={calcHeading}>What This Means for Your ROI</h3>
        <p className={`mb-5 mt-1.5 ${calcPara}`}>The revenue model adjusts to only count premium in CoverForce&apos;s reach (commercial lines you&apos;ve selected). Here&apos;s what that unlocks:</p>
        
        <div className="grid grid-cols-1 gap-0 font-sans md:grid-cols-3 md:divide-x md:divide-[#E8E8EC]">
          <div className="py-4 md:px-6 md:py-1 first:md:pl-0">
            <p className={calcMetricLabel}>
              {inputs.projYears}-Year Net ROI
            </p>
            <div className={`mt-3 ${calcMetricValueSm}`}>
              {fmtM(totalROI)}
            </div>
            <div className={`mt-1 ${calcSubpara}`}>Based on {fmtM(lobBreakdown.cfReachable)} in reach</div>
          </div>
          <div className="py-4 md:px-6 md:py-1">
            <p className={calcMetricLabel}>
              Annual Commission at Stake
            </p>
            <div className={`mt-3 ${calcMetricValueSm}`}>
              {fmtM(lobBreakdown.cfReachable * inputs.commissionRate / 100)}
            </div>
            <div className={`mt-1 ${calcSubpara}`}>{inputs.commPct}% of book × {inputs.commissionRate}% rate</div>
          </div>
          <div className="py-4 md:px-6 md:py-1 last:md:pr-0">
            <p className={calcMetricLabel}>
              Personal Lines Pain Quantified
            </p>
            <div className={`mt-3 ${calcMetricValueSm}`}>
              {fmtM(lobBreakdown.persTotal)}
            </div>
            <div className={`mt-1 ${calcSubpara}`}>Full digital gap for executives</div>
          </div>
        </div>
      </CalculatorSection>

    </div>
  );
}
