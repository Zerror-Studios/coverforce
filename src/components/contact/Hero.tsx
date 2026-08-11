"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import MapPoints, {
  MobileOfficeAddresses,
  MobileOfficePopup,
} from "./MapPoints";
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
  // Default false so SSR / first paint never locks the form into 100vh.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleActiveOfficeChange = useCallback((office: string | null) => {
    setActiveOffice(office);
  }, []);

  const closeOfficePopup = useCallback(() => {
    setActiveOffice(null);
  }, []);

  useGSAP(
    () => {
      if (!isDesktop) return;

      const container = containerRef.current;
      const form = formRef.current;
      const map = mapRef.current;
      const glow = glowRef.current;
      if (!container || !form || !map || !glow) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const mapLayers = [map, glow];
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
    },
    { dependencies: [isDesktop] },
  );

  if (!isDesktop) {
    return (
      <section className="relative bg-[#151f4d] text-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(70vh,32rem)] overflow-hidden"
          aria-hidden
        >
          <SectionRadialGlow className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10">
          <ContactForm />
          <MobileOfficeAddresses />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[200svh] bg-[#151f4d] text-white"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
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
