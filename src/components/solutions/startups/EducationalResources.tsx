"use client";

import { useRef, type ComponentType } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Rocket } from "lucide-react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

type ResourceBadge = "PRIMER" | "GLOSSARY" | "GUIDE";

type ResourceCard = {
  id: string;
  badge: ResourceBadge;
  readTime: string;
  title: string;
  description: string;
  href: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

const BADGE_STYLES: Record<ResourceBadge, string> = {
  PRIMER: "bg-[#E8F5E9] text-[#1B5E20]",
  GLOSSARY: "bg-[#FFF8E1] text-[#8A6A22]",
  GUIDE: "bg-[#0a143b] text-white",
};

const RESOURCE_CARDS: ResourceCard[] = [
  {
    id: "primer",
    badge: "PRIMER",
    readTime: "5 min read",
    title: "Introduction to Commercial Insurance",
    description:
      "What commercial insurance actually is, how it works, and why it's structurally different from personal lines. The starting point for every founder entering this space.",
    href: "/blog",
    Icon: ClipboardList,
  },
  {
    id: "glossary",
    badge: "GLOSSARY",
    readTime: "15 min read",
    title: "The Insurtech Founder's Glossary — 50+ Terms You'll Hear in Your First 50 Days",
    description:
      "From admitted vs. non-admitted to surplus lines, E&O, and loss ratios — a plain-English guide to the terminology you'll encounter immediately.",
    href: "/blog",
    Icon: BookOpen,
  },
  {
    id: "guide",
    badge: "GUIDE",
    readTime: "10 min read",
    title: "How to Launch a Digital P&C Brokerage: The 5 Steps Every Founder Has to Run",
    description:
      "The end-to-end operational guide — entity formation, licensing, market access, API integration, and your first bound policy. Written for founders who want the honest version.",
    href: "/blog",
    Icon: Rocket,
  },
];

const ARTICLE_LINK_CLASS =
  "font-heading text-[0.9375rem] font-regular leading-none text-[#322696] transition-colors hover:text-[#151F4D]";

function ResourceCardItem({ card }: { card: ResourceCard }) {
  const { badge, readTime, title, description, href, Icon } = card;

  return (
    <article className="flex h-full flex-col rounded-md border border-[#E5E7EB] bg-white p-6 md:p-7">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] ${BADGE_STYLES[badge]}`}
        >
          {badge}
        </span>
        <span className="font-sans text-xs text-[#6B7280]">{readTime}</span>
      </div>

      <Icon className="mt-5 size-5 text-[#0a143b]" strokeWidth={1.75} aria-hidden />

      <h3 className="mt-4 font-heading text-xl font-medium leading-[1.2] tracking-tight text-[#0a143b] md:text-[1.375rem]">
        {title}
      </h3>

      <p className="mt-3 flex-1 font-sans text-sm font-regular leading-[1.55] text-[#50617a]">
        {description}
      </p>

      <Link href={href} className={`mt-6 inline-flex w-fit ${ARTICLE_LINK_CLASS}`}>
        Read article →
      </Link>
    </article>
  );
}

export default function EducationalResources() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  return (
    <section ref={sectionRef} className="bg-[#FBFCFF] text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-12"
          >
            <div className="max-w-2xl">
              <EyebrowPill surface="light" className="mb-0">
                Educational Resources
              </EyebrowPill>
              <h2
                ref={headingRef}
                className="mt-5 max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Everything you need to get up to speed.</span>
              </h2>
              <p
                ref={descRef}
                className="mt-4 max-w-xl font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                Launching a brokerage means learning a new language fast. These resources
                are written specifically for insurtech founders — no fluff, no assumed
                knowledge.
              </p>
            </div>

            <Button href="/blog" className="shrink-0 self-start lg:self-end">
              View all articles
            </Button>
          </div>

          <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5 lg:mt-14 lg:gap-6">
            {RESOURCE_CARDS.map((card) => (
              <ResourceCardItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
