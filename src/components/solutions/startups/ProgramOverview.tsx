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
  CARD_ACCENT_COLORS,
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
    title: ["Educational", "resources"],
    description:
      "Access educational resources designed to help your team learn the industry and scale with confidence",
    Icon: GraduationCap,
    background: "developer",
  },
  {
    number: "03",
    title: ["Carrier connectivity", "& access"],
    description:
      "60+ carrier integrations are ready from day one through our API, with warm carrier introductions when you're ready for direct appointments",
    Icon: Cable,
    background: "wholesaler",
  },
  {
    number: "04",
    title: ["Market access", "partnerships"],
    description:
      "Carrier appointments are the #1 bottleneck for new brokerages. We connect qualified startups with vetted market access providers who can get you live before you have your own direct appointments",
    Icon: Handshake,
    background: "broker",
  },
];

function ProgramCard({ item }: { item: ProgramItem }) {
  const { number, title, description, Icon, background } = item;
  const accent = CARD_ACCENT_COLORS[background];

  return (
    <article className="relative flex min-h-[18rem] flex-col overflow-hidden rounded-md border border-[#121C49]/10 bg-white text-[#0a143b] shadow-[0_8px_24px_rgba(10,20,59,0.06)] md:min-h-[19rem] lg:min-h-[20rem]">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: CARD_BACKGROUND_STYLES[background] }}
        aria-hidden
      />

      <div className="pointer-events-none relative z-10 flex h-full min-h-[18rem] flex-col p-6 md:min-h-[19rem] md:p-8 lg:min-h-[20rem]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[15rem] text-2xl font-heading font-regular leading-[1.15] tracking-tight text-[#0a143b] sm:max-w-[18rem] sm:text-3xl md:text-4xl lg:text-3xl lg:leading-[1.15]">
            {title[0]}
            <br />
            {title[1]}
          </h3>
          <span className="mt-1 shrink-0" style={{ color: accent }}>
            <Icon
              className="size-6 md:size-7"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
        </div>

        <div className="mt-auto">
          <span
            className="font-mono text-xs font-medium tracking-wide md:text-sm"
            style={{ color: accent }}
          >
            {number}
          </span>
          <div className="mt-3 border-t border-[#121C49]/10 pt-4">
            <p className="max-w-md font-sans text-sm font-regular leading-[1.4] text-[#50617a] md:text-[1.125rem]">
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
    <section
      id="program-overview"
      ref={sectionRef}
      data-header-surface="dark"
      className="relative bg-[#121C49] text-white"
    >
      <Container borderColor="#FFFFFF33" borderBottom={true} className="relative z-10">
        <div className="grid gap-10 pt-16 pb-24 md:gap-12 md:pt-20 md:pb-32 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12 lg:pt-24 lg:pb-40 xl:gap-16">
          <div className="order-1 self-start lg:sticky lg:top-24">
            <div
              ref={headerRef}
              className="flex w-full max-w-sm flex-col items-start space-y-5"
            >
              <h2
                ref={headingRef}
                className="max-w-sm text-2xl font-heading font-regular leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-3xl lg:leading-[1.15]"
              >
                <span data-split>Program Overview</span>
              </h2>

              <p
                ref={descRef}
                className="max-w-xs font-sans text-sm font-regular leading-[1.45] text-white/80 md:text-[0.9375rem]"
              >
                Infrastructure, pricing, education, and ecosystem partnerships - so you can get to market faster
              </p>

              <Button href="/contact" surface="on-dark" className="mt-1">
                Join the program
              </Button>
            </div>
          </div>

          <div className="order-2 flex flex-col gap-4 md:gap-5">
            {programItems.map((item) => (
              <ProgramCard key={item.number} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProgramOverview;
