"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { PRIMARY_BUTTON_GRADIENT } from "@/data/wayCardStyles";

const FAQ_CONTENT_CLASS =
  "font-heading text-[0.9375rem] font-regular leading-[1.4] text-[#3D3D3D]";
const FAQ_LINK_CLASS =
  "font-heading text-[0.9375rem] font-regular leading-none text-[#3D3D3D] underline decoration-[#3D3D3D]/25 underline-offset-2 transition-colors hover:text-[#151F4D] hover:decoration-[#151F4D]/30";

type FaqItem = {
  id: string;
  question: string;
  content: ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "bor",
    question:
      "Does CoverForce offer its own market access solution, or act as a broker of record?",
    content: (
      <>
        <p>
          Neither. CoverForce is neutral infrastructure — we are not a broker of record,
          and we do not offer our own market access solution. We don&apos;t take positions
          in the market or compete with the brokerages and MGAs we serve.
        </p>
        <p>
          Instead, we partner with established market access providers who offer carrier
          appointments to startups that aren&apos;t yet appointed directly. Those partners
          set their own terms and pricing; CoverForce negotiates preferred rates on behalf
          of Startup Program members. Our role is to connect the dots — not to own the
          relationship between a startup and its carriers.
        </p>
      </>
    ),
  },
  {
    id: "partner",
    question:
      "What does it take to become a market access partner and join the CoverForce partner marketplace?",
    content: (
      <>
        <p>
          The primary requirement is a commitment to offering preferred pricing to
          CoverForce customers. Our Startup Program members are early-stage brokerages that
          are price-sensitive and volume-driven — partners who offer competitive,
          transparent pricing get the most out of the relationship.
        </p>
        <p>
          Beyond pricing, we look for partners with broad carrier appetite, clean onboarding
          processes, and a genuine interest in supporting the next generation of insurtech
          brokerages. If that describes your organization,{" "}
          <Link href="/contact" className={FAQ_LINK_CLASS}>
            apply to become a partner →
          </Link>
        </p>
      </>
    ),
  },
];

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
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StartupFaq() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    theme: "light",
  });

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="mx-auto flex max-w-2xl flex-col items-center text-center"
          >
            <EyebrowPill surface="light" className="mb-0">
              FAQ
            </EyebrowPill>
            <h2
              ref={headingRef}
              className="mt-5 text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl md:text-4xl lg:text-[2rem] lg:leading-[1.12]"
            >
              <span data-split>Have questions? We got answers</span>
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-3xl border-t border-dashed border-[#D1D5DB] md:mt-14">
            {FAQ_ITEMS.map((item) => (
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
      </Container>
    </section>
  );
}
