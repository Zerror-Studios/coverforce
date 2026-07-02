"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiCheckLine } from "@remixicon/react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";

gsap.registerPlugin(ScrollTrigger);

type PricingPlan = {
  id: string;
  title: string;
  badge?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  accentClassName: string;
  hoverClassName: string;
};

const PLANS: PricingPlan[] = [
  {
    id: "startup",
    title: "Startup",
    badge: "New",
    description:
      "For insurtechs, new brokerages, and early-stage startups. Full platform access from day one. Start building in sandbox with no time limit, go live when you're ready, and scale with pricing that grows as you do.",
    features: [
      "Free Sandbox Access",
      "Standard API Integrations",
      "Basic AI Intake Tools",
      "Community Support",
    ],
    cta: {
      label: "Apply to our startup program",
      href: "/solutions/startups",
    },
    accentClassName: "bg-[#154AED]",
    hoverClassName: "hover:bg-[#154AED]",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description:
      "For wholesalers, brokers, carriers, and organizations at scale. The full CoverForce platform with unlimited usage, enterprise controls, dedicated support, and custom integrations built for organizations processing thousands of submissions per month.",
    features: [
      "All 40+ carrier integrations — unlimited usage",
      "Full AI suite — 10 production capabilities",
      "Broker code management & carrier code delegation",
      "E&S compliance — surplus lines tax, covering letters",
      "Performance analytics & commission tracking",
      "AMS integration — Applied EPIC, AMS360, Nexsure, Salesforce",
    ],
    cta: {
      label: "Talk to sales",
      href: "/",
    },
    accentClassName: "bg-[#5B35E0]",
    hoverClassName: "hover:bg-[#5B35E0]",
  },
];

function FeatureItem({ children }: { children: string }) {
  return (
    <li className="pricing-feature">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7CD20D] text-[#0a143b]">
          <RiCheckLine className="size-3" aria-hidden />
        </span>
        <span className="font-sans text-sm font-regular leading-relaxed text-inherit transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/pricing:text-white/95">
          {children}
        </span>
      </div>
    </li>
  );
}

function PricingCard({
  plan,
  settled,
}: {
  plan: PricingPlan;
  settled: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const hoverTweenRef = useRef<gsap.core.Timeline | null>(null);

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const points = card.querySelectorAll<HTMLElement>(".pricing-feature");

    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap
      .timeline({ defaults: { ease: "power3.out", overwrite: "auto" } })
      .to(card, { y: -24, duration: 0.9 }, 0)
      .to(
        points,
        {
          y: "-0.35rem",
          duration: 0.75,
          stagger: 0.05,
        },
        0.18,
      );
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const points = card.querySelectorAll<HTMLElement>(".pricing-feature");

    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap
      .timeline({ defaults: { ease: "power3.inOut", overwrite: "auto" } })
      .to(
        points,
        {
          y: 0,
          duration: 0.55,
          stagger: { each: 0.035, from: "end" },
        },
        0,
      )
      .to(card, { y: 0, duration: 0.8 }, 0.08);
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition:
          "background 0.85s cubic-bezier(0.22, 1, 0.36, 1), color 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={`pricing-card group/pricing flex min-h-[40rem] flex-col rounded-xl p-8 will-change-transform transform-gpu md:min-h-[46rem] md:p-12 lg:min-h-[50rem] lg:p-10 ${
        settled
          ? `bg-[#F8F8F8] text-[#1A1A1A] ${plan.hoverClassName} hover:text-white`
          : `${plan.accentClassName} text-white`
      }`}
    >
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-3xl font-medium tracking-tight text-inherit transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/pricing:text-white md:text-4xl">
          {plan.title}
        </h2>
        {plan.badge ? (
          <span className="rounded-full bg-white px-2.5 py-1 font-sans text-xs font-semibold text-[#413CC0]">
            {plan.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-5 font-sans text-sm font-regular leading-relaxed text-inherit transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/pricing:text-white">
        {plan.description}
      </p>

      <ul className="mt-8 flex flex-1 flex-col gap-4">
        {plan.features.map((feature) => (
          <FeatureItem key={feature}>{feature}</FeatureItem>
        ))}
      </ul>

      <Button
        href={plan.cta.href}
        variant="primary"
        balanced
        className={`w-full border-transparent transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          settled
            ? "bg-[#121C49] text-white group-hover/pricing:bg-white group-hover/pricing:text-[#2E2E2E]"
            : "bg-white text-[#2E2E2E]"
        }`}
      >
        {plan.cta.label}
      </Button>
    </article>
  );
}

const PricingPlans = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [cardsSettled, setCardsSettled] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>(".pricing-card");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { opacity: 1, y: 0, clearProps: "transform" });
        setCardsSettled(true);
        return;
      }

      gsap.set(cards, { opacity: 0, y: 48 });

      const tl = gsap.timeline({
        onComplete: () => setCardsSettled(true),
      });

      tl.to(cards, {
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
      <Container borderColor="#53535333">
        <div className="grid items-stretch gap-6 py-12 md:grid-cols-2 md:gap-8 md:py-16 lg:py-20 px-26">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} settled={cardsSettled} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PricingPlans;