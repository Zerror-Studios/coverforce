"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import HeroReveal from "@/components/common/HeroReveal";
import EyebrowPill from "@/components/common/EyebrowPill";

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
          src="/images/careers/hero.webp"
          alt="careers-hero"
          fill
          priority
          className="object-cover object-center lg:object-[50%_60%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden />

        <Container
          borderColor="#FFFFFF33"
          className="relative flex h-svh min-h-svh items-center justify-center"
        >
          <HeroReveal className="flex max-w-4xl flex-col items-center text-center">
            <EyebrowPill surface="dark" className="mx-auto mb-0">
              Careers
            </EyebrowPill>

            <h1 className="mt-4 text-4xl font-heading font-normal leading-[1.08] tracking-tight md:text-5xl lg:whitespace-nowrap lg:text-6xl lg:leading-[1.05] xl:text-6xl">
              Join a team of
              <br />
              Industry Experts
            </h1>

            <div className="mt-10 md:mt-12">
              <Button href="/careers#positions" balanced surface="on-dark">
                Explore open positions
              </Button>
            </div>
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
