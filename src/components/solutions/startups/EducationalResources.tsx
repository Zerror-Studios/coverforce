"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import ArrowNavButton from "@/components/common/ArrowNavButton";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@/data/blogPosts";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

import "swiper/css";

type EducationalResourcesProps = {
  posts: BlogPost[];
};

export default function EducationalResources({
  posts,
}: EducationalResourcesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  if (!posts.length) return null;

  const showNav = posts.length > 2;

  const syncNav = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="overflow-hidden py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-5"
          >
            <div className="order-1 flex max-w-sm flex-col items-start gap-6 lg:col-start-1 lg:row-start-1">
              <h2
                ref={headingRef}
                className="text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Educational Resources</span>
              </h2>
            </div>

            <div className="order-2 flex w-full max-w-md flex-col items-start gap-6 text-left sm:ml-auto sm:items-end lg:col-start-2 lg:row-start-1">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] sm:text-right md:text-[1.125rem]"
              >
                Learn the essentials of launching a brokerage with founder-focused
                resources.
              </p>

              {showNav ? (
                <div className="flex shrink-0 items-center gap-3">
                  <ArrowNavButton
                    direction="prev"
                    tone="light"
                    aria-label="Previous articles"
                    disabled={isBeginning}
                    onClick={() => swiperRef.current?.slidePrev()}
                  />
                  <ArrowNavButton
                    direction="next"
                    tone="light"
                    aria-label="Next articles"
                    disabled={isEnd}
                    onClick={() => swiperRef.current?.slideNext()}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-10 md:mt-12 lg:mt-14">
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              slidesPerGroup={1}
              speed={600}
              watchOverflow
              breakpoints={{
                640: { slidesPerView: 2, slidesPerGroup: 1 },
                1024: { slidesPerView: 3, slidesPerGroup: 1 },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                syncNav(swiper);
              }}
              onSlideChange={syncNav}
              onResize={syncNav}
              onBreakpoint={syncNav}
              className="educational-resources-swiper !overflow-visible"
            >
              {posts.map((post) => (
                <SwiperSlide key={post.slug} className="!h-auto">
                  <BlogCard post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <Button href="/blog" className="mt-12">
            View all articles
          </Button>
        </div>
      </Container>
    </section>
  );
}
