"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../common/Container";
import EyebrowPill from "../common/EyebrowPill";
import { processSteps } from "@/data/processSteps";
import { RiArrowRightLine } from "@remixicon/react";
import { applyWaveToChars, COLOR_THEMES } from "@/lib/animateSplitTextReveal";
import { PRIMARY_BUTTON_GRADIENT } from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

const POINT_ARROW = "#151F4D";

function stepShortName(tag: string) {
  // "01 Smart Intake" → "Smart Intake"
  return tag.replace(/^\d+\s*/, "").trim();
}

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

function ProcessStepNav({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <nav aria-label="Process steps" className="relative z-10 flex w-full items-stretch">
      {processSteps.map((step, index) => {
        const isActive = index === activeIndex;
        const isFilled = index <= activeIndex;
        const isLast = index === processSteps.length - 1;
        const className = `flex min-w-0 flex-1 items-center justify-center px-2 py-3 text-center font-heading text-[0.6875rem] font-medium tracking-wide transition-colors duration-500 sm:text-xs md:py-3.5 md:text-sm ${
          isFilled ? "text-white" : "text-[#9AA8BC]"
        } ${!isLast ? "border-r border-[#E8ECF0]/35" : ""} ${
          onSelect
            ? isFilled
              ? "hover:text-white/85"
              : "hover:text-[#50617a]"
            : ""
        }`;

        const label = (
          <span className="flex min-w-0 items-center justify-center">
            <span className={isActive ? "font-semibold" : "font-regular"}>
              {index + 1}
            </span>
            <span className="ml-1 truncate sm:ml-1.5">{stepShortName(step.tag)}</span>
          </span>
        );

        if (onSelect) {
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(index)}
              className={className}
              aria-current={isActive ? "step" : undefined}
            >
              {label}
            </button>
          );
        }

        return (
          <span
            key={step.id}
            className={className}
            aria-current={isActive ? "step" : undefined}
          >
            {label}
          </span>
        );
      })}
    </nav>
  );
}

function ProcessStepBar({
  activeIndex,
  onSelect,
  className = "",
}: {
  activeIndex: number;
  onSelect?: (index: number) => void;
  className?: string;
}) {
  const progress = ((activeIndex + 1) / processSteps.length) * 100;

  return (
    <div
      className={`relative w-full overflow-hidden border-t border-[#E8ECF0]/80 bg-[#F3F5F8] ${className}`}
    >
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out"
        style={{ width: `${progress}%`, background: PRIMARY_BUTTON_GRADIENT }}
        aria-hidden
      />
      <ProcessStepNav activeIndex={activeIndex} onSelect={onSelect} />
    </div>
  );
}

function ProcessStepStrip({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden w-full lg:block">
      <div className="pointer-events-auto w-full">
        <ProcessStepBar activeIndex={activeIndex} onSelect={onSelect} />
      </div>
    </div>
  );
}

function MobileProcessFlow({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target) return;
        const index = items.indexOf(visible.target as HTMLDivElement);
        if (index >= 0) setActiveIndex(index);
      },
      { threshold: [0.35, 0.55], rootMargin: "-20% 0px -35% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [setActiveIndex]);

  return (
    <>
      <div className="flex flex-col gap-16 py-12 pb-20 lg:hidden">
        {processSteps.map((step, index) => (
        <div
          key={step.id}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="flex flex-col"
        >
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
            <ProcessStepVideo src={step.videoSrc} label={step.heading} />
          </div>
        </div>
        ))}
      </div>

      <ProcessStepBar activeIndex={activeIndex} className="fixed inset-x-0 bottom-0 z-30 lg:hidden" />
    </>
  );
}

const ProcessFlow = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepStartTimesRef = useRef<number[]>([0]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const jumpingRef = useRef(false);

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

      const stepStarts = [0];

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
          onUpdate: (self) => {
            if (jumpingRef.current) return;
            const anim = self.animation;
            const time = anim ? anim.time() : 0;
            const starts = stepStartTimesRef.current;
            let next = 0;
            for (let i = 0; i < starts.length; i += 1) {
              if (time + 0.001 >= (starts[i] ?? 0)) next = i;
            }
            setActiveStep((current) => (current === next ? current : next));
          },
        },
      });
      const tl = timelineRef.current!;
      scrollTriggerRef.current = tl.scrollTrigger ?? null;

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

      // Record when the step is fully in view (after the panel scroll finishes).
      const scrollToStep = (step: number, yPercent: number, t: number) => {
        tl.to(".leftScroll", { yPercent, duration: SCROLL_DUR, ease: "none" }, t);
        tl.to(".rightScroll", { yPercent, duration: SCROLL_DUR, ease: "none" }, t);
        const arrived = t + SCROLL_DUR;
        stepStarts[step - 1] = arrived;
        return arrived + T(1);
      };

      let t = T(1);
      stepStarts[0] = 0;

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

      stepStartTimesRef.current = [...stepStarts];
      ScrollTrigger.refresh();
      // Re-bind after refresh so start/end are current for jumpToStep.
      scrollTriggerRef.current = tl.scrollTrigger ?? null;

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
        scrollTriggerRef.current = null;
      };
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  const jumpToStep = (index: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;

    const tl = st.animation;
    if (!tl) return;

    const starts = stepStartTimesRef.current;
    const total = Math.max(tl.duration(), 0.001);
    const stepStart = starts[index] ?? 0;
    // Small absolute nudge past the boundary - do NOT use a % of the gap to the
    // next step (that gap includes a long panel scroll and overshoots badly).
    const targetTime = gsap.utils.clamp(0, total, stepStart + 0.2);
    const progress = targetTime / total;
    const scroll = st.start + (st.end - st.start) * progress;

    jumpingRef.current = true;
    setActiveStep(index);

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      // Re-assert exact scroll, then snap scrub:1 so panels match immediately.
      if (window.lenis) {
        window.lenis.scrollTo(scroll, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: scroll, behavior: "auto" });
      }
      st.getTween()?.progress(1);
      ScrollTrigger.update();
      jumpingRef.current = false;
      setActiveStep(index);
    };

    if (window.lenis) {
      window.lenis.scrollTo(scroll, {
        duration: 0.75,
        force: true,
        lock: true,
        onComplete: settle,
      });
      window.setTimeout(settle, 1200);
      return;
    }

    window.scrollTo({ top: scroll, behavior: "smooth" });
    window.setTimeout(settle, 800);
  };

  return (
    <section
      ref={sectionRef}
      data-processflow
      className="relative bg-white [contain:layout_paint] lg:h-screen lg:overflow-hidden"
    >
      <ProcessStepStrip
        activeIndex={activeStep}
        onSelect={jumpToStep}
      />

      <Container borderColor="#53535380">
        <MobileProcessFlow
          activeIndex={activeStep}
          setActiveIndex={setActiveStep}
        />

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
              <div key={step.id} className="flex h-screen items-center justify-center">
                <div className="relative aspect-square w-full overflow-hidden">
                  <ProcessStepVideo src={step.videoSrc} label={step.heading} />
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
