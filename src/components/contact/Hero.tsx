"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import MapPoints from "./MapPoints";
import ContactForm from "./ContactForm";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const form = formRef.current;
    const map = mapRef.current;
    const glow = glowRef.current;
    const label = labelRef.current;
    if (!container || !form || !map || !glow) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mapLayers = [map, glow];

    gsap.set(mapLayers, { yPercent: 100 });
    gsap.set(form, { autoAlpha: 1 });
    if (label) gsap.set(label, { autoAlpha: 1 });

    if (reducedMotion) {
      gsap.set(mapLayers, { yPercent: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    // Map rises over the full scroll; form fades out smoothly in the first half
    // so the fade stays visible above the map.
    tl.to(
      mapLayers,
      {
        yPercent: 0,
        ease: "none",
        duration: 1,
      },
      0,
    ).to(
      form,
      {
        autoAlpha: 0,
        ease: "power2.out",
        duration: 0.5,
      },
      0,
    );

    if (label) {
      tl.to(
        label,
        {
          autoAlpha: 0,
          ease: "power2.out",
          duration: 0.4,
        },
        0,
      );
    }

    const lenis = window.lenis;
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);

    return () => {
      lenis?.off("scroll", onLenisScroll);
    };
  });

  return (
    <section
      ref={containerRef}
      className="relative h-[200svh] bg-[#151f4d] text-white"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Glow rides with the map, but stays under form content */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 z-[15] h-full w-full will-change-transform"
          aria-hidden
        >
          <SectionRadialGlow className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div ref={formRef} className="absolute inset-0 z-30 will-change-[opacity]">
          <ContactForm />

          <div
            ref={labelRef}
            className="scroll-down-label pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center"
          >
            <div className="flex flex-col items-center gap-2 text-sm font-medium text-white/90">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80 motion-safe:animate-bounce"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="M19 12l-7 7-7-7" />
              </svg>
              <span>Scroll down</span>
            </div>
          </div>
        </div>

        <div
          ref={mapRef}
          className="us_map_bg absolute inset-0 z-20 h-full w-full will-change-transform"
        >
          <Canvas
            camera={{ position: [0, 0, 500], fov: 50 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <MapPoints />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default Hero;
