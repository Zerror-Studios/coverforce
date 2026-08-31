"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import ArrowNavButton from "@/components/common/ArrowNavButton";
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
  logo: string;
  logoScale?: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "As a new brokerage, securing direct carrier appointments on our own was challenging. With CoverForce's support, we connected with the right carrier teams and were appointed in a matter of days, which would have been far more difficult and time-consuming on our own.",
    name: "Alex Ledbetter",
    role: "Founder, Delegance Brokerage",
    company: "Delegance Brokerage",
    avatar: "/images/testimonals/Alex Ledbetter.webp",
    logo: "/images/testimonals/delegance.svg",
  },
  {
    id: "2",
    quote:
      "We went from kickoff to live in under two months. The CoverForce API was straightforward to work with - clean documentation, a sandbox that behaved like production, and a team that answered questions same-day. Multi-carrier quoting that would have taken us quarters to build ourselves was running in weeks.",
    name: "Jatin Sandilya",
    role: "Founder, Latent Insurance",
    company: "Latent Insurance",
    avatar: "/images/testimonals/Jatin Sandilya.png",
    logo: "/images/testimonals/latent.svg",
    logoScale: 1.35,
  },
  {
    id: "3",
    quote:
      "Building bindable, multi-carrier quoting ourselves would've meant a team we didn't have. With CoverForce, we went from idea to a live, bindable flow in about three weeks — without adding a single engineer.",
    name: "Gary McCarthy",
    role: "Founder, Snapbind",
    company: "Snapbind",
    avatar: "/images/testimonals/gary mccarthy.png",
    logo: "/images/testimonals/snapbind.svg",
  },
];

function CompanyLogo({
  src,
  alt,
  scale = 1,
}: {
  src: string;
  alt: string;
  scale?: number;
}) {
  return (
    <div className="relative h-10 w-[148px] shrink-0 md:h-11 md:w-[168px]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-right"
        sizes="(max-width: 768px) 148px, 168px"
        style={{ transform: `scale(${scale})`, transformOrigin: "right center" }}
      />
    </div>
  );
}

function TestimonialCard({
  testimonial,
  variant = "grid",
}: {
  testimonial: Testimonial;
  variant?: "carousel" | "grid";
}) {
  const isCarousel = variant === "carousel";

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-sm bg-white p-5 md:p-6 ${
        isCarousel
          ? "h-[340px] sm:h-[320px] md:h-[340px]"
          : "min-h-80 lg:min-h-[320px] xl:min-h-[380px]"
      }`}
    >
      <div className="relative z-10 flex h-full flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <div className="size-12 shrink-0 overflow-hidden md:size-14">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={56}
              height={56}
              className="size-full object-cover object-[50%_20%]"
            />
          </div>

          <div className="space-y-0.5">
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#303030]">
              {testimonial.name}
            </p>
            <p className="font-mono text-[0.625rem] font-normal uppercase tracking-[0.12em] text-[#303030]/55 md:text-[0.6875rem]">
              {testimonial.role}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center py-5 md:py-6">
          <blockquote
            className={`w-full text-left text-lg font-heading font-regular leading-[1.38] tracking-tight text-[#1a1a2e] md:text-xl md:leading-[1.35] lg:text-[1.375rem] lg:leading-[1.32] ${
              isCarousel ? "line-clamp-6" : ""
            }`}
          >
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        </div>

        <div className="mt-auto flex shrink-0 justify-end pt-2">
          <CompanyLogo
            src={testimonial.logo}
            alt={testimonial.company}
            scale={testimonial.logoScale}
          />
        </div>
      </div>
    </article>
  );
}

export default function StartupTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    theme: "dark",
  });

  return (
    <section
      ref={sectionRef}
      data-header-surface="dark"
      className="bg-[#151f4d] text-white"
    >
      <Container borderColor="#FFFFFF33" className="border-t border-[#FFFFFF1A]">
        <div className="relative overflow-hidden py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-12"
          >
            <div className="max-w-2xl">
              <EyebrowPill surface="dark" className="mb-0">
                What Founders Say
              </EyebrowPill>
              <h2
                ref={headingRef}
                className="mt-5 max-w-md text-2xl font-heading font-medium leading-[1.12] tracking-tight text-[#9AA8BC] sm:text-3xl md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Built for builders like you.</span>
              </h2>
            </div>

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
              modules={[Navigation, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              speed={600}
              loop
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
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
              className="startup-testimonials-swiper !overflow-visible"
            >
              {TESTIMONIALS.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="h-auto">
                  <TestimonialCard testimonial={testimonial} variant="carousel" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="hidden gap-6 lg:grid lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
