import React from "react";
import Container from "../common/Container";
import { processSteps } from "@/data/processSteps";
import Image from "next/image";
import { RiMailLine, RiSparkling2Fill } from "@remixicon/react";

function Step1Wireframe() {
    return (
        <div className="relative w-full h-full aspect-square flex justify-center items-center">
            <Image src="/images/process/step1wire.svg" alt="Graph preview" width={120} height={120} className="h-full w-full object-cover" />
            <Step1Final />
        </div>
    );
}

function Step1Final() {
    return (
        <div className="bg-white absolute top-0 left-0 w-full h-full aspect-square">
            <Image src="/images/process/step1final.svg" alt="Graph preview" width={120} height={120} className="h-full w-full object-cover" />
        </div>
    );
}

function Step2Wireframe() {
    return (
        <div className="relative w-full h-full aspect-square flex justify-center items-center">
            <Image src="/images/process/step2wire.svg" alt="Step 2 wireframe" width={120} height={120} className="h-full w-full object-cover" />
            <Step2Final />
        </div>
    );
}

function Step2Final() {
    return (
        <div className="bg-white absolute top-0 left-0 w-full h-full aspect-square">
            <Image src="/images/process/step2final.svg" alt="Step 2 final" width={120} height={120} className="h-full w-full object-cover" />
        </div>
    );
}

function Step3Wireframe() {
    return (
        <div className="relative w-full h-full aspect-square flex justify-center items-center">
            <Image src="/images/process/step3wire.svg" alt="Step 3 wireframe" width={120} height={120} className="h-full w-full object-cover" />
            <Step3Final />
        </div>
    );
}

function Step3Final() {
    return (
        <div className="bg-white absolute top-0 left-0 w-full h-full aspect-square">
            <Image src="/images/process/step3final.svg" alt="Step 3 final" width={120} height={120} className="h-full w-full object-cover" />
        </div>
    );
}

function Step4Wireframe() {
    return (
        <div className="relative w-full h-full aspect-square flex justify-center items-center">
            <Image src="/images/process/step4wire.svg" alt="Step 4 wireframe" width={120} height={120} className="h-full w-full object-cover" />
            <Step4Final />
        </div>
    );
}

function Step4Final() {
    return (
        <div className="bg-white absolute top-0 left-0 w-full h-full aspect-square">
            <Image src="/images/process/step4final.svg" alt="Step 4 final" width={120} height={120} className="h-full w-full object-cover" />
        </div>
    );
}

function Step5Wireframe() {
    return (
        <div className="relative w-full h-full aspect-square flex justify-center items-center">
            <Image src="/images/process/step5wire.svg" alt="Step 5 wireframe" width={120} height={120} className="h-full w-full object-cover" />
            <Step5Final />
        </div>
    );
}

function Step5Final() {
    return (
        <div className="bg-white absolute top-0 left-0 w-full h-full aspect-square">
            <Image src="/images/process/step5final.svg" alt="Step 5 final" width={120} height={120} className="h-full w-full object-cover" />
        </div>
    );
}

// A single wrapper that will host step wireframe/final UIs.
function ProcessWrapper() {
    return (
        <div className="relative aspect-square w-full flex justify-center items-center overflow-hidden">
            <Step1Wireframe />
        </div>
    );
}

const ProcessFlow = () => {
    const intake = processSteps[0];
    return (
        <section className="bg-white">
            <Container borderColor="#5353531A">
                <div className="grid min-h-screen items-center gap-12 py-16 md:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24 xl:gap-20">
                    <div>
                        <p className="text-base font-mono font-medium uppercase tracking-[0.14em] text-[#0130BE]">
                            {intake.tag}
                        </p>
                        <h3 className="mt-4 text-2xl font-heading font-regular tracking-tight text-[#0a143b] md:text-3xl lg:text-4xl">
                            {intake.heading.pre}{" "}
                            <span className="bg-linear-to-r from-[#4F63E8] to-[#0130BE] bg-clip-text text-transparent">
                                {intake.heading.highlightLines[0]} <br />
                                {intake.heading.highlightLines[1]}
                            </span>{" "}
                            {intake.heading.postLines[0]} <br />{" "}
                            {intake.heading.postLines[1]}
                        </h3>
                        <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#4A5778] font-sans font-regular md:text-base">
                            {intake.desc}
                        </p>

                        <ul className="mt-10 space-y-3">
                            {intake.points.map((feature) => {
                                const icon =
                                    feature.icon === "sparkle" ? (
                                        <RiSparkling2Fill className="size-3" />
                                    ) : (
                                        <RiMailLine className="size-3" />
                                    );

                                return (
                                    <li key={feature.id} className="flex gap-4 py-4">
                                        <span
                                            className={`flex size-6 shrink-0 items-center justify-center rounded-full border border-[#424242] ${feature.highlighted ? "bg-[#0130BE] text-white" : ""
                                                }`}
                                        >
                                            {icon}
                                        </span>
                                        <p
                                            className={`text-sm leading-relaxed font-heading font-regular md:text-base ${feature.highlighted ? "text-[#0130BE]" : "text-[#424242]"
                                                }`}
                                        >
                                            {feature.text}{" "}
                                            {feature.highlighted && (
                                                <span className="inline-flex rounded-full bg-[#0130BE] px-4 py-0.2 text-[10px] uppercase tracking-wide text-white">
                                                    AI
                                                </span>
                                            )}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <ProcessWrapper />
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default ProcessFlow