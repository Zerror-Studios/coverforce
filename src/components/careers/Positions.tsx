"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { containerPadding, getBottomBorderStyle } from "@/components/common/containerStyles";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import type { JobCategory, JobListing } from "@/lib/doverJobs";

gsap.registerPlugin(ScrollTrigger);

const BORDER_COLOR = "#FFFFFF33";

const TABLE_GRID =
  "lg:grid lg:grid-cols-[minmax(0,1fr)_16rem_8rem_auto] lg:gap-x-6";

const ROW_BASE =
  `flex flex-col gap-y-2 ${containerPadding} lg:grid lg:col-span-full lg:grid-cols-subgrid lg:items-center lg:gap-x-6 lg:gap-y-0`;

const JOB_ROW_LAYOUT =
  "sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-x-6 sm:gap-y-2 lg:grid-cols-subgrid lg:items-center lg:gap-y-0";

const COL_LOCATION =
  "font-mono text-sm font-medium uppercase text-white/55 lg:justify-self-start lg:text-left lg:whitespace-nowrap";

const COL_TYPE = COL_LOCATION;

const COL_HEADER =
  "hidden font-heading text-base font-medium text-white lg:block lg:justify-self-start lg:text-left";

function JobRow({ job }: { job: JobListing }) {
  return (
    <article
      className={`positions-row ${ROW_BASE} ${JOB_ROW_LAYOUT} py-5 lg:py-6`}
      style={getBottomBorderStyle(BORDER_COLOR)}
    >
      <h3 className="max-w-sm font-heading text-base font-semibold leading-snug text-white sm:col-start-1 sm:row-start-1 md:text-xl md:font-medium lg:col-auto lg:row-auto">
        {job.title}
      </h3>

      <div className="flex items-center gap-x-4 sm:col-start-1 sm:row-start-2 lg:col-auto lg:row-auto lg:contents">
        <p className={COL_LOCATION}>{job.location}</p>
        <p className={COL_TYPE}>{job.type}</p>
      </div>

      <div className="flex justify-start pt-2 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:justify-end sm:justify-self-end sm:self-start sm:pt-0 lg:col-auto lg:row-auto lg:row-span-1 lg:justify-self-end lg:self-center">
        <Button href={job.href} target={job.target} rel={job.rel} size="sm" surface="on-dark">
          Apply
        </Button>
      </div>
    </article>
  );
}

function JobCategoryBlock({ category }: { category: JobCategory }) {
  return (
    <div className={`mt-14 first:mt-0 md:mt-16 ${TABLE_GRID}`}>
      <div className={`positions-row ${ROW_BASE} py-4 lg:py-5`}>
        <p className="font-heading text-base font-medium text-white md:text-[0.9375rem]">
          {category.name}
        </p>
        <p className={COL_HEADER}>Location</p>
        <p className={COL_HEADER}>Type</p>
        <span className="hidden lg:block" aria-hidden />
      </div>

      {category.jobs.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </div>
  );
}

type PositionsProps = {
  categories: JobCategory[];
};

const Positions = ({ categories }: PositionsProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const positionsListRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    theme: "dark",
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      const overlay = overlayRef.current;
      const list = positionsListRef.current;
      if (!section || !container || !overlay || !list) return;

      const rows = gsap.utils.toArray<HTMLElement>(".positions-row", list);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isSmallDevice = window.matchMedia("(max-width: 1023px)").matches;

      const tweens: gsap.core.Tween[] = [];

      if (reducedMotion) {
        gsap.set(rows, { opacity: 1, y: 0, clearProps: "transform" });
      } else if (rows.length) {
        gsap.set(rows, { opacity: 0, y: 28 });

        rows.forEach((row) => {
          tweens.push(
            gsap.to(row, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                toggleActions: "play none none none",
                once: true,
              },
            }),
          );
        });
      }

      gsap.set(container, {
        y: 0,
        scale: 1,
        force3D: true,
        transformOrigin: "50% 50%",
        backfaceVisibility: "hidden",
      });
      gsap.set(overlay, { opacity: 0, pointerEvents: "none" });

      let parallaxTl: gsap.core.Timeline | null = null;
      let overlayTl: gsap.core.Timeline | null = null;

      if (!reducedMotion && !isSmallDevice) {
        const getShift = () => container.offsetHeight;
        const scrollEnd = "bottom -180%";
        const scrollConfig = {
          trigger: section,
          scrub: 0.35,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        };

        parallaxTl = gsap.timeline({
          scrollTrigger: {
            ...scrollConfig,
            start: "bottom bottom",
            end: scrollEnd,
          },
        });

        parallaxTl.to(container, {
          y: getShift,
          scale: 0.8,
          ease: "none",
          force3D: true,
        });

        overlayTl = gsap.timeline({
          scrollTrigger: {
            ...scrollConfig,
            start: "bottom center",
            end: scrollEnd,
          },
        });

        overlayTl.to(overlay, {
          opacity: 0.85,
          ease: "none",
        });
      }

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
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        parallaxTl?.scrollTrigger?.kill();
        parallaxTl?.kill();
        overlayTl?.scrollTrigger?.kill();
        overlayTl?.kill();
      };
    },
    { scope: sectionRef, dependencies: [categories] },
  );

  return (
    <section
      id="positions"
      ref={sectionRef}
      className="relative z-30 overflow-hidden bg-[#151f4d] text-white"
    >
      <div ref={containerRef} className="relative z-10 overflow-hidden lg:will-change-transform">
        <Container borderColor="#FFFFFF33" className="relative !px-0">
          <SectionRadialGlow className="absolute left-1/2 top-[10%] z-0 -translate-x-1/2 opacity-70 md:top-[12%]" />

          <div className="relative z-10 py-16 md:py-20 lg:py-24">
            <div
              ref={headerRef}
              className={`flex flex-col items-start justify-end space-y-5 ${containerPadding}`}
            >
              <EyebrowPill surface="dark" className="mb-0">
                Open Positions
              </EyebrowPill>

              <h2
                ref={headingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Join Our Growing Team</span>
              </h2>
            </div>

            <div ref={positionsListRef} className="mt-14 md:mt-16 lg:mt-20">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <JobCategoryBlock key={category.name} category={category} />
                ))
              ) : (
                <p
                  className={`${containerPadding} font-sans text-sm text-white/70 md:text-base`}
                >
                  No open positions right now. Check back soon.
                </p>
              )}
            </div>
          </div>
        </Container>
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 bg-[#080808]"
        aria-hidden
      />
    </section>
  );
};

export default Positions;
