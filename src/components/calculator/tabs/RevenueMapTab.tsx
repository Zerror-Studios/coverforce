import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle2, Target, Building2, User } from 'lucide-react';
import { CalculationResult, LOB_COMMERCIAL, LOB_PERSONAL } from '@/lib/calculations';
import { fmtM, pct } from '@/lib/formatters';

const LOB_COLORS_COMM = ['#0A143B','#1D2C59','#293B73','#3A4B95','#3834a4','#6E82F4','#8B9DF6','#A7B9F9'];
const LOB_COLORS_PERS = ['#50617a','#687A93','#8296B0','#9DB1CA'];

export default function RevenueMapTab({ results }: { results: CalculationResult }) {
  const { inputs, lobBreakdown, totalROI } = results;
  const ap = inputs.annualPremium;

  const commMax = Math.max(...lobBreakdown.commLOBs.map(l => l.premium), 1);
  const persMax = Math.max(...lobBreakdown.persLOBs.map(l => l.premium), 1);

  const commOffPremium = lobBreakdown.commLOBs.filter(l => !l.on).reduce((s,l) => s + l.premium, 0);

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPIs */}
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Premium in Reach</div>
            <div className="p-2 bg-[#f0f4ff] rounded-xl text-[#3834a4] group-hover:scale-110 transition-transform duration-300">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fmtM(lobBreakdown.cfReachable)}</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">{(lobBreakdown.cfReachable / ap * 100).toFixed(0)}% of total book</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Commercial Premium</div>
            <div className="p-2 bg-gray-50 rounded-xl text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fmtM(lobBreakdown.commTotal)}</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">{inputs.commPct}% of book</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a143b] to-[#3834a4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold text-[#50617a] uppercase tracking-wider font-heading">Personal Lines</div>
            <div className="p-2 bg-gray-50 rounded-xl text-[#0a143b] group-hover:scale-110 transition-transform duration-300">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-heading font-regular tracking-tight font-bold text-[#0a143b] mb-1">{fmtM(lobBreakdown.persTotal)}</div>
          <div className="text-xs text-[#50617a] font-sans mt-2">Pain Quantified Only</div>
        </div>
      </div>

      {/* Full Book Stacked Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0a143b] mb-1 font-heading">Your Full Book — Where Every Dollar Lives</h3>
        <p className="text-xs text-[#50617a] mb-4 font-sans">Each segment is sized to your inputs. Green = CoverForce can help today. Amber = Personal lines. Gray = Commercial not yet selected.</p>
        
        <div className="h-12 rounded-lg flex overflow-hidden shadow-inner mb-3 border border-gray-200">
          {lobBreakdown.commLOBs.map((l, i) => {
            const w = (l.premium / ap * 100).toFixed(2);
            const col = l.on ? LOB_COLORS_COMM[i % LOB_COLORS_COMM.length] : '#E5E7EB';
            return parseFloat(w) > 0.5 ? (
              <div key={l.id} className={`h-full flex items-center justify-center text-[10px] font-bold ${l.on ? 'text-white' : 'text-gray-500'} overflow-hidden transition-all duration-500`} style={{ width: `${w}%`, background: col }} title={`${l.label}: ${fmtM(l.premium)}`}>
                <span className="truncate px-2">{l.label}</span>
              </div>
            ) : null;
          })}
          {lobBreakdown.persLOBs.map((l, i) => {
            const w = (l.premium / ap * 100).toFixed(2);
            const col = LOB_COLORS_PERS[i % LOB_COLORS_PERS.length];
            return parseFloat(w) > 0.5 ? (
              <div key={l.id} className="h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden transition-all duration-500" style={{ width: `${w}%`, background: col }} title={`${l.label}: ${fmtM(l.premium)}`}>
                <span className="truncate px-2">{l.label}</span>
              </div>
            ) : null;
          })}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {lobBreakdown.commLOBs.map((l, i) => {
            const w = (l.premium / ap * 100).toFixed(2);
            const col = l.on ? LOB_COLORS_COMM[i % LOB_COLORS_COMM.length] : '#E5E7EB';
            return parseFloat(w) > 0.5 ? (
              <div key={l.id} className="flex items-center gap-1.5 text-[10px] text-[#50617a] font-sans">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: col }}></div>
                <span>{l.label} {fmtM(l.premium)}</span>
              </div>
            ) : null;
          })}
          {lobBreakdown.persLOBs.map((l, i) => {
            const w = (l.premium / ap * 100).toFixed(2);
            const col = LOB_COLORS_PERS[i % LOB_COLORS_PERS.length];
            return parseFloat(w) > 0.5 ? (
              <div key={l.id} className="flex items-center gap-1.5 text-[10px] text-[#50617a] font-sans">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: col }}></div>
                <span>{l.label} {fmtM(l.premium)}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Spilt Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Commercial Lines */}
        <div className="bg-[#f0f4ff] border border-[#3834a4]/30 ring-2 ring-[#3834a4]/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#3834a4]"></div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#50617a] flex-1 font-sans">Commercial Lines</h3>
            <span className="text-[9px] font-bold bg-[#3834a4] text-white px-2 py-0.5 rounded-full">{inputs.commPct}%</span>
          </div>

          <div className="mb-6 font-sans">
            <div className="text-[10px] font-semibold text-[#50617a] uppercase tracking-widest mb-2">Admitted vs E&amp;S</div>
            <div className="flex h-8 rounded-lg overflow-hidden mb-2 shadow-inner border border-gray-200">
              <div className="flex items-center justify-center text-[10px] font-bold text-white bg-[#3834a4]" style={{ width: `${inputs.admittedPct}%` }}>Admitted {inputs.admittedPct}%</div>
              <div className="flex items-center justify-center text-[10px] font-bold text-white bg-[#0a143b]" style={{ width: `${100 - inputs.admittedPct}%` }}>E&amp;S {100 - inputs.admittedPct}%</div>
            </div>
            <div className="flex gap-4 text-[11px]">
              <span className="font-bold text-[#3834a4]">{fmtM(lobBreakdown.admTotal)} Admitted</span>
              <span className="font-bold text-[#0a143b]">{fmtM(lobBreakdown.ensTotal)} E&amp;S</span>
            </div>
          </div>

          <hr className="border-gray-200 my-4" />
          <div className="text-[10px] font-semibold text-[#50617a] uppercase tracking-widest mb-3 font-sans">By Line of Business</div>

          <div className="flex flex-col gap-2 font-sans">
            {lobBreakdown.commLOBs.map((l, i) => {
              const barW = (l.premium / commMax * 100).toFixed(1);
              const col = l.on ? LOB_COLORS_COMM[i % LOB_COLORS_COMM.length] : '#E5E7EB';
              return (
                <div key={l.id}>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <div className="font-medium text-[#0a143b] flex items-center gap-1.5">
                      {l.on 
                        ? <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#e0e8ff] text-[#3834a4] tracking-wider">CF ✓</span> 
                        : <span className="text-[8px] font-bold text-gray-500 tracking-wider">OFF</span>
                      }
                      {l.label}
                    </div>
                    <div className="font-bold text-[#0a143b]">{fmtM(l.premium)}</div>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barW}%`, background: col }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Personal Lines */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#50617a]"></div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#50617a] flex-1 font-sans">Personal Lines</h3>
            <span className="text-[9px] font-bold bg-[#50617a] text-white px-2 py-0.5 rounded-full">{100 - inputs.commPct}%</span>
          </div>

          <div className="bg-gray-50 border-l-2 border-gray-400 p-3 rounded-r-lg text-[11px] leading-relaxed text-[#50617a] mb-6 font-sans">
            <strong className="text-[#0a143b]">Pain quantification only.</strong> CoverForce does not currently serve personal lines — but showing this premium helps executives see the full scope of the digital transformation gap.
          </div>

          <div className="text-[10px] font-semibold text-[#50617a] uppercase tracking-widest mb-3 font-sans">By Line of Business</div>
          
          <div className="flex flex-col gap-2 font-sans">
            {lobBreakdown.persLOBs.map((l, i) => {
              const barW = (l.premium / persMax * 100).toFixed(1);
              return (
                <div key={l.id}>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <div className="font-medium text-[#0a143b] flex items-center gap-1.5">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-[#50617a] tracking-wider uppercase">Pain Only</span>
                      {l.label}
                    </div>
                    <div className="font-bold text-[#0a143b]">{fmtM(l.premium)}</div>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barW}%`, background: LOB_COLORS_PERS[i % 4] }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pain Callouts */}
      <div className="flex flex-col gap-3 font-sans">
        {lobBreakdown.persTotal > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-[#50617a]">
            <div className="text-sm font-bold text-[#0a143b] mb-1 flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-[#50617a]" /> {fmtM(lobBreakdown.persTotal)} in Personal Lines — the size of the gap</div>
            <div className="text-xs leading-relaxed">
              {inputs.companyName} is managing <strong className="text-[#0a143b]">{fmtM(lobBreakdown.persTotal)}</strong> ({100 - inputs.commPct}% of book) in personal lines without a CoverForce equivalent. While CoverForce can't help here today, this premium represents the scale of the digital workflow problem you're solving in commercial — and it signals how much operational leverage is still on the table.
            </div>
          </div>
        )}
        {commOffPremium > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-[#50617a]">
            <div className="text-sm font-bold text-[#0a143b] mb-1 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-[#0a143b]" /> {fmtM(commOffPremium)} in commercial lines not yet in scope</div>
            <div className="text-xs leading-relaxed">
              You've toggled off some commercial LOBs — that's <strong className="text-[#0a143b]">{fmtM(commOffPremium)}</strong> in commercial premium still handled manually. Turning these on expands the CoverForce opportunity to the full <strong className="text-[#0a143b]">{fmtM(lobBreakdown.commTotal)}</strong> commercial book.
            </div>
          </div>
        )}
        {lobBreakdown.cfReachable > 0 && (
          <div className="bg-[#f0f4ff] border border-[#3834a4]/30 rounded-xl p-4 shadow-sm text-[#0a143b]">
            <div className="text-sm font-bold text-[#0a143b] mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#3834a4]" /> {fmtM(lobBreakdown.cfReachable)} in premium CoverForce can transform today</div>
            <div className="text-xs leading-relaxed">
              At a {inputs.commissionRate}% commission rate, <strong className="text-[#0a143b]">{fmtM(lobBreakdown.cfReachable)}</strong> in addressable premium represents <strong className="text-[#0a143b]">{fmtM(lobBreakdown.cfReachable * inputs.commissionRate / 100)}</strong> in annual commission — the base that compounds with every new policy written.
            </div>
          </div>
        )}
      </div>

      {/* ROI Tie-In */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0a143b] mb-1 font-heading">What This Means for Your ROI</h3>
        <p className="text-xs text-[#50617a] mb-5 font-sans">The revenue model adjusts to only count premium in CoverForce's reach (commercial lines you've selected). Here's what that unlocks:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-heading font-regular tracking-tight text-[#0a143b] mb-1">{fmtM(totalROI)}</div>
            <div className="text-[11px] font-bold text-[#0a143b] mb-0.5">{inputs.projYears}-Year Net ROI</div>
            <div className="text-[10px] text-[#50617a]">Based on {fmtM(lobBreakdown.cfReachable)} in reach</div>
          </div>
          <div className="bg-[#f0f4ff] border border-[#3834a4]/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-heading font-regular tracking-tight text-[#3834a4] mb-1">{fmtM(lobBreakdown.cfReachable * inputs.commissionRate / 100)}</div>
            <div className="text-[11px] font-bold text-[#0a143b] mb-0.5">Annual Commission at Stake</div>
            <div className="text-[10px] text-[#50617a]">{inputs.commPct}% of book × {inputs.commissionRate}% rate</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-heading font-regular tracking-tight text-[#0a143b] mb-1">{fmtM(lobBreakdown.persTotal)}</div>
            <div className="text-[11px] font-bold text-[#0a143b] mb-0.5">Personal Lines Pain Quantified</div>
            <div className="text-[10px] text-[#50617a]">Full digital gap for executives</div>
          </div>
        </div>
      </div>

    </div>
  );
}
