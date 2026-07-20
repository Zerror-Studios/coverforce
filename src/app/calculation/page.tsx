"use client";

import Sidebar from "@/components/calculator/Sidebar";
import Tabs from "@/components/calculator/Tabs";
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
      <section className="min-h-screen bg-[#F7F7F8] pt-24 text-[#444444] md:pt-28">
        <div
          id="calculator-main-view"
          className="flex w-full flex-col gap-5 px-4 py-5 print:flex-col print:gap-4 print:px-4 print:py-4 sm:px-6 md:flex-row md:items-start md:gap-6 md:px-8 md:py-6 lg:gap-8 lg:px-10"
        >
          <Sidebar
            inputs={inputs}
            updateInput={updateInput}
            applySegment={applySegment}
            toggleCommercialLob={toggleCommercialLob}
            setCommercialLobPct={setCommercialLobPct}
            setPersonalLobPct={setPersonalLobPct}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <Tabs results={results} />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
