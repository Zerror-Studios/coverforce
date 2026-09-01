"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import {
  containerPadding,
  getBottomBorderStyle,
} from "@/components/common/containerStyles";
import type { ReportMilestonesData } from "@/data/staticBlogDetails";
import {
  CARD_BACKGROUND_STYLES,
  REPORT_MILESTONE_THEMES,
} from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

const BORDER_COLOR = "#FFFFFF40";

type Milestone = {
  src: string;
  alt: string;
  year: string;
  title: string;
  description: string;
};

const milestones: Milestone[] = [
  {
    src: "/images/about/mil1.webp",
    alt: "CoverForce milestone 2022",
    year: "2022",
    title: "Partnered with ISU",
    description:
      "Our first customer - partnered with ISU Steadfast to build CoverForce from the ground up.",
  },
  {
    src: "/images/about/mil2.webp",
    alt: "CoverForce milestone 2023",
    year: "2023",
    title: "Nationwide launch",
    description:
      "Scaled carrier connectivity and launched admitted with 8 carriers across the country.",
  },
  {
    src: "/images/about/mil3.webp",
    alt: "CoverForce milestone 2025",
    year: "2025",
    title: "Launched E&S",
    description:
      "Introduced CoverForce to a broader audience - now powering 4 of the top 10 U.S. wholesalers.",
  },
  {
    src: "/images/about/mil4.webp",
    alt: "CoverForce milestone 2026",
    year: "2026",
    title: "First-in-market AI agents",
    description:
      "Deployed AI agents for bindable quoting in commercial lines. Launching the first bindable quote and instant bind E&S integrations with Nationwide, Markel, and Westchester.",
  },
];

const CLIP_HIDDEN_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const CLIP_FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const CLIP_HIDDEN_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

const IMAGE_TRAVEL = 18;

const MILESTONE_OVERLAY_GRADIENT =
  "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.7) 100%)";

const milestoneDisplayClassName =
  "font-heading text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl sm:leading-tight md:text-[4.5rem] md:leading-none lg:text-[3.5rem]";

