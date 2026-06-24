"use client";

import CompanyBar from "@/components/calculator/CompanyBar";
import Sidebar from "@/components/calculator/Sidebar";
import Tabs from "@/components/calculator/Tabs";
import Container from "@/components/common/Container";
import PageWrapper from "@/components/PageWrapper";
import { useCalculator } from "@/hooks/useCalculator";

export default function CalculationPage() {
  const {
    inputs,
    updateInput,
    applySegment,
    toggleCommercialLob,
    setCommercialLobPct,
    setPersonalLobPct,
    results,
  } = useCalculator();

  return (
    <PageWrapper>
      <section className="bg-white text-[#0a143b]">
        <Container borderColor="#53535380" borderBottom>
          <CompanyBar
            inputs={inputs}
            updateInput={updateInput}
            applySegment={applySegment}
            results={results}
          />

          <div
            id="calculator-main-view"
            className="mx-auto flex w-full flex-col gap-8 py-8 print:flex-col print:gap-4 print:py-4 md:flex-row md:gap-10 lg:py-12"
          >
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
      </section>
    </PageWrapper>
  );
}
