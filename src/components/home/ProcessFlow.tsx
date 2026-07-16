"use client";
import { useRef, useLayoutEffect } from "react";
import Container from "../common/Container";
import EyebrowPill from "../common/EyebrowPill";
import { processSteps } from "@/data/processSteps";
import {
    RiArrowDownSLine,
    RiArrowRightLine,
    RiCalendarLine,
    RiCheckLine,
    RiFileTextFill,
    RiHashtag,
    RiLineChartLine,
    RiLoader2Fill,
    RiSparkling2Fill,
} from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyWaveToChars, COLOR_THEMES } from "@/lib/animateSplitTextReveal";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ─── Design tokens ────────────────────────────────────────────────────────────
const POINT_ACTIVE = "#413CC0";
const POINT_ARROW = "#151F4D";
const FIELD_VALID = "#6DAB4E";

function ProcessPointText({ text }: { text: string }) {
    const words = text.split(" ");

    return (
        <p className="point-text max-w-sm text-sm leading-relaxed font-heading font-regular md:text-sm">
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                        <span key={charIndex} className="point-char inline-block text-[#BCC5D6]">
                            {char}
                        </span>
                    ))}
                    {wordIndex < words.length - 1 ? (
                        <span className="point-char inline-block text-[#BCC5D6]">&nbsp;</span>
                    ) : null}
                </span>
            ))}
        </p>
    );
}
const FIELD_IDLE_BORDER = "#D1D5DB";
const FIELD_IDLE_TOGGLE = "#E5E7EB";
const POINTS_PER_STEP = 3;

function clamp01(v: number) {
    return Math.min(1, Math.max(0, v));
}

function getMobileNavOffset() {
    if (typeof window === "undefined") return 56;
    const header = document.querySelector(".site-view-header");
    return header?.getBoundingClientRect().height ?? 56;
}

const MOBILE_F2_FIELDS = [
    { loader: ".f2-loader-np", check: ".f2-check-np", icon: ".f2-icon-np" },
    { loader: ".f2-loader-fein", check: ".f2-check-fein", icon: ".f2-icon-fein", input: ".f2-inp-fein" },
    { loader: ".f2-loader-ent", check: ".f2-check-ent", icon: ".f2-icon-ent", input: ".f2-inp-ent" },
    { loader: ".f2-loader-yr", check: ".f2-check-yr", icon: ".f2-icon-yr", input: ".f2-inp-yr" },
] as const;

function mobileSeg(rawIndex: number, start: number, end: number) {
    return clamp01((rawIndex - start) / (end - start));
}

