"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import ToolWheel from "@/components/home/ToolWheel";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import {
  CARD_VERTICAL_BACKGROUND_STYLES,
} from "@/data/wayCardStyles";
import {
  IntegrationAutomationBg,
  IntegrationCodeTypingBg,
} from "@/components/integration/IntegrationStatCardBackgrounds";
import RequestGlobe2 from "../home/Globe/RequestGlobe2";

gsap.registerPlugin(ScrollTrigger);

/** Stronger blue wash for integration stat cards - less pale/white at the end. */
const INTEGRATION_STAT_CARD_BG =
  "linear-gradient(45deg, #0038E0 0%, #0045FF 22%, #008EFF 55%, #008EFF 78%, #4AAFFF 100%)";

const CardSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsHeaderRef = useRef<HTMLDivElement>(null);
  const cardsHeadingRef = useRef<HTMLHeadingElement>(null);
  const cardsDescRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef });
  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef: cardsHeaderRef,
    headingRef: cardsHeadingRef,
    descRef: cardsDescRef,
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  
      const cards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
      if (!cards.length) return;
  
      gsap.set(cards, {
        x: 180,               // Start from the right
        opacity: 0,
        transformOrigin: "right center",
        force3D: true,
      });
  
      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.15,
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
        <div className="py-12 md:py-20 lg:py-24 relative">
          <div className="relative">
          <div ref={headerRef} className=" w-full lg:absolute left-0 items-center  top-1/2 lg:-translate-y-1/2 md:flex justify-between">
            <h2
              ref={headingRef}
              className=" text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>The best integration <br  className="max-sm:hidden"/> stack for insurance.</span>
            </h2>
            <div className="max-sm:text-sm max-sm:mt-5">
              <div className="space-y-1">
                {[
                  {
                    label: "Carriers",
                    background: CARD_VERTICAL_BACKGROUND_STYLES.carrier,
                  },
                  {
                    label: "Distributors",
                    background: CARD_VERTICAL_BACKGROUND_STYLES.startup,
                  },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span
                      className="inline-block size-2.5 shrink-0 rounded-full"
                      style={{ background: item.background }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
            <RequestGlobe2 logoColor="dark" />
          </div>

          <div
            ref={cardsHeaderRef}
            className="mt-14 grid gap-8 md:mt-20 lg:mt-24 lg:grid-cols-2 lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col justify-end">
              <EyebrowPill surface="light">APIs &amp; AI Agents</EyebrowPill>
              <h2
                ref={cardsHeadingRef}
                className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>We integrate with APIs and AI agents.</span>
              </h2>
              <p
                ref={cardsDescRef}
                className="max-w-lg font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:hidden"
              >
                Direct carrier API connections and purpose-built AI agents -
                quoting, binding, and workflow automation in one stack.
              </p>
            </div>
            <p className="hidden max-w-lg font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:ml-auto lg:block lg:text-right">
              Direct carrier API connections and purpose-built AI agents -
              quoting, binding, and workflow automation in one stack.
            </p>
          </div>

          <div
            className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5 lg:mt-14 lg:gap-6"
            style={{ perspective: "1200px" }}
          >
            <div
              data-stat-card
              className="relative flex min-h-88 flex-col overflow-hidden rounded-md p-6 text-white transform-3d will-change-transform md:min-h-96 md:p-8 lg:min-h-112 lg:p-10"
              style={{ background: INTEGRATION_STAT_CARD_BG }}
            >
              <IntegrationCodeTypingBg />
              <div className="relative z-10 flex h-full flex-1 flex-col">
                <h3 className="font-heading text-2xl font-regular leading-[1.15] tracking-tight text-white md:text-3xl lg:text-4xl lg:leading-[1.1]">
                  Direct Carrier API
                  <br />
                  connections
                </h3>
                <div className="mt-auto pt-8">
                  <p className="font-heading text-lg font-medium leading-snug text-white/90 md:text-xl lg:text-2xl">
                    20+ API integrations
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80 md:text-base">
                    Real-time quoting, binding and policy issuance - no portals,
                    no rekeying. AMS, premium finance and compliance partners stay
                    in sync automatically.
                  </p>
                </div>
              </div>
            </div>

            <div
              data-stat-card
              className="relative flex min-h-88 flex-col overflow-hidden rounded-md p-6 text-white transform-3d will-change-transform md:min-h-96 md:p-8 lg:min-h-112 lg:p-10"
              style={{ background: INTEGRATION_STAT_CARD_BG }}
            >
              <IntegrationAutomationBg />
              <div className="relative z-10 flex h-full flex-1 flex-col">
                <h3 className="font-heading text-2xl font-regular leading-[1.15] tracking-tight text-white md:text-3xl lg:text-4xl lg:leading-[1.1]">
                  AI workflow
                  <br />
                  automation
                </h3>
                <div className="mt-auto pt-8">
                  <p className="font-heading text-lg font-medium leading-snug text-white/90 md:text-xl lg:text-2xl">
                    AI Agent workflow
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80 md:text-base">
                    Purpose-built AI agents read submissions, match appetite and
                    orchestrate the entire workflow - from intake to policy
                    delivery - so your team focuses on relationships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CardSection;
