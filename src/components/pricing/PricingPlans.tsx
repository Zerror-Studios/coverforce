"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiCheckLine } from "@remixicon/react";
import Container from "@/components/common/Container";
import RequestDemoCta from "@/components/request-demo/RequestDemoCta";

gsap.registerPlugin(ScrollTrigger);

type PricingPlan = {
  id: string;
  title: string;
  badge?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
};

const PLANS: PricingPlan[] = [
  {
    id: "startup",
    title: "Startup",
    badge: "New",
    description:
      "For insurtechs, new brokerages, and early-stage startups. Full platform access from day one. Start building in sandbox with no time limit, go live when you're ready, and scale with pricing that grows as you do.",
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
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description:
      "For wholesalers, brokers, carriers, and organizations at scale. The full CoverForce platform with unlimited usage, enterprise controls, dedicated support, and custom integrations built for organizations processing thousands of submissions per month.",
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
  },
];

function FeatureItem({ children }: { children: string }) {
  return (
    <li className="pricing-feature">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7CD20D] text-[#0a143b]">
          <RiCheckLine className="size-3" aria-hidden />
        </span>
        <span className="font-sans text-[0.9375rem] font-regular leading-relaxed text-[#2E2E2E]">
          {children}
        </span>
      </div>
    </li>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const cardRef = useRef<HTMLElement>(null);
  const hoverTweenRef = useRef<gsap.core.Timeline | null>(null);
  const isEnterprise = plan.id === "enterprise";

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

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
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

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
      className={`pricing-card pricing-plan-card-shell way-card-shell group/pricing relative flex flex-col overflow-hidden rounded-md will-change-transform transform-gpu lg:will-change-transform ${
        isEnterprise
          ? "min-h-[40rem] sm:min-h-[42rem]"
          : "min-h-[36rem] sm:min-h-[38rem]"
      } md:min-h-[44rem] lg:min-h-[48rem]`}
    >
      <div className="way-card-body absolute inset-0 overflow-hidden rounded-md">
        <div className="absolute inset-0 rounded-md bg-[#F4F5F7]" aria-hidden />
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5 text-[#0a143b] sm:p-8 md:p-12 lg:p-10">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-3xl font-medium text-[#0a143b] sm:text-4xl md:text-5xl">
            {plan.title}
          </h2>
          {plan.badge ? (
            <span className="rounded-full bg-[#0a143b] px-2.5 py-1 font-sans text-sm font-semibold text-white">
              {plan.badge}
            </span>
          ) : null}
        </div>

        <p className="mt-4 font-sans text-[0.9375rem] font-regular leading-relaxed text-[#444444] sm:mt-5">
          {plan.description}
        </p>

        <ul className="mt-6 flex flex-1 flex-col gap-3 sm:mt-8 sm:gap-4">
          {plan.features.map((feature) => (
            <FeatureItem key={feature}>{feature}</FeatureItem>
          ))}
        </ul>

        <RequestDemoCta
          label={plan.cta.label}
          href={plan.cta.href}
          variant="primary"
          size="md"
          surface="default"
          balanced
          className="w-full"
        />
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
          border-radius: 0.375rem;
          clip-path: inset(4px 4.798048790430439px 4px 4.798048790430439px round 0.375rem);
        }

        @media (prefers-reduced-motion: no-preference) {
          @media (hover: hover) {
            .pricing-plan-card-shell.way-card-shell:hover {
              clip-path: inset(4px 4.798048790430439px 4px 4.798048790430439px round 0.375rem);
            }
          }
        }

        .pricing-plan-card-shell .way-card-body,
        .pricing-plan-card-shell .way-card-body > div {
          border-radius: 0.375rem;
        }

        .pricing-plan-card-shell .way-card-body {
          transition: transform 800ms cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: translate3d(0, 0, 0) scale(1);
        }
      `}</style>
      <Container borderColor="#53535380">
        <div className="grid grid-cols-1 items-stretch gap-4 py-12 sm:gap-6 md:grid-cols-2 md:gap-8 md:px-26 md:py-16 lg:py-20">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PricingPlans;
