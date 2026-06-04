"use client";
import { useRef } from "react";
import Container from "../common/Container";
import { processSteps } from "@/data/processSteps";
import {
    RiArrowDownSLine,
    RiCalendarLine,
    RiCheckLine,
    RiFileTextFill,
    RiLineChartLine,
    RiMailLine,
    RiSparkling2Fill,
} from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const POINT_ACTIVE = "#0130BE";
const POINT_IDLE = "#424242";
const FIELD_VALID = "#34A854";
const FIELD_IDLE_BORDER = "#D1D5DB";
const FIELD_IDLE_TOGGLE_BG = "#E5E7EB";

function ProcessStep1() {
    return (
        <div className="process-step1 opacity-0 relative flex w-full h-full items-center justify-center">
            <div className="relative grid w-xs bg shrink-0 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
                <div className="final1 w-full rounded-2xl border border-[#CCCCCC] bg-white" aria-hidden>
                    <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
                        <span className="flex size-[23px] shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-[#F9FAFB]">
                            <RiFileTextFill color="#6F6F6F" size={11} />
                        </span>
                        <span className="font-heading text-xs font-medium leading-tight text-[#3C3B3B]">ACORD 25</span>
                    </div>

                    <div className="px-3">
                        <div className="grid grid-cols-3 gap-x-2 border-b border-dashed border-[#CCCCCC] py-2">
                            <div className="mt-0.5 flex items-start gap-1">
                                <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
                                    <RiLineChartLine className="size-2 text-[#6B7280]" />
                                </span>
                                <div>
                                    <p className="font-sans text-[0.40rem] font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">Insured</p>
                                    <p className="font-heading text-[0.50rem] font-medium tracking-wide text-[#111827]">Construction LLC</p>
                                </div>
                            </div>
                            <div className="mt-0.5 flex items-start gap-1">
                                <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
                                    <RiLineChartLine className="size-2 text-[#6B7280]" />
                                </span>
                                <div>
                                    <p className="font-sans text-[0.40rem] font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">Policy Number</p>
                                    <p className="font-heading text-[0.50rem] font-medium tracking-wide text-[#111827]">GL-2024-98765</p>
                                </div>
                            </div>
                            <div className="mt-0.5 flex items-start gap-1">
                                <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
                                    <RiLineChartLine className="size-2 text-[#6B7280]" />
                                </span>
                                <div>
                                    <p className="font-sans text-[0.40rem] font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">Coverage</p>
                                    <p className="font-heading text-[0.50rem] font-medium tracking-wide text-[#111827]">5 coverages</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-2 border-b border-dashed border-[#CCCCCC] py-2">
                            <div className="mt-0.5 flex items-start gap-1">
                                <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
                                    <RiLineChartLine className="size-2 text-[#6B7280]" />
                                </span>
                                <div>
                                    <p className="font-sans text-[0.40rem] font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">Insured</p>
                                    <p className="font-heading text-[0.50rem] font-medium tracking-wide text-[#111827]">Construction LLC</p>
                                </div>
                            </div>
                            <div className="mt-0.5 flex items-start gap-1">
                                <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
                                    <RiLineChartLine className="size-2 text-[#6B7280]" />
                                </span>
                                <div>
                                    <p className="font-sans text-[0.40rem] font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">Policy Number</p>
                                    <p className="font-heading text-[0.50rem] font-medium tracking-wide text-[#111827]">GL-2024-98765</p>
                                </div>
                            </div>
                            <div className="mt-0.5 flex items-start gap-1">
                                <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
                                    <RiLineChartLine className="size-2 text-[#6B7280]" />
                                </span>
                                <div>
                                    <p className="font-sans text-[0.40rem] font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">Coverage</p>
                                    <p className="font-heading text-[0.50rem] font-medium tracking-wide text-[#111827]">5 coverages</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
                        <p className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">Limits Summary</p>
                        <span className="font-sans text-[9px] text-[#4683E5]">View All</span>
                    </div>

                    <div className="divide-y divide-neutral-100 px-4">
                        <div className="flex items-center justify-between py-2">
                            <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">General Liability</span>
                            <span className="font-heading text-xs font-medium leading-tight text-[#3C3B3B]">$1,000,000</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">Automobile Liability</span>
                            <span className="font-heading text-xs font-medium leading-tight text-[#3C3B3B]">$500,000</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">Umbrella Liability</span>
                            <span className="font-heading text-xs font-medium leading-tight text-[#3C3B3B]">$5,000,000</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#CCCCCC] px-4 py-3">
                        <div className="flex items-center gap-1.5">
                            <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                    <path d="M1 3l2 2 4-4" stroke="#4683E5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <div>
                                <p className="font-sans text-[0.55rem] uppercase leading-tight tracking-wide text-[#4683E5]">Verified</p>
                                <p className="truncate font-heading text-[0.60rem] font-normal leading-tight text-[#9CA3AF]">
                                    This certificate is valid.
                                </p>
                            </div>
                        </div>
                        <span className="truncate font-heading text-[0.60rem] font-normal leading-tight text-[#9CA3AF]">
                            ACORD 25 Standard
                        </span>
                    </div>
                </div>

                <div className="placeholder1 absolute inset-0 z-0 flex w-full flex-col rounded-2xl border border-[#CED2D2] bg-white p-[3px]">
                    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[0.70rem] border border-[#CED2D2]">
                        <div className="h-[18%] shrink-0 border-b border-[#CED2D2]" aria-hidden />
                        <div className="flex-1" aria-hidden />
                        <div className="flex h-[34%] shrink-0 flex-col">
                            <div className="flex-1 border-b border-dashed border-[#CED2D2]" aria-hidden />
                            <div className="flex-1 border-b border-dashed border-[#CED2D2]" aria-hidden />
                            <div className="flex-1 border-b border-dashed border-[#CED2D2]" aria-hidden />
                            <div className="flex-1" aria-hidden />
                        </div>
                    </div>
                </div>

                <div className="placeholder11 absolute overflow-hidden left-full bottom-[105%] rounded-2xl border border-[#CED2D2] p-[3px] z-10 w-[12rem] aspect-video">
                    <div className="w-full h-full rounded-xl border border-[#CED2D2]"></div>
                    <div className="final11 absolute opacity-0 inset-0 z-10 py-3 p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="font-mono tracking-wider font-medium text-[0.45rem] text-[#5A5A5A] uppercase">
                                    Revenue
                                </span>
                            </div>
                            <p className="font-mono text-xs font-medium leading-tight text-[#5A5A5A]">
                                +326%
                            </p>
                        </div>
                        <Image
                            src="/images/process/graph.svg"
                            alt="step1"
                            width={100}
                            height={100}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                <div className="step1-scanner absolute top-full opacity-0 left-1/2 h-20 w-[25rem] -translate-x-1/2 border-t border-[#1365D0] bg-gradient-to-b from-[#1365D0]/10 to-transparent" />
            </div>
        </div>
    );
}

function ProcessStep2() {
    return (
        <div className="process-step2 relative flex h-full w-full items-center justify-center opacity-0">
            <div className="ai-buttom relative w-44 bg-[#CED2D2] overflow-hidden rounded-full p-px opacity-0">
                <div
                    className="ai-buttom-gradient absolute inset-0 rounded-full opacity-0"
                    style={{
                        backgroundImage: "linear-gradient(90deg, #0032C9, #EA4336, #FCBC05, #34A854, #0032C9)",
                        backgroundSize: "200% 100%",
                        backgroundPosition: "0% 50%",
                    }}
                />
                <div className="ai-buttom-content relative z-1 flex h-full w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4">
                    <RiSparkling2Fill className="ai-buttom-icon size-4 shrink-0 text-[#CED2D2]" />
                    <span className="ai-buttom-text inline-block w-0 overflow-hidden whitespace-nowrap font-sans text-xs font-semibold leading-tight tracking-wide text-[#0032C9]">
                        <span className="ai-buttom-text-span opacity-0">AI AutoFill</span>
                    </span>
                </div>
            </div>
            <div className="process-step2-cursor absolute bottom-[40%] right-[35%] z-10 flex h-12 w-12 items-center justify-center opacity-0">
                <Image src="/images/process/cursor.svg" alt="" width={100} height={100} className="h-full w-full object-cover" />
            </div>
            <div className="placeholder2wrapper opacity-0 w-full h-full absolute inset-0 z-11 flex items-center justify-center">
                <div className="relative grid w-xs bg shrink-0 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
                    <div className="w-full rounded-2xl border border-[#CCCCCC] bg-white" aria-hidden>
                        <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
                            <span className="font-heading text-xs font-medium leading-tight text-[#269138]">CARRIER APPLICATION (PRE-FILLED)</span>
                        </div>

                        <div className="px-3">
                            <div className="py-6">
                                <div className="mt-0.5 flex items-start gap-1">
                                    <div>
                                        <p className="font-sans text-[0.40rem] font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">Business Details</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 px-4 py-2.5">
                            <p className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">
                                Is your Business non-profit?
                                <span className="text-[#EF4444]">*</span>
                            </p>
                            <div className="flex shrink-0 items-center gap-1.5">
                                <div className="flex overflow-hidden rounded-full border border-[#D1D5DB] text-[0.55rem] font-semibold leading-none">
                                    <span className="border-r border-[#D1D5DB] bg-white px-2.5 py-1 text-[#6B7280]">Yes</span>
                                    <span className="step2-toggle-no bg-[#E5E7EB] px-2.5 py-1 text-[#111827]">No</span>
                                </div>
                                <span className="step2-check-nonprofit flex size-2.5 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white">
                                    <RiCheckLine className="step2-check-icon-nonprofit size-1.5 text-[#111827]" />
                                </span>
                            </div>
                        </div>

                        <div className="divide-y divide-neutral-100 px-4">
                            <div className="flex items-center justify-between gap-2 py-3">
                                <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">
                                    FEIN <span className="text-[#EF4444]">*</span>
                                </span>
                                <div className="flex shrink-0 items-center gap-1">
                                    <span className="step2-input-fein inline-flex w-[8.25rem] max-w-[8.25rem] shrink-0 items-center justify-start rounded-md border border-[#D1D5DB] bg-white px-2 py-1 text-left font-heading text-[0.55rem] font-medium leading-tight text-[#111827]">
                                        13-1324567
                                    </span>
                                    <span className="step2-check-fein flex size-2.5 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white">
                                        <RiCheckLine className="step2-check-icon-fein size-1.5 text-[#111827]" />
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 py-3">
                                <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">
                                    Business Entity Type <span className="text-[#EF4444]">*</span>
                                </span>
                                <div className="flex shrink-0 items-center gap-1">
                                    <span className="step2-input-entity inline-flex w-[8.25rem] max-w-[8.25rem] shrink-0 items-center justify-start rounded-md border border-[#D1D5DB] bg-white px-2 py-1 text-left font-heading text-[0.55rem] font-medium leading-tight text-[#111827]">
                                        <span className="min-w-0 flex-1 truncate">General Partnership</span>
                                        <RiArrowDownSLine className="ml-auto size-3 shrink-0 text-[#6B7280]" />
                                    </span>
                                    <span className="step2-check-entity flex size-2.5 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white">
                                        <RiCheckLine className="step2-check-icon-entity size-1.5 text-[#111827]" />
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 py-3">
                                <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">
                                    Start Year <span className="text-[#EF4444]">*</span>
                                </span>
                                <div className="flex shrink-0 items-center gap-1">
                                    <span className="step2-input-year inline-flex w-[8.25rem] max-w-[8.25rem] shrink-0 items-center justify-start rounded-md border border-[#D1D5DB] bg-white px-2 py-1 text-left font-heading text-[0.55rem] font-medium leading-tight text-[#111827]">
                                        <span className="flex-1">2023</span>
                                        <RiCalendarLine className="ml-auto size-3 shrink-0 text-[#6B7280]" />
                                    </span>
                                    <span className="step2-check-year flex size-2.5 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white">
                                        <RiCheckLine className="step2-check-icon-year size-1.5 text-[#111827]" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end border-t border-[#CCCCCC] px-4 py-3">
                            <div className="ai-buttom-small relative w-28 overflow-hidden rounded-full p-px ">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        backgroundImage: "linear-gradient(90deg, #0032C9, #EA4336, #FCBC05, #34A854, #0032C9)",
                                        backgroundSize: "200% 100%",
                                        backgroundPosition: "0% 50%",
                                    }}
                                />
                                <div className="relative z-1 flex h-full w-full items-center justify-center gap-2 rounded-full bg-white px-2 py-2">
                                    <RiSparkling2Fill className="size-3 shrink-0 text-[#0032C9]" />
                                    <span className="inline-block  whitespace-nowrap font-sans text-[0.55rem] font-semibold leading-tight tracking-wide text-[#0032C9]">
                                        <span>AI AutoFill</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="placeholder21 absolute inset-0 z-10 flex w-full flex-col rounded-2xl border border-[#CED2D2] bg-white p-[3px]">
                        <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[0.70rem] border border-[#CED2D2]">
                            <div className="h-[18%] shrink-0 border-b border-[#CED2D2]" aria-hidden />
                            <div className="flex-1" aria-hidden />
                            <div className="flex h-[34%] shrink-0 flex-col">
                                <div className="flex-1 border-b border-dashed border-[#CED2D2]" aria-hidden />
                                <div className="flex-1 border-b border-dashed border-[#CED2D2]" aria-hidden />
                                <div className="flex-1 border-b border-dashed border-[#CED2D2]" aria-hidden />
                                <div className="flex-1" aria-hidden />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

const ProcessFlow = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;

            const stepCount = processSteps.length;
            const scrollDistance = `+=${stepCount * 175}vh`;

            const EASE = "power2.inOut";
            const EASE_OUT = "power2.out";
            const D_POINT = 2.5;
            const D_PANEL = 2.5;
            const D_SCROLL = 12;
            const D_VALIDATE = 0.65;
            const VALIDATE_STAGGER = 0.8;

            gsap.set(".pocessContainer", { yPercent: 0 });
            gsap.set(".process-step2", { opacity: 0 });
            gsap.set(".ai-buttom", { opacity: 0, scale: 1, transformOrigin: "50% 50%" });
            gsap.set(".ai-buttom-gradient", { opacity: 0 });
            gsap.set(".ai-buttom-text-span", { opacity: 0 });
            gsap.set(".process-step2-cursor", {
                opacity: 0,
                x: 28,
                y: 22,
                scale: 1,
                transformOrigin: "50% 50%",
            });
            gsap.set(".placeholder2wrapper", { opacity: 0 });
            gsap.set(".placeholder21", { opacity: 1 });
            gsap.set(".step2-toggle-no", { backgroundColor: FIELD_IDLE_TOGGLE_BG, color: "#111827" });
            gsap.set(".step2-check-nonprofit, .step2-check-fein, .step2-check-entity, .step2-check-year", {
                backgroundColor: "#ffffff",
                borderColor: FIELD_IDLE_BORDER,
            });
            gsap.set(
                ".step2-check-icon-nonprofit, .step2-check-icon-fein, .step2-check-icon-entity, .step2-check-icon-year",
                { color: "#111827" },
            );
            gsap.set(".step2-input-fein, .step2-input-entity, .step2-input-year", {
                borderColor: FIELD_IDLE_BORDER,
            });

            const gradientEl = section.querySelector<HTMLElement>(".ai-buttom-gradient");
            if (gradientEl) {
                gsap.to(gradientEl, {
                    backgroundPosition: "200% 50%",
                    duration: 4,
                    ease: "none",
                    repeat: -1,
                });
            }

            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: scrollDistance,
                pin: true,
                pinSpacing: true,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: scrollDistance,
                    scrub: 2.8,
                },
            });

            const pointSpanActive = {
                backgroundColor: POINT_ACTIVE,
                color: "#ffffff",
                borderColor: POINT_ACTIVE,
            };
            const pointSpanIdle = {
                backgroundColor: "transparent",
                color: POINT_IDLE,
                borderColor: POINT_IDLE,
            };

            const highlightPoint = (step: number, point: number, time: number) => {
                const base = `.step${step} .point${point}`;
                tl.to(`${base} p`, { color: POINT_ACTIVE, duration: D_POINT, ease: EASE }, time).to(
                    `${base} span`,
                    { ...pointSpanActive, duration: D_POINT, ease: EASE },
                    time,
                );
            };
            const unhighlightPoint = (step: number, point: number, time: number) => {
                const base = `.step${step} .point${point}`;
                tl.to(`${base} p`, { color: POINT_IDLE, duration: D_POINT, ease: EASE }, time).to(
                    `${base} span`,
                    { ...pointSpanIdle, duration: D_POINT, ease: EASE },
                    time,
                );
            };

            // Step 1 — each point gets a dedicated scroll window
            const s1p1 = 0;
            const s1p1Off = 5.5;
            const s1p2 = 5.5;
            const s1p2Off = 11;
            const s1p3 = 11;
            const s1scanner = 12;
            const s1p3Off = 18.5;
            const s1outro = 18.5;
            const s2scrollStart = 20;

            // Step 2 — starts when step 1 scroll finishes; points sync to right-panel beats
            const s2stick = s2scrollStart + D_SCROLL;
            const s2p1Fill = s2stick + 4;
            const s2cursor = s2stick + 7.5;
            const s2click = s2stick + 10.5;
            const s2afterClick = s2click + 0.55;
            const s2p2 = s2afterClick + 2.5;
            const s2p3 = s2p2 + 5.5;
            const s2validate = s2p3 + D_PANEL;
            const s2hideWrap = s2validate + VALIDATE_STAGGER * 4 + 2.5;
            const s3scroll = s2hideWrap + 1.5;

            tl.to(".process-step1", { opacity: 1, duration: D_PANEL, ease: EASE }, s1p1);

            highlightPoint(1, 1, s1p1);
            unhighlightPoint(1, 1, s1p1Off);

            highlightPoint(1, 2, s1p2);
            tl.to(".placeholder1", { opacity: 0, duration: D_PANEL, ease: EASE }, s1p2).to(
                ".final11",
                { opacity: 1, duration: D_PANEL, ease: EASE },
                s1p2,
            );
            unhighlightPoint(1, 2, s1p2Off);

            highlightPoint(1, 3, s1p3);
            tl.to(".step1-scanner", { opacity: 1, duration: 1.5, ease: EASE }, s1scanner)
                .to(".step1-scanner", { top: "10%", duration: 1.5, ease: EASE }, s1scanner + 1.25)
                .to(".step1-scanner", { top: "100%", duration: 3.5, ease: "none" }, s1scanner + 3);
            unhighlightPoint(1, 3, s1p3Off);
            tl.to(".step1-scanner", { opacity: 0, duration: 1.5, ease: EASE }, s1p3Off).to(
                ".process-step1",
                { opacity: 0, duration: D_PANEL, ease: EASE },
                s1outro,
            );

            tl.to(".pocessContainer", { yPercent: -20, duration: D_SCROLL, ease: "none" }, s2scrollStart);

            tl.to(".process-step2", { opacity: 1, duration: D_PANEL, ease: EASE }, s2stick);
            highlightPoint(2, 1, s2stick);
            tl.to(".ai-buttom", { opacity: 1, duration: D_PANEL, ease: EASE }, s2stick + 0.75);

            tl.to(".ai-buttom-content", { backgroundColor: "#E1E9FF", duration: D_PANEL, ease: EASE }, s2p1Fill)
                .to(".ai-buttom-gradient", { opacity: 1, duration: D_PANEL, ease: EASE }, s2p1Fill)
                .to(".ai-buttom-text", { width: "4.85rem", duration: D_PANEL, ease: EASE }, s2p1Fill)
                .to(".ai-buttom-icon", { color: POINT_ACTIVE, duration: D_PANEL, ease: EASE }, s2p1Fill)
                .to(".ai-buttom-text-span", { opacity: 1, duration: D_PANEL, ease: EASE }, s2p1Fill);

            tl.to(
                ".process-step2-cursor",
                { opacity: 1, x: 0, y: 0, duration: D_PANEL, ease: EASE_OUT },
                s2cursor,
            );
            tl.to(".process-step2-cursor", { scale: 0.82, duration: 0.18, ease: "power2.in" }, s2click)
                .to(".ai-buttom", { scale: 0.9, duration: 0.18, ease: "power2.in" }, s2click)
                .to(".process-step2-cursor", { scale: 1, duration: 0.35, ease: EASE_OUT }, s2click + 0.18)
                .to(".ai-buttom", { scale: 1, duration: 0.4, ease: "back.out(2)" }, s2click + 0.22);

            tl.to(".ai-buttom", { opacity: 0, duration: 1.25, ease: EASE }, s2afterClick).to(
                ".process-step2-cursor",
                { opacity: 0, duration: 1.25, ease: EASE },
                s2afterClick,
            );

            unhighlightPoint(2, 1, s2p2);
            highlightPoint(2, 2, s2p2);
            tl.to(".placeholder2wrapper", { opacity: 1, duration: D_PANEL, ease: EASE }, s2p2 + 0.5);

            unhighlightPoint(2, 2, s2p3);
            highlightPoint(2, 3, s2p3);
            tl.to(".placeholder21", { opacity: 0, duration: D_PANEL, ease: EASE }, s2p3 + 0.5);

            const validateField = (time: number, selectors: string[], props: gsap.TweenVars) => {
                selectors.forEach((sel) => {
                    tl.to(sel, { ...props, duration: D_VALIDATE, ease: EASE }, time);
                });
            };

            validateField(s2validate, [".step2-toggle-no"], { backgroundColor: FIELD_VALID, color: "#ffffff" });
            validateField(s2validate + VALIDATE_STAGGER, [".step2-check-nonprofit"], {
                backgroundColor: FIELD_VALID,
                borderColor: FIELD_VALID,
            });
            validateField(s2validate + VALIDATE_STAGGER, [".step2-check-icon-nonprofit"], { color: "#ffffff" });
            validateField(s2validate + VALIDATE_STAGGER * 2, [".step2-input-fein"], { borderColor: FIELD_VALID });
            validateField(s2validate + VALIDATE_STAGGER * 2, [".step2-check-fein"], {
                backgroundColor: FIELD_VALID,
                borderColor: FIELD_VALID,
            });
            validateField(s2validate + VALIDATE_STAGGER * 2, [".step2-check-icon-fein"], { color: "#ffffff" });
            validateField(s2validate + VALIDATE_STAGGER * 3, [".step2-input-entity"], { borderColor: FIELD_VALID });
            validateField(s2validate + VALIDATE_STAGGER * 3, [".step2-check-entity"], {
                backgroundColor: FIELD_VALID,
                borderColor: FIELD_VALID,
            });
            validateField(s2validate + VALIDATE_STAGGER * 3, [".step2-check-icon-entity"], { color: "#ffffff" });
            validateField(s2validate + VALIDATE_STAGGER * 4, [".step2-input-year"], { borderColor: FIELD_VALID });
            validateField(s2validate + VALIDATE_STAGGER * 4, [".step2-check-year"], {
                backgroundColor: FIELD_VALID,
                borderColor: FIELD_VALID,
            });
            validateField(s2validate + VALIDATE_STAGGER * 4, [".step2-check-icon-year"], { color: "#ffffff" });

            tl.to(".placeholder2wrapper", { opacity: 0, duration: D_PANEL, ease: EASE }, s2hideWrap);
            tl.to(".pocessContainer", { yPercent: -40, duration: D_SCROLL, ease: "none" }, s3scroll);

            const lenis = window.lenis;
            const onLenisScroll = () => ScrollTrigger.update();
            lenis?.on("scroll", onLenisScroll);

            ScrollTrigger.refresh();

            return () => {
                lenis?.off("scroll", onLenisScroll);
            };
        },
        { scope: sectionRef, revertOnUpdate: true },
    );

    return (
        <section ref={sectionRef} className="h-screen overflow-hidden">
            <Container borderColor="#5353531A">
                <div className="h-screen overflow-hidden grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
                    <div className="pocessContainer flex flex-col will-change-transform">
                        {processSteps.map((intake, index) => (
                            <div
                                className={`step${index + 1} h-screen flex flex-col justify-center`}
                                key={index}
                            >
                                <p className="text-sm font-mono font-medium uppercase tracking-[0.14em] text-[#4F63E8]">
                                    {intake.tag}
                                </p>
                                <h3 className="mt-4 text-2xl font-heading font-regular tracking-tight text-[#0a143b] md:text-3xl lg:text-3xl">
                                    {intake.heading.pre}{" "}
                                    <span className="bg-linear-to-r from-[#4F63E8] to-[#0130BE] bg-clip-text text-transparent">
                                        {intake.heading.highlightLines[0]} <br />
                                        {intake.heading.highlightLines[1]}
                                    </span>{" "}
                                    {intake.heading.postLines[0]} <br /> {intake.heading.postLines[1]}
                                </h3>
                                <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#4A5778] font-sans font-regular md:text-sm">
                                    {intake.desc}
                                </p>

                                <ul className="mt-10 space-y-3">
                                    {intake.points.map((feature, idx) => {
                                        const icon =
                                            feature.icon === "sparkle" ? (
                                                <RiSparkling2Fill className="size-3" />
                                            ) : (
                                                <RiMailLine className="size-3" />
                                            );
                                        return (
                                            <li
                                                key={feature.id}
                                                className={`point${idx + 1} flex gap-4 py-4 ${idx === intake.points.length - 1
                                                    ? ""
                                                    : "border-b border-black/10"
                                                    }`}
                                            >
                                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#424242]">
                                                    {icon}
                                                </span>
                                                <p className="max-w-sm text-sm text-[#424242] leading-relaxed font-heading font-regular md:text-sm">
                                                    {feature.text}{" "}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="h-screen relative flex w-full items-center justify-center">
                        <div className="absolute z-1 top-0 left-0 flex h-screen w-full items-center justify-center lg:justify-end">
                            <div className="relative flex w-full aspect-square overflow-hidden justify-center items-center">
                                <ProcessStep1 />
                            </div>
                        </div>
                        <div className="absolute z-2 top-0 left-0 flex h-screen w-full items-center justify-center lg:justify-end">
                            <div className="relative flex w-full aspect-square overflow-hidden justify-center items-center">
                                <ProcessStep2 />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ProcessFlow;