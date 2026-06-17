import React from 'react';
import { CalculatorInputs, LOB_COMMERCIAL, LOB_PERSONAL } from '@/lib/calculations';
import { FolderGit2, BarChart3, Zap, Wrench, Blocks, CheckCircle2, PlusCircle } from 'lucide-react';

interface Props {
  inputs: CalculatorInputs;
  updateInput: (key: keyof CalculatorInputs, value: any) => void;
  toggleCommercialLob: (id: string) => void;
  setCommercialLobPct: (id: string, pct: number) => void;
  setPersonalLobPct: (id: string, pct: number) => void;
}

export default function Sidebar({ inputs, updateInput, toggleCommercialLob, setCommercialLobPct, setPersonalLobPct }: Props) {
  
  const InputRow = ({ label, prop, suffix, prefix, note, step = 1, type = "number" }: any) => (
    <div className="mb-3.5">
      <label className="block text-xs font-semibold text-[#50617a] mb-1.5 font-sans">{label}</label>
      <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#3834a4] focus-within:ring-1 focus-within:ring-[#3834a4] transition-all">
        {prefix && <span className="pl-3 pr-1 text-sm font-semibold text-gray-400">{prefix}</span>}
        <input 
          type={type}
          className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#0a143b] py-2.5 px-3"
          value={inputs[prop as keyof CalculatorInputs] as any}
          onChange={(e) => {
            const val = type === "number" ? parseFloat(e.target.value) : e.target.value;
            updateInput(prop, isNaN(val as any) && type === "number" ? 0 : val);
          }}
          step={step}
        />
        {suffix && <span className="pr-3 pl-1 text-sm font-semibold text-gray-400">{suffix}</span>}
      </div>
      {note && <div className="text-[10px] text-gray-400 mt-1 font-sans">{note}</div>}
    </div>
  );

  return (
    <aside className="w-full md:w-[340px] print:w-full flex-shrink-0 flex flex-col gap-5">
      
      {/* Business Mix Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0a143b] mb-4 flex items-center font-heading">
          <FolderGit2 className="w-4 h-4 text-[#3834a4] mr-2" /> Business Mix
        </h3>

        {/* Commercial vs Personal Slider */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-[#50617a] mb-2 font-sans">Commercial vs Personal Lines</div>
          <div className="flex justify-between text-[11px] font-bold mb-1 font-sans">
            <span className="text-[#0a143b]">Commercial {inputs.commPct}%</span>
            <span className="text-gray-500">Personal {100 - inputs.commPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2 shadow-inner">
            <div className="h-full bg-[#3834a4]" style={{ width: `${inputs.commPct}%` }}></div>
          </div>
          <input 
            type="range" min="0" max="100" 
            className="w-full accent-[#3834a4]"
            value={inputs.commPct}
            onChange={(e) => updateInput('commPct', parseInt(e.target.value))}
          />
        </div>

        {/* Admitted vs E&S Slider */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-[#50617a] mb-2 font-sans">Admitted vs E&amp;S (Commercial only)</div>
          <div className="flex justify-between text-[11px] font-bold mb-1 font-sans">
            <span className="text-[#0a143b]">Admitted {inputs.admittedPct}%</span>
            <span className="text-gray-500">E&amp;S {100 - inputs.admittedPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2 shadow-inner">
            <div className="h-full bg-[#3834a4]" style={{ width: `${inputs.admittedPct}%` }}></div>
          </div>
          <input 
            type="range" min="0" max="100" 
            className="w-full accent-[#3834a4]"
            value={inputs.admittedPct}
            onChange={(e) => updateInput('admittedPct', parseInt(e.target.value))}
          />
        </div>

        <hr className="border-gray-100 my-4" />

        {/* Commercial LOBs */}
        <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-widest mb-2 font-heading flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-[#3834a4] mr-1.5" /> Commercial Lines — CF can help</div>
        <div className="flex flex-col gap-1.5 mb-4 font-sans">
          {LOB_COMMERCIAL.map(lob => {
            const st = inputs.commercialLobs[lob.id] || { on: true, pct: lob.pct };
            return (
              <label key={lob.id} className={`flex items-center gap-2 p-1.5 rounded-md border ${st.on ? 'border-[#3834a4]/30 bg-[#f0f4ff]' : 'border-gray-200 bg-gray-50'} cursor-pointer select-none transition-colors`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${st.on ? 'border-[#3834a4] bg-[#3834a4] text-white' : 'border-gray-300 bg-white'}`}>
                  {st.on && <span className="text-[10px]">✓</span>}
                </div>
                <input type="checkbox" className="hidden" checked={st.on} onChange={() => toggleCommercialLob(lob.id)} />
                <span className={`text-xs font-semibold flex-1 ${st.on ? 'text-[#0a143b]' : 'text-gray-400'}`}>{lob.label}</span>
                <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                  <input 
                    type="number" min="0" max="100" 
                    className="w-8 text-right bg-transparent border-none outline-none text-xs font-bold text-[#0a143b] p-0"
                    value={st.pct}
                    onChange={(e) => setCommercialLobPct(lob.id, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[10px] font-bold text-gray-400">%</span>
                </div>
              </label>
            )
          })}
        </div>

        {/* Personal LOBs */}
        <div className="text-[10px] font-bold text-[#50617a] uppercase tracking-widest mb-2 mt-4 font-heading flex items-center"><BarChart3 className="w-3.5 h-3.5 text-gray-400 mr-1.5" /> Personal Lines — quantify pain only</div>
        <div className="flex flex-col gap-1.5 font-sans">
          {LOB_PERSONAL.map(lob => {
            const st = inputs.personalLobs[lob.id] || { on: true, pct: lob.pct };
            return (
              <label key={lob.id} className={`flex items-center gap-2 p-1.5 rounded-md border ${st.on ? 'border-[#50617a]/30 bg-gray-100' : 'border-gray-200 bg-gray-50'} cursor-pointer select-none transition-colors`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${st.on ? 'border-[#50617a] bg-[#50617a] text-white' : 'border-gray-300 bg-white'}`}>
                  {st.on && <span className="text-[10px]">✓</span>}
                </div>
                {/* Personal LOBs are mostly always on for pain quantification, but keeping toggle for parity */}
                <input type="checkbox" className="hidden" checked={st.on} onChange={() => {
                }} />
                <span className={`text-xs font-semibold flex-1 ${st.on ? 'text-[#0a143b]' : 'text-gray-400'}`}>{lob.label}</span>
                <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
                  <input 
                    type="number" min="0" max="100" 
                    className="w-8 text-right bg-transparent border-none outline-none text-xs font-bold text-[#0a143b] p-0"
                    value={st.pct}
                    onChange={(e) => setPersonalLobPct(lob.id, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[10px] font-bold text-gray-400">%</span>
                </div>
              </label>
            )
          })}
        </div>
        
        {/* Other LOB */}
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4 font-heading flex items-center"><PlusCircle className="w-3.5 h-3.5 text-gray-400 mr-1.5" /> Other Line of Business</div>
        <div className="flex items-center gap-2 font-sans">
          <input 
            type="text" placeholder="e.g. Marine Cargo..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-md text-xs p-2 outline-none focus:border-[#3834a4] text-[#0a143b] placeholder-gray-400"
            value={inputs.otherLobName}
            onChange={e => updateInput('otherLobName', e.target.value)}
          />
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus-within:border-[#3834a4]">
            <input 
              type="number" min="0" max="100" placeholder="0"
              className="w-6 text-right bg-transparent border-none outline-none text-xs font-bold text-[#0a143b] p-0"
              value={inputs.otherLobPct || ''}
              onChange={e => updateInput('otherLobPct', parseFloat(e.target.value) || 0)}
            />
            <span className="text-[10px] font-bold text-gray-400">%</span>
          </div>
        </div>
        <label className="flex items-center gap-1.5 mt-2 text-xs text-[#50617a] cursor-pointer font-sans">
          <input 
            type="checkbox" className="accent-[#3834a4]"
            checked={inputs.otherLobCF}
            onChange={e => updateInput('otherLobCF', e.target.checked)}
          />
          CF helps
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0a143b] mb-4 font-heading flex items-center"><BarChart3 className="w-4 h-4 text-[#3834a4] mr-2" /> Business Profile</h3>
        <InputRow label="Annual Premium Volume" prop="annualPremium" prefix="$" step="1000000" note="Total bound premium written today" />
        <InputRow label="Commission / Net Revenue Rate" prop="commissionRate" suffix="%" step="0.5" />
        <InputRow label="Annual New Business Growth Rate" prop="newBizRate" suffix="%" step="1" note="% of current book added as new business each year" />
        <InputRow label="Policy Renewal Retention Rate" prop="renewalRate" suffix="%" step="1" note="Industry avg 75–85%" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0a143b] mb-4 font-heading flex items-center"><Zap className="w-4 h-4 text-[#3834a4] mr-2" /> Quoting Operations</h3>
        <InputRow label="Monthly Quote Volume" prop="quoteVol" step="50" />
        <InputRow label="Current Bind Rate" prop="bindCurrent" suffix="%" step="1" />
        <InputRow label="Bind Rate With CoverForce" prop="bindCF" suffix="%" step="1" />
        <InputRow label="Minutes per Quote — Current" prop="minCurrent" suffix="min" step="5" />
        <InputRow label="Minutes per Quote — CoverForce" prop="minCF" suffix="min" step="1" />
        <InputRow label="Blended Staff Hourly Cost" prop="hourlyCost" prefix="$" step="5" />
        <InputRow label="Number of Producers / Underwriters" prop="staffCount" step="1" note="Used to calculate capacity unlock" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0a143b] mb-4 font-heading flex items-center"><Wrench className="w-4 h-4 text-[#3834a4] mr-2" /> Quality & Compliance</h3>
        <InputRow label="Manual Error Rate — Current" prop="errorCurrent" suffix="%" step="0.5" />
        <InputRow label="Manual Error Rate — CoverForce" prop="errorCF" suffix="%" step="0.5" />
        <InputRow label="Cost per Error / Rework Event" prop="costPerError" prefix="$" step="25" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0a143b] mb-4 font-heading flex items-center"><Blocks className="w-4 h-4 text-[#3834a4] mr-2" /> Technology Investment</h3>
        <InputRow label="CoverForce Implementation Fee" prop="implFee" prefix="$" step="1000" />
        <InputRow label="CoverForce Monthly Fee" prop="monthlyFee" prefix="$" step="500" />
        <hr className="border-gray-200 my-4" />
        <InputRow label="In-House Build Cost (Year 1)" prop="buildYear1" prefix="$" step="50000" />
        <InputRow label="In-House Annual Maintenance" prop="buildAnnual" prefix="$" step="10000" />
        <InputRow label="IT Staff Hourly Rate" prop="itRate" prefix="$" step="5" />
        <InputRow label="IT Hours/Month on Maintenance" prop="itHours" step="5" note="Ongoing hours to maintain in-house connections" />
        <hr className="border-gray-200 my-4" />
        <InputRow label="Carrier API Integrations (Current)" prop="carrierIntegrations" step="1" note="Each integration = dev + annual maintenance cost. Complexity scales with every carrier added." />
      </div>

    </aside>
  );
}
