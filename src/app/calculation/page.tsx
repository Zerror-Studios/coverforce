'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
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
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <div className="print:hidden">
        <Header />
      </div>
      
      <main className="flex-1 flex flex-col">
        <CompanyBar 
          inputs={inputs} 
          updateInput={updateInput} 
          applySegment={applySegment} 
          results={results}
        />
        
        <div id="calculator-main-view" className="max-w-[1440px] w-full mx-auto p-5 md:p-10 flex flex-col md:flex-row gap-8">
          <Sidebar 
            inputs={inputs}
            updateInput={updateInput}
            toggleCommercialLob={toggleCommercialLob}
            setCommercialLobPct={setCommercialLobPct}
            setPersonalLobPct={setPersonalLobPct}
          />
          <Tabs results={results} />
        </div>
      </main>
    </div>
  );
}
