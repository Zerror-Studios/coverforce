'use client';

import React from 'react';
import CompanyBar from '@/components/calculator/CompanyBar';
import Sidebar from '@/components/calculator/Sidebar';
import Tabs from '@/components/calculator/Tabs';
import { useCalculator } from '@/hooks/useCalculator';
import Container from '@/components/common/Container';
import PageWrapper from '@/components/PageWrapper'

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
    <PageWrapper>
    <Container borderColor="#53535380">
      <CompanyBar
        inputs={inputs}
        updateInput={updateInput}
        applySegment={applySegment}
        results={results}
      />

      <div id="calculator-main-view" className="w-full mx-auto flex flex-col md:flex-row print:flex-col gap-8 print:gap-4 py-5 print:py-4">
        <Sidebar
          inputs={inputs}
          updateInput={updateInput}
          toggleCommercialLob={toggleCommercialLob}
          setCommercialLobPct={setCommercialLobPct}
          setPersonalLobPct={setPersonalLobPct}
        />
        <Tabs results={results} />
      </div>
      </Container>
    </PageWrapper>
    </>
  );
}
