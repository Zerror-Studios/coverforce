"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

const DEMO_STEPS = [
  {
    id: "doc-reader",
    label: "AI Doc Reader",
    image: "/images/product/demo1.svg",
    headline: (
      <>
        Uploads any ACORD, loss run, or prior policy. Extracts{" "}
        <span className="text-[#9AA8BC]">structured fields</span> and pre-fills
        the application in under 4 seconds.
      </>
    ),
  },
  {
    id: "inbox",
    label: "AI Inbox",
    image: "/images/product/demo2.svg",
    headline: (
      <>
        Routes submissions from email automatically. Parses attachments and
        surfaces <span className="text-[#9AA8BC]">ready-to-quote</span> risks
        without manual triage.
      </>
    ),
  },
  {
    id: "uw-copilot",
    label: "AI UW Co-Pilot",
    image: "/images/product/demo3.svg",
    headline: (
      <>
        Flags appetite gaps and missing data before bind. Gives underwriters{" "}
        <span className="text-[#9AA8BC]">actionable context</span> on every
        submission in seconds.
      </>
    ),
  },
  {
    id: "codematch",
    label: "AI CodeMatch",
    image: "/images/product/demo4.svg",
    headline: (
      <>
        Maps NAICS and class codes across carriers instantly. Matches risk to{" "}
        <span className="text-[#9AA8BC]">the right appetite</span> before you
        quote.
      </>
    ),
  },
  {
    id: "smartform",
    label: "AI SmartForm",
    image: "/images/product/demo5.svg",
    headline: (
      <>
        Pre-fills carrier-specific questions from prior submissions. Cuts
        repetitive data entry with{" "}
        <span className="text-[#9AA8BC]">95%+ accuracy</span> across formats.
      </>
    ),
  },
  {
    id: "coi-generator",
    label: "AI COI Generator",
    image: "/images/product/demo6.svg",
    headline: (
      <>
        Issues certificates of insurance on demand. Delivers compliant COIs with{" "}
        <span className="text-[#9AA8BC]">policy-accurate limits</span> in one
        click.
      </>
    ),
  },
] as const;

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-2.5 py-2 text-left font-heading text-[0.9375rem] font-regular leading-none tracking-normal transition-colors duration-300 lg:gap-0 lg:pl-[0.8125rem] ${
        active ? "text-white" : "text-white/35 hover:text-white/55"
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 lg:absolute lg:left-0 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 ${
          active ? "bg-white" : "bg-transparent"
        }`}
        aria-hidden
      />
      <span>{label}</span>
    </button>
  );
}

function DemoStepPanel({
  step,
  index,
  panelRef,
  headlineRef,
  imageRef,
  className,
}: {
  step: (typeof DEMO_STEPS)[number];
  index: number;
  panelRef: (el: HTMLElement | null) => void;
  headlineRef: (el: HTMLParagraphElement | null) => void;
  imageRef: (el: HTMLDivElement | null) => void;
  className: string;
}) {
  return (
    <article ref={panelRef} data-index={index} className={className}>
      <p
        ref={headlineRef}
        className="max-w-3xl text-left font-heading text-2xl font-regular leading-[1.25] tracking-tight text-white sm:text-3xl sm:leading-[1.3] md:text-3xl md:leading-[1.35] lg:text-[2rem] lg:leading-[1.3]"
      >
        {step.headline}
      </p>

      <div
        ref={imageRef}
        className="relative mr-auto w-full max-w-[350px] sm:max-w-[400px] md:max-w-[640px] lg:max-w-[800px]"
      >
        <Image
          src={step.image}
          alt={`${step.label} preview`}
          width={800}
          height={346}
          className="h-auto w-full"
          sizes="(max-width: 640px) 350px, (max-width: 768px) 400px, (max-width: 1024px) 640px, 800px"
        />
      </div>
    </article>
  );
}

const DemoSteps = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const mobilePanelRefs = useRef<Array<HTMLElement | null>>([]);
  const headlineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const mobileHeadlineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileImageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      const headlines = (isLg ? headlineRefs : mobileHeadlineRefs).current.filter(
        (el): el is HTMLParagraphElement => Boolean(el),
      );
      const images = (isLg ? imageRefs : mobileImageRefs).current.filter(
        (el): el is HTMLDivElement => Boolean(el),
      );

      const cleanups = headlines.map((headline) =>
        animateSplitTextReveal(headline, {
          trigger: headline,
          theme: "dark",
          splitSelf: true,
          start: "top 80%",
          end: "top 45%",
        }),
      );

      images.forEach((image) => {
        gsap.fromTo(
          image,
          { y: 40 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top 100%",
              end: "top 68%",
              scrub: 0.3,
            },
          },
        );
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef },
  );

  const scrollToPanel = useCallback((index: number) => {
    const isLg = window.matchMedia("(min-width: 1024px)").matches;
    const refs = isLg ? panelRefs : mobilePanelRefs;
    refs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      observer?.disconnect();

      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      const panels = (isLg ? panelRefs : mobilePanelRefs).current.filter(
        Boolean,
      ) as HTMLElement[];

      if (!panels.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (!visible.length) return;

          const index = Number(visible[0].target.getAttribute("data-index"));
          if (!Number.isNaN(index)) setActiveIndex(index);
        },
        {
          root: null,
          rootMargin: isLg ? "-20% 0px -55% 0px" : "-20% 0px -45% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      );

      panels.forEach((panel) => observer?.observe(panel));
    };

    setupObserver();

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    mediaQuery.addEventListener("change", setupObserver);

    return () => {
      mediaQuery.removeEventListener("change", setupObserver);
      observer?.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33">
        <div className="py-16 md:py-20 lg:py-24">
          {/* Mobile: nav item + step stacked */}
          <div className="flex flex-col gap-12 lg:hidden">
            {DEMO_STEPS.map((step, index) => (
              <div key={step.id}>
                <NavItem
                  label={step.label}
                  active={activeIndex === index}
                  onClick={() => scrollToPanel(index)}
                />
                <DemoStepPanel
                  step={step}
                  index={index}
                  panelRef={(el) => {
                    mobilePanelRefs.current[index] = el;
                  }}
                  headlineRef={(el) => {
                    mobileHeadlineRefs.current[index] = el;
                  }}
                  imageRef={(el) => {
                    mobileImageRefs.current[index] = el;
                  }}
                  className="mt-5 flex flex-col gap-6"
                />
              </div>
            ))}
          </div>

          {/* Desktop: sticky nav + scroll panels */}
          <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(11rem,16rem)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <nav className="flex flex-col gap-0">
                {DEMO_STEPS.map((step, index) => (
                  <NavItem
                    key={step.id}
                    label={step.label}
                    active={activeIndex === index}
                    onClick={() => scrollToPanel(index)}
                  />
                ))}
              </nav>
            </aside>

            <div className="min-w-0">
              {DEMO_STEPS.map((step, index) => (
                <DemoStepPanel
                  key={step.id}
                  step={step}
                  index={index}
                  panelRef={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  headlineRef={(el) => {
                    headlineRefs.current[index] = el;
                  }}
                  imageRef={(el) => {
                    imageRefs.current[index] = el;
                  }}
                  className="flex flex-col gap-10 pb-16 last:pb-0 md:gap-12 md:pb-20 lg:pb-24"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DemoSteps;
