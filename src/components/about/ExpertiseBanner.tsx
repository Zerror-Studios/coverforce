"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ExpertiseBanner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      if (!section || !image) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (reducedMotion || isMobile) {
        gsap.set(image, { y: 0, clearProps: "transform" });
        return;
      }

      // Keep shift downward-only so Kaivan's headroom isn't cropped off the top.
      gsap.set(image, { y: 0, force3D: true });

      const tween = gsap.to(image, {
        y: 48,
        ease: "none",
        force3D: true,
        overwrite: "auto",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // smoothing lag instead of hard 1:1 scrub
          invalidateOnRefresh: true,
        },
      });

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);

      // Keep GSAP's ticker in sync with Lenis's rAF loop
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();

      return () => {
        lenis?.off("scroll", onLenisScroll);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[45svh] min-h-[45svh] w-full overflow-hidden sm:h-[60svh] sm:min-h-[60svh] md:h-svh md:min-h-svh"
    >
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform md:scale-105"
      >
        <Image
          src="/images/about/expertise.png"
          alt="A Convergence of Expertise"
          fill
          priority={false}
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>
    </section>
  );
};

export default ExpertiseBanner;