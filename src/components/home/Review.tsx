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
    <div className="flex items-center gap-2 text-[#0a143b]">
      <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#0a143b] text-xs font-bold">
        C
      </span>
      <span className="text-lg font-semibold tracking-tight">Coalition</span>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-white p-8 md:min-h-[360px] md:p-10 lg:min-h-[400px] lg:p-12">
      <div
        className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-[#E8D4F0]/60 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-8 size-20 shrink-0 overflow-hidden rounded-lg md:mb-10 md:size-24">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={96}
            height={96}
            className="size-full object-cover"
          />
        </div>

        <blockquote className="mb-auto max-w-3xl text-xl font-semibold leading-snug tracking-tight text-[#1a1a2e] md:text-2xl lg:text-[1.75rem] lg:leading-snug">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <div className="mt-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0a143b]">
              {testimonial.name}
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
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
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl lg:text-4xl">
            Why Commercial Insurance{" "}
            <span className="text-white/40">Teams Trust</span>
            <br />
            CoverForce for Smarter Workflows
          </h2>

          <div className="flex shrink-0 items-center gap-3">
            <button
              ref={prevRef}
              type="button"
              aria-label="Previous testimonial"
              className="review-prev flex size-11 items-center justify-center rounded-full border border-white/20 bg-[#1a1540] text-white transition-colors hover:bg-[#1a1540]/80"
            >
              <RiArrowLeftLine className="size-5" />
            </button>
            <button
              ref={nextRef}
              type="button"
              aria-label="Next testimonial"
              className="review-next flex size-12 items-center justify-center rounded-full bg-white text-[#0a143b] transition-opacity hover:opacity-90"
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
