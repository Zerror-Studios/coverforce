"use client";

import { useRef } from "react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import BlogCard from "@/components/blog/BlogCard";
import { BASE_BLOG_POSTS } from "@/data/blogPosts";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

const FEATURED_POSTS = BASE_BLOG_POSTS.slice(0, 3);

export default function EducationalResources() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="py-16 md:py-20 lg:py-24">
          <div
            ref={headerRef}
            className="mb-24 flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-5"
          >
            <div className="order-1 flex max-w-sm flex-col items-start gap-6 lg:col-start-1 lg:row-start-1">
              <h2
                ref={headingRef}
                className="text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>Everything you need to get up to speed.</span>
              </h2>

              <Button href="/blog">View all articles</Button>
            </div>

            <div className="order-2 flex max-w-md flex-col items-start gap-6 text-left lg:col-start-2 lg:row-start-1 lg:ml-auto lg:items-end">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                Launching a brokerage means learning a new language fast. These resources
                are written specifically for insurtech founders - no fluff, no assumed
                knowledge.
              </p>
            </div>

          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-12 lg:mt-14 lg:grid-cols-3">
            {FEATURED_POSTS.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
