"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import HeroReveal from "@/components/common/HeroReveal";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const section = sectionRef.current;
      if (!container || !section) return;

      gsap.set(container, {
        y: 0,
        force3D: true,
        backfaceVisibility: "hidden",
      });

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (reducedMotion || isMobile) return;

      const getShift = () => container.offsetHeight;

      const scrollEnd = "bottom -180%";
      const scrollConfig = {
        trigger: section,
        scrub: 0.35,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
      };

      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          ...scrollConfig,
          start: "bottom bottom",
          end: scrollEnd,
        },
      });

      parallaxTl.to(container, {
        y: getShift,
        ease: "none",
        force3D: true,
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
        parallaxTl.scrollTrigger?.kill();
        parallaxTl.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-30 h-svh min-h-svh overflow-hidden text-white"
    >
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden will-change-transform"
      >
        <Image
          src="/images/about/about-banner-mobile.webp"
          alt="about-hero"
          fill
          priority
          className="object-cover object-top lg:hidden"
          sizes="100vw"
        />
        <Image
          src="/images/about/about-banner.webp"
          alt="about-hero"
          fill
          priority
          className="hidden object-cover object-top lg:block"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-black/80 via-black/30 to-transparent sm:h-[40%]"
          aria-hidden
        />

        <Container
          borderColor="#FFFFFF33"
          className="relative flex h-svh min-h-svh items-end pb-14 md:pb-20 lg:pb-24"
        >
          <HeroReveal className="max-w-xl text-left md:max-w-2xl lg:max-w-4xl">
            <h1 className="text-3xl font-heading font-normal leading-[1.12] tracking-tight md:text-4xl lg:text-6xl lg:leading-[1.08] xl:text-6xl">
              Building intelligent infrastructure for commercial insurance distribution.
            </h1>
          </HeroReveal>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
