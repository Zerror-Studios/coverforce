"use client";
import { useRef } from "react";
import Container from "../common/Container";
import { processSteps } from "@/data/processSteps";
import {
    RiArrowDownSLine,
    RiArrowRightLine,
    RiCalendarLine,
    RiCheckLine,
    RiFileTextFill,
    RiHashtag,
    RiLineChartLine,
    RiSparkling2Fill,
} from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ─── Design tokens ────────────────────────────────────────────────────────────
const POINT_ACTIVE = "#0130BE";
const POINT_IDLE = "#CCCCCC";
const FIELD_VALID = "#1c4439";

function ProcessPointText({ text }: { text: string }) {
    return (
        <p className="point-text max-w-sm text-sm leading-relaxed font-heading font-regular md:text-sm">
            {text.split("").map((char, i) => (
                <span key={`${char}-${i}`} className="point-char inline-block text-[#CCCCCC]">
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </p>
    );
}
const FIELD_IDLE_BORDER = "#D1D5DB";
const FIELD_IDLE_TOGGLE = "#1c4439";

// ─── Step panel components ────────────────────────────────────────────────────

function PanelStep1() {
    return (
        <div
            style={{
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            }}
            className="panel-step1 absolute inset-0 flex items-center justify-center  pointer-events-none">
            <div className="relative grid w-xs shrink-0 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
                <div

                    className="skeleton1 absolute inset-0 z-10 flex w-full flex-col rounded-2xl border border-[#CED2D2] bg-white p-[3px]"
                    style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    }}
                >
                    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[0.70rem] border border-[#CED2D2]">
                        <div className="h-[18%] shrink-0 border-b border-[#CED2D2]" />
                        <div className="flex-1" />
                        <div className="flex h-[34%] shrink-0 flex-col">
                            <div className="flex-1 border-b border-dashed border-[#CED2D2]" />
                            <div className="flex-1 border-b border-dashed border-[#CED2D2]" />
                            <div className="flex-1 border-b border-dashed border-[#CED2D2]" />
                            <div className="flex-1" />
                        </div>
                    </div>
                </div>

                <div className="card1 relative z-0 w-full overflow-hidden rounded-2xl border border-[#CCCCCC] bg-white opacity-0">
                    <div className="card1-content">
                    <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
                        <span className="flex size-[23px] shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-[#F9FAFB]">
                            <RiFileTextFill color="#6F6F6F" size={11} />
                        </span>
                        <span className="font-heading text-xs font-medium text-[#3C3B3B]">ACORD 25</span>
                    </div>
                    <div className="px-3">
                        {[0, 1].map(row => (
                            <div key={row} className="grid grid-cols-3 gap-x-2 border-b border-dashed border-[#CCCCCC] py-2">
                                {[
                                    { label: "Insured", value: "Construction LLC" },
                                    { label: "Policy Number", value: "GL-2024-98765" },
                                    { label: "Coverage", value: "5 coverages" },
                                ].map(item => (
                                    <div key={item.label} className="mt-0.5 flex items-start gap-1">
                                        <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
                                            <RiLineChartLine className="size-2 text-[#6B7280]" />
                                        </span>
                                        <div>
                                            <p className="font-sans text-[0.40rem] uppercase tracking-wider text-[#9CA3AF]">{item.label}</p>
                                            <p className="font-heading text-[0.50rem] font-medium tracking-wide text-[#111827]">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
                        <p className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">Limits Summary</p>
                        <span className="font-sans text-[9px] text-[#4683E5]">View All</span>
                    </div>
                    <div className="divide-y divide-neutral-100 px-4">
                        {[["General Liability", "$1,000,000"], ["Automobile Liability", "$500,000"], ["Umbrella Liability", "$5,000,000"]].map(([label, val]) => (
                            <div key={label} className="flex items-center justify-between py-2">
                                <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">{label}</span>
                                <span className="font-heading text-xs font-medium text-[#3C3B3B]">{val}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#CCCCCC] px-4 py-3">
                        <div className="flex items-center gap-1.5">
                            <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                    <path d="M1 3l2 2 4-4" stroke="#4683E5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <div>
                                <p className="font-sans text-[0.55rem] uppercase tracking-wide text-[#4683E5]">Verified</p>
                                <p className="truncate font-heading text-[0.60rem] font-normal text-[#9CA3AF]">This certificate is valid.</p>
                            </div>
                        </div>
                        <span className="font-heading text-[0.60rem] font-normal text-[#9CA3AF]">ACORD 25 Standard</span>
                    </div>
                    </div>
                    <div className="card1-morph-shell pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
                        <div className="card1-morph-inner flex h-full w-full items-center justify-center rounded-full bg-white">
                            <RiSparkling2Fill className="card1-morph-icon size-4 shrink-0 text-[#CED2D2]" />
                        </div>
                    </div>
                </div>

                {/* Mini graph card */}
                <div className="graph1 absolute opacity-0 left-full bottom-[105%] rounded-2xl border border-[#CED2D2] p-[3px] z-10 w-[12rem] aspect-video">
                    <div className="w-full h-full rounded-xl border border-[#CED2D2]" />
                    <div className="absolute inset-0 z-10 py-3 p-4 flex flex-col justify-between">
                        <div>
                            <span className="font-mono tracking-wider font-medium text-[0.45rem] text-[#5A5A5A] uppercase">Revenue</span>
                            <p className="font-mono text-xs font-medium text-[#5A5A5A]">+326%</p>
                        </div>
                        <Image src="/images/process/graph.svg" alt="graph" width={100} height={100} className="w-full h-auto object-cover" />
                    </div>
                </div>

                {/* Scanner beam */}
                <div className="scanner1 absolute top-full z-20 opacity-0 left-1/2 h-20 w-[25rem] -translate-x-1/2 border-t border-[#1365D0] bg-gradient-to-b from-[#1365D0]/10 to-transparent" />
            </div>
        </div>
    );
}

function PanelStep2() {
    return (
        <div className="panel-step2 absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
            <div className="ai-btn relative size-14 bg-[#CED2D2] overflow-hidden rounded-full p-[0.05rem] opacity-0">
                <div
                    className="ai-btn-gradient absolute inset-0 rounded-full opacity-0"
                    style={{ backgroundImage: "linear-gradient(90deg,#0032C9,#EA4336,#FCBC05,#34A854,#0032C9)", backgroundSize: "200% 100%", backgroundPosition: "0% 50%" }}
                />
                <div className="ai-btn-inner relative z-1 flex h-full w-full items-center justify-center rounded-full bg-white">
                    <RiSparkling2Fill className="ai-btn-icon size-4 shrink-0 text-[#CED2D2]" />
                    <span className="ai-btn-text inline-block w-0 overflow-hidden whitespace-nowrap font-sans text-xs font-semibold tracking-wide text-[#0032C9]">
                        <span className="ai-btn-label opacity-0">AI AutoFill</span>
                    </span>
                </div>
            </div>

            <div className="cursor2 absolute bottom-[40%] right-[35%] z-10 flex h-12 w-12 items-center justify-center opacity-0">
                <Image src="/images/process/cursor.svg" alt="" width={100} height={100} className="h-full w-full object-cover" />
            </div>

            <div className="form-wrap2 opacity-0 absolute inset-0 flex items-center justify-center">
                <div className="relative grid w-xs shrink-0 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
                    <div className="w-full rounded-2xl border border-[#CCCCCC] bg-white">
                        <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
                            <span className="font-heading text-xs font-medium text-[#1c4439]">CARRIER APPLICATION (PRE-FILLED)</span>
                        </div>
                        <div className="px-3 py-6">
                            <p className="font-sans text-[0.40rem] uppercase tracking-wider text-[#9CA3AF]">Business Details</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 px-4 py-2.5">
                            <p className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">Is your Business non-profit? <span className="text-[#EF4444]">*</span></p>
                            <div className="flex shrink-0 items-center gap-1.5">
                                <div className="flex overflow-hidden rounded-full border border-[#D1D5DB] text-[0.55rem] font-semibold">
                                    <span className="border-r border-[#D1D5DB] bg-white px-2.5 py-1 text-[#6B7280]">Yes</span>
                                    <span className="f2-toggle-no bg-[#E5E7EB] px-2.5 py-1 text-[#111827]">No</span>
                                </div>
                                <span className="f2-check-np flex size-2.5 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white">
                                    <RiCheckLine className="f2-icon-np size-1.5 text-[#111827]" />
                                </span>
                            </div>
                        </div>
                        <div className="divide-y divide-neutral-100 px-4">
                            {[
                                { label: "FEIN", icon: null, cls: "f2-inp-fein", chk: "f2-check-fein", ico: "f2-icon-fein", val: "13-1324567" },
                                { label: "Business Entity Type", icon: <RiArrowDownSLine className="ml-auto size-3 shrink-0 text-[#6B7280]" />, cls: "f2-inp-ent", chk: "f2-check-ent", ico: "f2-icon-ent", val: "General Partnership" },
                                { label: "Start Year", icon: <RiCalendarLine className="ml-auto size-3 shrink-0 text-[#6B7280]" />, cls: "f2-inp-yr", chk: "f2-check-yr", ico: "f2-icon-yr", val: "2023" },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between gap-2 py-3">
                                    <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">{row.label} <span className="text-[#EF4444]">*</span></span>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <span className={`${row.cls} inline-flex w-[8.25rem] shrink-0 items-center justify-start rounded-md border border-[#D1D5DB] bg-white px-2 py-1 text-left font-heading text-[0.55rem] font-medium text-[#111827]`}>
                                            <span className="min-w-0 flex-1 truncate">{row.val}</span>
                                            {row.icon}
                                        </span>
                                        <span className={`${row.chk} flex size-2.5 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white`}>
                                            <RiCheckLine className={`${row.ico} size-1.5 text-[#111827]`} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-end border-t border-[#CCCCCC] px-4 py-3">
                            <div className="relative w-28 overflow-hidden rounded-full p-px">
                                <div className="absolute inset-0 rounded-full" style={{ backgroundImage: "linear-gradient(90deg,#0032C9,#EA4336,#FCBC05,#34A854,#0032C9)", backgroundSize: "200% 100%" }} />
                                <div className="relative z-1 flex w-full items-center justify-center gap-2 rounded-full bg-white px-2 py-2">
                                    <RiSparkling2Fill className="size-3 shrink-0 text-[#0032C9]" />
                                    <span className="whitespace-nowrap font-sans text-[0.55rem] font-semibold tracking-wide text-[#0032C9]">AI AutoFill</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="skeleton2 absolute inset-0 z-10 flex w-full flex-col rounded-2xl border border-[#CED2D2] bg-white p-[3px]">
                        <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[0.70rem] border border-[#CED2D2]">
                            <div className="h-[18%] shrink-0 border-b border-[#CED2D2]" />
                            <div className="flex-1" />
                            <div className="flex h-[34%] shrink-0 flex-col">
                                <div className="flex-1 border-b border-dashed border-[#CED2D2]" />
                                <div className="flex-1 border-b border-dashed border-[#CED2D2]" />
                                <div className="flex-1 border-b border-dashed border-[#CED2D2]" />
                                <div className="flex-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CARRIER_LOGOS = [
    { src: "/images/process/logo1.svg", alt: "AmTrust", highlighted: true },
    { src: "/images/process/logo2.svg", alt: "AccidentFund", highlighted: true },
    { src: "/images/process/logo4.svg", alt: "Chubb" },
    { src: "/images/process/logo3.svg", alt: "CompWest" },
    { src: "/images/process/logo5.svg", alt: "Coalition", highlighted: true },
    { src: "/images/process/logo6.svg", alt: "Cowbell" },
    { src: "/images/process/logo7.svg", alt: "Liberty Mutual" },
    { src: "/images/process/logo8.svg", alt: "Merchants" },
    { src: "/images/process/logo9.svg", alt: "Markel" },
] as const;

function PanelStep3() {
    return (
        <div className="panel-step3 absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
            <div className="w-xs shrink-0 overflow-hidden rounded-2xl border border-[#CCCCCC] bg-white">
                <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
                    <span className="flex size-[23px] shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-[#F9FAFB]">
                        <RiHashtag color="#6F6F6F" size={11} />
                    </span>
                    <div>
                        <p className="font-heading text-xs font-medium text-[#3C3B3B]">Select NAICS Code</p>
                        <p className="font-heading text-[0.55rem] text-[#3C3B3B]">Choose the business industry code.</p>
                    </div>
                </div>
                <div className="px-3 pb-4">
                    <div className="mt-0.5 w-full flex items-start justify-between gap-1 py-4">
                        <div>
                            <p className="font-sans text-[0.50rem] uppercase tracking-wider text-[#9CA3AF]">NAICS Code</p>
                            <p className="font-heading text-[0.50rem] flex items-center justify-center rounded-full px-2 py-px mt-1 font-medium bg-[#D8EFFF] text-[#7299B4]">445110</p>
                        </div>
                        <RiArrowDownSLine className="size-5 shrink-0 text-[#6B7280]" />
                    </div>
                    <div className="w-full flex items-start justify-between gap-1">
                        <div>
                            <p className="font-sans text-[0.50rem] uppercase tracking-wider text-[#9CA3AF]">Description</p>
                            <p className="font-heading text-[0.70rem] font-medium leading-tight text-[#2E2E2E] uppercase">Supermarkets and Other Grocery Stores</p>
                        </div>
                    </div>
                </div>
                <div className="logos-grid3 grid grid-cols-3 gap-2 overflow-hidden px-3 pb-0" style={{ height: 0 }}>
                    {CARRIER_LOGOS.map((logo) => (
                        <div
                            key={logo.src}
                            className={`logo3 col-span-1 flex items-center justify-center rounded-sm border py-1 shadow-[0_1px_4px_rgba(0,0,0,0.06)] opacity-0 scale-90 ${"highlighted" in logo && logo.highlighted ? "border-[#B1B9FF]" : "border-[#F3F2F3]"}`}
                        >
                            <Image src={logo.src} alt={logo.alt} width={100} height={100} className="size-12 object-contain" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PanelStep4() {
    return (
        <div className="panel-step4 absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none p-7">
            <div className="relative overflow-hidden flex h-full w-full flex-col justify-between">
                <div
                    className="cursor4 pointer-events-none absolute z-50 flex h-11 w-11 items-center justify-center opacity-0"
                    style={{ right: "25%", top: "60%", transform: "translateY(0%)" }}
                >
                    <Image src="/images/process/cursor.svg" alt="" width={100} height={100} className="h-full w-full object-cover" />
                </div>

                <div className="row4-1 w-full h-[31%] overflow-hidden flex items-center justify-between">
                    {["-ml-2", "-mr-2"].map(cls => (
                        <div
                            key={cls}
                            className={`row4-1-card ${cls === "-ml-2" ? "row4-1-left" : "row4-1-right"} w-1/2 h-full border ${cls} border-[#CCCCCC] bg-white rounded-2xl p-[3px]`}
                        >
                            <div className="w-full h-full rounded-xl border border-[#CCCCCC]">
                                <div className="w-full h-12 border-b border-[#CCCCCC]" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row4-2 relative w-full h-[31%] flex items-center justify-center">
                    <div className="row4-2-track absolute left-[-28%] w-full h-full flex items-center justify-between">
                        <div className="row4-2-card row4-2-left w-1/2 shrink-0 h-full border border-[#CCCCCC] bg-white rounded-2xl p-[3px]">
                            <div className="w-full h-full rounded-xl border border-[#CCCCCC]">
                                <div className="w-full h-12 border-b border-[#CCCCCC]" />
                            </div>
                        </div>

                        <div className="card4-center relative w-1/2 h-full shrink-0 overflow-hidden border mx-4 border-[#CCCCCC] bg-white rounded-2xl">
                            <div className="card4-quote absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl">
                                <div className="w-full h-12 px-3 bg-[#EEF1F3]/25 flex items-center justify-between">
                                    <Image src="/images/process/logo1.svg" alt="AmTrust" width={100} height={100} className="size-10 object-contain" />
                                    <div className="flex items-center gap-2">
                                        <span className="font-heading text-[0.50rem] font-medium text-[#177F9B] flex items-center rounded-xs bg-[#D7F2F9] py-px px-2">A++</span>
                                        <span className="font-heading text-[0.50rem] font-medium text-[#177F9B] flex items-center rounded-xs bg-[#D7F2F9] py-px px-2">10/10</span>
                                    </div>
                                </div>
                                <div className="w-full flex items-end justify-between px-3 pb-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-heading text-xs uppercase font-medium text-[#9C9AA2]">Premium</span>
                                        <span className="font-mono text-sm tracking-wide text-[#6DAB4E]">$900.00</span>
                                    </div>
                                    <span className="font-heading text-[0.50rem] font-medium text-[#177F9B] flex items-center rounded-full bg-[#D7F2F9] py-1 px-4">Instantly Bindable</span>
                                </div>
                                <div className="w-full flex items-end justify-between px-3 pb-3">
                                    <span className="font-heading text-[0.55rem] font-medium tracking-wide text-[#3A48BE]">Gain 2% Enhanced Commissions</span>
                                    <div className="relative shrink-0">
                                        <div className="bind-btn flex items-center justify-center gap-1 rounded-full bg-[#0032C9] px-3 py-1 font-heading text-[0.60rem] font-medium text-white">
                                            Bind <RiArrowRightLine size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card4-success absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl opacity-0">
                                <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
                                    <Image src="/images/process/success.gif" alt="success" width={100} height={100} className="size-16 object-contain" />
                                    <p className="mt-4 font-sans text-xs font-medium text-[#3742A4]">Thank you!</p>
                                    <p className="mt-1 font-sans text-sm font-medium tracking-tight text-[#11243E]">Policy Bound Successfully!</p>
                                </div>
                                <div className="flex items-end justify-between bg-[#F5F7F9] px-5 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-heading text-[0.65rem] font-medium text-[#4A5568]">Builder&apos;s Risk</span>
                                        <Image src="/images/process/logo1.svg" alt="AmTrust Insurance" width={100} height={32} className="h-6 w-auto object-contain object-left" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-heading text-xs uppercase font-medium text-[#9C9AA2]">Premium</span>
                                        <span className="font-mono text-sm tracking-wide text-[#6DAB4E]">$900.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row4-2-card row4-2-right w-1/2 shrink-0 h-full border border-[#CCCCCC] bg-white rounded-2xl p-[3px]">
                            <div className="w-full h-full rounded-xl border border-[#CCCCCC]">
                                <div className="w-full h-12 border-b border-[#CCCCCC]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row4-3 w-full h-[31%] overflow-hidden flex items-center justify-between">
                    {["-ml-2", "-mr-2"].map(cls => (
                        <div
                            key={cls}
                            className={`row4-3-card ${cls === "-ml-2" ? "row4-3-left" : "row4-3-right"} w-1/2 h-full border ${cls} border-[#CCCCCC] bg-white rounded-2xl p-[3px]`}
                        >
                            <div className="w-full h-full rounded-xl border border-[#CCCCCC]">
                                <div className="w-full h-12 border-b border-[#CCCCCC]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PanelStep5() {
    return (
        <div className="panel-step5 absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
            <div className="w-xs shrink-0 overflow-hidden rounded-2xl border border-[#CCCCCC] bg-white">
                <div className="flex flex-col items-center px-6 pb-8 pt-10 text-center">
                    <Image src="/images/process/success.gif" alt="success" width={100} height={100} className="size-18 object-contain" />
                    <p className="mt-5 font-sans text-xs font-medium text-[#3742A4]">Thank you!</p>
                    <p className="mt-1 font-sans text-base font-medium tracking-tight text-[#11243E]">Policy Bound Successfully!</p>
                </div>
                <div className="flex items-end justify-between bg-[#F5F7F9] px-5 py-4">
                    <div className="flex flex-col">
                        <span className="font-heading text-[0.65rem] font-medium text-[#4A5568]">Builder's Risk</span>
                        <Image src="/images/process/logo1.svg" alt="AmTrust Insurance" width={100} height={32} className="h-7 w-auto object-contain object-left" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-heading text-xs uppercase font-medium text-[#9C9AA2]">Premium</span>
                        <span className="font-mono text-sm tracking-wide text-[#6DAB4E]">$900.00</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ProcessFlow = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;

            const EASE_ENTER = "power2.out";
            const EASE_EXIT = "power2.inOut";
            const EASE_REVEAL = "power3.out";
            const EASE_SOFT = "sine.inOut";

            const S = 1.75;
            const T = (n: number) => n * S;

            const FADE_DUR = T(6);
            const SCROLL_DUR = T(24);
            const SCAN_RISE = T(4);
            const SCAN_TRAVEL = T(12);
            const VALID_DUR = T(1.2);
            const VALID_STAG = T(2.0);

            const VH_PER_UNIT = 3.5;
            const POINT_GAP = T(2);

            gsap.set(".panel-step2, .panel-step3, .panel-step4, .panel-step5", { opacity: 0 });
            gsap.set(".skeleton1", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
            gsap.set(".graph1", { opacity: 0, y: 12, x: -4 });
            gsap.set(".scanner1", { opacity: 0, top: "100%" });
            gsap.set(".card1", { opacity: 0 });
            gsap.set(".card1-content", { opacity: 1, visibility: "visible" });
            gsap.set(".card1-morph-shell", { opacity: 0 });
            gsap.set(".card1-morph-inner", { backgroundColor: "#fff" });

            gsap.set(".ai-btn", { opacity: 0, scale: 1, width: "3.5rem", transformOrigin: "50% 50%" });
            gsap.set(".ai-btn-gradient", { opacity: 0 });
            gsap.set(".ai-btn-text", { width: 0 });
            gsap.set(".ai-btn-label", { opacity: 0 });
            gsap.set(".ai-btn-inner", { backgroundColor: "#fff", gap: 0, paddingLeft: 0, paddingRight: 0 });
            gsap.set(".cursor2", { opacity: 0, x: 48, y: 36 });
            gsap.set(".form-wrap2", { opacity: 0 });
            gsap.set(".skeleton2", { opacity: 1 });
            gsap.set(".f2-toggle-no", { backgroundColor: FIELD_IDLE_TOGGLE, color: "#111827" });
            gsap.set(".f2-check-np, .f2-check-fein, .f2-check-ent, .f2-check-yr",
                { backgroundColor: "#fff", borderColor: FIELD_IDLE_BORDER });
            gsap.set(".f2-icon-np, .f2-icon-fein, .f2-icon-ent, .f2-icon-yr",
                { color: "#111827" });
            gsap.set(".f2-inp-fein, .f2-inp-ent, .f2-inp-yr",
                { borderColor: FIELD_IDLE_BORDER });

            gsap.set(".logos-grid3", { height: 0, paddingBottom: 0 });
            gsap.set(".logo3", { opacity: 0, scale: 0.94, y: 10 });

            gsap.set(".cursor4", { opacity: 0, x: 40, y: -20 });
            gsap.set(".bind-btn", { scale: 1, transformOrigin: "50% 50%" });
            gsap.set(".row4-1, .row4-3", { opacity: 1, height: "31%" });
            gsap.set(".row4-1-card, .row4-3-card, .row4-2-card", { x: 0, y: 0, opacity: 1 });
            gsap.set(".row4-2-track", { x: 0 });
            gsap.set(".card4-center", { scale: 1, y: 0, transformOrigin: "50% 50%" });
            gsap.set(".card4-quote", { opacity: 1 });
            gsap.set(".card4-success", { opacity: 0 });

            const gradEl = section.querySelector<HTMLElement>(".ai-btn-gradient");
            if (gradEl) {
                gsap.to(gradEl, {
                    backgroundPosition: "200% 50%",
                    duration: 6,
                    ease: "none",
                    repeat: -1,
                    paused: true,
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        toggleActions: "play pause resume pause",
                    },
                });
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${Math.max(tl.duration(), T(100)) * VH_PER_UNIT}vh`,
                    pin: true,
                    pinSpacing: true,
                    scrub: true,
                    fastScrollEnd: true,
                    invalidateOnRefresh: true,
                },
            });

            const CHAR_STAG = T(0.48);
            const CHAR_DUR = T(0.34);

            const pointText = (step: number, pt: number) => processSteps[step - 1].points[pt - 1].text;
            const pointFillDur = (text: string) => {
                const n = text.length;
                if (n <= 1) return CHAR_DUR;
                return CHAR_DUR + (n - 1) * CHAR_STAG;
            };
            const afterPoint = (start: number, text: string, rightEnd: number) =>
                Math.max(start + pointFillDur(text), rightEnd) + POINT_GAP;

            const idleRgb = gsap.utils.splitColor(POINT_IDLE) as number[];
            const activeRgb = gsap.utils.splitColor(POINT_ACTIVE) as number[];
            const letterEase = gsap.parseEase("power2.out");

            const hi = (step: number, pt: number, t: number) => {
                const b = `.step${step} .point${pt}`;
                const chars = section.querySelectorAll<HTMLElement>(`${b} .point-char`);
                const icon = section.querySelector<HTMLElement>(`${b} .point-icon`);
                const totalDur = pointFillDur(pointText(step, pt));
                const setters = Array.from(chars, (el) => gsap.quickSetter(el, "color"));
                const prog = { v: 0 };

                tl.to(prog, {
                    v: 1,
                    duration: totalDur,
                    ease: "none",
                    onUpdate: () => {
                        const elapsed = prog.v * totalDur;
                        for (let i = 0; i < setters.length; i++) {
                            const letterT = gsap.utils.clamp(0, 1, (elapsed - i * CHAR_STAG) / CHAR_DUR);
                            const blend = letterEase(letterT);
                            if (blend <= 0) {
                                setters[i](POINT_IDLE);
                            } else if (blend >= 1) {
                                setters[i](POINT_ACTIVE);
                            } else {
                                setters[i](
                                    `rgb(${idleRgb[0] + (activeRgb[0] - idleRgb[0]) * blend},${idleRgb[1] + (activeRgb[1] - idleRgb[1]) * blend},${idleRgb[2] + (activeRgb[2] - idleRgb[2]) * blend})`,
                                );
                            }
                        }
                    },
                }, t);

                if (icon) {
                    tl.to(icon, {
                        backgroundColor: POINT_ACTIVE,
                        color: "#fff",
                        borderColor: POINT_ACTIVE,
                        duration: CHAR_DUR * 1.2,
                        ease: "power2.out",
                    }, t);
                }
            };
            // ═══════════════════════════════════════════════════════════════
            // STEP 1
            // ═══════════════════════════════════════════════════════════════
            const s1_enter = 0;

            gsap.set(".panel-step1", { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", });
            tl.to(".panel-step1", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: FADE_DUR * 1.2, ease: EASE_ENTER }, s1_enter);

            let s1_t = s1_enter + FADE_DUR * 1.2 + T(1);

            hi(1, 1, s1_t);
            s1_t = afterPoint(s1_t, pointText(1, 1), s1_t);

            hi(1, 2, s1_t);
            const s1_card = s1_t + T(1);
            const s1_graph = s1_t + T(4);
            tl.to(".skeleton1", { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", duration: FADE_DUR * 0.8, ease: EASE_EXIT }, s1_card)
                .to(".card1", { opacity: 1, duration: FADE_DUR * 0.8, ease: EASE_REVEAL }, s1_card)
                .to(".graph1", { opacity: 1, y: 0, x: 0, duration: FADE_DUR * 0.8, ease: EASE_REVEAL }, s1_graph);
            s1_t = afterPoint(s1_t, pointText(1, 2), s1_graph + FADE_DUR * 0.8);

            hi(1, 3, s1_t);
            const s1_scan = s1_t + T(1);
            tl.to(".scanner1", { opacity: 1, top: "10%", duration: SCAN_RISE, ease: EASE_ENTER }, s1_scan)
                .to(".scanner1", { top: "100%", duration: SCAN_TRAVEL, ease: "none" }, s1_scan + SCAN_RISE)
                .to(".scanner1", { opacity: 0, duration: T(2.5), ease: "power2.in" }, s1_scan + SCAN_RISE + SCAN_TRAVEL - T(1.5));
            s1_t = afterPoint(s1_t, pointText(1, 3), s1_scan + SCAN_RISE + SCAN_TRAVEL + T(1));

            const s1_outro = s1_t + T(2);
            const s1_contentFade = s1_outro + T(1);
            const s1_morph = s1_contentFade + T(5);
            const s1_swap = s1_morph + T(7);
            const s2_scroll = s1_swap + T(4);
            gsap.set(".panel-step2", { y: 0, opacity: 0 });

            // Step 1 → 2: after scan + last point, card1 morphs into AI button
            tl.to(".graph1", { opacity: 0, y: 8, duration: FADE_DUR * 0.5, ease: EASE_EXIT }, s1_outro)
                .to(".skeleton1", { opacity: 0, duration: FADE_DUR * 0.6, ease: EASE_EXIT }, s1_outro);

            tl.to(".card1-content", { opacity: 0, duration: FADE_DUR * 0.7, ease: EASE_EXIT }, s1_contentFade);

            tl.call(() => {
                const el = section.querySelector<HTMLElement>(".card1");
                if (!el) return;
                gsap.set(el, {
                    width: el.offsetWidth,
                    height: el.offsetHeight,
                    marginLeft: "auto",
                    marginRight: "auto",
                    transformOrigin: "50% 50%",
                    zIndex: 10,
                });
            }, [], s1_morph);

            tl.to(".card1", {
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                borderColor: "#CED2D2",
                padding: "1px",
                duration: FADE_DUR * 1.1,
                ease: EASE_SOFT,
            }, s1_morph)
                .to(".card1-morph-shell", { opacity: 1, duration: FADE_DUR * 0.5, ease: EASE_ENTER }, s1_morph + FADE_DUR * 0.45);

            tl.to(".panel-step1", { opacity: 0, duration: FADE_DUR * 0.5, ease: EASE_EXIT }, s1_swap)
                .to(".panel-step2", { opacity: 1, duration: FADE_DUR * 0.6, ease: EASE_ENTER }, s1_swap)
                .set(".card1", { opacity: 0 }, s1_swap + FADE_DUR * 0.35)
                .set(".ai-btn", { opacity: 1, scale: 1 }, s1_swap + FADE_DUR * 0.35);

            tl.to(".leftScroll", { yPercent: -20, duration: SCROLL_DUR, ease: "none" }, s2_scroll);

            // ═══════════════════════════════════════════════════════════════
            // STEP 2
            // ═══════════════════════════════════════════════════════════════
            const s2_stick = s2_scroll + SCROLL_DUR;

            let s2_t = s2_stick + T(2);

            hi(2, 1, s2_t);
            const s2_fill = s2_t + T(1);
            const s2_cursor = s2_fill + FADE_DUR * 1.1 + T(2);
            const s2_click = s2_cursor + FADE_DUR * 1.3 + T(2);
            const s2_afterCl = s2_click + T(2);
            tl.to(".ai-btn", { width: "11rem", duration: FADE_DUR * 1.1, ease: "power2.out" }, s2_fill)
                .to(".ai-btn-inner", { backgroundColor: "#E1E9FF", gap: "0.5rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "1rem", paddingBottom: "1rem", duration: FADE_DUR, ease: EASE_SOFT }, s2_fill)
                .to(".ai-btn-gradient", { opacity: 1, duration: FADE_DUR, ease: EASE_SOFT }, s2_fill)
                .to(".ai-btn-text", { width: "4.85rem", duration: FADE_DUR * 1.1, ease: "power2.out" }, s2_fill)
                .to(".ai-btn-icon", { color: POINT_ACTIVE, duration: FADE_DUR, ease: EASE_SOFT }, s2_fill)
                .to(".ai-btn-label", { opacity: 1, duration: FADE_DUR, ease: EASE_SOFT }, s2_fill + T(1.5));
            tl.to(".cursor2", { opacity: 1, x: 0, y: 0, duration: FADE_DUR * 1.3, ease: "power2.out" }, s2_cursor);
            tl.to(".cursor2", { scale: 0.85, duration: T(0.3), ease: "power2.in" }, s2_click)
                .to(".ai-btn", { scale: 0.93, duration: T(0.3), ease: "power2.in" }, s2_click)
                .to(".cursor2", { scale: 1, duration: T(0.7), ease: "back.out(2)" }, s2_click + T(0.3))
                .to(".ai-btn", { scale: 1, duration: T(0.7), ease: "back.out(2)" }, s2_click + T(0.35));
            tl.to(".cursor2", { opacity: 0, x: -12, duration: FADE_DUR * 0.8, ease: EASE_EXIT }, s2_afterCl)
                .to(".ai-btn", { opacity: 0, y: -8, duration: FADE_DUR * 0.8, ease: EASE_EXIT }, s2_afterCl);
            s2_t = afterPoint(s2_t, pointText(2, 1), s2_afterCl + FADE_DUR * 0.8);

            hi(2, 2, s2_t);
            const s2_form = s2_t + T(1);
            tl.to(".form-wrap2", { opacity: 1, duration: FADE_DUR, ease: EASE_ENTER }, s2_form)
                .to(".skeleton2", { opacity: 0, duration: FADE_DUR * 0.9, ease: EASE_EXIT }, s2_form + T(1.5));
            s2_t = afterPoint(s2_t, pointText(2, 2), s2_form + FADE_DUR + T(1.5));

            hi(2, 3, s2_t);
            const s2_valid = s2_t + T(2);

            const vld = (t: number, inputs: string[], checks: string[], icons: string[]) => {
                inputs.forEach(sel => tl.to(sel, { borderColor: FIELD_VALID, duration: VALID_DUR * 1.3, ease: EASE_SOFT }, t));
                checks.forEach(sel => tl.to(sel, { backgroundColor: FIELD_VALID, borderColor: FIELD_VALID, duration: VALID_DUR * 1.3, ease: EASE_SOFT }, t));
                icons.forEach(sel => tl.to(sel, { color: "#fff", duration: VALID_DUR, ease: EASE_SOFT }, t + T(0.4)));
            };
            tl.to(".f2-toggle-no", { backgroundColor: FIELD_VALID, color: "#fff", duration: VALID_DUR * 1.5, ease: EASE_SOFT }, s2_valid);
            vld(s2_valid + VALID_STAG, [], [".f2-check-np"], [".f2-icon-np"]);
            vld(s2_valid + VALID_STAG * 2, [".f2-inp-fein"], [".f2-check-fein"], [".f2-icon-fein"]);
            vld(s2_valid + VALID_STAG * 3, [".f2-inp-ent"], [".f2-check-ent"], [".f2-icon-ent"]);
            vld(s2_valid + VALID_STAG * 4, [".f2-inp-yr"], [".f2-check-yr"], [".f2-icon-yr"]);
            s2_t = afterPoint(s2_t, pointText(2, 3), s2_valid + VALID_STAG * 4 + VALID_DUR * 1.5 + T(2));

            const s2_outro = s2_t + T(2);
            const s3_scroll = s2_outro + T(5);

            tl.to(".panel-step2", { opacity: 0, y: -14, duration: FADE_DUR, ease: EASE_EXIT }, s2_outro);
            tl.to(".leftScroll", { yPercent: -40, duration: SCROLL_DUR, ease: "none" }, s3_scroll);

            // ═══════════════════════════════════════════════════════════════
            // STEP 3
            // ═══════════════════════════════════════════════════════════════
            const s3_stick = s3_scroll + SCROLL_DUR;

            gsap.set(".panel-step3", { y: 18, opacity: 0 });
            tl.to(".panel-step3", { opacity: 1, y: 0, duration: SCROLL_DUR * 0.65, ease: EASE_ENTER }, s3_scroll + SCROLL_DUR * 0.18);

            let s3_t = s3_stick + T(2);

            hi(3, 1, s3_t);
            s3_t = afterPoint(s3_t, pointText(3, 1), s3_t);

            hi(3, 2, s3_t);
            const s3_logos = s3_t + T(1);
            tl.to(".logos-grid3", {
                height: "12.5rem",
                paddingBottom: 20,
                duration: FADE_DUR * 2.8,
                ease: "power3.inOut",
            }, s3_logos);
            tl.to(".logo3", {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: FADE_DUR * 1.1,
                ease: EASE_REVEAL,
                stagger: { each: T(0.55), from: "start" },
            }, s3_logos + T(2.5));
            const s3_logosEnd = Math.max(
                s3_logos + FADE_DUR * 2.8,
                s3_logos + T(2.5) + FADE_DUR * 1.1 + T(0.55) * (CARRIER_LOGOS.length - 1),
            );
            s3_t = afterPoint(s3_t, pointText(3, 2), s3_logosEnd);

            hi(3, 3, s3_t);
            s3_t = afterPoint(s3_t, pointText(3, 3), s3_t);

            const s3_outro = s3_t + T(2);
            const s4_scroll = s3_outro + T(5);

            tl.to(".panel-step3", { opacity: 0, y: -14, duration: FADE_DUR, ease: EASE_EXIT }, s3_outro);
            tl.to(".leftScroll", { yPercent: -60, duration: SCROLL_DUR, ease: "none" }, s4_scroll);

            // ═══════════════════════════════════════════════════════════════
            // STEP 4
            // ═══════════════════════════════════════════════════════════════
            const s4_stick = s4_scroll + SCROLL_DUR;

            gsap.set(".panel-step4", { y: 18, opacity: 0 });
            tl.to(".panel-step4", { opacity: 1, y: 0, duration: SCROLL_DUR * 0.65, ease: EASE_ENTER }, s4_scroll + SCROLL_DUR * 0.18);

            tl.set(".row4-1, .row4-3", { height: "31%", opacity: 1 }, s4_scroll)
                .set(".row4-2", { height: "31%", opacity: 1 }, s4_scroll)
                .set(".row4-1-card, .row4-3-card, .row4-2-card", { x: 0, y: 0, opacity: 1 }, s4_scroll)
                .set(".row4-2-track", { x: 0 }, s4_scroll)
                .set(".card4-center", { scale: 1, y: 0 }, s4_scroll)
                .set(".card4-quote", { opacity: 1 }, s4_scroll)
                .set(".card4-success", { opacity: 0 }, s4_scroll)
                .set(".cursor4", { opacity: 0, x: 40, y: -20 }, s4_scroll);

            let s4_t = s4_stick + T(2);

            hi(4, 1, s4_t);
            s4_t = afterPoint(s4_t, pointText(4, 1), s4_t);

            hi(4, 2, s4_t);
            const s4_cursor = s4_t + T(1);
            tl.to(".cursor4", { opacity: 1, x: 0, y: 0, duration: FADE_DUR * 1.3, ease: "power2.out" }, s4_cursor)
                .to(".bind-btn", { scale: 1.1, duration: FADE_DUR, ease: EASE_SOFT }, s4_cursor + T(2));
            s4_t = afterPoint(s4_t, pointText(4, 2), s4_cursor + FADE_DUR * 1.3 + FADE_DUR + T(2));

            hi(4, 3, s4_t);
            const s4_click = s4_t + T(2);
            const s4_afterCl = s4_click + T(2);
            const s4_rows_out = s4_afterCl + FADE_DUR * 0.8 + T(2);

            tl.to(".cursor4", { scale: 0.84, duration: T(0.35), ease: "power2.in" }, s4_click)
                .to(".bind-btn", { scale: 0.91, duration: T(0.35), ease: "power2.in" }, s4_click)
                .to(".cursor4", { scale: 1, duration: T(0.65), ease: "back.out(2)" }, s4_click + T(0.35))
                .to(".bind-btn", { scale: 1, duration: T(0.7), ease: "back.out(2)" }, s4_click + T(0.38));

            tl.to(".row4-1-left", { x: "-130%", y: -8, opacity: 0, duration: FADE_DUR * 1.1, ease: EASE_EXIT }, s4_click + T(1))
                .to(".row4-1-right", { x: "130%", y: -8, opacity: 0, duration: FADE_DUR * 1.1, ease: EASE_EXIT }, s4_click + 1)
                .to(".row4-3-left", { x: "-130%", y: 8, opacity: 0, duration: FADE_DUR * 1.1, ease: EASE_EXIT }, s4_click + 1)
                .to(".row4-3-right", { x: "130%", y: 8, opacity: 0, duration: FADE_DUR * 1.1, ease: EASE_EXIT }, s4_click + 1);

            tl.to(".cursor4", { opacity: 0, x: 16, duration: FADE_DUR * 0.8, ease: EASE_EXIT }, s4_afterCl);

            tl.to(".row4-2-left", { x: "-130%", opacity: 0, duration: FADE_DUR * 1.1, ease: EASE_EXIT }, s4_rows_out)
                .to(".row4-2-right", { x: "130%", opacity: 0, duration: FADE_DUR * 1.1, ease: EASE_EXIT }, s4_rows_out)
                .to(".row4-2-track", { x: 0, duration: FADE_DUR, ease: EASE_SOFT }, s4_rows_out);
            s4_t = afterPoint(s4_t, pointText(4, 3), s4_rows_out + FADE_DUR * 1.1);

            const s4_outro = s4_t + T(2);
            const s5_scroll = s4_outro + T(5);
            const s5_morph = s5_scroll + SCROLL_DUR * 0.4;

            tl.to(".leftScroll", { yPercent: -80, duration: SCROLL_DUR, ease: "none" }, s5_scroll);

            // ═══════════════════════════════════════════════════════════════
            // STEP 5
            // ═══════════════════════════════════════════════════════════════
            const s5_stick = s5_scroll + SCROLL_DUR;

            tl.to(".row4-1", { height: 0, opacity: 0, duration: FADE_DUR * 1.2, ease: EASE_EXIT }, s5_morph)
                .to(".row4-3", { height: 0, opacity: 0, duration: FADE_DUR * 1.2, ease: EASE_EXIT }, s5_morph)
                .to(".row4-2", { height: "56%", duration: FADE_DUR * 1.4, ease: "power2.inOut" }, s5_morph)
                .to(".card4-center", { scale: 1.02, y: 0, duration: FADE_DUR * 1.2, ease: EASE_ENTER }, s5_morph);

            const s5_quoteOut = s5_morph + FADE_DUR * 0.8;
            const s5_successIn = s5_quoteOut + FADE_DUR * 0.6;
            tl.to(".card4-quote", { opacity: 0, duration: FADE_DUR, ease: EASE_EXIT }, s5_quoteOut)
                .to(".card4-success", { opacity: 1, duration: FADE_DUR * 1.1, ease: EASE_ENTER }, s5_successIn);

            gsap.set(".panel-step5", { y: 0 });

            let s5_t = s5_stick + T(1);

            hi(5, 1, s5_t);
            s5_t = afterPoint(s5_t, pointText(5, 1), s5_t);

            hi(5, 2, s5_t);
            s5_t = afterPoint(s5_t, pointText(5, 2), s5_t);

            hi(5, 3, s5_t);

            const lenis = (window as any).lenis;
            let scrollPending = false;
            const onLenisScroll = () => {
                if (scrollPending) return;
                scrollPending = true;
                requestAnimationFrame(() => {
                    ScrollTrigger.update();
                    scrollPending = false;
                });
            };
            lenis?.on("scroll", onLenisScroll);
            ScrollTrigger.refresh();

            return () => {
                lenis?.off("scroll", onLenisScroll);
            };
        },
        { scope: sectionRef, revertOnUpdate: true },
    );

    return (
        <section ref={sectionRef} className="h-screen overflow-hidden [contain:layout_paint]">
            <Container borderColor="#53535380">
                <div className="h-screen overflow-hidden grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">

                    {/* ── Left: scrolling step cards ───────────────────────── */}
                    <div className="leftScroll flex flex-col will-change-transform">
                        {processSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`step${index + 1} h-screen flex flex-col justify-center`}
                            >
                                <p className="text-sm font-mono font-medium uppercase tracking-[0.14em] text-[#4F63E8]">
                                    {step.tag}
                                </p>
                                <h3 className="w-lg mt-4 text-2xl font-heading font-regular tracking-tight text-[#0a143b] md:text-3xl lg:text-3xl">
                                    {step.heading}
                                </h3>
                                <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#4A5778] font-sans font-regular md:text-sm">
                                    {step.desc}
                                </p>
                                <ul className="mt-10 space-y-3">
                                    {step.points.map((feature, idx) => (
                                        <li
                                            key={feature.id}
                                            className={`point${idx + 1} flex gap-4 py-4 border-b border-black/10`}
                                        >
                                            <span className="point-icon flex size-6 shrink-0 items-center justify-center rounded-full border border-[#CCCCCC] text-[#CCCCCC]">
                                                <RiArrowRightLine className="size-3" />
                                            </span>
                                            <ProcessPointText text={feature.text} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* ── Right: single sticky visualization panel ─────────── */}
                    <div className="h-screen sticky top-0 flex items-center justify-center bg-white">
                        <div className="relative w-full aspect-square overflow-visible">
                            <PanelStep1 />
                            <PanelStep2 />
                            <PanelStep3 />
                            <PanelStep4 />
                            <PanelStep5 />
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default ProcessFlow;