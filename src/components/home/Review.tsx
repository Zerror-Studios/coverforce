"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ArrowNavButton from "../common/ArrowNavButton";
import Container from "../common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

import "swiper/css";
import "swiper/css/navigation";

gsap.registerPlugin(ScrollTrigger);

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  logo?: string;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "They provided excellent service, clear communication, and reliable support throughout the process. I highly recommend Cover Force to anyone looking for a trustworthy and customer-focused insurance partner.",
    name: "David Miller",
    role: "Marketing Director",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    logo: "/images/coailtionloading-logo.svg",
  },
  {
    id: "2",
    quote:
      "We cut submission time dramatically while improving carrier match rates across our book. CoverForce gave our underwriters the clarity and speed we had been missing for years.",
    name: "Sarah Chen",
    role: "VP of Underwriting",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    logo: "/images/coailtionloading-logo.svg",
  },
  {
    id: "3",
    quote:
      "CoverForce gives our team one workflow from intake to bind — fewer errors, faster quotes, and far less back-and-forth with carriers. It has become essential to how we operate every day.",
    name: "Marcus Webb",
    role: "Head of Distribution",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    logo: "/images/coailtionloading-logo.svg",
  },
  {
    id: "4",
    quote:
      "Carrier appetite visibility improved overnight. Our producers spend less time chasing dead ends and more time placing business with the right markets the first time.",
    name: "Elena Rodriguez",
    role: "Chief Operating Officer",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    logo: "/images/coailtionloading-logo.svg",
  },
  {
    id: "5",
    quote:
      "The platform streamlined renewals and cut manual data entry across our entire brokerage. What used to take days of rekeying now happens in a single, reliable workflow.",
    name: "James Okonkwo",
    role: "Senior Broker",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    logo: "/images/coailtionloading-logo.svg",
  },
  {
    id: "6",
    quote:
      "We onboarded new producers faster with one system for submissions, quotes, and binding. CoverForce removed the friction that used to slow every new hire down.",
    name: "Priya Sharma",
    role: "Director of Operations",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    logo: "/images/coailtionloading-logo.svg",
  },
];

