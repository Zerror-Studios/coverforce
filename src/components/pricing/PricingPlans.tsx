"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiCheckLine } from "@remixicon/react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import RequestDemoCta from "@/components/request-demo/RequestDemoCta";
import {
  CARD_BACKGROUND_STYLES,
  SOLUTION_GRAD_FLOW,
  type GradFlowRgb,
  type CardBackground,
} from "@/data/wayCardStyles";

gsap.registerPlugin(ScrollTrigger);

function deepen(color: GradFlowRgb, amount: number): GradFlowRgb {
  const keep = 1 - amount;
  return {
    r: Math.round(color.r * keep),
    g: Math.round(color.g * keep),
    b: Math.round(color.b * keep),
  };
}

const startupFlow = SOLUTION_GRAD_FLOW.startup;
const STARTUP_HERO_PRICING_FLOW = {
  color1: deepen(startupFlow.color3, 0.38),
  color2: deepen(startupFlow.color2, 0.18),
  color3: startupFlow.color1,
};

/** Same gradient family as the startup hero, with the left side kept deep for legibility. */
const STARTUP_CARD_BACKGROUND = `linear-gradient(135deg,
  rgb(${STARTUP_HERO_PRICING_FLOW.color1.r}, ${STARTUP_HERO_PRICING_FLOW.color1.g}, ${STARTUP_HERO_PRICING_FLOW.color1.b}) 0%,
  rgb(${STARTUP_HERO_PRICING_FLOW.color2.r}, ${STARTUP_HERO_PRICING_FLOW.color2.g}, ${STARTUP_HERO_PRICING_FLOW.color2.b}) 52%,
  rgb(${STARTUP_HERO_PRICING_FLOW.color3.r}, ${STARTUP_HERO_PRICING_FLOW.color3.g}, ${STARTUP_HERO_PRICING_FLOW.color3.b}) 100%)`;

const brokerFlow = SOLUTION_GRAD_FLOW.broker;
const BROKER_PRICING_FLOW = {
  color1: deepen(brokerFlow.color1, 0.22),
  color2: deepen(brokerFlow.color2, 0.42),
  color3: deepen(brokerFlow.color3, 0.48),
};

/** Broker Three Ways palette, darkened so white card copy stays readable. */
const BROKER_CARD_BACKGROUND = `linear-gradient(135deg,
  rgb(${BROKER_PRICING_FLOW.color1.r}, ${BROKER_PRICING_FLOW.color1.g}, ${BROKER_PRICING_FLOW.color1.b}) 0%,
  rgb(${BROKER_PRICING_FLOW.color2.r}, ${BROKER_PRICING_FLOW.color2.g}, ${BROKER_PRICING_FLOW.color2.b}) 48%,
  rgb(${BROKER_PRICING_FLOW.color3.r}, ${BROKER_PRICING_FLOW.color3.g}, ${BROKER_PRICING_FLOW.color3.b}) 100%)`;

type PricingFeature =
  | string
  | {
      parts: Array<{ text: string; bold?: boolean }>;
    };

type PricingPlan = {
  id: string;
  title: string;
  badge?: string;
  description: string;
  price: string;
  priceNote?: string;
  features: PricingFeature[];
  footnote?: string;
  cta: { label: string; href: string };
  background: CardBackground | "startup-dark" | "broker-dark";
  tone: "light" | "dark";
};

const PLAN_BACKGROUNDS: Record<PricingPlan["background"], string> = {
  ...CARD_BACKGROUND_STYLES,
  "startup-dark": STARTUP_CARD_BACKGROUND,
  "broker-dark": BROKER_CARD_BACKGROUND,
};

