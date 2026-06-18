"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject, type TransitionEvent } from "react";
import { RiAttachmentLine, RiFileTextFill, RiLineChartLine, RiMailFill } from "@remixicon/react";
import Image from "next/image";
import { MICRO_EASE, MICRO_ROLL_MS, MICRO_ROLL_STAGGER_MS } from "@/lib/motion";
import { PeriodicIncrementalStat } from "@/components/common/AnimatedPercent";

const SLIDE_MS = 1700;
const ROTATE_MS = 8000;

const LIMIT_LABELS = [
  "General Liability",
  "Automobile Liability",
  "Umbrella Liability",
] as const;

const LIMIT_VALUES_BY_ROW = [
  ["$1,000,000", "$1,250,000", "$2,000,000"],
  ["$500,000", "$750,000", "$1,000,000"],
  ["$5,000,000", "$7,500,000", "$10,000,000"],
] as const;

const LIMIT_ROW_INTERVAL_MS = [9_000, 11_500, 14_000] as const;
const LIMIT_ROW_START_DELAY_MS = [0, 2_800, 5_600] as const;

function OdometerDigit({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] shrink-0 overflow-hidden align-middle leading-none">
      <span
        className="flex flex-col will-change-transform"
        style={{
          transform: `translateY(calc(-${value} * 1em))`,
          transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {Array.from({ length: 10 }, (_, digit) => (
          <span
            key={digit}
            className="flex h-[1em] w-[0.62em] items-center justify-center leading-none"
          >
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

function OdometerCurrency({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span
      className={`inline-flex h-[1em] items-center overflow-hidden leading-none tabular-nums ${className}`}
      aria-hidden
    >
      {value.split("").map((char, index) => {
        if (char >= "0" && char <= "9") {
          return <OdometerDigit key={`d-${index}`} value={Number(char)} />;
        }
        return (
          <span key={`s-${index}`} className="inline-block leading-none">
            {char}
          </span>
        );
      })}
    </span>
  );
}

function AnimatedLimitRow({
  label,
  values,
  intervalMs,
  startDelayMs,
}: {
  label: string;
  values: readonly string[];
  intervalMs: number;
  startDelayMs: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (values.length <= 1) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let intervalId: number | undefined;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIndex((current) => (current + 1) % values.length);
      }, intervalMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [intervalMs, startDelayMs, values]);

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[0.60rem] font-heading font-medium text-[#3C3B3B]">{label}</span>
      <OdometerCurrency
        value={values[index]}
        className="text-xs font-heading font-medium text-[#3C3B3B]"
      />
    </div>
  );
}

function AnimatedLimitsList() {
  return (
    <div className="divide-y divide-neutral-100 px-4">
      {LIMIT_LABELS.map((label, rowIndex) => (
        <AnimatedLimitRow
          key={label}
          label={label}
          values={LIMIT_VALUES_BY_ROW[rowIndex]}
          intervalMs={LIMIT_ROW_INTERVAL_MS[rowIndex]}
          startDelayMs={LIMIT_ROW_START_DELAY_MS[rowIndex]}
        />
      ))}
    </div>
  );
}

const EMAIL_INTAKES = [
  { firm: "Summit Risk Advisors", time: "9:14 AM", attachments: 5 },
  { firm: "Harborline Insurance Group", time: "11:28 AM", attachments: 3 },
  { firm: "Atlas Commercial Partners", time: "2:06 PM", attachments: 7 },
] as const;

const ACORD_INFO = {
  insured: "Construction LLC",
  policy: "GL-2024-98765",
  coverage: "5 coverages",
} as const;

/** Same content on every slide — avoids wrap/height jumps during transition */
const ACORD_INFO_SLIDES = [ACORD_INFO, ACORD_INFO, ACORD_INFO] as const;

const AVATARS = [
  { label: "A", className: "bg-amber-400", image: "/images/avatar1.png" },
  { label: "B", className: "bg-blue-400", image: "/images/avatar2.png" },
] as const;

function DigitRoller({
  sequence,
  animate,
  duration = MICRO_ROLL_MS,
  delay = 0,
}: {
  sequence: readonly number[];
  animate: boolean;
  duration?: number;
  delay?: number;
}) {
  const endIndex = sequence.length - 1;

  return (
    <span
      className="relative inline-block h-[1em] w-[0.62em] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
      }}
    >
      <span
        className="flex flex-col will-change-transform"
        style={{
          transition: animate
            ? `transform ${duration * 0.75}ms ${MICRO_EASE} ${delay}ms`
            : "none",
          transform: animate
            ? `translateY(calc(-${endIndex} * 1em))`
            : "translateY(0)",
        }}
      >
        {sequence.map((digit, i) => (
          <span
            key={`${digit}-${i}`}
            className="flex h-[1em] items-center justify-center leading-none"
          >
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

function RollingText({
  prev,
  next,
  animationKey,
  className = "",
}: {
  prev: string;
  next: string;
  animationKey: number;
  className?: string;
}) {
  const [roll, setRoll] = useState(false);

  useEffect(() => {
    if (animationKey === 0) return;
    setRoll(false);
    const id = window.setTimeout(() => setRoll(true), 40);
    return () => window.clearTimeout(id);
  }, [animationKey]);

  const width = Math.max(prev.length, next.length);
  const pad = "\u00A0"; // NBSP so layout doesn't collapse
  const paddedPrev = prev.padStart(width, pad);
  const paddedNext = next.padStart(width, pad);

  return (
    <span
      className={`inline-flex items-baseline tabular-nums leading-none whitespace-pre ${className}`}
      aria-hidden
    >
      {paddedNext.split("").map((char, i) => {
        const prevChar = paddedPrev[i];
        const isDigit = char >= "0" && char <= "9";

        if (!isDigit) {
          return (
            <span key={`${char}-${i}`} className="inline-block">
              {char}
            </span>
          );
        }

        const prevDigit = prevChar >= "0" && prevChar <= "9" ? Number(prevChar) : Number(char);
        const nextDigit = Number(char);
        // Always roll digits, even when they don't change.
        // For unchanged digits we roll 0→0 (or 5→5, etc) using a 2-step sequence.
        const sequence =
          prevDigit === nextDigit ? [nextDigit, nextDigit] : [prevDigit, nextDigit];

        return (
          <DigitRoller
            key={`${i}-${sequence.join("-")}`}
            sequence={sequence}
            animate={roll}
            delay={i > 0 ? MICRO_ROLL_STAGGER_MS : 0}
          />
        );
      })}
    </span>
  );
}

function AcordInfoField({
  label,
  value,
  liveValue,
}: {
  label: string;
  value: string;
  liveValue?: ReactNode;
}) {
  return (
    <div className="mt-0.5 flex items-start gap-1">
      <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
        <RiLineChartLine className="text-[#6B7280] size-2" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.40rem] font-sans font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">
          {label}
        </p>
        <p className="truncate text-[0.50rem] tracking-wide font-heading font-medium text-[#111827]">
          {liveValue ?? value}
        </p>
      </div>
    </div>
  );
}

type AcordInfoSet = (typeof ACORD_INFO_SLIDES)[number];

function AcordInfoPanel({
  set,
  liveStats,
  coverageStatClassName,
  panelRef,
}: {
  set: AcordInfoSet;
  liveStats: boolean;
  coverageStatClassName: string;
  panelRef?: RefObject<HTMLDivElement | null>;
}) {
  const fields = [
    { label: "Insured", value: set.insured },
    { label: "Policy Number", value: set.policy },
    { label: "Coverage", value: set.coverage },
  ] as const;

  return (
    <div ref={panelRef} className="px-3">
      {[0, 1].map((rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-3 gap-x-2 border-b border-dashed border-[#CCCCCC] py-2"
        >
          {fields.map((field) => (
            <div key={`${rowIndex}-${field.label}`} className="min-w-0">
              <AcordInfoField
                label={field.label}
                value={field.value}
                liveValue={
                  liveStats && rowIndex === 0 && field.label === "Coverage" ? (
                    <span className="inline-flex items-baseline">
                      <PeriodicIncrementalStat
                        start={5}
                        step={1}
                        max={12}
                        intervalMs={ROTATE_MS}
                        className={coverageStatClassName}
                      />
                      <span className={coverageStatClassName}> coverages</span>
                    </span>
                  ) : undefined
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AnimatedAcordInfoSection({
  liveStats,
  coverageStatClassName,
}: {
  liveStats: boolean;
  coverageStatClassName: string;
}) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const animatingRef = useRef(false);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const nextIndex = (index + 1) % ACORD_INFO_SLIDES.length;

  const finishSlide = useCallback(() => {
    if (!animatingRef.current) return;

    animatingRef.current = false;
    setAnimating(false);
    setIndex((current) => (current + 1) % ACORD_INFO_SLIDES.length);

    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  }, []);

  const startSlide = useCallback(() => {
    if (animatingRef.current || ACORD_INFO_SLIDES.length <= 1) return;

    animatingRef.current = true;
    setAnimating(true);

    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    slideTimerRef.current = setTimeout(finishSlide, SLIDE_MS + 150);
  }, [finishSlide]);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el || panelHeight > 0) return;

    setPanelHeight(el.offsetHeight);
  }, [liveStats, panelHeight]);

  useEffect(() => {
    if (ACORD_INFO_SLIDES.length <= 1) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const interval = setInterval(startSlide, ROTATE_MS);
    return () => {
      clearInterval(interval);
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [startSlide]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "transform") return;
    if (event.target !== event.currentTarget) return;
    finishSlide();
  };

  return (
    <div className="overflow-hidden" style={panelHeight ? { height: panelHeight } : undefined}>
      <div
        className="flex flex-col will-change-transform"
        style={{
          transform: animating && panelHeight ? `translateY(-${panelHeight}px)` : "translateY(0)",
          transition: animating ? `transform ${SLIDE_MS}ms ${MICRO_EASE}` : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <AcordInfoPanel
          set={ACORD_INFO_SLIDES[index]}
          liveStats={liveStats}
          coverageStatClassName={coverageStatClassName}
          panelRef={panelRef}
        />
        <AcordInfoPanel
          set={ACORD_INFO_SLIDES[nextIndex]}
          liveStats={liveStats}
          coverageStatClassName={coverageStatClassName}
        />
      </div>
    </div>
  );
}

function EmailMessageBody({ firm, time }: { firm: string; time: string }) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-sans font-medium leading-[1.4] text-[#111827]">
          New submission from
          <br />
          {firm}
        </p>
        <span className="shrink-0 pt-0.5 text-[10px] font-sans font-normal leading-[1.4] text-[#9CA3AF]">
          {time}
        </span>
      </div>
    </div>
  );
}

function EmailIntakeFooter({
  prevAttachments,
  nextAttachments,
  animationKey,
}: {
  prevAttachments: number;
  nextAttachments: number;
  animationKey: number;
}) {
  return (
    <div className="flex items-center justify-between border-t border-dashed border-[#CCCCCC] px-3 py-3">
      <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
        <RiAttachmentLine className="size-2 rotate-90 text-[#6B7280]" />
        <RollingText
          prev={String(prevAttachments)}
          next={String(nextAttachments)}
          animationKey={animationKey}
          className="text-[10px] font-sans font-normal leading-[1.4] text-[#6B7280]"
        />
        <span>attachments</span>
      </div>
      <div className="flex items-center">
        <div className="-mr-1.5 flex -space-x-1.5">
          {AVATARS.map((avatar) => (
            <span
              key={avatar.label}
              className={`flex size-[23px] items-center justify-center overflow-hidden rounded-full border border-[#AFAFAF] ${avatar.className}`}
            >
              <Image
                className="h-full w-full object-cover"
                src={avatar.image}
                alt={avatar.label}
                width={20}
                height={20}
              />
            </span>
          ))}
        </div>
        <span className="flex size-[23px] items-center justify-center rounded-full border border-[#AFAFAF] bg-[#EEF2FF] text-[7px] font-bold text-[#4B5563]">
          +2
        </span>
      </div>
    </div>
  );
}

function AnimatedEmailIntake() {
  const [index, setIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [animating, setAnimating] = useState(false);
  const animatingRef = useRef(false);
  const prevIndexRef = useRef(0);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIndex = (index + 1) % EMAIL_INTAKES.length;

  const finishSlide = useCallback(() => {
    if (!animatingRef.current) return;

    animatingRef.current = false;
    setAnimating(false);
    prevIndexRef.current = index;
    setIndex((current) => (current + 1) % EMAIL_INTAKES.length);

    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  }, [index]);

  const startSlide = useCallback(() => {
    if (animatingRef.current || EMAIL_INTAKES.length <= 1) return;

    animatingRef.current = true;
    setAnimating(true);
    setAnimationKey((key) => key + 1);

    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    slideTimerRef.current = setTimeout(finishSlide, SLIDE_MS + 150);
  }, [finishSlide]);

  useEffect(() => {
    if (EMAIL_INTAKES.length <= 1) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const interval = setInterval(startSlide, ROTATE_MS);
    return () => {
      clearInterval(interval);
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [startSlide]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "transform") return;
    if (event.target !== event.currentTarget) return;
    finishSlide();
  };

  const prevAttachments = EMAIL_INTAKES[prevIndexRef.current].attachments;
  const nextAttachments = animating
    ? EMAIL_INTAKES[nextIndex].attachments
    : EMAIL_INTAKES[index].attachments;

  return (
    <>
      <div className="overflow-hidden">
        <div
          className="flex will-change-transform"
          style={{
            width: "200%",
            transform: animating ? "translateX(-50%)" : "translateX(0)",
            transition: animating ? `transform ${SLIDE_MS}ms ${MICRO_EASE}` : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="w-1/2 shrink-0">
            <EmailMessageBody {...EMAIL_INTAKES[index]} />
          </div>
          <div className="w-1/2 shrink-0">
            <EmailMessageBody {...EMAIL_INTAKES[nextIndex]} />
          </div>
        </div>
      </div>

      <EmailIntakeFooter
        prevAttachments={prevAttachments}
        nextAttachments={nextAttachments}
        animationKey={animationKey}
      />
    </>
  );
}

export default function WholesalerMock({ liveStats = false }: { liveStats?: boolean }) {
  const coverageStatClassName = "inline text-[0.50rem] tracking-wide font-heading font-medium text-[#111827]";

  return (
    <div className="relative -ml-32 w-full max-w-[290px]">
      <div className="absolute top-0 -right-32 z-20 w-full">
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3 border-b border-dashed border-[#CCCCCC] px-4 py-2.5">
            <span className="flex size-[23px] shrink-0 items-center justify-center border border-[#F3F4F6] rounded-full bg-[#F9FAFB]">
              <RiMailFill color="#6F6F6F" size={11} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-heading font-medium leading-tight text-[#3C3B3B]">
                Email Intake
              </p>
              <p className="truncate text-[0.60rem] font-heading font-normal leading-tight text-[#3C3B3B]">
                submissions@coverforce.com
              </p>
              {liveStats ? (
                <p className="mt-0.5 flex items-baseline gap-1 text-[0.55rem] font-sans text-[#4683E5]">
                  <PeriodicIncrementalStat
                    start={18}
                    step={1}
                    max={26}
                    intervalMs={ROTATE_MS}
                    className="text-[0.55rem] font-sans font-medium text-[#4683E5]"
                  />
                  <span>new today</span>
                </p>
              ) : null}
            </div>
          </div>

          <AnimatedEmailIntake />
        </div>
      </div>

      <div className="mt-[72px] w-full">
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
            <span className="flex size-[23px] shrink-0 items-center justify-center border border-[#F3F4F6] rounded-full bg-[#F9FAFB]">
              <RiFileTextFill color="#6F6F6F" size={11} />
            </span>
            <span className="text-xs font-heading font-medium leading-tight text-[#3C3B3B]">ACORD 25</span>
          </div>

          <AnimatedAcordInfoSection
            liveStats={liveStats}
            coverageStatClassName={coverageStatClassName}
          />

          <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
            <p className="text-[0.60rem] font-heading font-medium text-[#3C3B3B]">Limits Summary</p>
            <span className="text-[9px] font-sans text-[#4683E5]">View All</span>
          </div>

          <AnimatedLimitsList />

          <div className="flex items-center justify-between border-t border-[#CCCCCC] px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-blue-100">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path
                    d="M1 3l2 2 4-4"
                    stroke="#4683E5"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-[0.55rem] font-sans uppercase leading-tight tracking-wide text-[#4683E5]">
                  Verified
                </p>
                <p className="truncate text-[0.60rem] font-heading font-normal leading-tight text-[#9CA3AF]">
                  This certificate is valid.
                </p>
              </div>
            </div>
            <span className="truncate text-[0.60rem] font-heading font-normal leading-tight text-[#9CA3AF]">
              ACORD 25 Standard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
