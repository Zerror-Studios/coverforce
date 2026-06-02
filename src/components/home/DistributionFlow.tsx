import React from "react";
import Container from "../common/Container";


function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#0a143b]/50">
      <span className="inline-block size-2 shrink-0 bg-[#797979] rounded-full" aria-hidden />
      {children}
    </p>
  );
}

const DistributionFlow = () => {
  return (
    <section className="bg-white">
      <Container borderColor="#5353531A">
        <div className="relative z-10 pt-16 md:pt-20 lg:pt-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>The AI distribution flow</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-heading font-medium leading-tight tracking-tight text-[#424242] md:text-4xl lg:text-3xl">
              Built to streamline <br /> commercial insurance workflows
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#091843BF] font-sans font-regular md:text-sm">
              Upload emails and documents to instantly extract <br /> insurance-ready
              data with AI.
            </p>
          </div>
        </div>
      </Container>

    </section>
  );
};

export default DistributionFlow;
