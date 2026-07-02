"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ArrowNavButton from "../common/ArrowNavButton";
import Container from "../common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

import "swiper/css";
import "swiper/css/navigation";

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
      "The platform simplifies complex commercial insurance workflows, with greater accuracy",
    name: "Daniel Briggs",
    role: "Sr. Director of Sales",
    company: "Coalition",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "2",
    quote:
      "We cut submission time dramatically while improving carrier match rates across our book.",
    name: "Sarah Chen",
    role: "VP of Underwriting",
    company: "Coalition",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "3",
    quote:
      "CoverForce gives our team one workflow from intake to bind — fewer errors, faster quotes.",
    name: "Marcus Webb",
    role: "Head of Distribution",
    company: "Coalition",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="relative flex min-h-[320px] flex-col overflow-hidden rounded-sm bg-white p-7 md:min-h-[420px] md:p-9 lg:min-h-[520px] lg:p-10"
    >
      <div className="pointer-events-none absolute -translate-y-1/6 left-1/2 z-0 h-[180%] w-[120%] -translate-x-1/2 md:-top-24 lg:-top-28">
        <Image
          src="/images/secondcardbg.svg"
          alt=""
          fill
          className="h-full w-full object-cover object-bottom"
          sizes="100vw"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex h-full flex-1 flex-col">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="size-16 shrink-0 overflow-hidden rounded-full md:size-20">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={96}
              height={96}
              className="size-full object-cover"
            />
          </div>
          <div className="pt-1">
            <p className="font-sans text-lg font-medium tracking-tight text-[#303030] md:text-xl">
              {testimonial.name}
            </p>
            <p className="mt-1 font-sans text-base font-regular tracking-tight text-[#303030]/90 md:text-lg">
              {testimonial.company}
            </p>
          </div>
        </div>

        <blockquote className="mt-auto max-w-[16ch] text-[1.65rem] font-heading font-regular leading-[1.3] tracking-tight text-[#303030] md:max-w-[17ch] md:text-[2rem] lg:max-w-[18ch] lg:text-[2.35rem]">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
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
      <Container borderColor="#FFFFFF33" borderBottom={true}>
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
      </Container>
    </section>
  );
};

export default Review;
