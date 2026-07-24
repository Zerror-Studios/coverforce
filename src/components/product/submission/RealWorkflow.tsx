"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Document Intake",
    category: "INTAKE",
    without: "50 MIN",
    withLabel: "8 sec",
    meta: "WITHOUT COVERFORCE — 50 MIN — MANUAL ENTRY",
  },
  {
    step: "02",
    title: "Carrier data entry",
    category: "DATA ENTRY",
    without: "15 MIN",
    withLabel: "3 mins",
    meta: "WITHOUT COVERFORCE — 15 MIN — REKEYING",
  },
  {
    step: "03",
    title: "Review & Submit",
    category: "REVIEW",
    without: "HOURS",
    withLabel: "~3 mins",
    meta: "WITHOUT COVERFORCE — HOURS — MANUAL CHECKS",
  },
  {
    step: "04",
    title: "Quoting",
    category: "QUOTING",
    without: "45 MIN",
    withLabel: "4 sec",
    meta: "WITHOUT COVERFORCE — 45 MIN — PORTAL HOPS",
  },
  {
    step: "05",
    title: "Bind and Deliver",
    category: "BIND",
    without: "5 MIN",
    withLabel: "1 min",
    meta: "WITHOUT COVERFORCE — 5 MIN — HANDOFF DELAY",
  },
] as const;

type WorkflowStep = (typeof WORKFLOW_STEPS)[number];

function WorkflowRow({
  item,
  active,
  hovered,
  onActivate,
}: {
  item: WorkflowStep;
  active: boolean;
  hovered: boolean;
  onActivate: () => void;
}) {
  const shutter =
    "transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]";

  return (
    <li
      data-workflow-row
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      }}
      className="group relative grid cursor-pointer grid-cols-[minmax(0,1.35fr)_auto_minmax(0,0.65fr)] items-stretch gap-3 border-t border-white/25 outline-none md:gap-4 lg:gap-5"
    >
      {/* Horizontal shutters — hover only, open from center like the vertical line */}
      <span
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 h-[0.5px] scale-y-80 origin-center bg-white ${shutter} ${
          hovered ? "scale-x-100" : "scale-x-0"
        }`}
        aria-hidden
      />
      <span
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[0.5px] scale-y-80 origin-center bg-white ${shutter} ${
          hovered ? "scale-x-100" : "scale-x-0"
        }`}
        aria-hidden
      />

      {/* Left: without meta + title */}
      <div className="relative flex min-w-0 items-center py-6 pr-1 md:py-8 md:pr-2 lg:py-9">
        <p
          className={`pointer-events-none absolute left-0 top-1/2 hidden max-w-40 -translate-y-1/2 text-left font-mono text-[0.5625rem] font-medium uppercase leading-relaxed tracking-[0.08em] text-white/55 transition-opacity duration-300 md:block md:max-w-52 md:text-[0.625rem] lg:max-w-56 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        >
          [ {item.meta} ]
        </p>
        <div className="w-full">
          <span
            className={`block text-right font-heading text-2xl font-medium leading-[1.15] tracking-tight transition-colors duration-300 sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12] ${
              active ? "text-white" : "text-white/40"
            }`}
          >
            {item.title}
          </span>
          <p
            className={`mt-1 text-right font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-white/50 transition-opacity duration-300 md:hidden ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            Without · {item.without}
          </p>
        </div>
      </div>

      {/* Number column stretches the full row height */}
      <div className="relative z-10 flex items-center justify-center">
        <span
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/20"
          aria-hidden
        />
        <span
          className={`pointer-events-none absolute inset-y-0 left-1/2 w-px origin-top -translate-x-1/2 bg-white ${shutter} ${
            active ? "scale-y-100" : "scale-y-0"
          }`}
          aria-hidden
        />
        <span
          className={`relative flex h-6 w-8 shrink-0 items-center justify-center overflow-hidden border font-mono text-[0.625rem] font-medium tabular-nums md:h-7 md:w-9 md:text-[0.6875rem] ${
            active ? "border-white/40" : "border-white/35"
          }`}
        >
          <span className="absolute inset-0 bg-[#151f4d]" aria-hidden />
          <span
            className={`absolute inset-x-0 top-0 origin-top bg-white ${shutter} ${
              active ? "h-full scale-y-100" : "h-full scale-y-0"
            }`}
            aria-hidden
          />
          <span
            className={`relative z-10 transition-colors duration-300 ${
              active ? "delay-150 text-[#151f4d]" : "text-white/70"
            }`}
          >
            {item.step}
          </span>
        </span>
      </div>

      {/* Right: category + with CoverForce detail */}
      <div className="relative flex min-w-0 items-center py-6 pl-1 md:py-8 md:pl-2 lg:py-9">
        <div className="min-w-0">
          <p
            className={`font-mono text-[0.5625rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 md:text-[0.625rem] ${
              active ? "text-white/80" : "text-white/45"
            }`}
          >
            {item.category}
          </p>
          <p
            className={`mt-1 font-heading text-xs font-regular leading-snug text-white/85 transition-all duration-300 md:text-sm ${
              active
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            {item.withLabel}
          </p>
        </div>
      </div>
    </li>
  );
}

const RealWorkflow = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-workflow-row]", list);
      if (!rows.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(rows, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(rows, { opacity: 0, y: 28 });

      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: list,
          start: "top 80%",
          once: true,
        },
        onComplete: () => gsap.set(rows, { clearProps: "transform" }),
      });

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
    { scope: listRef },
  );

  return (
    <section ref={sectionRef} className="bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col items-start gap-6">
              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Move from 115 minutes</span>
                <br />
                <span data-split>to 8 minutes.</span>
              </h2>
              <RequestDemoButton variant="primary" surface="on-dark">
                Request Demo
              </RequestDemoButton>
            </div>

            <div className="flex max-w-md flex-col items-start text-left lg:ml-auto lg:items-end">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-white/75 md:text-[1.125rem] lg:text-right"
              >
                Without CoverForce vs with CoverForce — each step of submission,
                side by side.
              </p>
            </div>
          </div>

          <ul
            ref={listRef}
            className="relative mt-14 border-b border-white/25 md:mt-16 lg:mt-20"
            onMouseLeave={() => {
              setHoveredStep(null);
              setActiveStep(0);
            }}
          >
            {WORKFLOW_STEPS.map((item, index) => (
              <WorkflowRow
                key={item.step}
                item={item}
                active={activeStep === index}
                hovered={hoveredStep === index}
                onActivate={() => {
                  setHoveredStep(index);
                  setActiveStep(index);
                }}
              />
            ))}
          </ul>

          <p className="mt-8 font-heading text-sm font-regular text-white/60 md:text-base">
            <span className="text-white">107 minutes</span> saved per submission
          </p>
        </div>
      </Container>
    </section>
  );
};

export default RealWorkflow;
