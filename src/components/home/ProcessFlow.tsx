import React from 'react'
import Container from '../common/Container'
import { RiMailLine, RiSparkling2Fill } from '@remixicon/react';

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
        <div className="relative w-full flex justify-center items-center aspect-square ">
            <div className="w-full h-full">
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

                    <div className="flex justify-center items-center">
                        <AcordMock />
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default ProcessFlow