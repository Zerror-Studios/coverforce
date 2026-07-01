"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    id: "submission-intelligence",
    label: "Submission Intelligence",
    image: "/images/product/intelligence1.svg",
    width: 467,
    height: 410,
    headline: (
      <>
        Every field extracted from ACORDs and loss runs with{" "}
        <span className="text-[#9AA8BC]">95%+ pre-fill accuracy</span> in
        seconds.
      </>
    ),
  },
  {
    id: "appetite-intelligence",
    label: "Appetite Intelligence",
    image: "/images/product/intelligence2.svg",
    width: 446,
    height: 418,
    headline: (
      <>
        Match risk to carrier appetite instantly with{" "}
        <span className="text-[#9AA8BC]">real-time appetite signals</span> across
        your book.
      </>
    ),
  },
  {
    id: "carrier-performance",
    label: "Carrier Performance",
    image: "/images/product/intelligence3.svg",
    width: 442,
    height: 428,
    headline: (
      <>
        See quote conversion and bind rates by carrier with{" "}
        <span className="text-[#9AA8BC]">named outcome analytics</span>.
      </>
    ),
  },
  {
    id: "pipeline-visibility",
    label: "Pipeline Visibility",
    image: "/images/product/intelligence4.svg",
    width: 479,
    height: 421,
    headline: (
      <>
        Track every submission across producers with{" "}
        <span className="text-[#9AA8BC]">100% pipeline visibility</span> in one
        dashboard.
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
      className={`flex w-full items-center gap-2 py-2 text-left font-mono text-[0.6875rem] font-medium leading-snug transition-colors duration-300 md:text-xs ${
        active ? "text-[#1A1A1A]" : "text-[#C8CDD6] hover:text-[#9AA8BC]"
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 lg:-translate-x-1/2 ${
          active ? "bg-[#1A1A1A]" : "bg-transparent"
        }`}
        aria-hidden
      />
      <span>{label}</span>
    </button>
  );
}

const FORWARD_ACTIVATION = 0.4;
const BACKWARD_ACTIVATION = 0.52;

const IntelligenceWorkFlow = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const headlineRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  useGSAP(
    () => {
      const cleanups = headlineRefs.current
        .filter((el): el is HTMLParagraphElement => Boolean(el))
        .map((headline) =>
          animateSplitTextReveal(headline, {
            trigger: headline,
            theme: "light",
            splitSelf: true,
            start: "top 80%",
            end: "top 45%",
          }),
        );

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef },
  );

  const scrollToPanel = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    panelRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    const panels = panelRefs.current.filter(Boolean) as HTMLElement[];
    if (!panels.length) return;

    let ticking = false;

    const updateActiveIndex = () => {
      const vh = window.innerHeight;
      let index = activeIndexRef.current;

      while (index < panels.length - 1) {
        const nextTop = panels[index + 1].getBoundingClientRect().top;
        if (nextTop <= vh * FORWARD_ACTIVATION) index += 1;
        else break;
      }

      while (index > 0) {
        const currentTop = panels[index].getBoundingClientRect().top;
        if (currentTop > vh * BACKWARD_ACTIVATION) index -= 1;
        else break;
      }

      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActiveIndex);
    };

    updateActiveIndex();
    window.addEventListener("scroll", onScroll, { passive: true });
    const lenis = window.lenis;
    lenis?.on("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis?.off("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white text-[#0a143b]"
    >
      <Container borderColor="#53535340">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end space-y-5">
              <h2
                ref={headingRef}
                className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>The full distribution intelligence <br /> stack</span>
              </h2>
            </div>

            <div className="flex max-w-md flex-col items-end gap-6 text-left lg:ml-auto">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                Submission intelligence, appetite matching, and carrier analytics
                with AI embedded at every step.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-12 md:mt-14 lg:mt-16 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            <aside className="lg:-ml-6 lg:sticky lg:top-28 lg:self-start">
              <nav className="flex flex-row gap-6 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
                {WORKFLOW_STEPS.map((step, index) => (
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
              {WORKFLOW_STEPS.map((step, index) => (
                <article
                  key={step.id}
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="flex min-h-[70vh] flex-col justify-center gap-10 py-10 first:pt-0 last:pb-0 md:min-h-[80vh] md:gap-12 lg:min-h-screen lg:py-16"
                >
                  <p
                    ref={(el) => {
                      headlineRefs.current[index] = el;
                    }}
                    className="max-w-3xl text-left font-heading text-2xl font-regular leading-[1.35] tracking-tight text-[#1A1A1A] md:text-3xl lg:text-[2rem] lg:leading-[1.3]"
                  >
                    {step.headline}
                  </p>

                  <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
                    <Image
                      src={step.image}
                      alt={`${step.label} preview`}
                      width={step.width}
                      height={step.height}
                      className="h-auto w-full"
                      sizes="(max-width: 768px) 280px, 400px"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default IntelligenceWorkFlow;
