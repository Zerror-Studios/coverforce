"use client";
import Container from "../common/Container";
import SectionRadialGlow from "../common/SectionRadialGlow";
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import MapPoints from './MapPoints';
import ContactForm from "./ContactForm";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const form = formRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    tl.to(".us_map_bg", {
      opacity: 0.05,
    });

    if (form) {
      gsap.to(".scroll-down-label", {
        opacity: 0,
        scrollTrigger: {
          trigger: form,
          start: "top bottom",
          end: "top 70%",
          scrub: true,
        },
      });
    }
  });

  return (
    <section ref={containerRef}  className="relative bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33" className="relative">
        <SectionRadialGlow className="absolute opacity-80! left-1/2 top-[18%] z-0 w-screen max-w-7xl -translate-x-1/2 blur-[5.5rem] md:top-[18%] md:w-[95vw]" />
      </Container>

      <div className="us_map_bg w-full h-screen sticky top-0 overflow-hidden z-10">
        <Canvas
          camera={{ position: [0, 0, 500], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <MapPoints />
          </Suspense>
        </Canvas>

        <div className="scroll-down-label pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
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

      <div ref={formRef}>
        <ContactForm />
      </div>
    </section>
  );
};

export default Hero;
