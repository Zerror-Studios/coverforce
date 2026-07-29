"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Document Intake",
    category: "Intake",
    without: "50 MIN",
    withLabel: " 8 sec",
    meta: " 50 min — Manual Entry",
  },
  {
    step: "02",
    title: "Carrier data entry",
    category: "Data Entry",
    without: "15 MIN",
    withLabel: " 3 mins",
    meta: " 15 min — Rekeying",
  },
  {
    step: "03",
    title: "Review & Submit",
    category: "Review",
    without: "HOURS",
    withLabel: " 3 mins",
    meta: " Hours — Manual Checks",
  },
  {
    step: "04",
    title: "Quoting",
    category: "Quoting",
    without: "45 MIN",
    withLabel: " 4 sec",
    meta: " 45 min — Portal Hops",
  },
  {
    step: "05",
    title: "Bind and Deliver",
    category: "Bind",
    without: "5 MIN",
    withLabel: " 1 min",
    meta: " 5 min — Handoff Delay",
  },
] as const;

type WorkflowStep = (typeof WORKFLOW_STEPS)[number];

function WorkflowRow({ item }: { item: WorkflowStep }) {
  return (
    <li
      data-workflow-row
      className="group relative grid grid-cols-2 md:grid-cols-3 items-stretch border-t border-white/25"
    >
      {/* Top border shutter on hover */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 -translate-y-px h-[1px] bg-white scale-x-0 origin-center transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100 z-20"
        aria-hidden
      />
      {/* Bottom border shutter on hover */}
      <span
        className="pointer-events-none absolute inset-x-0 translate-y-px bottom-0 h-[1px] bg-white scale-x-0 origin-center transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100 z-20"
        aria-hidden
      />
      {/* Left: title only */}
      <div className="flex max-sm:col-span-2 min-w-0 items-center py-2  md:py-8  lg:py-9">
        <span
          className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.12em] md:text-[0.625rem] opacity-30"
          data-row-title
        >
          {item.title}
        </span>
      </div>

      {/* Right: meta · number · category · withLabel */}
      <div className="col-span-2  relative flex min-w-0 items-center py-4 md:py-8 lg:py-9">
        <div className="grid grid-cols-3 items-center md:grid-cols-[1.5fr_0.3fr_1fr] w-full">
          <span
            className="block md:text-end font-heading text-base font-medium leading-[1.15] tracking-tight sm:text-3xl sm:leading-[1.12] md:text-lg lg:text-[1.625rem] lg:leading-[1.12] opacity-30"
            data-row-meta
          >
            {item.meta}
          </span>

          {/* Number badge */}
          <div className="flex items-center justify-center" data-row-badge-wrap>
            <span
              className="relative flex h-6 w-8 shrink-0 items-center justify-center overflow-hidden border border-white/35 font-mono text-[0.625rem] font-medium tabular-nums md:h-7 md:w-9 md:text-[0.6875rem]"
              data-row-badge
            >
              <span className="absolute inset-0 bg-[#151f4d]" aria-hidden />
              <span
                className="absolute inset-x-0 top-0 origin-top bg-white h-full scale-y-0"
                aria-hidden
                data-row-badge-fill
              />
              <span
                className="relative z-10 text-white/70"
                data-row-badge-text
              >
                {item.step}
              </span>
            </span>
          </div>

          <div className="flex gap-x-2 max-sm:justify-end">
            <span
              className="block font-heading text-base whitespace-nowrap font-medium leading-[1.15] tracking-tight sm:text-3xl sm:leading-[1.12] md:text-lg lg:text-[1.625rem] lg:leading-[1.12] opacity-30"
              data-row-category
            >
              {item.category}
              {item.withLabel}
            </span>
          </div>
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

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  // Row entrance animation
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

  // Scroll-driven line + row activation animation
  useGSAP(
    () => {
      const filParen = document.querySelector<HTMLElement>(".fil_paren");
      const filLine = document.querySelector<HTMLElement>(".fil_line");
      const animBox = document.querySelector<HTMLElement>(".anim_box");
      const animBoxContent = document.querySelector<HTMLElement>(".anim_box_content");
      if (!filParen || !filLine || !animBox) return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-workflow-row]");
      if (!rows.length) return;

      const totalSteps = rows.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: filParen,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      tl.to(
        filLine,
        {
          height: "100%",
          ease: "none",
          duration: totalSteps,
        },
        0,
      );
      tl.to(
        animBox,
        {
          height: "0.5rem",
          width: "0.5rem",
          ease: "power2.out",
          duration: 0.25,
        },
        0,
      );

      // For each row, calculate its exact position relative to fil_paren
      const parenHeight = filParen.offsetHeight;

      rows.forEach((row, i) => {
        const titleEl = row.querySelector("[data-row-title]");
        const metaEl = row.querySelector("[data-row-meta]");
        const categoryEl = row.querySelector("[data-row-category]");
        const withEl = row.querySelector("[data-row-with]");
        const badgeFill = row.querySelector("[data-row-badge-fill]");
        const badgeText = row.querySelector("[data-row-badge-text]");
        const badgeWrap = row.querySelector("[data-row-badge-wrap]");

        if (!badgeWrap) return;

        // Calculate badge top and bottom relative to fil_paren top
        const parenRect = filParen.getBoundingClientRect();
        const badgeRect = badgeWrap.getBoundingClientRect();

        const relativeTop = badgeRect.top - parenRect.top;
        const relativeBottom = badgeRect.bottom - parenRect.top;

        const startProgress = Math.max(0, Math.min(1, relativeTop / parenHeight));
        const endProgress = Math.max(0, Math.min(1, relativeBottom / parenHeight));

        const startAt = startProgress * totalSteps;
        const duration = (endProgress - startProgress) * totalSteps;

        // Activate row text — opacity 0.3 → 1 in sync with badge passing
        tl.to(
          [titleEl, metaEl, categoryEl, withEl].filter(Boolean),
          { opacity: 1, duration: duration, ease: "none" },
          startAt,
        );

        // Fill the number badge white exactly as the line passes through it
        if (badgeFill) {
          tl.to(
            badgeFill,
            { scaleY: 1, duration: duration, ease: "none" },
            startAt,
          );
        }

        // Change badge text color to dark in sync
        if (badgeText) {
          tl.to(
            badgeText,
            { color: "#151f4d", duration: duration * 0.5 },
            startAt + duration * 0.5,
          );
        }
      });

      // After line completes → expand anim_box into a white summary card
      tl.to(
        animBox,
        {
          height: "10rem",
          width: "25rem",
          backgroundColor: "#ffffff",
          borderRadius: "0.25rem",
          duration: 1.2,
          ease: "power2.out",
        },
        totalSteps - 0.1,
      );

      // Fade in the content inside the box
      if (animBoxContent) {
        tl.to(
          [animBoxContent, ".last_txt"],
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          totalSteps + 0.5,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-[#151f4d] text-white max-sm:pb-20">
      <Container borderColor="#FFFFFF33">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col items-start gap-6">
              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-white sm:text-3xl sm:leading-[1.12] md:text-lg lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Move from 115 minutes</span>
                <br />
                <span data-split>to 8 minutes.</span>
              </h2>
              <RequestDemoButton variant="primary" surface="on-dark">
                Contact us
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
          >
            <div className="grid grid-cols-3">
              <div className="col-span-1 max-sm:hidden"></div>

              <div className="w-full col-span-3 md:col-span-2 grid grid-cols-3 md:grid-cols-[1.5fr_0.3fr_1fr]">
                <div className="md:text-end opacity-60">
                  <p className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.12em] md:text-[0.625rem]">
                    Without Coverforce
                  </p>
                </div>
                <div className="flex items-center justify-center relative">
                  <div className="fil_paren absolute w-[2px] h-[45rem] top-[100%]">
                    <div className="fil_line w-full h-[0%] bg-white flex justify-center items-end">
                      <div className="anim_box h-0 w-0 bg-white shrink-0 flex items-center justify-center overflow-hidden">
                        {/* Summary card content — visible when expanded */}
                        <div className="anim_box_content opacity-0 text-center px-6 flex flex-col items-center justify-center gap-2">
                          <div className="relative w-32 h-6 flex shrink-0">
                            <Image
                              src="/Coverforce_logo_blue.svg"
                              alt="CoverForce Logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="font-heading text-lg md:text-[1.375rem] font-semibold leading-snug tracking-tight text-[#151f4d] whitespace-normal max-w-[22rem]">
                            107 minutes saved with CoverForce
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-60 max-sm:text-end">
                  <p className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.12em] md:text-[0.625rem]">
                    With Coverforce
                  </p>
                </div>
              </div>
            </div>
            {WORKFLOW_STEPS.map((item) => (
              <WorkflowRow key={item.step} item={item} />
            ))}

          </ul>
          <p className=" last_txt font-mono pt-7 md:pt-30 text-[0.5625rem] font-medium uppercase tracking-[0.12em] md:text-[0.625rem] opacity-30">
            saved per submission
          </p>
        </div>
      </Container>
    </section>
  );
};

export default RealWorkflow;