const PLANS: PricingPlan[] = [
  {
    id: "independent-agency",
    title: "Independent Agency",
    badge: "60 DAYS FREE - LIMITED TIME",
    description:
      "For independent retail agencies quoting on their own appointments. Full platform access from day one — unlimited users, month to month.",
    price: "$99",
    priceNote: "/MO after the first 60 days",
    features: [
      "Quote and bind across 20+ carriers on your own appointments",
      {
        parts: [
          { text: "100 quote submissions", bold: true },
          { text: " included per month" },
        ],
      },
      "$1.50 per additional quote submission, capped at 250 a month",
      "Unlimited users, no per-seat fees",
      "One unified application, no re-keying between carriers",
      "Pre-fill, auto-filled renewals, AI doc reading and email intake",
      "Quote comparison PDFs, appetite guides and ACORD generation",
      "Send to additional markets with dedicated underwriters",
      "Month to month, cancel any time",
    ],
    cta: {
      label: "Start quoting now",
      href: "/contact",
    },
    background: "broker-dark",
    tone: "dark",
  },
  {
    id: "startup",
    title: "Startup",
    badge: "New",
    description:
      "For insurtechs, new brokerages, and early-stage startups. Full platform access from day one with pricing that scales as you grow.",
    price: "Custom",
    priceNote: "usage-based as you scale",
    features: [
      "Application and usage-based pricing that scales as you scale",
      "Unlimited seats",
      "Aligned incentives",
      "Free sandbox",
      "Standard API",
      "Slack + integration support",
      "API-only",
    ],
    cta: {
      label: "Apply to our startup program",
      href: "/contact",
    },
    background: "startup-dark",
    tone: "dark",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    badge: "Enterprise",
    description:
      "For brokers and organizations at scale. Enterprise controls, dedicated support, and custom integrations for high-volume teams.",
    price: "Custom",
    priceNote: "tailored to your volume",
    features: [
      "Application and usage-based pricing that scales as you scale",
      "Unlimited seats",
      "Aligned incentives",
      "Full AI ingestion, enrichment, quoting & binding",
      "Tailored carrier roadmap",
      "Agent & consumer-facing modules, plus wholesaler and agency-network experiences with configurable workflows",
      "Nationwide distribution capabilities",
      "24/7 enterprise technical customer support",
    ],
    cta: {
      label: "Talk to sales",
      href: "/contact",
    },
    background: "accent",
    tone: "dark",
  },
];

function featureKey(feature: PricingFeature): string {
  if (typeof feature === "string") return feature;
  return feature.parts.map((part) => part.text).join("");
}

