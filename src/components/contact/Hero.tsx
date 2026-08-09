"use client";

import React, { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MapPoints, { MobileOfficePopup } from "./MapPoints";
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
  const [activeOffice, setActiveOffice] = useState<string | null>(null);

  const handleActiveOfficeChange = useCallback((office: string | null) => {
    setActiveOffice(office);
  }, []);

  const closeOfficePopup = useCallback(() => {
    setActiveOffice(null);
  }, []);

  useGSAP(() => {
    const container = containerRef.current;
    const form = formRef.current;
    const map = mapRef.current;
    const glow = glowRef.current;
    if (!container || !form || !map || !glow) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mapLayers = [map, glow];
    // Keep a strip of the map visible under the form so it’s clear more content is below.
    const mapPeekStart = 90;

    gsap.set(mapLayers, { yPercent: mapPeekStart });
    gsap.set(form, { autoAlpha: 1 });

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

    // Map rises from the peek position to fill the viewport; form fades in the first half.
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
              <MapPoints
                activeOffice={activeOffice}
                onActiveOfficeChange={handleActiveOfficeChange}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <MobileOfficePopup office={activeOffice} onClose={closeOfficePopup} />
    </section>
  );
};

export default Hero;
