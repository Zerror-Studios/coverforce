"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../common/Container";
import EyebrowPill from "../common/EyebrowPill";
import { processSteps } from "@/data/processSteps";
import { RiArrowRightLine } from "@remixicon/react";
import { applyWaveToChars, COLOR_THEMES } from "@/lib/animateSplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

const POINT_ARROW = "#151F4D";

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

function ProcessStepVideo({
    src,
    label,
    className = "",
}: {
    src: string;
    label: string;
    className?: string;
}) {
    return (
        <div className={`relative h-full w-full overflow-hidden ${className}`}>
            <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full border-0 object-cover object-center outline-none"
                aria-label={label}
            />
        </div>
    );
}

function MobileProcessFlow() {
    return (
        <div className="flex flex-col gap-16 py-12 lg:hidden">
            {processSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col">
                    <div className="w-fit">
                        <EyebrowPill surface="light">{step.tag}</EyebrowPill>
                    </div>
                    <h3 className="mt-3 max-w-lg pr-2 text-balance text-2xl font-heading font-regular leading-[1.2] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.15]">
                        {step.heading}
                    </h3>

                    <ul className="mt-5 space-y-0">
                        {step.points.map((point) => (
                            <li
                                key={point.id}
                                className="flex gap-4 border-b border-black/10 py-4 last:border-b-0"
                            >
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#151F4D] bg-[#151F4D] text-white">
                                    <RiArrowRightLine className="size-3" />
                                </span>
                                <p className="max-w-sm text-sm leading-relaxed font-heading font-regular text-[#0a143b] md:text-sm">
                                    {point.text}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="relative mt-8 aspect-square w-full overflow-hidden">
                        <ProcessStepVideo
                            src={step.videoSrc}
                            label={step.heading}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

const ProcessFlow = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;
            if (window.matchMedia("(max-width: 1023px)").matches) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const S = 1.75;
            const T = (n: number) => n * S;
            const SCROLL_DUR = T(24);
            const VH_PER_UNIT = 2.9;
            const POINT_GAP = T(2);
            const CHAR_STAG = T(0.48);
            const CHAR_DUR = T(0.34);

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
                },
            });
            const tl = timelineRef.current!;

            const pointText = (step: number, pt: number) =>
                processSteps[step - 1].points[pt - 1].text;
            const pointFillDur = (text: string) => {
                const n = text.length;
                if (n <= 1) return CHAR_DUR;
                return CHAR_DUR + (n - 1) * CHAR_STAG;
            };
            const pointAnimDur = (text: string) => CHAR_DUR * 0.35 + pointFillDur(text);
            const afterPoint = (fillStart: number, text: string) =>
                fillStart + pointAnimDur(text) + POINT_GAP;

            const pointWaveColors = COLOR_THEMES.light;

            const playPoint = (step: number, pt: number, t: number) => {
                const selector = `.step${step} .point${pt}`;
                const chars = Array.from(
                    section.querySelectorAll<HTMLSpanElement>(`${selector} .point-char`),
                );
                const icon = section.querySelector<HTMLElement>(`${selector} .point-icon`);
                const totalDur = pointFillDur(pointText(step, pt));
                const prog = { v: 0 };

                if (icon) {
                    tl.to(
                        icon,
                        {
                            backgroundColor: POINT_ARROW,
                            color: "#ffffff",
                            borderColor: POINT_ARROW,
                            duration: CHAR_DUR * 1.2,
                            ease: "power2.out",
                        },
                        t,
                    );
                }

                tl.to(
                    prog,
                    {
                        v: 1,
                        duration: totalDur,
                        ease: "none",
                        onUpdate: () => applyWaveToChars(chars, prog.v, pointWaveColors),
                        onComplete: () => applyWaveToChars(chars, 1, pointWaveColors),
                    },
                    t + CHAR_DUR * 0.35,
                );
            };

            const hi = (step: number, pt: number, t: number) => {
                playPoint(step, pt, t);
            };

            const scrollToStep = (step: number, yPercent: number, t: number) => {
                tl.to(".leftScroll", { yPercent, duration: SCROLL_DUR, ease: "none" }, t);
                tl.to(".rightScroll", { yPercent, duration: SCROLL_DUR, ease: "none" }, t);
                return t + SCROLL_DUR + T(1);
            };

            let t = T(1);

            hi(1, 1, t);
            t = afterPoint(t, pointText(1, 1));
            hi(1, 2, t);
            t = afterPoint(t, pointText(1, 2));
            hi(1, 3, t);
            t = afterPoint(t, pointText(1, 3)) + T(3);

            t = scrollToStep(2, -20, t);
            playPoint(2, 1, t);
            t = afterPoint(t, pointText(2, 1));
            hi(2, 2, t);
            t = afterPoint(t, pointText(2, 2));
            hi(2, 3, t);
            t = afterPoint(t, pointText(2, 3)) + T(3);

            t = scrollToStep(3, -40, t);
            hi(3, 1, t);
            t = afterPoint(t, pointText(3, 1));
            hi(3, 2, t);
            t = afterPoint(t, pointText(3, 2));
            hi(3, 3, t);
            t = afterPoint(t, pointText(3, 3)) + T(3);

            t = scrollToStep(4, -60, t);
            hi(4, 1, t);
            t = afterPoint(t, pointText(4, 1));
            hi(4, 2, t);
            t = afterPoint(t, pointText(4, 2));
            hi(4, 3, t);
            t = afterPoint(t, pointText(4, 3)) + T(3);

            t = scrollToStep(5, -80, t);
            playPoint(5, 1, t);
            t = afterPoint(t, pointText(5, 1));
            hi(5, 2, t);
            t = afterPoint(t, pointText(5, 2));
            hi(5, 3, t);

            const lenis = window.lenis;
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
        <section
            ref={sectionRef}
            data-processflow
            className="bg-white [contain:layout_paint] lg:h-screen lg:overflow-hidden"
        >
            <Container borderColor="#53535380">
                <MobileProcessFlow />

                <div className="hidden h-screen gap-12 lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20">
                    <div className="leftScroll relative flex flex-col will-change-transform">
                        {processSteps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`step${index + 1} flex h-screen flex-col justify-center`}
                            >
                                <div className="w-fit">
                                    <EyebrowPill surface="light" className="mb-0">
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
                                            className={`point${idx + 1} flex gap-4 border-b border-black/10 py-4`}
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

                    <div className="rightScroll relative flex flex-col will-change-transform">
                        {processSteps.map((step) => (
                            <div
                                key={step.id}
                                className="flex h-screen items-center justify-center"
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <ProcessStepVideo
                                        src={step.videoSrc}
                                        label={step.heading}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ProcessFlow;
