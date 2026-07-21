"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { CARD_BACKGROUND_STYLES, type CardBackground } from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

type WorkflowProps = {
  coverforceBackground?: CardBackground;
};

type ComparisonItem = {
  title: string;
  description: string;
};

const todayItems: ComparisonItem[] = [
  {
    title: "Manual PDF Data Entry",
    description:
      "Underwriters spend 40% of their day re-typing information from Acord forms into carrier portals.",
  },
  {
    title: "Blind Submission Routing",
    description:
      "Submissions get routed to carriers without appetite checks — producers waste days quoting risks that were never going to bind.",
  },
  {
    title: "Incomplete Submissions",
    description:
      "Missing ACORD fields, loss runs, and supplemental forms stall underwriting before a quote can even begin.",
  },
];

const coverforceItems: ComparisonItem[] = [
  {
    title: "AI Document Ingestion",
    description:
      "95% accuracy in extracting data from unstructured PDFs and emails in seconds.",
  },
  {
    title: "Instant Appetite Matching",
    description:
      "Automatically route to the carrier most likely to bind based on historical data.",
  },
  {
    title: "Automated Enrichment",
    description:
      "Integrations with 3rd party data sources automatically fill in missing firmographic details.",
  },
];

function ComparisonPanel({
  tone,
  items,
  coverforceBackground = "broker",
}: {
  tone: "today" | "coverforce";
  items: ComparisonItem[];
  coverforceBackground?: CardBackground;
}) {
  const isToday = tone === "today";

  return (
    <div
      className={`workflow-comparison-card flex min-h-[28rem] flex-col rounded-md px-6 py-8 sm:min-h-[32rem] sm:px-8 sm:py-10 md:min-h-[36rem] md:px-10 md:py-12 lg:min-h-[40rem] ${
        isToday ? "bg-[#F5F5F7]" : ""
      }`}
      style={isToday ? undefined : { background: CARD_BACKGROUND_STYLES[coverforceBackground] }}
    >
      <EyebrowPill
        surface={isToday ? "light" : "dark"}
        background={isToday ? undefined : "#FFFFFF"}
        dotColor={isToday ? undefined : "#151f4d"}
        className={`mb-0 ${isToday ? "" : "text-[#151f4d]!"}`}
      >
        {isToday ? "Traditional workflow tools" : "With CoverForce"}
      </EyebrowPill>

      <div className="mt-auto flex flex-col gap-10 pt-16 sm:gap-12 sm:pt-20 md:gap-14 md:pt-24 lg:gap-16 lg:pt-28">
        {items.map((item) => (
          <div key={item.title}>
            <h3
              className={`font-heading text-lg font-medium leading-snug sm:text-xl md:text-[1.375rem] ${
                isToday ? "text-[#0a143b]" : "text-white"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-2 max-w-md text-sm leading-[1.5] sm:mt-2.5 sm:text-[0.9375rem] md:leading-[1.55] ${
                isToday ? "text-[#50617a]" : "text-white/75"
              }`}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const Workflow = ({ coverforceBackground = "broker" }: WorkflowProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "light",
  });

  useGSAP(
    () => {
      const grid = cardsGridRef.current;
      if (!grid) return;

      const cards = gsap.utils.toArray<HTMLElement>(".workflow-comparison-card", grid);
      if (!cards.length) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, x: 0 });
        return;
      }

      cards.forEach((card) => {
        gsap.set(card, {
          opacity: 0,
          x: 96,
        });
      });

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      revealTl.to(cards, {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.14,
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
    { scope: sectionRef },
  );
  return (
    <section ref={sectionRef} id="workflow" className="scroll-mt-14 bg-white text-[#0a143b] lg:scroll-mt-0">
      <Container borderColor="#53535380" borderBottom={true}>
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="mb-10 flex flex-col gap-6 lg:mb-14 lg:grid lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-x-12"
          >
            <div className="flex flex-col items-start">
              <EyebrowPill surface="light">
                What changes
              </EyebrowPill>
              <h2
                ref={headingRef}
                className="max-w-sm text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split className="block">
                  Before and after
                </span>
                <span data-split className="block">
                  Coverforce
                </span>
              </h2>            </div>

            <div className="flex max-w-md flex-col items-start text-left lg:ml-auto lg:items-end">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                Compare manual intake and blind routing with automated submission
                and appetite matching.
              </p>
            </div>
          </div>

          <div
            ref={cardsGridRef}
            className="grid gap-4 overflow-hidden lg:grid-cols-2 lg:gap-5"
          >
            <ComparisonPanel tone="today" items={todayItems} />
            <ComparisonPanel
              tone="coverforce"
              items={coverforceItems}
              coverforceBackground={coverforceBackground}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Workflow;
