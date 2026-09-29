"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { PRIMARY_BUTTON_GRADIENT } from "@/data/wayCardStyles";
import type { FaqEntry } from "@/data/faqs";

const FAQ_CONTENT_CLASS =
  "font-heading text-[0.9375rem] font-regular leading-[1.4] text-[#3D3D3D]";

type FaqItem = {
  id: string;
  question: string;
  paragraphs: string[];
};

function toFaqItems(entries: FaqEntry[]): FaqItem[] {
  return entries.map((entry) => ({
    id: entry.id,
    question: entry.question,
    paragraphs: entry.answer
      .split(/\n\n+/)
      .map((part) => part.trim())
      .filter(Boolean),
  }));
}

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-dashed border-[#D1D5DB]">
      <button
        type="button"
        id={`faq-trigger-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
      >
        <span className="font-heading text-lg font-medium leading-snug tracking-tight text-[#0a143b] md:text-xl">
          {item.question}
        </span>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 md:size-10 ${
            isOpen ? "bg-[#E5E7EB] text-[#3D3D3D]" : "text-white"
          }`}
          style={isOpen ? undefined : { background: PRIMARY_BUTTON_GRADIENT }}
          aria-hidden
        >
          {isOpen ? (
            <RiSubtractLine className="size-5" />
          ) : (
            <RiAddLine className="size-5" />
          )}
        </span>
      </button>
      <div
        id={`faq-panel-${item.id}`}
        role="region"
        aria-labelledby={`faq-trigger-${item.id}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`max-w-3xl space-y-4 pb-6 md:pb-7 ${FAQ_CONTENT_CLASS}`}>
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StartupFaq({ items }: { items: FaqEntry[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const faqItems = toFaqItems(items);
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    theme: "light",
  });

  if (faqItems.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start lg:gap-14">
            <div className="relative order-2 hidden overflow-hidden rounded-md bg-[#EFF3FF] lg:order-1 lg:block">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,31,77,0.04),rgba(21,31,77,0.12))]" />
              <Image
                src="/images/careers/image3.webp"
                alt="CoverForce team culture"
                width={900}
                height={1100}
                className="relative h-full min-h-80 w-full object-cover object-left md:object-[72%_50%] lg:min-h-144 lg:max-h-144"
                sizes="(min-width: 1024px) 34vw, 100vw"
              />
            </div>

            <div className="order-1 lg:order-2">
              <div
                ref={headerRef}
                className="flex max-w-3xl flex-col items-start text-left"
              >
                <EyebrowPill surface="light" className="mb-0">
                  FAQ
                </EyebrowPill>
                <h2
                  ref={headingRef}
                  className="mt-5 max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                >
                  <span data-split>Have questions? We got answers</span>
                </h2>
              </div>

              <div className="mt-12 max-w-4xl border-t border-dashed border-[#D1D5DB] md:mt-14">
                {faqItems.map((item) => (
                  <FaqAccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() =>
                      setOpenId((current) => (current === item.id ? null : item.id))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
