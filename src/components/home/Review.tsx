"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
} from "@remixicon/react";
import Container from "../common/Container";

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

      <div className="relative z-10 flex h-full flex-1 flex-col justify-between">
        <div className="size-20 shrink-0 overflow-hidden md:size-24">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={96}
            height={96}
            className="size-full object-cover"
          />
        </div>

        <blockquote className="max-w-3xl text-xl font-heading font-regular tracking-tight text-[#1a1a2e] md:text-2xl lg:text-4xl">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono font-medium uppercase tracking-[0.14em]  text-[#303030]">
              {testimonial.name}
            </p>
            <p className="text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#303030]">
              {testimonial.role}
            </p>
          </div>
          <CoalitionLogo />
        </div>
      </div>
    </article>
  );
}

const Review = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

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
    <section className="bg-[#141E4B] text-white">
      <Container borderColor="#FFFFFF1A" className="border-t border-[#FFFFFF1A]">
        <div className="relative overflow-hidden py-16 md:py-20 lg:py-24">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-12">
            <h2 className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
              Why Commercial Insurance{" "}
              <span className="text-white/40">Teams Trust CoverForce for Smarter Workflows</span>
            </h2>

            <div className="flex shrink-0 items-center gap-3">
              <button
                ref={prevRef}
                type="button"
                aria-label="Previous testimonial"
                className="review-prev flex size-11 shrink-0 items-center justify-center rounded-full border border-[#FFFFFF29] bg-transparent text-white transition-colors hover:bg-white/10"
              >
                <RiArrowLeftLine className="size-5" />
              </button>
              <button
                ref={nextRef}
                type="button"
                aria-label="Next testimonial"
                className="review-next flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0a143b] transition-opacity hover:opacity-90"
              >
                <RiArrowRightLine className="size-5" />
              </button>
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