function FeatureItem({
  children,
  tone,
}: {
  children: PricingFeature;
  tone: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <li className="pricing-feature">
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full mt-1  ${
            isDark ? "bg-white text-[#0a143b]" : "bg-[#0a143b] text-white"
          }`}
        >
          <RiCheckLine className="size-2.5" aria-hidden />
        </span>
        <span
          className={`font-sans text-[0.9375rem] font-regular leading-relaxed ${
            isDark ? "text-white" : "text-[#2E2E2E]"
          }`}
        >
          {typeof children === "string"
            ? children
            : children.parts.map((part) =>
                part.bold ? (
                  <strong key={part.text} className="font-semibold">
                    {part.text}
                  </strong>
                ) : (
                  <span key={part.text}>{part.text}</span>
                ),
              )}
        </span>
      </div>
    </li>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const isEnterprise = plan.id === "enterprise";
  const isDark = plan.tone === "dark";

  return (
    <article
      className={`pricing-card pricing-plan-card-shell way-card-shell group/pricing relative flex flex-col overflow-hidden rounded-md will-change-transform ${
        isEnterprise
          ? "min-h-[44rem] sm:min-h-[46rem]"
          : "min-h-[40rem] sm:min-h-[42rem]"
      } md:min-h-[44rem] lg:min-h-[48rem]`}
    >
      <div className="way-card-body absolute inset-0 overflow-hidden rounded-md">
        <div
          className="absolute inset-0 rounded-md"
          style={{ background: PLAN_BACKGROUNDS[plan.background] }}
          aria-hidden
        />
      </div>

      <div
        className={`relative z-10 flex flex-1 flex-col px-5 pb-6 pt-8 sm:px-7 sm:pb-7 sm:pt-10 md:px-7 md:pb-7 md:pt-10 lg:px-6 lg:pb-6 lg:pt-9 xl:px-7 xl:pb-7 xl:pt-10 ${
          isDark ? "text-white" : "text-[#0a143b]"
        }`}
      >
        {plan.badge ? (
          <EyebrowPill
            surface={isDark ? "dark" : "light"}
            className={`!mb-4 ${
              plan.id === "enterprise"
                ? "pointer-events-none hidden opacity-0 lg:flex"
                : ""
            }`}
          >
            {plan.badge}
          </EyebrowPill>
        ) : null}

        <h2
          className={`whitespace-nowrap font-heading text-3xl font-medium tracking-tight sm:text-4xl md:text-3xl xl:text-3xl ${
            isDark ? "text-white" : "text-[#0a143b]"
          }`}
        >
          {plan.title}
        </h2>

        <p
          className={`mt-4 font-sans text-[0.9375rem] font-regular leading-relaxed sm:mt-5 ${
            isDark ? "text-white" : "text-[#444444]"
          }`}
        >
          {plan.description}
        </p>

        <div className="mt-6 sm:mt-8">
          <div className="flex flex-nowrap items-baseline gap-x-2">
            <span
              className={`shrink-0 font-heading text-4xl font-[600] leading-none tracking-tight sm:text-5xl ${
                isDark ? "text-white" : "text-[#413CC0]"
              }`}
            >
              {plan.price}
            </span>
            {plan.priceNote ? (
              <span
                className={`whitespace-nowrap font-sans text-sm font-regular ${
                  isDark ? "text-white/70" : "text-[#8A8A8A]"
                }`}
              >
                {plan.priceNote}
              </span>
            ) : null}
          </div>
        </div>

        <RequestDemoCta
          label={plan.cta.label}
          href={plan.cta.href}
          variant="primary"
          size="md"
          surface={isDark ? "on-dark" : "default"}
          balanced
          className="mt-5 w-full sm:mt-6"
        />

        <ul
          className={`mt-6 flex flex-1 flex-col gap-3 border-t pt-6 sm:mt-8 sm:gap-4 sm:pt-8 ${
            isDark ? "border-white/20" : "border-[#535353]/20"
          }`}
        >
          {plan.features.map((feature) => (
            <FeatureItem key={featureKey(feature)} tone={plan.tone}>
              {feature}
            </FeatureItem>
          ))}
        </ul>

        {plan.footnote ? (
          <p
            className={`mt-5 border-t pt-4 font-sans text-[0.6875rem] font-regular leading-relaxed sm:mt-6 ${
              isDark
                ? "border-white/20 text-white/70"
                : "border-[#535353]/20 text-[#8A8A8A]"
            }`}
          >
            {plan.footnote}
          </p>
        ) : null}
      </div>
    </article>
  );
}

const PricingPlans = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>(".pricing-card");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { opacity: 1, y: 0, clearProps: "transform" });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 48 });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.45,
        clearProps: "transform",
      });

      cards.forEach((card) => {
        const points = card.querySelectorAll<HTMLElement>(".pricing-feature");
        if (points.length) {
          gsap.set(points, { opacity: 0, y: 24 });

          gsap.to(points, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 70%",
              toggleActions: "play none none once",
              once: true,
            },
          });
        }
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
    <section ref={sectionRef} id="plans" className="bg-white text-[#0a143b]">
      <style>{`
        .pricing-plan-card-shell.way-card-shell {
          --way-card-hover-scale: 1.03;
        }

        .pricing-plan-card-shell .way-card-body {
          transition: transform 800ms cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: translate3d(0, 0, 0) scale(1);
        }
      `}</style>
      <Container borderColor="#53535380">
        <div className="grid grid-cols-1 items-stretch gap-3 py-12 sm:gap-4 md:grid-cols-2 md:gap-4 md:py-16 lg:grid-cols-3 lg:gap-3 lg:py-20 xl:gap-4">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PricingPlans;
