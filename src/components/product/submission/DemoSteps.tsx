"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Container from "@/components/common/Container";

const DEMO_STEPS = [
  {
    id: "doc-reader",
    label: "AI DOC READER",
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
    label: "AI INBOX",
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
    label: "AI UW CO-PILOT",
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
    label: "AI CODEMATCH",
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
    label: "AI SMARTFORM",
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
    label: "AI COI GENERATOR",
    image: "/images/product/demo5.svg",
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
      className={`flex w-full items-center gap-2 py-2 text-left font-mono text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-300 md:text-[0.8125rem] ${
        active ? "text-white" : "text-white/35 hover:text-white/55"
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 ${
          active ? "bg-white" : "bg-transparent"
        }`}
        aria-hidden
      />
      <span>{label}</span>
    </button>
  );
}

const DemoSteps = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);

  const scrollToPanel = useCallback((index: number) => {
    panelRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    const panels = panelRefs.current.filter(Boolean) as HTMLElement[];
    if (!panels.length) return;

    const observer = new IntersectionObserver(
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
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#121C49] text-white">
      <Container borderColor="#FFFFFF33" className="border-t border-[#FFFFFF1A]">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(11rem,16rem)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <nav className="flex flex-row gap-6 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
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
                <article
                  key={step.id}
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="flex min-h-[70vh] flex-col justify-center gap-10 py-10 first:pt-0 last:pb-0 md:min-h-[80vh] md:gap-12 lg:min-h-screen lg:py-16"
                >
                  <p className="max-w-3xl indent-12 text-left font-heading text-2xl font-regular leading-[1.35] tracking-tight text-white md:indent-16 md:text-3xl lg:indent-20 lg:text-[2rem] lg:leading-[1.3]">
                    {step.headline}
                  </p>

                  <div className="relative w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                    <Image
                      src={step.image}
                      alt={`${step.label} preview`}
                      width={740}
                      height={320}
                      className="h-auto w-full"
                      sizes="(max-width: 1280px) 100vw, 740px"
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

export default DemoSteps;
