import React from 'react'
import Container from '../common/Container'
import { RiCheckboxCircleFill, RiDownloadLine, RiMailLine, RiSparkling2Fill } from '@remixicon/react';

type FeatureItem = {
    id: string;
    icon: React.ReactNode;
    text: React.ReactNode;
    highlighted?: boolean;
};

const features: FeatureItem[] = [
    {
      id: "accept",
      icon: <RiMailLine className="size-3" />,
      text: "Accept submissions from email, ACORD PDFs, loss runs, prior policies, manual entry, or AMS sync.",
    },
    {
      id: "ai",
      icon: <RiSparkling2Fill className="size-3" />,
      highlighted: true,
      text: (
        <>
          AI reads ACORDs, prior policies, and loss runs with 95%+ accuracy.{" "}
          <span className="inline-flex rounded-full bg-[#0130BE] px-4 py-0.2 text-[10px] uppercase tracking-wide text-white">
            AI
          </span>
        </>
      ),
    },
    {
      id: "customer",
      icon: <RiMailLine className="size-3" />,
      text: "Customer details are saved and reused for future submissions.",
    },
  ];
  

function AcordMock() {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute -right-4 -top-4 z-10 rounded-xl border border-neutral-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:-right-8 md:-top-6">
                <div className="flex items-end gap-1">
                    {[20, 35, 28, 50, 42, 65].map((h, i) => (
                        <div
                            key={i}
                            className="w-2 rounded-sm bg-[#0130BE]/70"
                            style={{ height: `${h}px` }}
                        />
                    ))}
                </div>
                <p className="mt-2 text-lg font-semibold text-[#0130BE]">+326%</p>
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
                        <button type="button" className="text-xs font-medium text-[#0130BE]">
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
                    <RiCheckboxCircleFill className="size-5 text-[#0130BE]" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0130BE]">
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

const ProcessFlow = () => {
    return (
        <section className="bg-white">
            <Container borderColor="#5353531A">
                <div className="grid min-h-screen items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
                    <div>
                        <p className="text-base font-mono font-medium uppercase tracking-[0.14em] text-[#0130BE]">
                            Intake 01
                        </p>
                        <h3 className="mt-4 text-2xl font-heading font-regular tracking-tight text-[#0a143b] md:text-3xl lg:text-4xl">
                            From{" "}
                            <span className="bg-linear-to-r from-[#4F63E8] to-[#0130BE] bg-clip-text text-transparent">
                                email to forms to <br /> documents
                            </span>{" "}
                            every <br /> submission starts here.
                        </h3>
                        <p className="max-w-lg mt-5 text-sm leading-relaxed text-[#4A5778] font-sans font-regular md:text-base">
                            CoverForce accepts submissions however agents already work email, ACORD PDFs, manual entry, or direct AMS sync.
                        </p>

                        <ul className="mt-10 space-y-3">
                            {features.map((feature) => (
                                <li
                                    key={feature.id}
                                    className={`flex gap-4 py-4 `}
                                >
                                    <span
                                        className={`flex size-6 border border-[#424242] shrink-0 items-center justify-center rounded-full ${feature.highlighted
                                            ? "bg-[#0130BE] text-white"
                                            : ""
                                            }`}
                                    >
                                        {feature.icon}
                                    </span>
                                    <p className={`text-sm leading-relaxed ${feature.highlighted ? "text-[#0130BE]" : "text-[#424242]"} font-heading font-regular md:text-base`}>
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
            </Container>
        </section>
    )
}

export default ProcessFlow