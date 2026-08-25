"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
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
  company: string;
  avatar: string;
  logo: string;
  logoScale?: number;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "The partnership between ISU and CoverForce is opening the door to the future of the insurance industry, providing cutting-edge technology to our 225+ member agencies nationwide - increasing the ease of doing business.",
    name: "T.J. Ryan",
    role: "CEO, ISU Steadfast Agency Network",
    company: "ISU Steadfast Agency Network",
    avatar: "/images/testimonals/tj.webp",
    logo: "/images/testimonals/ISU Steadfast.png",
  },
  {
    id: "2",
    quote:
      "We have seen the number of applications processed by a single underwriter in a day skyrocket by 500%, with marked improvements in submission quality and customer win-rates due to increased speed and efficiency in data transmission.",
    name: "Danny Lee",
    role: "COO, International Underwriting Agency",
    company: "International Underwriting Agency",
    avatar: "/images/testimonals/Danny Lee.webp",
    logo: "/images/testimonals/International Underwriting Agency.png",
  },
  {
    id: "3",
    quote:
      "CoverForce's API enabled us to become fully operational with the top carriers within just 8 weeks. This rapid integration has allowed us to surpass our competitors, achieving more with significantly less cost and engineering resources. The swift and smooth process of integration with CoverForce highlights their expertise in engineering best practices, making them an ideal partner.",
    name: "Peter Germanov",
    role: "CEO, Momentum Agency Management Systems",
    company: "Momentum Agency Management Systems",
    avatar: "/images/testimonals/Peter Germanov.webp",
    logo: "/images/testimonals/momentum_nowcerts.png",
  },
  {
    id: "4",
    quote:
      "As a new brokerage, securing direct carrier appointments on our own was challenging. With CoverForce's support, we connected with the right carrier teams and were appointed in a matter of days, which would have been far more difficult and time-consuming on our own.",
    name: "Alex Ledbetter",
    role: "Founder, Delegance Brokerage",
    company: "Delegance Brokerage",
    avatar: "/images/testimonals/Alex Ledbetter.webp",
    logo: "/images/testimonals/Diligence Brokerage.png",
  },
  {
    id: "5",
    quote:
      "We went from kickoff to live in under two months. The CoverForce API was straightforward to work with - clean documentation, a sandbox that behaved like production, and a team that answered questions same-day. Multi-carrier quoting that would have taken us quarters to build ourselves was running in weeks.",
    name: "Jatin Sandilya",
    role: "Founder, Latent Insurance",
    company: "Latent Insurance",
    avatar: "/images/testimonals/Jatin Sandilya.webp",
    logo: "/images/testimonals/Latent Insurance.png",
    logoScale: 1.35,
  },
];

function CompanyLogo({
  src,
  alt,
  scale = 1,
  align = "right",
}: {
  src: string;
  alt: string;
  scale?: number;
  align?: "left" | "right";
}) {
  return (
    <div className="relative h-10 w-[160px] shrink-0 md:h-12 md:w-[200px]">
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain ${align === "left" ? "object-left" : "object-right"}`}
        sizes="(max-width: 768px) 160px, 200px"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: align === "left" ? "left center" : "right center",
        }}
      />
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="relative flex h-[420px] flex-col overflow-hidden rounded-sm bg-white p-5 sm:h-[340px] md:h-[380px] md:p-7 lg:h-[330px] xl:h-[450px] lg:p-8">
      <div className="relative z-10 flex h-full flex-1 flex-col">
        {/* Author — top on mobile, bottom-left on desktop */}
        <div className="relative order-1 shrink-0 md:order-2 md:mt-7">
          <div className="relative z-10 flex min-w-0 items-center gap-4 md:max-w-[70%] md:gap-5">
            <div className="size-16 shrink-0 overflow-hidden border-2 border-gray md:size-20">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={80}
                height={80}
                className="size-full object-cover object-[50%_20%]"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#303030] md:text-xs">
                {testimonial.name}
              </p>
              <p className="font-mono text-[0.625rem] font-normal uppercase tracking-[0.12em] text-[#303030]/55 md:text-[0.6875rem]">
                {testimonial.role}
              </p>
            </div>
          </div>

          {/* Logo — bottom-right on desktop only */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden opacity-90 md:block">
            <CompanyLogo
              src={testimonial.logo}
              alt={testimonial.company}
              scale={testimonial.logoScale}
              align="right"
            />
          </div>
        </div>

        {/* Quote — center on mobile, top on desktop */}
        <div className="order-2 flex flex-1 items-center overflow-hidden py-5 md:order-1 md:py-0">
          <blockquote className="line-clamp-6 w-full text-left text-xl font-heading font-regular leading-[1.35] tracking-tight text-[#1a1a2e] md:text-2xl lg:text-3xl lg:leading-[1.32]">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        </div>

        {/* Logo — bottom-left on mobile only */}
        <div className="order-3 mt-auto shrink-0 md:hidden">
          <CompanyLogo
            src={testimonial.logo}
            alt={testimonial.company}
            scale={testimonial.logoScale}
            align="left"
          />
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

      // One-time nudge: when the section is scrolling out of view (user
      // moving on to the next section), advance a single slide so people
      // notice the carousel even before autoplay would have ticked over.
      const st = ScrollTrigger.create({
        trigger: section,
        start: "bottom 90%",
        onEnter: () => swiperRef.current?.slideNext(),
      });

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);

      return () => {
        lenis?.off("scroll", onLenisScroll);
        st.kill();
      };
    },
    { scope: sectionRef },
  );

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
              className="max-w-xl text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl sm:leading-[1.12] md:text-[1.625rem] md:leading-[1.12]"
            >
              <span data-split>Why commercial insurance teams trust CoverForce for smarter workflows</span>
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
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            speed={600}
            loop
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
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