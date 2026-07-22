"use client";

import { useRef, type ComponentType } from "react";
import {
  BadgePercent,
  Cable,
  Handshake,
  GraduationCap,
} from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import {
  CARD_BACKGROUND_STYLES,
  type CardBackground,
} from "@/data/wayCardStyles";

type ProgramItem = {
  number: string;
  title: [string, string];
  description: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  background: CardBackground;
};

const programItems: ProgramItem[] = [
  {
    number: "01",
    title: ["Preferred startup", "pricing"],
    description:
      "Qualified teams get low-cost pricing built for early-stage brokerages and designed to grow with your book.",
    Icon: BadgePercent,
    background: "startup",
  },
  {
    number: "02",
    title: ["Carrier connectivity", "& access"],
    description:
      "50+ carrier integrations are ready from day one through our API, with warm carrier introductions when you're ready for direct appointments.",
    Icon: Cable,
    background: "wholesaler",
  },
  {
    number: "03",
    title: ["Preferred partner", "pricing"],
    description:
      "Members get special partner pricing and trusted licensing support, helping you get licensed, secure carrier appointments.",
    Icon: Handshake,
    background: "broker",
  },
  {
    number: "04",
    title: ["Educational", "Resources"],
    description:
      "Access curated guides, trainings, and playbooks that help your team learn the market, place risks faster, and scale with confidence.",
    Icon: GraduationCap,
    background: "developer",
  },
];

function ProgramCard({ item }: { item: ProgramItem }) {
  const { number, title, description, Icon, background } = item;

  return (
    <article className="relative flex min-h-[22rem] flex-col overflow-hidden rounded-md text-white md:min-h-[26rem] lg:min-h-[28rem]">
      <div
        className="absolute inset-0"
        style={{ background: CARD_BACKGROUND_STYLES[background] }}
        aria-hidden
      />

      <div className="pointer-events-none relative z-10 flex h-full min-h-[22rem] flex-col p-6 md:min-h-[26rem] md:p-8 lg:min-h-[28rem]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[15rem] text-2xl font-heading font-regular leading-[1.15] tracking-tight text-white sm:max-w-[18rem] sm:text-3xl md:text-4xl lg:text-3xl lg:leading-[1.15]">
            {title[0]}
            <br />
            {title[1]}
          </h3>
          <Icon
            className="mt-1 size-6 shrink-0 text-white/85 md:size-7"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>

        <div className="mt-auto">
          <span className="font-mono text-xs font-medium tracking-wide text-white/70 md:text-sm">
            {number}
          </span>
          <div className="mt-3 border-t border-white/35 pt-4">
            <p className="max-w-md font-sans text-sm font-regular leading-[1.4] text-white/85 md:text-[1.125rem]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

const ProgramOverview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
    theme: "dark",
  });

  return (
    <section id="program-overview" ref={sectionRef} className="relative bg-[#121C49] text-white">
      <Container borderColor="#FFFFFF33" borderBottom={true} className="relative z-10">
        <div className="grid gap-10 pt-16 pb-24 md:gap-12 md:pt-20 md:pb-32 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:pt-24 lg:pb-40 xl:gap-16">
          <div className="order-2 flex flex-col gap-4 md:gap-5 lg:order-1">
            {programItems.map((item) => (
              <ProgramCard key={item.number} item={item} />
            ))}
          </div>

          <div className="order-1 flex lg:order-2 lg:items-start lg:justify-end">
            <div
              ref={headerRef}
              className="flex w-full max-w-sm flex-col items-start space-y-5 lg:sticky lg:top-24 lg:h-fit"
            >
              <h2
                ref={headingRef}
                className="max-w-sm text-2xl font-heading font-regular leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl md:text-4xl lg:text-3xl lg:leading-[1.15]"
              >
                <span data-split>Everything you need to </span>
                <span
                  data-split
                  className="bg-linear-to-r from-[#A483FE] via-[#8B7CFF] to-[#C4B5FF] bg-clip-text text-transparent"
                >
                  launch.
                </span>
              </h2>

              <p
                ref={descRef}
                className="max-w-xs font-sans text-sm font-regular leading-[1.45] text-[#D1D1D1] md:text-[0.9375rem]"
              >
                Infrastructure, pricing, and relationships — so you can focus on
                acquisition and placement.
              </p>

              <Button href="/contact" surface="on-dark" className="mt-1">
                Join the program
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProgramOverview;
