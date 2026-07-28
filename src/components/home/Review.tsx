"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  company: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "The platform simplifies complex insurance workflows, improves accuracy, and helps our team respond to brokers with greater speed and confidence.",
    name: "Daniel Briggs",
    role: "Sr. Director of Sales",
    company: "Coalition",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    quote:
      "We cut submission time while improving carrier matches, giving our underwriters more time to evaluate the opportunities that matter.",
    name: "Sarah Chen",
    role: "VP of Underwriting",
    company: "Coalition",
    avatar:
      "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    quote:
      "CoverForce gives us one workflow from intake to bind—fewer errors, faster quotes, and less back-and-forth with carriers.",
    name: "Marcus Webb",
    role: "Head of Distribution",
    company: "Coalition",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop",
  },
];

function CoalitionLogo() {
  return (
    <div className="relative h-14 w-[220px] shrink-0 md:h-16 md:w-[264px]">
      <Image
        src="/images/review%20logo.png"
        alt="Coalition"
        fill
        className="object-contain object-right"
        sizes="(max-width: 768px) 220px, 264px"
      />
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="relative flex min-h-[360px] flex-col overflow-hidden rounded-sm bg-white p-6 md:min-h-[440px] md:p-8 lg:min-h-[520px] lg:p-10">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_0%,rgba(203,190,255,0.45),rgba(255,255,255,0.95)_72%)]"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-1 flex-col">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="size-16 shrink-0 overflow-hidden md:size-20">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={80}
              height={80}
              className="size-full object-cover object-[50%_20%]"
            />
          </div>

          <div className="space-y-1">
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#303030] md:text-xs">
              {testimonial.name}
            </p>
            <p className="font-mono text-[0.625rem] font-normal uppercase tracking-[0.12em] text-[#303030]/55 md:text-[0.6875rem]">
              {testimonial.role}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center px-2 md:px-4">
          <blockquote className="max-w-3xl text-left text-2xl font-heading font-regular leading-[1.35] tracking-tight text-[#1a1a2e] md:text-3xl lg:text-4xl lg:leading-[1.3]">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        </div>

        <div className="mt-8 flex justify-end md:mt-10">
          <CoalitionLogo />
        </div>
      </div>
    </article>
  );
}

const Review = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, theme: "dark" });

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      let scrollTrigger: ScrollTrigger | null = null;
      let rafId = 0;

      const bindScrollTrigger = () => {
        const swiper = swiperRef.current;
        if (!swiper) {
          rafId = window.requestAnimationFrame(bindScrollTrigger);
          return;
        }

        scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom",
          end: "bottom center",
          onUpdate: (self) => {
            const nextIndex = self.progress >= 0.5 ? 1 : 0;
            if (swiper.activeIndex <= 1 && swiper.activeIndex !== nextIndex) {
              swiper.slideTo(nextIndex);
            }
          },
        });
      };

      bindScrollTrigger();

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);
      ScrollTrigger.refresh();

      return () => {
        window.cancelAnimationFrame(rafId);
        scrollTrigger?.kill();
        lenis?.off("scroll", onLenisScroll);
      };
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
    <section ref={sectionRef} className="bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33" className="border-t border-[#FFFFFF1A]">
        <div className="relative overflow-hidden py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-12"
          >
            <h2
              ref={headingRef}
              className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#9AA8BC] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>Why Commercial Insurance</span>{" "}
              <span data-split>
                Teams Trust CoverForce for Smarter Workflows
              </span>
            </h2>

            <div className="flex shrink-0 items-center gap-3">
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

          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
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
      </Container>
    </section>
  );
};

export default Review;