function TestimonialCard({
  testimonial,
  compact = false,
  overlayRef,
}: {
  testimonial: Testimonial;
  compact?: boolean;
  overlayRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-sm bg-white p-6 md:p-8 ${
        compact
          ? "min-h-[340px] lg:min-h-[400px] lg:p-7"
          : "min-h-[320px] md:min-h-[400px] lg:min-h-[480px] lg:p-9"
      }`}
    >
      <div className="pointer-events-none absolute -translate-y-1/6 left-1/2 z-0 h-[180%] w-[120%] -translate-x-1/2 md:-top-24 lg:-top-28">
        <Image
          src="/images/secondcardbg.svg"
          alt=""
          fill
          className="h-full w-full object-cover object-bottom opacity-60"
          sizes="100vw"
          aria-hidden
        />
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 rounded-sm bg-[#151f4d] opacity-0"
      />

      <div className="relative z-10 grid h-full min-h-[inherit] flex-1 grid-rows-[auto_1fr_auto]">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="size-12 shrink-0 overflow-hidden md:size-14">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={72}
              height={72}
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-[#303030] md:text-sm">
              {testimonial.name}
            </p>
            <p className="mt-1 font-mono text-[0.625rem] font-medium uppercase leading-[1.4] tracking-[0.06em] text-[#303030]/80 md:text-[0.6875rem]">
              {testimonial.role}
            </p>
          </div>
        </div>

        <blockquote
          className={`flex max-w-[32rem] items-center self-center font-sans font-normal leading-snug tracking-tight text-[#303030] ${
            compact
              ? "text-base sm:text-lg lg:text-xl lg:leading-[1.45]"
              : "text-base sm:text-lg md:text-2xl md:leading-[1.45] lg:text-[1.75rem] lg:leading-[1.4]"
          }`}
        >
          {testimonial.quote}&rdquo;
        </blockquote>

        {testimonial.logo ? (
          <div className="flex justify-start pt-6 md:pt-8">
            <Image
              src={testimonial.logo}
              alt="Coalition"
              width={80}
              height={24}
              className="h-5 w-auto max-w-[5rem] brightness-0 md:h-6 md:max-w-[5.5rem]"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

const CARD_STAGGER_Y = 80;

const Review = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const desktopPinRef = useRef<HTMLDivElement>(null);
  const trackViewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoveredIndexRef = useRef<number | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const animateCardHover = (index: number | null) => {
    if (hoveredIndexRef.current === index) return;
    hoveredIndexRef.current = index;

    innerCardRefs.current.forEach((el, i) => {
      if (!el) return;

      const isActive = index !== null && i === index;
      const isInactive = index !== null && i !== index;

      gsap.to(el, {
        scale: isActive ? 1.04 : isInactive ? 0.96 : 1,
        zIndex: isActive ? 10 : 1,
        duration: 0.55,
        ease: "power2.out",
        overwrite: true,
      });
    });

    overlayRefs.current.forEach((el, i) => {
      if (!el) return;

      gsap.to(el, {
        opacity: index !== null && i !== index ? 0.35 : 0,
        duration: 0.55,
        ease: "power2.out",
        overwrite: true,
      });
    });
  };

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, theme: "dark" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const row = rowRef.current;
        const pinSection = desktopPinRef.current;
        if (!row || !pinSection) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reducedMotion) return;

        const cardEls = cardRefs.current.filter(Boolean);
        if (!cardEls.length) return;

        const getDistance = () => {
          const viewport = trackViewportRef.current;
          const lastCard = cardEls[cardEls.length - 1];
          if (!viewport || !lastCard) return 0;

          const lastCardRight = lastCard.offsetLeft + lastCard.offsetWidth;
          return Math.max(0, lastCardRight - viewport.clientWidth);
        };

        cardEls.forEach((card, i) => {
          gsap.set(card, { y: i * CARD_STAGGER_Y, force3D: true });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSection,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          row,
          {
            x: () => -getDistance(),
            ease: "none",
            duration: 1,
          },
          0,
        );

        const perCardSpan = 1 / cardEls.length;

        cardEls.forEach((card, i) => {
          const start = i * perCardSpan;

          tl.to(
            card,
            {
              y: 0,
              ease: "none",
              duration: 1 - start,
            },
            start,
          );
        });

        const lenis = window.lenis;
        const onLenisScroll = () => ScrollTrigger.update();
        lenis?.on("scroll", onLenisScroll);

        return () => {
          lenis?.off("scroll", onLenisScroll);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper?.params.navigation || typeof swiper.params.navigation === "boolean") {
      return;
    }

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33" borderBottom={true}>
        <div className="relative pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-0">
          <div
            ref={headerRef}
            className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between md:mb-12 lg:mb-0"
          >
            <h2
              ref={headingRef}
              className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>Why Commercial Insurance</span>{" "}
              <span data-split>
                Teams Trust CoverForce for Smarter Workflows
              </span>
            </h2>

            <div className="flex shrink-0 items-center gap-3 lg:hidden">
              <ArrowNavButton
                ref={prevRef}
                direction="prev"
                tone="dark"
                aria-label="Previous testimonial"
              />
              <ArrowNavButton
                ref={nextRef}
                direction="next"
                tone="dark"
                aria-label="Next testimonial"
              />
            </div>
          </div>

          <div className="lg:hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            speed={600}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className="review-swiper !overflow-visible"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
          </div>

          <div
            ref={desktopPinRef}
            className="relative hidden h-screen overflow-hidden lg:block"
          >
            <div
              ref={trackViewportRef}
              className="@container flex h-full items-center overflow-hidden"
            >
              <div
                ref={rowRef}
                onMouseLeave={() => animateCardHover(null)}
                className="group/review flex gap-6 pl-[20%] will-change-transform"
              >
                {testimonials.map((testimonial, i) => (
                  <div
                    key={testimonial.id}
                    ref={(el) => {
                      if (el) cardRefs.current[i] = el;
                    }}
                    className="relative w-[calc((80cqi-3rem)/1.95)] shrink-0 will-change-transform"
                  >
                    <div
                      ref={(el) => {
                        innerCardRefs.current[i] = el;
                      }}
                      onMouseEnter={() => animateCardHover(i)}
                      className="relative origin-center will-change-transform"
                    >
                      <TestimonialCard
                        testimonial={testimonial}
                        compact
                        overlayRef={(el) => {
                          overlayRefs.current[i] = el;
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Review;
