'use client';

import React from 'react';
import CompanyBar from '@/components/calculator/CompanyBar';
import Sidebar from '@/components/calculator/Sidebar';
import Tabs from '@/components/calculator/Tabs';
import { useCalculator } from '@/hooks/useCalculator';

export default function CalculationPage() {
  const {
    inputs,
    updateInput,
    applySegment,
    toggleCommercialLob,
    setCommercialLobPct,
    setPersonalLobPct,
    results
  } = useCalculator();

  return (
    <>
      <CompanyBar
        inputs={inputs}
        updateInput={updateInput}
        applySegment={applySegment}
        results={results}
      />

      <div id="calculator-main-view" className="max-w-[1440px] w-full mx-auto px-5 md:px-10 flex flex-col md:flex-row print:flex-col gap-8 print:gap-4 print:py-4">
        <Sidebar
          inputs={inputs}
          updateInput={updateInput}
          toggleCommercialLob={toggleCommercialLob}
          setCommercialLobPct={setCommercialLobPct}
          setPersonalLobPct={setPersonalLobPct}
        />
        <Tabs results={results} />
      </div>
    </>
  );
}
