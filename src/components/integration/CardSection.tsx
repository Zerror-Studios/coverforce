"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import ToolWheel from "@/components/home/ToolWheel";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { CARD_BACKGROUND_STYLES, CARD_VERTICAL_BACKGROUND_STYLES } from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

const CardSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
      if (!cards.length) return;

      gsap.set(cards, { rotateY: 90, opacity: 0, transformOrigin: "left center" });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            rotateY: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-[#0a143b]"
    >
      <Container borderColor="#53535380">
        <div className="py-12 md:py-20 lg:py-24">
          <div ref={headerRef} className="text-center">
            <h2
              ref={headingRef}
              className="mx-auto max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[2.5rem] lg:leading-[1.12]"
            >
              <span data-split>The best integration stack for insurance.</span>
            </h2>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[min(100%,720px)] md:mt-14">
            <ToolWheel className="h-full w-full max-w-none" showBackground />
          </div>

          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#4F4F4F]">
            {[
              { label: "Wholesalers", background: CARD_VERTICAL_BACKGROUND_STYLES.wholesaler },
              { label: "Brokers", background: CARD_VERTICAL_BACKGROUND_STYLES.broker },
              { label: "Developers", background: CARD_VERTICAL_BACKGROUND_STYLES.developer },
              { label: "Startups", background: CARD_VERTICAL_BACKGROUND_STYLES.startup },
              { label: "Carriers", background: CARD_VERTICAL_BACKGROUND_STYLES.carrier },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ background: item.background }}
                />
                {item.label}
              </span>
            ))}
          </div>

          <div
            className="mt-10 grid gap-3 md:mt-14 md:grid-cols-2 lg:mt-16"
            style={{ perspective: "1200px" }}
          >
            <div
              data-stat-card
              className="flex flex-col overflow-hidden rounded-md p-5 text-white transform-3d will-change-transform lg:p-8"
              style={{ background: CARD_BACKGROUND_STYLES.wholesaler }}
            >
              <EyebrowPill surface="dark">API Integrations</EyebrowPill>
              <span className="mt-4 font-heading text-4xl font-regular leading-none tracking-tight text-white lg:text-6xl">
                20+
              </span>
              <div className="mt-auto pt-6">
                <p className="font-heading text-base font-medium leading-snug text-white lg:text-xl">
                  Direct carrier API connections
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Real-time quoting, binding and policy issuance — no portals,
                  no rekeying. AMS, premium finance and compliance partners stay
                  in sync automatically.
                </p>
              </div>
            </div>

            <div
              data-stat-card
              className="flex flex-col overflow-hidden rounded-md p-5 text-white transform-3d will-change-transform lg:p-8"
              style={{ background: CARD_BACKGROUND_STYLES.wholesaler }}
            >
              <EyebrowPill surface="dark">AI Agents</EyebrowPill>
              <span className="mt-4 font-heading text-4xl font-regular leading-none tracking-tight text-white lg:text-6xl">
                AI
              </span>
              <div className="mt-auto pt-6">
                <p className="font-heading text-base font-medium leading-snug text-white lg:text-xl">
                  Intelligent workflow automation
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Purpose-built AI agents read submissions, match appetite and
                  orchestrate the entire workflow — from intake to policy
                  delivery — so your team focuses on relationships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CardSection;
