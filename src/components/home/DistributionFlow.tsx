import React from "react";
import {
  RiMailLine,
  RiSparkling2Line,
  RiUser3Line,
  RiDownloadLine,
  RiCheckboxCircleFill,
} from "@remixicon/react";
import Container from "../common/Container";
type FeatureItem = {
  id: string;
  icon: React.ReactNode;
  text: React.ReactNode;
  highlighted?: boolean;
};

const features: FeatureItem[] = [
  {
    id: "accept",
    icon: <RiMailLine className="size-5" />,
    text: "Accept submissions from email, ACORD PDFs, loss runs, prior policies, manual entry, or AMS sync.",
  },
  {
    id: "ai",
    icon: <RiSparkling2Line className="size-5" />,
    highlighted: true,
    text: (
      <>
        AI reads ACORDs, prior policies, and loss runs with 95%+ accuracy.{" "}
        <span className="inline-flex rounded-full bg-[#5B35E0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          AI
        </span>
      </>
    ),
  },
  {
    id: "customer",
    icon: <RiUser3Line className="size-5" />,
    text: "Customer details are saved and reused for future submissions.",
  },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a143b]/50">
      <span className="inline-block size-2 shrink-0 bg-[#797979] rounded-full" aria-hidden />
      {children}
    </p>
  );
}

function AcordMock() {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -right-4 -top-4 z-10 rounded-xl border border-neutral-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:-right-8 md:-top-6">
        <div className="flex items-end gap-1">
          {[20, 35, 28, 50, 42, 65].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-sm bg-[#5B35E0]/70"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <p className="mt-2 text-lg font-semibold text-[#5B35E0]">+326%</p>
      </div>

      <div className="relative rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl md:p-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <span className="text-sm font-semibold text-[#0a143b]">ACORD 25</span>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500"
          >
            Download
            <RiDownloadLine className="size-4" />
          </button>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Insured
            </dt>
            <dd className="font-medium text-[#0a143b]">Construction LLC</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Policy number
            </dt>
            <dd className="font-medium text-[#0a143b]">GL-2024-98765</dd>
          </div>
        </dl>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Limits summary
            </p>
            <button type="button" className="text-xs font-medium text-[#5B35E0]">
              View all
            </button>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between text-[#0a143b]">
              <span>General liability</span>
              <span className="font-semibold">$1,000,000</span>
            </li>
            <li className="flex justify-between text-[#0a143b]">
              <span>Automobile liability</span>
              <span className="font-semibold">$500,000</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-neutral-100 pt-5">
          <RiCheckboxCircleFill className="size-5 text-[#5B35E0]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5B35E0]">
              Verified
            </p>
            <p className="text-[11px] text-neutral-500">
              This certificate is valid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const DistributionFlow = () => {
  return (
    <section className="bg-white">
      <Container borderColor="#5353531A">
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>The AI distribution flow</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#0a143b] md:text-4xl lg:text-5xl">
            Built to streamline commercial insurance workflows
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500 md:text-base">
            Upload emails and documents to instantly extract insurance-ready
            data with AI.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5B35E0]">
              Intake 01
            </p>
            <h3 className="mt-4 text-2xl font-semibold leading-snug text-[#0a143b] md:text-3xl lg:text-4xl">
              From{" "}
              <span className="bg-gradient-to-r from-[#4F63E8] to-[#5B35E0] bg-clip-text text-transparent">
                email to forms to documents
              </span>{" "}
              every submission starts here.
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">
              CoverForce accepts submissions however agents already work —
              email, ACORD PDFs, manual entry, or direct AMS sync.
            </p>

            <ul className="mt-10 space-y-3">
              {features.map((feature) => (
                <li
                  key={feature.id}
                  className={`flex gap-4 rounded-xl p-4 ${
                    feature.highlighted
                      ? "bg-[#EEF0FF] ring-1 ring-[#5B35E0]/15"
                      : "bg-transparent"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      feature.highlighted
                        ? "bg-[#5B35E0] text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {feature.icon}
                  </span>
                  <p className="text-sm leading-relaxed text-[#0a143b]/80 md:text-base">
                    {feature.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AcordMock />
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
};

export default DistributionFlow;
