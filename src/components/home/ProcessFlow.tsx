"use client";

import Container from "../common/Container";
import EyebrowPill from "../common/EyebrowPill";
import { processSteps } from "@/data/processSteps";
import { RiArrowRightLine } from "@remixicon/react";
import Image from "next/image";

function ProcessPoint({ text }: { text: string }) {
    return (
        <li className="flex gap-4 border-b border-black/10 py-4 last:border-b-0">
            <span className="point-icon flex size-6 shrink-0 items-center justify-center rounded-full border border-[#151F4D] bg-[#151F4D] text-white">
                <RiArrowRightLine className="size-3" />
            </span>
            <p className="max-w-sm text-sm leading-relaxed font-heading font-regular text-[#0a143b] md:text-sm">
                {text}
            </p>
        </li>
    );
}

function MobileProcessFlow() {
    return (
        <div className="flex flex-col gap-16 py-12 lg:hidden">
            {processSteps.map((step, index) => (
                <div key={index} className="flex flex-col">
                    <div className="w-fit">
                        <EyebrowPill surface="light">{step.tag}</EyebrowPill>
                    </div>
                    <h3 className="mt-3 max-w-lg pr-2 text-balance text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.15]">
                        {step.heading}
                    </h3>

                    <ul className="mt-5 space-y-0">
                        {step.points.map((point) => (
                            <ProcessPoint key={point.id} text={point.text} />
                        ))}
                    </ul>

                    <div className="mt-8 flex w-full flex-col justify-end px-1">
                        <Image
                            src={`/images/process/step${index + 1}.svg`}
                            alt={step.heading}
                            width={520}
                            height={520}
                            className="h-auto w-full"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

const ProcessFlow = () => {
    return (
        <section data-processflow className="bg-white">
            <Container borderColor="#53535380">
                <MobileProcessFlow />

                <div className="hidden gap-12 pb-16 md:pb-20 lg:grid lg:grid-cols-2 lg:gap-16 lg:pb-24 xl:gap-20">
                    {/* Left: normal scroll steps */}
                    <div className="relative flex flex-col">
                        {processSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex flex-col justify-center ${index === 0 ? "" : "pt-16 lg:pt-20"} ${index === processSteps.length - 1 ? "" : "pb-16 lg:pb-20"}`}
                            >
                                <div className="w-fit">
                                    <EyebrowPill surface="light" className="mb-0" dotAttr={`step-${index}`}>
                                        {step.tag}
                                    </EyebrowPill>
                                </div>
                                <h3 className="mt-4 max-w-lg text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#0a143b] md:text-3xl lg:max-w-md lg:text-[1.75rem] lg:leading-[1.25]">
                                    {step.heading}
                                </h3>
                                <ul className="mt-8 space-y-0 md:mt-10">
                                    {step.points.map((feature) => (
                                        <ProcessPoint key={feature.id} text={feature.text} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Right: sticky video slot — centered below header */}
                    <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center justify-center self-start">
                        <div className="relative aspect-square w-full overflow-hidden">
                            <video
                                src="/videos/process-video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                className="absolute inset-0 h-full w-full border-0 object-cover object-center outline-none"
                                aria-label="Process flow demo"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ProcessFlow;