function initMobilePanelState(panelRoot: HTMLElement) {
    gsap.set(panelRoot.querySelectorAll('[class*="panel-step"]'), { opacity: 0, y: 0 });
    gsap.set(panelRoot.querySelector(".panel-step1"), {
        opacity: 1,
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(panelRoot.querySelector(".skeleton1"), {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        opacity: 1,
    });
    gsap.set(panelRoot.querySelector(".card1"), { opacity: 0, width: "100%", height: "auto", borderRadius: "1rem", scale: 1 });
    gsap.set(panelRoot.querySelector(".card1-content"), { opacity: 1 });
    gsap.set(panelRoot.querySelector(".card1-morph-shell"), { opacity: 0 });
    gsap.set(panelRoot.querySelector(".graph1"), { opacity: 0, y: 12, x: -4 });
    gsap.set(panelRoot.querySelector(".scanner1"), { opacity: 0, top: "100%" });

    gsap.set(panelRoot.querySelector(".ai-btn"), { opacity: 0, scale: 1, width: "3.5rem" });
    gsap.set(panelRoot.querySelector(".ai-btn-gradient"), { opacity: 0 });
    gsap.set(panelRoot.querySelector(".ai-btn-text"), { width: 0 });
    gsap.set(panelRoot.querySelector(".ai-btn-label"), { opacity: 0 });
    gsap.set(panelRoot.querySelector(".ai-btn-inner"), { backgroundColor: "#fff", gap: 0, paddingLeft: 0, paddingRight: 0 });
    gsap.set(panelRoot.querySelector(".cursor2"), { opacity: 0, x: 48, y: 36, scale: 1 });
    gsap.set(panelRoot.querySelector(".form-wrap2"), { opacity: 0 });
    gsap.set(panelRoot.querySelector(".form-card2-content"), { opacity: 1, visibility: "visible", display: "block" });
    gsap.set(panelRoot.querySelector(".form-card2-naics"), { opacity: 0 });
    gsap.set(panelRoot.querySelector(".skeleton2"), { opacity: 1 });
    gsap.set(panelRoot.querySelector(".f2-toggle-no"), { backgroundColor: FIELD_IDLE_TOGGLE, color: "#111827" });
    MOBILE_F2_FIELDS.forEach((field) => {
        gsap.set(panelRoot.querySelector(field.loader), { opacity: 0 });
        gsap.set(panelRoot.querySelector(field.check), { opacity: 0, scale: 0.85, backgroundColor: "#fff", borderColor: FIELD_IDLE_BORDER });
        gsap.set(panelRoot.querySelector(field.icon), { opacity: 0, color: "#fff" });
        if ("input" in field) gsap.set(panelRoot.querySelector(field.input), { borderColor: FIELD_IDLE_BORDER });
    });

    gsap.set(panelRoot.querySelector(".logos-grid3"), { height: 0, paddingBottom: 0 });
    panelRoot.querySelectorAll<HTMLElement>(".logo3").forEach((logo) => {
        gsap.set(logo, { opacity: 0, scale: 0.94, y: 10 });
    });

    gsap.set(panelRoot.querySelector(".cursor4"), { opacity: 0, x: 40, y: -20, scale: 1 });
    gsap.set(panelRoot.querySelector(".bind-btn"), { scale: 1 });
    gsap.set(panelRoot.querySelectorAll(".row4-1, .row4-3"), { height: "31%", opacity: 1 });
    gsap.set(panelRoot.querySelector(".row4-2"), { height: "31%", opacity: 1 });
    gsap.set(panelRoot.querySelectorAll(".row4-1-card, .row4-3-card, .row4-2-card"), { x: 0, y: 0, opacity: 1 });
    gsap.set(panelRoot.querySelector(".row4-2-track"), { x: 0 });
    gsap.set(panelRoot.querySelector(".card4-center"), { scale: 1, y: 0 });
    gsap.set(panelRoot.querySelector(".card4-quote"), { opacity: 1 });
    gsap.set(panelRoot.querySelector(".card4-success"), { opacity: 0 });
}

function applyMobilePanelState(root: HTMLElement, rawIndex: number) {
    const panelRoot = root.querySelector<HTMLElement>(".mobile-process-panel") ?? root;
    const stepIndex = Math.min(processSteps.length - 1, Math.floor(rawIndex / POINTS_PER_STEP));
    const pointInStep = Math.floor(rawIndex) % POINTS_PER_STEP;
    const pointT = clamp01(rawIndex - Math.floor(rawIndex));

    const q = (sel: string) => panelRoot.querySelector<HTMLElement>(sel);

    const showPanel1 = rawIndex < 3.15;
    const showPanel2 = rawIndex >= 2.85 && rawIndex < 8.85;
    const showPanel4 = rawIndex >= 8.5;

    const panelReveal = mobileSeg(rawIndex, 0, 0.3);
    if (q(".panel-step1")) {
        gsap.set(q(".panel-step1")!, {
            opacity: showPanel1 ? 1 : 0,
            clipPath: `polygon(0% 0%, 100% 0%, 100% ${gsap.utils.interpolate(100, 0, panelReveal)}%, 0% ${gsap.utils.interpolate(100, 0, panelReveal)}%)`,
            y: 0,
        });
    }
    if (q(".panel-step2")) {
        gsap.set(q(".panel-step2")!, {
            opacity: showPanel2 ? 1 : 0,
            y: rawIndex >= 8.5 && rawIndex < 8.95 ? gsap.utils.interpolate(0, -14, mobileSeg(rawIndex, 8.5, 8.95)) : 0,
        });
    }
    if (q(".panel-step4")) {
        gsap.set(q(".panel-step4")!, {
            opacity: showPanel4 ? 1 : 0,
            y: rawIndex < 9.1 && rawIndex >= 8.5 ? gsap.utils.interpolate(18, 0, mobileSeg(rawIndex, 8.5, 9.1)) : 0,
        });
    }

    // ── Step 1: intake ──────────────────────────────────────────────────────
    const cardReveal = stepIndex === 0 && pointInStep === 1 ? pointT : stepIndex > 0 || (stepIndex === 0 && pointInStep > 1) ? 1 : 0;
    const graphReveal =
        stepIndex === 0 && pointInStep === 2
            ? mobileSeg(pointT, 0, 0.4)
            : stepIndex > 0 || (stepIndex === 0 && pointInStep > 2)
              ? 1
              : 0;

    if (q(".skeleton1")) {
        const hideSkeleton = stepIndex > 0 || (stepIndex === 0 && pointInStep === 2 && pointT > 0.15);
        gsap.set(q(".skeleton1")!, {
            opacity: hideSkeleton ? 0 : 1,
            clipPath: `polygon(0% 0%, 100% 0%, 100% ${Math.max(0, 100 - cardReveal * 100)}%, 0% ${Math.max(0, 100 - cardReveal * 100)}%)`,
        });
    }
    if (q(".card1")) {
        const morphing = stepIndex === 1 && pointInStep === 0;
        const morphT = morphing ? mobileSeg(pointT, 0, 0.5) : 0;
        gsap.set(q(".card1")!, {
            opacity:
                stepIndex === 0
                    ? cardReveal > 0
                        ? Math.max(0.9, cardReveal)
                        : 0
                    : morphing
                      ? Math.max(0, 1 - morphT * 1.4)
                      : 0,
            width: "100%",
            height: "auto",
            borderRadius: "1rem",
            scale: morphing ? gsap.utils.interpolate(1, 0.2, morphT) : 1,
            transformOrigin: "50% 50%",
        });
        gsap.set(q(".card1-content")!, { opacity: stepIndex === 0 ? 1 : morphing ? Math.max(0, 1 - morphT * 2) : 0 });
        gsap.set(q(".card1-morph-shell")!, { opacity: morphing ? morphT : 0 });
    }
    if (q(".graph1")) {
        gsap.set(q(".graph1")!, {
            opacity: stepIndex === 0 ? graphReveal : 0,
            y: gsap.utils.interpolate(12, 0, graphReveal),
            x: gsap.utils.interpolate(-4, 0, graphReveal),
        });
    }
    if (q(".scanner1")) {
        let scanTop = 100;
        let scanOpacity = 0;
        if (stepIndex === 0 && pointInStep === 2) {
            scanOpacity = pointT < 0.92 ? 1 : Math.max(0, 1 - mobileSeg(pointT, 0.92, 1));
            if (pointT < 0.12) scanTop = gsap.utils.interpolate(100, 10, pointT / 0.12);
            else if (pointT < 0.5) scanTop = gsap.utils.interpolate(10, 100, (pointT - 0.12) / 0.38);
            else if (pointT < 0.72) scanTop = gsap.utils.interpolate(100, 10, (pointT - 0.5) / 0.22);
            else scanTop = gsap.utils.interpolate(10, 100, (pointT - 0.72) / 0.28);
        }
        gsap.set(q(".scanner1")!, { opacity: scanOpacity, top: `${scanTop}%` });
    }

    // ── Step 2: AI + form ───────────────────────────────────────────────────
    const aiMorphT = stepIndex === 1 && pointInStep === 0 ? mobileSeg(pointT, 0.2, 0.55) : stepIndex > 1 || (stepIndex === 1 && pointInStep > 0) ? 1 : 0;
    const aiExpandT = stepIndex === 1 && pointInStep === 0 ? mobileSeg(pointT, 0.45, 0.9) : stepIndex > 1 || (stepIndex === 1 && pointInStep > 0) ? 1 : 0;
    const cursorT = stepIndex === 1 && pointInStep === 0 ? mobileSeg(pointT, 0.72, 1) : 0;
    const formT = stepIndex === 1 && pointInStep === 1 ? pointT : stepIndex > 1 || (stepIndex === 1 && pointInStep > 1) ? 1 : 0;
    const validT = stepIndex === 1 && pointInStep === 2 ? pointT : stepIndex > 1 ? 1 : 0;

    if (q(".ai-btn")) {
        const showAi = rawIndex >= 3.1 && rawIndex < 4.05;
        gsap.set(q(".ai-btn")!, {
            opacity: showAi ? Math.max(aiMorphT, aiExpandT > 0 ? 0.95 : 0) : 0,
            scale: cursorT > 0.82 && cursorT < 0.92 ? 0.93 : 1,
            width: showAi ? `${gsap.utils.interpolate(56, 176, aiExpandT)}px` : "3.5rem",
            y: stepIndex === 1 && pointInStep === 1 && pointT < 0.12 ? -8 * mobileSeg(pointT, 0, 0.12) : 0,
        });
        gsap.set(q(".ai-btn-inner")!, {
            backgroundColor: aiExpandT > 0.45 ? "#E1E9FF" : "#ffffff",
            gap: aiExpandT > 0 ? `${aiExpandT * 0.5}rem` : 0,
            paddingLeft: aiExpandT > 0 ? `${aiExpandT * 1.25}rem` : 0,
            paddingRight: aiExpandT > 0 ? `${aiExpandT * 1.25}rem` : 0,
            paddingTop: aiExpandT > 0 ? `${aiExpandT}rem` : 0,
            paddingBottom: aiExpandT > 0 ? `${aiExpandT}rem` : 0,
        });
        gsap.set(q(".ai-btn-gradient")!, { opacity: aiExpandT });
        gsap.set(q(".ai-btn-text")!, { width: aiExpandT > 0 ? `${aiExpandT * 4.85}rem` : 0 });
        gsap.set(q(".ai-btn-label")!, { opacity: mobileSeg(aiExpandT, 0.35, 0.85) });
        gsap.set(q(".ai-btn-icon")!, { color: aiExpandT > 0 ? POINT_ACTIVE : "#CED2D2" });
    }
    if (q(".cursor2")) {
        const showCursor = stepIndex === 1 && pointInStep === 0 && pointT >= 0.7;
        gsap.set(q(".cursor2")!, {
            opacity: showCursor ? 1 : 0,
            x: showCursor ? gsap.utils.interpolate(48, 0, cursorT) : 48,
            y: showCursor ? gsap.utils.interpolate(36, 0, cursorT) : 36,
            scale: cursorT > 0.82 && cursorT < 0.92 ? 0.85 : 1,
        });
    }
    if (q(".form-wrap2")) {
        gsap.set(q(".form-wrap2")!, { opacity: stepIndex >= 1 && (stepIndex > 1 || pointInStep >= 1) ? Math.min(1, formT + 0.1) : 0 });
    }
    if (q(".skeleton2")) {
        gsap.set(q(".skeleton2")!, {
            opacity: stepIndex === 1 && pointInStep === 1 ? Math.max(0, 1 - mobileSeg(formT, 0.35, 0.75)) : stepIndex > 1 || (stepIndex === 1 && pointInStep > 1) ? 0 : 1,
        });
    }

    // ── Step 3: NAICS + logos ───────────────────────────────────────────────
    const naicsT =
        stepIndex === 2 && pointInStep === 0
            ? pointT
            : stepIndex > 2 || (stepIndex === 2 && pointInStep > 0)
              ? 1
              : 0;
    const logosT = stepIndex === 2 && pointInStep === 1 ? pointT : stepIndex > 2 || (stepIndex === 2 && pointInStep > 1) ? 1 : 0;

    if (q(".form-card2-content")) {
        gsap.set(q(".form-card2-content")!, {
            opacity: stepIndex < 2 ? 1 : Math.max(0, 1 - naicsT),
            visibility: naicsT > 0.95 ? "hidden" : "visible",
            display: naicsT > 0.95 ? "none" : "block",
        });
    }
    if (q(".form-card2-naics")) {
        gsap.set(q(".form-card2-naics")!, { opacity: stepIndex >= 2 ? naicsT : 0 });
    }

    const toggleNo = q(".f2-toggle-no");
    if (toggleNo) {
        const toggleOn = validT > 0.08;
        gsap.set(toggleNo, {
            backgroundColor: toggleOn ? FIELD_VALID : FIELD_IDLE_TOGGLE,
            color: toggleOn ? "#fff" : "#111827",
        });
    }
    MOBILE_F2_FIELDS.forEach((field, i) => {
        const loaderIn = mobileSeg(validT, 0.1 + i * 0.1, 0.24 + i * 0.1);
        const loaderOut = mobileSeg(validT, 0.44 + i * 0.06, 0.54 + i * 0.06);
        const checkIn = mobileSeg(validT, 0.54 + i * 0.1, 0.74 + i * 0.1);
        const loader = q(field.loader);
        const check = q(field.check);
        const icon = q(field.icon);
        if (loader) gsap.set(loader, { opacity: loaderIn > 0 && loaderOut < 1 ? 1 : 0 });
        if (check) {
            gsap.set(check, {
                opacity: checkIn,
                scale: gsap.utils.interpolate(0.85, 1, checkIn),
                backgroundColor: checkIn > 0 ? FIELD_VALID : "#fff",
                borderColor: checkIn > 0 ? FIELD_VALID : FIELD_IDLE_BORDER,
            });
        }
        if (icon) gsap.set(icon, { opacity: mobileSeg(checkIn, 0.25, 0.75) });
        if ("input" in field) {
            const input = q(field.input);
            if (input) gsap.set(input, { borderColor: checkIn > 0 ? FIELD_VALID : FIELD_IDLE_BORDER });
        }
    });

    if (q(".logos-grid3")) {
        const gridH = `${gsap.utils.interpolate(0, 200, logosT)}px`;
        gsap.set(q(".logos-grid3")!, { height: gridH, paddingBottom: logosT > 0 ? 20 : 0 });
    }
    panelRoot.querySelectorAll<HTMLElement>(".logo3").forEach((logo, i) => {
        const logoT = mobileSeg(logosT, 0.12 + i * 0.08, 0.52 + i * 0.08);
        gsap.set(logo, {
            opacity: logoT,
            scale: gsap.utils.interpolate(0.94, 1, logoT),
            y: gsap.utils.interpolate(10, 0, logoT),
        });
    });

    // ── Step 4 & 5: premium card (mobile — no side rows) ────────────────────
    const bindCursorT = stepIndex === 3 && pointInStep === 1 ? pointT : 0;
    const bindClickT = stepIndex === 3 && pointInStep === 2 ? pointT : 0;
    const successT =
        stepIndex === 4
            ? pointInStep === 0
                ? pointT
                : 1
            : stepIndex === 3 && pointInStep === 2
              ? mobileSeg(pointT, 0.55, 1)
              : 0;

    if (q(".cursor4")) {
        const showBindCursor = stepIndex === 3 && pointInStep === 1;
        gsap.set(q(".cursor4")!, {
            opacity: showBindCursor ? (pointT > 0.88 ? Math.max(0, 1 - mobileSeg(pointT, 0.88, 1)) : 1) : 0,
            x: showBindCursor ? gsap.utils.interpolate(40, 0, bindCursorT) : 40,
            y: showBindCursor ? gsap.utils.interpolate(-20, 0, bindCursorT) : -20,
            scale: bindClickT > 0.15 && bindClickT < 0.35 ? 0.84 : 1,
        });
    }
    if (q(".bind-btn")) {
        const bindScale = bindCursorT > 0.5 ? gsap.utils.interpolate(1, 1.1, mobileSeg(bindCursorT, 0.5, 0.85)) : 1;
        gsap.set(q(".bind-btn")!, {
            scale: bindClickT > 0.15 && bindClickT < 0.35 ? 0.91 : bindScale,
        });
    }
    if (q(".card4-center")) {
        gsap.set(q(".card4-center")!, {
            scale: successT > 0 ? gsap.utils.interpolate(1, 1.04, successT) : 1,
            y: 0,
        });
    }
    const quoteEl = q(".card4-quote");
    const successEl = q(".card4-success");
    if (quoteEl) gsap.set(quoteEl, { opacity: Math.max(0, 1 - successT) });
    if (successEl) gsap.set(successEl, { opacity: successT });
}

function MobileProcessPoint({ text, fill }: { text: string; fill: number }) {
    const rowRef = useRef<HTMLLIElement>(null);

    useLayoutEffect(() => {
        const chars = rowRef.current?.querySelectorAll<HTMLSpanElement>(".point-char");
        if (!chars?.length) return;
        applyWaveToChars(Array.from(chars), clamp01(fill), COLOR_THEMES.light);
    }, [fill, text]);

    const iconActive = fill > 0.02;

    return (
        <li ref={rowRef} className="flex gap-3 border-b border-black/10 py-3 last:border-b-0">
            <span
                className={`point-icon flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    fill >= 0.98
                        ? "border-[#151F4D] bg-[#151F4D] text-white"
                        : iconActive
                          ? "border-[#151F4D] bg-[#151F4D] text-white"
                          : "border-[#CCCCCC] text-[#CCCCCC]"
                }`}
            >
                <RiArrowRightLine className="size-3" />
            </span>
            <ProcessPointText text={text} />
        </li>
    );
}

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
                <div className="graph1 absolute opacity-0 left-full bottom-[105%] rounded-2xl border border-[#CED2D2] p-[3px] z-10 w-[12rem] aspect-video max-lg:left-1/2 max-lg:bottom-full max-lg:mb-2 max-lg:w-[9rem] max-lg:-translate-x-1/2">
                    <div className="w-full h-full rounded-xl border border-[#CED2D2]" />
                    <div className="absolute inset-0 z-10 py-3 p-4 flex flex-col justify-between">
                        <div>
                            <span className="font-mono tracking-wider font-medium text-[0.45rem] text-[#5A5A5A] uppercase">Revenue</span>
                            <p className="font-mono text-xs font-medium text-[#5A5A5A]">+326%</p>
                        </div>
                        <Image src="/images/process/graph.svg" alt="Revenue growth chart" width={100} height={100} className="w-full h-auto object-cover" />
                    </div>
                </div>

                {/* Scanner beam */}
                <div className="scanner1 absolute top-full z-20 opacity-0 left-1/2 h-20 w-[25rem] -translate-x-1/2 border-t border-[#1365D0] bg-gradient-to-b from-[#1365D0]/10 to-transparent" />
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
                <Image src="/images/process/cursor.svg" alt="cursor" width={100} height={100} className="h-full w-full object-cover" />
            </div>

            <div className="form-wrap2 opacity-0 absolute inset-0 flex items-center justify-center">
                <div className="relative grid w-xs shrink-0 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
                    <div className="form-card2 relative w-full overflow-hidden rounded-2xl border border-[#CCCCCC] bg-white">
                        <div className="form-card2-content">
                        <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
                            <span className="font-heading text-xs font-medium text-[#6DAB4E]">CARRIER APPLICATION (PRE-FILLED)</span>
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
                                <span className="relative grid size-2.5 shrink-0 place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
                                    <span className="f2-loader-np flex size-3.5 items-center justify-center opacity-0">
                                        <RiLoader2Fill className="block size-3.5 shrink-0 animate-spin text-[#9CA3AF] [animation-duration:0.85s]" />
                                    </span>
                                    <span className="f2-check-np flex size-2.5 items-center justify-center rounded-full border border-[#D1D5DB] bg-white opacity-0">
                                        <RiCheckLine className="f2-icon-np size-1.5 text-white opacity-0" />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="divide-y divide-neutral-100 px-4">
                            {[
                                { label: "FEIN", icon: null, cls: "f2-inp-fein", loader: "f2-loader-fein", chk: "f2-check-fein", ico: "f2-icon-fein", val: "13-1324567" },
                                { label: "Business Entity Type", icon: <RiArrowDownSLine className="ml-auto size-3 shrink-0 text-[#6B7280]" />, cls: "f2-inp-ent", loader: "f2-loader-ent", chk: "f2-check-ent", ico: "f2-icon-ent", val: "General Partnership" },
                                { label: "Start Year", icon: <RiCalendarLine className="ml-auto size-3 shrink-0 text-[#6B7280]" />, cls: "f2-inp-yr", loader: "f2-loader-yr", chk: "f2-check-yr", ico: "f2-icon-yr", val: "2023" },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between gap-2 py-3">
                                    <span className="font-heading text-[0.60rem] font-medium text-[#3C3B3B]">{row.label} <span className="text-[#EF4444]">*</span></span>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <span className={`${row.cls} inline-flex w-[8.25rem] shrink-0 items-center justify-start rounded-md border border-[#D1D5DB] bg-white px-2 py-1 text-left font-heading text-[0.55rem] font-medium text-[#111827]`}>
                                            <span className="min-w-0 flex-1 truncate">{row.val}</span>
                                            {row.icon}
                                        </span>
                                        <span className="relative grid size-2.5 shrink-0 place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
                                            <span className={`${row.loader} flex size-3.5 items-center justify-center opacity-0`}>
                                                <RiLoader2Fill className="block size-3.5 shrink-0 animate-spin text-[#9CA3AF] [animation-duration:0.85s]" />
                                            </span>
                                            <span className={`${row.chk} flex size-2.5 items-center justify-center rounded-full border border-[#D1D5DB] bg-white opacity-0`}>
                                                <RiCheckLine className={`${row.ico} size-1.5 text-white opacity-0`} />
                                            </span>
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

                        <div className="form-card2-naics pointer-events-none absolute inset-0 opacity-0">
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

function PanelStep3() {
    return (
        <div className="panel-step3 absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none" />
    );
}

function PanelStep4() {
    return (
        <div className="panel-step4 absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none p-7 max-lg:p-2">
            <div className="relative overflow-hidden flex h-full w-full flex-col justify-between max-lg:justify-center">
                <div
                    className="cursor4 pointer-events-none absolute z-50 flex h-11 w-11 items-center justify-center opacity-0 max-lg:right-[18%] max-lg:top-[74%] max-lg:h-9 max-lg:w-9"
                    style={{ right: "25%", top: "60%", transform: "translateY(0%)" }}
                >
                    <Image src="/images/process/cursor.svg" alt="cursor" width={100} height={100} className="h-full w-full object-cover" />
                </div>

                <div className="row4-1 w-full h-[31%] overflow-hidden flex items-center justify-between max-lg:hidden">
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

                <div className="row4-2 relative w-full h-[31%] flex items-center justify-center max-lg:h-full max-lg:min-h-[240px]">
                    <div className="row4-2-track absolute left-[-28%] w-full h-full flex items-center justify-between max-lg:static max-lg:left-0 max-lg:justify-center">
                        <div className="row4-2-card row4-2-left w-1/2 shrink-0 h-full border border-[#CCCCCC] bg-white rounded-2xl p-[3px] max-lg:hidden">
                            <div className="w-full h-full rounded-xl border border-[#CCCCCC]">
                                <div className="w-full h-12 border-b border-[#CCCCCC]" />
                            </div>
                        </div>

                        <div className="card4-center relative w-1/2 h-full shrink-0 overflow-hidden border mx-4 border-[#CCCCCC] bg-white rounded-2xl max-lg:w-full max-lg:h-full max-lg:max-h-[300px] max-lg:mx-0">
                            <div className="card4-quote absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl">
                                <div className="w-full h-12 px-3 bg-[#EEF1F3]/25 flex items-center justify-between max-lg:h-14 max-lg:px-4">
                                    <Image src="/images/process/logo1.svg" alt="AmTrust" width={100} height={100} className="size-10 object-contain max-lg:size-12" />
                                    <div className="flex items-center gap-2">
                                        <span className="font-heading text-[0.50rem] font-medium text-[#177F9B] flex items-center rounded-xs bg-[#D7F2F9] py-px px-2 max-lg:text-[0.6rem] max-lg:px-2.5 max-lg:py-0.5">A++</span>
                                        <span className="font-heading text-[0.50rem] font-medium text-[#177F9B] flex items-center rounded-xs bg-[#D7F2F9] py-px px-2 max-lg:text-[0.6rem] max-lg:px-2.5 max-lg:py-0.5">10/10</span>
                                    </div>
                                </div>
                                <div className="w-full flex items-end justify-between px-3 pb-3 max-lg:px-4 max-lg:pb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-heading text-xs uppercase font-medium text-[#9C9AA2] max-lg:text-sm">Premium</span>
                                        <span className="font-mono text-sm tracking-wide text-[#6DAB4E] max-lg:text-lg">$900.00</span>
                                    </div>
                                    <span className="font-heading text-[0.50rem] font-medium text-[#177F9B] flex items-center rounded-full bg-[#D7F2F9] py-1 px-4 max-lg:text-xs max-lg:px-5 max-lg:py-1.5">Instantly Bindable</span>
                                </div>
                                <div className="w-full flex items-end justify-between px-3 pb-3 max-lg:px-4 max-lg:pb-4">
                                    <span className="font-heading text-[0.55rem] font-medium tracking-wide text-[#3A48BE] max-lg:text-xs">Gain 2% Enhanced Commissions</span>
                                    <div className="relative shrink-0">
                                        <div className="bind-btn flex items-center justify-center gap-1 rounded-full bg-[#0032C9] px-3 py-1 font-heading text-[0.60rem] font-medium text-white max-lg:px-4 max-lg:py-1.5 max-lg:text-xs">
                                            Bind <RiArrowRightLine size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card4-success absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl opacity-0">
                                <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
                                    <Image src="/images/process/success.gif" alt="Policy bound successfully confirmation" width={100} height={100} className="size-16 object-contain" />
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

                        <div className="row4-2-card row4-2-right w-1/2 shrink-0 h-full border border-[#CCCCCC] bg-white rounded-2xl p-[3px] max-lg:hidden">
                            <div className="w-full h-full rounded-xl border border-[#CCCCCC]">
                                <div className="w-full h-12 border-b border-[#CCCCCC]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row4-3 w-full h-[31%] overflow-hidden flex items-center justify-between max-lg:hidden">
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
                    <Image src="/images/process/success.gif" alt="Policy bound successfully confirmation" width={100} height={100} className="size-18 object-contain" />
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

function StaticPanel({ step, stacked = false }: { step?: number; stacked?: boolean }) {
    const panelClass =
        "absolute inset-0! flex items-center justify-center opacity-100! pointer-events-none!";

    if (stacked) {
        return (
            <div className="mobile-process-panel relative mx-auto aspect-square w-full max-w-sm overflow-visible rounded-2xl">
                <PanelStep1 />
                <PanelStep2 />
                <PanelStep3 />
                <PanelStep4 />
                <PanelStep5 />
            </div>
        );
    }

    return (
        <div className="relative aspect-square w-full max-w-sm overflow-visible">
            {step === 1 ? (
                <div className={panelClass}>
                    <PanelStep1 />
                </div>
            ) : null}
            {step === 2 ? (
                <div className={panelClass}>
                    <PanelStep2 />
                </div>
            ) : null}
            {step === 3 ? (
                <div className={panelClass}>
                    <PanelStep3 />
                </div>
            ) : null}
            {step === 4 ? (
                <div className={panelClass}>
                    <PanelStep4 />
                </div>
            ) : null}
            {step === 5 ? (
                <div className={panelClass}>
                    <PanelStep5 />
                </div>
            ) : null}
        </div>
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
                            <MobileProcessPoint key={point.id} text={point.text} fill={1} />
                        ))}
                    </ul>

                    <div className="mt-8 flex w-full flex-col justify-end px-1">
                        <Image
                            src={`/images/process/step${index + 1}.svg`}
                            alt={step.heading}
                            width={520}
                            height={520}
                            className="h-auto w-full"
                            onLoad={() => ScrollTrigger.refresh()}
                        />
                    </div>
                </div>
            ))}
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
            if (window.matchMedia("(max-width: 1023px)").matches) return;

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
            const PROGRESS_FILL_DUR = T(5.5);

            let trackHeight = 1;

            const measurePointHeights = () => {
                const track = section.querySelector<HTMLElement>(".process-progress-fill");
                if (!track) return [] as number[];

                const trackRect = track.getBoundingClientRect();
                trackHeight = trackRect.height || 1;
                const trackTop = trackRect.top;

                return processSteps.flatMap((step, stepIndex) =>
                    step.points.map((_, pointIndex) => {
                        const icon = section.querySelector<HTMLElement>(
                            `.step${stepIndex + 1} .point${pointIndex + 1} .point-icon`,
                        );
                        if (!icon) return 0;

                        const iconRect = icon.getBoundingClientRect();
                        return iconRect.top + iconRect.height / 2 - trackTop;
                    }),
                );
            };

            let pointHeights: number[] = [];
            const progressFill = section.querySelector<HTMLElement>(".progress-fill-inner");
            const progress = { scale: 0 };
            const setProgressScale = progressFill
                ? gsap.quickSetter(progressFill, "scaleY")
                : null;
            const resetProgress = () => {
                progress.scale = 0;
                setProgressScale?.(0);
            };
            const syncProgressHeights = () => {
                pointHeights = measurePointHeights();
            };
            ScrollTrigger.addEventListener("refreshInit", syncProgressHeights);

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
            gsap.set(".form-card2-content", { opacity: 1, visibility: "visible", display: "block" });
            gsap.set(".form-card2-naics", { opacity: 0 });
            gsap.set(".skeleton2", { opacity: 1 });
            gsap.set(".f2-toggle-no", { backgroundColor: FIELD_IDLE_TOGGLE, color: "#111827" });
            gsap.set(".f2-check-np, .f2-check-fein, .f2-check-ent, .f2-check-yr",
                { opacity: 0, scale: 0.85, backgroundColor: "#fff", borderColor: FIELD_IDLE_BORDER, borderRadius: "9999px" });
            gsap.set(".f2-loader-np, .f2-loader-fein, .f2-loader-ent, .f2-loader-yr", { opacity: 0 });
            gsap.set(".f2-icon-np, .f2-icon-fein, .f2-icon-ent, .f2-icon-yr",
                { opacity: 0, color: "#fff" });
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

            const timelineRef: { current: gsap.core.Timeline | null } = { current: null };
            timelineRef.current = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () =>
                        `+=${Math.max(timelineRef.current?.duration() ?? T(100), T(100)) * VH_PER_UNIT}vh`,
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    fastScrollEnd: true,
                    invalidateOnRefresh: true,
                    onLeaveBack: resetProgress,
                    onRefresh: (self) => {
                        if (self.progress <= 0) resetProgress();
                    },
                },
            });
            const tl = timelineRef.current!;

            const CHAR_STAG = T(0.48);
            const CHAR_DUR = T(0.34);

            const pointText = (step: number, pt: number) => processSteps[step - 1].points[pt - 1].text;
            const pointFillDur = (text: string) => {
                const n = text.length;
                if (n <= 1) return CHAR_DUR;
                return CHAR_DUR + (n - 1) * CHAR_STAG;
            };
            const pointAnimDur = (text: string) => CHAR_DUR * 0.35 + pointFillDur(text);
            const afterPoint = (fillStart: number, text: string, rightEnd: number) =>
                Math.max(fillStart + PROGRESS_FILL_DUR + pointAnimDur(text), rightEnd) + POINT_GAP;
            const afterPointAnim = (animStart: number, text: string, rightEnd: number) =>
                Math.max(animStart + pointAnimDur(text), rightEnd) + POINT_GAP;

            const pointWaveColors = COLOR_THEMES.light;
            let progressPoint = 0;

            syncProgressHeights();
            if (progressFill) {
                gsap.set(progressFill, { scaleY: 0, transformOrigin: "top center" });
            }
            resetProgress();

            const pointIndexFrom = (step: number, pt: number) => (step - 1) * 3 + (pt - 1);
            const pointScale = (pointIndex: number) => (pointHeights[pointIndex] ?? 0) / trackHeight;

            const fillProgress = (pointIndex: number, t: number, duration = PROGRESS_FILL_DUR) => {
                const startScale = pointIndex === 0 ? 0 : pointScale(pointIndex - 1);
                const endScale = pointScale(pointIndex);

                tl.fromTo(
                    progress,
                    { scale: startScale },
                    {
                        scale: endScale,
                        duration,
                        ease: "none",
                        immediateRender: false,
                        onUpdate: () => setProgressScale?.(progress.scale),
                    },
                    t,
                );
            };

            const playPoint = (step: number, pt: number, t: number) => {
                const b = `.step${step} .point${pt}`;
                const chars = Array.from(
                    section.querySelectorAll<HTMLSpanElement>(`${b} .point-char`),
                );
                const icon = section.querySelector<HTMLElement>(`${b} .point-icon`);
                const totalDur = pointFillDur(pointText(step, pt));
                const prog = { v: 0 };

                if (icon) {
                    tl.to(icon, {
                        backgroundColor: POINT_ARROW,
                        color: "#ffffff",
                        borderColor: POINT_ARROW,
                        duration: CHAR_DUR * 1.2,
                        ease: "power2.out",
                    }, t);
                }

                tl.to(prog, {
                    v: 1,
                    duration: totalDur,
                    ease: "none",
                    onUpdate: () => applyWaveToChars(chars, prog.v, pointWaveColors),
                    onComplete: () => applyWaveToChars(chars, 1, pointWaveColors),
                }, t + CHAR_DUR * 0.35);
            };

            const hi = (step: number, pt: number, t: number) => {
                const pointIndex = progressPoint++;
                fillProgress(pointIndex, t);
                playPoint(step, pt, t + PROGRESS_FILL_DUR);
            };

            const crossStepFill = (step: number, pt: number, scrollStart: number) => {
                const pointIndex = pointIndexFrom(step, pt);
                fillProgress(pointIndex, scrollStart, SCROLL_DUR);
                progressPoint = pointIndex + 1;
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
            // Slow the reveal so it's noticeable (clip-path + card fade).
            tl.to(".skeleton1", { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", duration: FADE_DUR * 1.35, ease: EASE_EXIT }, s1_card)
                .to(".card1", { opacity: 1, duration: FADE_DUR * 1.35, ease: EASE_REVEAL }, s1_card + T(0.25))
                .to(".graph1", { opacity: 1, y: 0, x: 0, duration: FADE_DUR * 1.1, ease: EASE_REVEAL }, s1_graph);
            s1_t = afterPoint(s1_t, pointText(1, 2), s1_graph + FADE_DUR * 1.1);

            hi(1, 3, s1_t);
            const s1_scan = s1_t + T(1);
            tl.to(".scanner1", { opacity: 1, top: "10%", duration: SCAN_RISE, ease: EASE_ENTER }, s1_scan)
                .to(".scanner1", { top: "100%", duration: SCAN_TRAVEL, ease: "none" }, s1_scan + SCAN_RISE)
                .to(".scanner1", { top: "10%", duration: SCAN_TRAVEL * 0.85, ease: "none" }, s1_scan + SCAN_RISE + SCAN_TRAVEL)
                .to(".scanner1", { top: "100%", duration: SCAN_TRAVEL, ease: "none" }, s1_scan + SCAN_RISE + SCAN_TRAVEL + SCAN_TRAVEL * 0.85)
                .to(".scanner1", { opacity: 0, duration: T(2.5), ease: "power2.in" }, s1_scan + SCAN_RISE + SCAN_TRAVEL * 2.85 - T(1.5));
            s1_t = afterPoint(s1_t, pointText(1, 3), s1_scan + SCAN_RISE + SCAN_TRAVEL * 2.85 + T(1));

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

            crossStepFill(2, 1, s2_scroll);
            tl.to(".leftScroll", { yPercent: -20, duration: SCROLL_DUR, ease: "none" }, s2_scroll);

            // ═══════════════════════════════════════════════════════════════
            // STEP 2
            // ═══════════════════════════════════════════════════════════════
            const s2_stick = s2_scroll + SCROLL_DUR;

            let s2_t = s2_stick + T(1);

            playPoint(2, 1, s2_t);
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
            s2_t = afterPointAnim(s2_t, pointText(2, 1), s2_afterCl + FADE_DUR * 0.8);

            hi(2, 2, s2_t);
            const s2_form = s2_t + T(1);
            tl.to(".form-wrap2", { opacity: 1, duration: FADE_DUR, ease: EASE_ENTER }, s2_form)
                .to(".skeleton2", { opacity: 0, duration: FADE_DUR * 0.9, ease: EASE_EXIT }, s2_form + T(1.5));
            s2_t = afterPoint(s2_t, pointText(2, 2), s2_form + FADE_DUR + T(1.5));

            hi(2, 3, s2_t);
            const s2_valid = s2_t + T(2);

            const F2_VALID_FIELDS = [
                { loader: ".f2-loader-np", check: ".f2-check-np", icon: ".f2-icon-np" },
                { loader: ".f2-loader-fein", check: ".f2-check-fein", icon: ".f2-icon-fein", input: ".f2-inp-fein" },
                { loader: ".f2-loader-ent", check: ".f2-check-ent", icon: ".f2-icon-ent", input: ".f2-inp-ent" },
                { loader: ".f2-loader-yr", check: ".f2-check-yr", icon: ".f2-icon-yr", input: ".f2-inp-yr" },
            ] as const;

            const LOADER_STAG = T(0.65);
            const LOADER_SPIN = T(2.8);
            const LOADER_FADE = FADE_DUR * 0.55;

            tl.to(".f2-toggle-no", { backgroundColor: FIELD_VALID, color: "#fff", duration: VALID_DUR * 1.5, ease: EASE_SOFT }, s2_valid);

            const s2_loaderIn = s2_valid + T(0.4);
            F2_VALID_FIELDS.forEach((field, i) => {
                const t = s2_loaderIn + i * LOADER_STAG;
                tl.to(field.loader, { opacity: 1, duration: LOADER_FADE, ease: EASE_ENTER }, t);
                tl.set(field.check, { opacity: 0, scale: 0.85 }, t);
            });

            const s2_loaderOut =
                s2_loaderIn + (F2_VALID_FIELDS.length - 1) * LOADER_STAG + LOADER_SPIN;
            F2_VALID_FIELDS.forEach((field, i) => {
                const t = s2_loaderOut + i * LOADER_STAG * 0.5;
                tl.to(field.loader, { opacity: 0, duration: LOADER_FADE * 0.8, ease: EASE_EXIT }, t);
            });

            const s2_successIn =
                s2_loaderOut + (F2_VALID_FIELDS.length - 1) * LOADER_STAG * 0.5 + LOADER_FADE * 0.8 + T(0.5);
            F2_VALID_FIELDS.forEach((field, i) => {
                const t = s2_successIn + i * VALID_STAG;
                if ("input" in field && field.input) {
                    tl.to(field.input, { borderColor: FIELD_VALID, duration: VALID_DUR * 1.3, ease: EASE_SOFT }, t);
                }
                tl.to(field.check, {
                    opacity: 1,
                    scale: 1,
                    backgroundColor: FIELD_VALID,
                    borderColor: FIELD_VALID,
                    borderRadius: "9999px",
                    duration: VALID_DUR * 1.3,
                    ease: EASE_SOFT,
                }, t);
                tl.to(field.icon, { opacity: 1, duration: VALID_DUR, ease: EASE_SOFT }, t + T(0.4));
            });

            const s2_validEnd =
                s2_successIn + (F2_VALID_FIELDS.length - 1) * VALID_STAG + VALID_DUR * 1.5 + T(2);
            s2_t = afterPoint(s2_t, pointText(2, 3), s2_validEnd);

            const s2_outro = s2_t + T(2);

            // Step 2 → 3: same card morphs — carrier application content fades, card resizes, NAICS content appears.
            const s2_morph = s2_outro + T(0.3);
            const s2_contentFade = s2_morph;
            // Slow + smooth morph timing
            const s2_resize = s2_morph + FADE_DUR * 0.75;
            const s2_naicsIn = s2_morph + FADE_DUR * 0.95;

            tl.to(".form-card2-content", { opacity: 0, duration: FADE_DUR * 0.95, ease: EASE_SOFT }, s2_contentFade);

            tl.call(() => {
                const card = section.querySelector<HTMLElement>(".form-card2");
                const naics = section.querySelector<HTMLElement>(".form-card2-naics");
                if (!card || !naics) return;

                const fromH = card.offsetHeight;
                naics.style.visibility = "hidden";
                naics.style.position = "static";
                naics.style.opacity = "1";
                const toH = naics.offsetHeight;
                naics.style.position = "absolute";
                naics.style.inset = "0";
                naics.style.visibility = "visible";
                naics.style.opacity = "0";

                gsap.set(card, { height: fromH, overflow: "hidden", transformOrigin: "50% 50%" });
                card.dataset.morphTargetH = String(toH);
            }, [], s2_contentFade + FADE_DUR * 0.45);

            tl.to(".form-card2", {
                height: () => {
                    const card = section.querySelector<HTMLElement>(".form-card2");
                    const target = card?.dataset.morphTargetH;
                    return target ? `${target}px` : "auto";
                },
                duration: FADE_DUR * 1.65,
                ease: EASE_SOFT,
            }, s2_resize);

            tl.to(".form-card2-naics", { opacity: 1, duration: FADE_DUR * 1.25, ease: EASE_SOFT }, s2_naicsIn)
                .set(".form-card2-content", { visibility: "hidden", display: "none" }, s2_naicsIn);

            const s2_morphEnd = s2_naicsIn + FADE_DUR * 1.25 + T(1.2);
            tl.set(".form-card2-naics", { position: "static", clearProps: "inset" }, s2_morphEnd)
                .set(".form-card2", { height: "auto" }, s2_morphEnd);
            const s3_scroll = s2_morphEnd + T(3);

            crossStepFill(3, 1, s3_scroll);
            tl.to(".leftScroll", { yPercent: -40, duration: SCROLL_DUR, ease: "none" }, s3_scroll);

            // ═══════════════════════════════════════════════════════════════
            // STEP 3
            // ═══════════════════════════════════════════════════════════════
            const s3_stick = s3_scroll + SCROLL_DUR;

            let s3_t = s3_stick + T(1);

            playPoint(3, 1, s3_t);
            s3_t = afterPointAnim(s3_t, pointText(3, 1), s3_t);

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

            tl.to(".panel-step2", { opacity: 0, y: -14, duration: FADE_DUR, ease: EASE_EXIT }, s3_outro);
            crossStepFill(4, 1, s4_scroll);
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

            let s4_t = s4_stick + T(1);

            playPoint(4, 1, s4_t);
            s4_t = afterPointAnim(s4_t, pointText(4, 1), s4_t);

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

            crossStepFill(5, 1, s5_scroll);
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

            playPoint(5, 1, s5_t);
            s5_t = afterPointAnim(s5_t, pointText(5, 1), s5_t);

            hi(5, 2, s5_t);
            s5_t = afterPoint(s5_t, pointText(5, 2), s5_t);

            hi(5, 3, s5_t);

            tl.call(resetProgress, [], 0);

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
            syncProgressHeights();
            ScrollTrigger.refresh();
            resetProgress();

            return () => {
                lenis?.off("scroll", onLenisScroll);
                ScrollTrigger.removeEventListener("refreshInit", syncProgressHeights);
            };
        },
        { scope: sectionRef, revertOnUpdate: true },
    );

    return (
        <section ref={sectionRef} data-processflow className="bg-white [contain:layout_paint] lg:h-screen lg:overflow-hidden">
            <Container borderColor="#53535380">
                <MobileProcessFlow />

                <div className="hidden h-screen gap-12 lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20">

                    {/* ── Left: scrolling step cards ───────────────────────── */}
                    <div className="leftScroll relative flex flex-col will-change-transform">
                        {processSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`step${index + 1} h-screen flex flex-col justify-center`}
                            >
                                <div data-step-tag={index} className="w-fit">
                                    <EyebrowPill surface="light" dotAttr={`step-${index}`}>
                                        {step.tag}
                                    </EyebrowPill>
                                </div>
                                <h3 className="mt-4 max-w-lg text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#0a143b] md:text-3xl lg:max-w-md lg:text-[1.75rem] lg:leading-[1.25]">
                                    {step.heading}
                                </h3>
                                <ul className="mt-8 space-y-3 md:mt-10">
                                    {step.points.map((feature, idx) => (
                                        <li
                                            key={feature.id}
                                            className={`point${idx + 1} flex gap-4 py-4 border-b border-black/10`}
                                        >
                                            <span className="point-icon flex size-6 shrink-0 items-center justify-center rounded-full border border-[#CCCCCC] text-background">
                                                <RiArrowRightLine className="size-3" />
                                            </span>
                                            <ProcessPointText text={feature.text} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div className="process-progress-fill pointer-events-none absolute -left-6 top-0 h-full w-[2px] overflow-hidden">
                            <div className="progress-fill-inner absolute top-0 left-0 h-full w-full opacity-0 origin-top bg-gradient-to-b from-[#5B35E0] via-[#B87AFF] to-[#5B35E0] will-change-transform" />
                        </div>
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