function MilestoneContent({ milestone }: { milestone: Milestone }) {
  return (
    <div className="relative flex h-full flex-col">
      <div
        className="flex min-h-[42%] flex-col justify-end md:min-h-[45%]"
        style={getBottomBorderStyle(BORDER_COLOR)}
      >
        <div className={`${containerPadding} pb-8 md:pb-10`}>
          <p className={milestoneDisplayClassName}>{milestone.year}</p>
        </div>
      </div>

      <div
        className={`grid flex-1 content-start gap-6 pt-8 md:gap-8 md:pt-10 lg:grid-cols-[auto_minmax(0,40rem)] lg:items-start lg:justify-between lg:gap-10 lg:pt-12 ${containerPadding}`}
      >
        <EyebrowPill surface="dark" className="mb-0">
          Milestones
        </EyebrowPill>
        <div className="w-full lg:max-w-160 lg:justify-self-end">
          <h2 className={milestoneDisplayClassName}>{milestone.title}</h2>
          <p className="mt-4 max-w-xl font-sans text-sm font-semibold leading-[1.55] text-white md:text-xl md:leading-[1.6]">
            {milestone.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportMilestoneContent({
  sectionTitle,
  slides,
  activeIndex,
}: {
  sectionTitle: string;
  slides: ReportMilestonesData["slides"];
  activeIndex: number;
}) {
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex min-h-[34%] flex-col justify-end md:min-h-[38%]">
        <div
          className={`${containerPadding} relative z-10 flex w-full items-start justify-between gap-6 pb-4 md:pb-6`}
        >
          <h2 className="max-w-lg font-heading text-3xl font-medium leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.05]">
            {slides[activeIndex]?.title ?? sectionTitle}
          </h2>
          <p className="shrink-0 font-heading text-3xl font-medium leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.05]">
            {activeIndex + 1}/{slides.length}
          </p>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 top-[58%] z-10 ${containerPadding}`}
        aria-hidden
      >
        <span className="block h-0" style={getBottomBorderStyle("#FFFFFF")} />
      </div>

      <div
        className={`relative z-10 flex flex-1 flex-col justify-end pb-6 md:pb-8 lg:pb-10 ${containerPadding}`}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end lg:gap-16 xl:gap-20">
          <ul className="mb-0 flex flex-col gap-2.5 md:gap-3">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={`${slide.label}-${index}`}>
                  <EyebrowPill
                    surface="dark"
                    bare={!isActive}
                    className="mb-0!"
                  >
                    {slide.label}
                  </EyebrowPill>
                </li>
              );
            })}
          </ul>

          <p className="max-w-xl font-sans text-sm font-medium leading-[1.65] text-white md:text-base lg:justify-self-end lg:text-lg lg:leading-[1.7]">
            {slides[activeIndex]?.description}
          </p>
        </div>
      </div>
    </div>
  );
}

type MilestonesProps = {
  limit?: number;
  variant?: "about" | "report";
  reportMilestones?: ReportMilestonesData;
};

const Milestones = ({
  limit,
  variant = "about",
  reportMilestones,
}: MilestonesProps = {}) => {
  const aboutItems =
    limit != null ? milestones.slice(0, limit) : milestones;
  const isReport = variant === "report" && reportMilestones != null;
  const reportItems = reportMilestones?.slides ?? [];
  const items = isReport ? reportItems : aboutItems;
  const count = items.length;

  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageWrapRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      const ctx = gsap.context(() => {
        panelRefs.current.forEach((el, index) => {
          if (!el) return;
          gsap.set(el, {
            clipPath: index === 0 ? CLIP_FULL : CLIP_HIDDEN_BOTTOM,
          });
        });

        imageWrapRefs.current.forEach((el, index) => {
          if (!el) return;
          gsap.set(el, {
            yPercent: index === 0 ? 0 : IMAGE_TRAVEL,
            force3D: true,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * count}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        items.forEach((_, index) => {
          if (index === 0) return;

          const pos = index - 1;

          const prevPanel = panelRefs.current[index - 1];
          const currPanel = panelRefs.current[index];
          const prevImage = imageWrapRefs.current[index - 1];
          const currImage = imageWrapRefs.current[index];

          tl.to(prevPanel, { clipPath: CLIP_HIDDEN_TOP, duration: 1, ease: "none" }, pos);
          tl.to(prevImage, { yPercent: -IMAGE_TRAVEL, duration: 1, ease: "none" }, pos);

          tl.to(currPanel, { clipPath: CLIP_FULL, duration: 1, ease: "none" }, pos);
          tl.to(currImage, { yPercent: 0, duration: 1, ease: "none" }, pos);
        });
      }, section);

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);

      return () => {
        lenis?.off("scroll", onLenisScroll);
        ctx.revert();
      };
    },
    { scope: sectionRef, dependencies: [limit, variant, count] },
  );

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      data-header-surface="dark"
      className="relative w-full"
    >
      <div className="relative h-dvh min-h-dvh w-full overflow-hidden lg:h-svh lg:min-h-svh">
        {items.map((item, index) => {
          const reportSlide = isReport ? reportItems[index] : null;
          const aboutMilestone = !isReport ? (item as Milestone) : null;
          const panelKey = reportSlide?.title ?? aboutMilestone?.src ?? String(index);
          const milestoneTheme =
            REPORT_MILESTONE_THEMES[index % REPORT_MILESTONE_THEMES.length] ??
            "developer";

          return (
          <div
            key={panelKey}
            ref={(el) => {
              panelRefs.current[index] = el;
            }}
            className="absolute bottom-0 left-0 h-full w-full overflow-hidden"
            style={{
              clipPath: index === 0 ? CLIP_FULL : CLIP_HIDDEN_BOTTOM,
              zIndex: index + 1,
            }}
          >
            <div
              ref={(el) => {
                imageWrapRefs.current[index] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              {isReport ? (
                <div
                  className="absolute inset-0"
                  style={{ background: CARD_BACKGROUND_STYLES[milestoneTheme] }}
                  aria-hidden
                />
              ) : (
                <>
                  <Image
                    src={aboutMilestone!.src}
                    alt={aboutMilestone!.alt}
                    fill
                    priority={index === 0}
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: MILESTONE_OVERLAY_GRADIENT }}
                    aria-hidden
                  />
                </>
              )}
            </div>

            <div className="pointer-events-none absolute inset-0 z-10">
              <Container borderColor={BORDER_COLOR} className="h-full px-0!">
                {isReport && reportMilestones ? (
                  <ReportMilestoneContent
                    sectionTitle={reportMilestones.sectionTitle}
                    slides={reportMilestones.slides}
                    activeIndex={index}
                  />
                ) : aboutMilestone ? (
                  <MilestoneContent milestone={aboutMilestone} />
                ) : null}
              </Container>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
};

export default Milestones;
