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
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const overlay = overlayRef.current;
      const section = sectionRef.current;
      if (!container || !overlay || !section) return;

      gsap.set(container, {
        y: 0,
        force3D: true,
        backfaceVisibility: "hidden",
      });
      gsap.set(overlay, { opacity: 0, pointerEvents: "none" });

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

      const overlayTl = gsap.timeline({
        scrollTrigger: {
          ...scrollConfig,
          start: "bottom center",
          end: scrollEnd,
        },
      });

      overlayTl.to(overlay, {
        opacity: 0.85,
        ease: "none",
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
        overlayTl.scrollTrigger?.kill();
        overlayTl.kill();
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
          src="/images/about/about.webp"
          alt="about-hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-black/40"
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

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 bg-[#080808]"
        aria-hidden
      />
    </section>
  );
};

export default Hero;
