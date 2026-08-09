"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

type CarrierResult = {
  id: string;
  logo: string;
  logoAlt: string;
  title: string;
  description: string;
};

const carrierResults: CarrierResult[] = [
  {
    id: "employers",
    logo: "/images/carrier-employers.png",
    logoAlt: "Employers",
    title: "0% Error Rate",
    description:
      "Only integration partner to achieve 0% API error rate on submission data.",
  },
  {
    id: "nationwide",
    logo: "/images/carrier - Nationwide.png",
    logoAlt: "Nationwide",
    title: "Live in 12 Weeks",
    description:
      "BOP integration: under 12 weeks, less than 10 hours carrier eng time.",
  },
  {
    id: "chubb",
    logo: "/images/carrier - Chubb.png",
    logoAlt: "Chubb",
    title: "Trust & Quality",
    description:
      "Submission quality → first wholesale partner appointed in 2+ years.",
  },
  {
    id: "liberty",
    logo: "/images/carrier - Liberty Mutual.png",
    logoAlt: "Liberty Mutual",
    title: "5-Point Bind Advantage",
    description:
      "CoverForce submissions score 5 points higher on Liberty Mutual’s bindability criteria.",
  },
];

function CarrierLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-10 w-[132px] max-w-full md:h-11 md:w-[148px]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-left brightness-0 invert"
        sizes="(max-width: 768px) 132px, 148px"
      />
    </div>
  );
}

function CarrierCard({ result }: { result: CarrierResult }) {
  return (
    <article className="flex flex-col gap-6 border-t border-white/10 pt-8 first:border-t-0 first:pt-0 sm:gap-8 sm:border-t-0 sm:pt-0 lg:gap-12 lg:px-8 xl:px-10 first:lg:pl-0 last:lg:pr-0">
      <div className="min-h-[2.5rem] sm:min-h-[2.75rem]">
        <CarrierLogo src={result.logo} alt={result.logoAlt} />
      </div>
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-lg font-heading font-regular tracking-tight text-white sm:text-xl">
          {result.title}
        </h3>
        <p className="max-w-none text-sm font-sans font-regular leading-relaxed text-white/55 sm:max-w-[240px]">
          {result.description}
        </p>
      </div>
    </article>
  );
}

const CarrierResults = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, theme: "dark" });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      const overlay = overlayRef.current;
      if (!section || !container || !overlay) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isSmallDevice = window.matchMedia("(max-width: 1023px)").matches;

      gsap.set(container, {
        y: 0,
        scale: 1,
        force3D: true,
        transformOrigin: "50% 50%",
        backfaceVisibility: "hidden",
      });
      gsap.set(overlay, { opacity: 0, pointerEvents: "none" });

      if (reducedMotion || isSmallDevice) return;

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
        scale: 0.8,
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
    <section ref={sectionRef} className="relative z-30 overflow-hidden bg-[#151f4d] text-white">
      <div ref={containerRef} className="relative z-10 overflow-hidden lg:will-change-transform">
        <Container borderColor="#FFFFFF33" borderBottom={true} className="relative">
          <SectionRadialGlow className="absolute left-1/2 top-[10%] z-0 -translate-x-1/2 md:top-[12%]" />
          <div
            className="absolute left-0 -top-20 z-0 hidden w-full opacity-75 lg:block lg:h-full"
            aria-hidden
          >
            {/*
              Original SVG kept pixel-perfect.
              Triangles/squares removed (display:none groups dropped).
              Dots added via animateMotion on <defs> path refs -
              one dot from the right edge flowing left to center,
              one from the left edge flowing right to center,
              both shrink+fade at the midpoint.
            */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 500"
              width="1440"
              height="500"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)", contentVisibility: "visible" }}
            >
              <defs>
                <clipPath id="__lottie_element_36">
                  <rect width="1440" height="500" x="0" y="0" />
                </clipPath>
                {/* Motion paths use the original local coordinates so dots stay locked to the rendered curves. */}
                <path
                  id="dot-path-L1"
                  d="M450.1409912109375,-120.7249984741211 C450.1409912109375,-120.7249984741211 349.8590087890625,-120.7249984741211 349.8590087890625,-120.7249984741211 C-11.593999862670898,-120.7249984741211 56.999000549316406,120.7249984741211 -380.1409912109375,120.7249984741211 C-380.1409912109375,120.7249984741211 -450.1409912109375,120.7249984741211 -450.1409912109375,120.7249984741211"
                />
                <path
                  id="dot-path-R1"
                  d="M450.1409912109375,120.7249984741211 C450.1409912109375,120.7249984741211 380.1409912109375,120.7249984741211 380.1409912109375,120.7249984741211 C-56.999000549316406,120.7249984741211 11.593999862670898,-120.7249984741211 -349.8590087890625,-120.7249984741211 C-349.8590087890625,-120.7249984741211 -450.1409912109375,-120.7249984741211 -450.1409912109375,-120.7249984741211"
                />
                <path id="dot-path-L2" d="M-450.1409912109375,0 C-450.1409912109375,0 349.8590087890625,0 349.8590087890625,0 C349.8590087890625,0 450.1409912109375,0 450.1409912109375,0" />
                <path id="dot-path-R2" d="M450.1409912109375,0 C450.1409912109375,0 -349.8590087890625,0 -349.8590087890625,0 C-349.8590087890625,0 -450.1409912109375,0 -450.1409912109375,0" />
                <path
                  id="dot-path-L3"
                  d="M-450.1409912109375,60.224998474121094 C-450.1409912109375,60.224998474121094 -380.1409912109375,60.224998474121094 -380.1409912109375,60.224998474121094 C-13.807999610900879,60.224998474121094 -13.807999610900879,-60.224998474121094 349.8590087890625,-60.224998474121094 C349.8590087890625,-60.224998474121094 450.1409912109375,-60.224998474121094 450.1409912109375,-60.224998474121094"
                />
                <path
                  id="dot-path-R3"
                  d="M450.1409912109375,60.224998474121094 C450.1409912109375,60.224998474121094 380.1409912109375,60.224998474121094 380.1409912109375,60.224998474121094 C-0.42100000381469727,60.224998474121094 -0.42500001192092896,-60.224998474121094 -349.8590087890625,-60.224998474121094 C-349.8590087890625,-60.224998474121094 -450.1409912109375,-60.224998474121094 -450.1409912109375,-60.224998474121094"
                />
                <path
                  id="dot-path-L4"
                  d="M-450.1409912109375,-60.224998474121094 C-450.1409912109375,-60.224998474121094 -380.1409912109375,-60.224998474121094 -380.1409912109375,-60.224998474121094 C-13.807999610900879,-60.224998474121094 -13.807999610900879,60.224998474121094 349.8590087890625,60.224998474121094 C349.8590087890625,60.224998474121094 450.1409912109375,60.224998474121094 450.1409912109375,60.224998474121094"
                />
                <path
                  id="dot-path-R4"
                  d="M450.1409912109375,-60.224998474121094 C450.1409912109375,-60.224998474121094 380.1409912109375,-60.224998474121094 380.1409912109375,-60.224998474121094 C-0.42100000381469727,-60.224998474121094 -0.42100000381469727,60.224998474121094 -349.8590087890625,60.224998474121094 C-349.8590087890625,60.224998474121094 -450.1409912109375,60.224998474121094 -450.1409912109375,60.224998474121094"
                />
                <path
                  id="dot-path-L5"
                  d="M-450.1409912109375,-120.7249984741211 C-450.1409912109375,-120.7249984741211 -380.1409912109375,-120.7249984741211 -380.1409912109375,-120.7249984741211 C67.81500244140625,-120.7249984741211 -11.258999824523926,120.7249984741211 349.8590087890625,120.7249984741211 C349.8590087890625,120.7249984741211 450.1409912109375,120.7249984741211 450.1409912109375,120.7249984741211"
                />
                <path
                  id="dot-path-R5"
                  d="M450.1409912109375,-120.7249984741211 C450.1409912109375,-120.7249984741211 380.1409912109375,-120.7249984741211 380.1409912109375,-120.7249984741211 C-67.81500244140625,-120.7249984741211 11.258999824523926,120.7249984741211 -349.8590087890625,120.7249984741211 C-349.8590087890625,120.7249984741211 -450.1409912109375,120.7249984741211 -450.1409912109375,120.7249984741211"
                />
              </defs>

              <g clipPath="url(#__lottie_element_36)">

                {/* ── ORIGINAL STATIC LINES (kept exactly) ── */}

                {/* Bottom-left outer curve */}
                <g transform="matrix(1,0,0,1,1170.1409912109375,370.7250061035156)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" stroke="#FFFFFF33" strokeWidth="1" d=" M450.1409912109375,120.7249984741211 C450.1409912109375,120.7249984741211 380.1409912109375,120.7249984741211 380.1409912109375,120.7249984741211 C-56.999000549316406,120.7249984741211 11.593999862670898,-120.7249984741211 -349.8590087890625,-120.7249984741211 C-349.8590087890625,-120.7249984741211 -450.1409912109375,-120.7249984741211 -450.1409912109375,-120.7249984741211" />
                  </g>
                </g>
                <g transform="matrix(1,0,0,1,269.8590087890625,370.7250061035156)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" stroke="#FFFFFF33" strokeWidth="1" d=" M450.1409912109375,-120.7249984741211 C450.1409912109375,-120.7249984741211 349.8590087890625,-120.7249984741211 349.8590087890625,-120.7249984741211 C-11.593999862670898,-120.7249984741211 56.999000549316406,120.7249984741211 -380.1409912109375,120.7249984741211 C-380.1409912109375,120.7249984741211 -450.1409912109375,120.7249984741211 -450.1409912109375,120.7249984741211" />
                  </g>
                </g>

                {/* Dashed curves upper */}
                <g transform="matrix(1,0,0,1,1170.1409912109375,310.2250061035156)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" strokeDasharray="1 5" strokeDashoffset="0" stroke="rgb(153,153,153)" strokeOpacity="1" strokeWidth="1" d=" M450.1409912109375,60.224998474121094 C450.1409912109375,60.224998474121094 380.1409912109375,60.224998474121094 380.1409912109375,60.224998474121094 C-0.42100000381469727,60.224998474121094 -0.42500001192092896,-60.224998474121094 -349.8590087890625,-60.224998474121094 C-349.8590087890625,-60.224998474121094 -450.1409912109375,-60.224998474121094 -450.1409912109375,-60.224998474121094" />
                  </g>
                </g>
                <g transform="matrix(1,0,0,1,269.8590087890625,310.2250061035156)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" strokeDasharray="1 5" strokeDashoffset="0" stroke="rgb(153,153,153)" strokeOpacity="1" strokeWidth="1" d=" M-450.1409912109375,60.224998474121094 C-450.1409912109375,60.224998474121094 -380.1409912109375,60.224998474121094 -380.1409912109375,60.224998474121094 C-13.807999610900879,60.224998474121094 -13.807999610900879,-60.224998474121094 349.8590087890625,-60.224998474121094 C349.8590087890625,-60.224998474121094 450.1409912109375,-60.224998474121094 450.1409912109375,-60.224998474121094" />
                  </g>
                </g>

                {/* Straight center lines */}
                <g transform="matrix(1,0,0,1,1170.1409912109375,250)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" stroke="#FFFFFF33" strokeWidth="1" d=" M450.1409912109375,0 C450.1409912109375,0 -349.8590087890625,0 -349.8590087890625,0 C-349.8590087890625,0 -450.1409912109375,0 -450.1409912109375,0" />
                  </g>
                </g>
                <g transform="matrix(1,0,0,1,269.8590087890625,250)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" stroke="#FFFFFF33" strokeWidth="1" d=" M-450.1409912109375,0 C-450.1409912109375,0 349.8590087890625,0 349.8590087890625,0 C349.8590087890625,0 450.1409912109375,0 450.1409912109375,0" />
                  </g>
                </g>

                {/* Dashed curves lower */}
                <g transform="matrix(1,0,0,1,1170.1409912109375,189.77499389648438)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" strokeDasharray="1 5" strokeDashoffset="0" stroke="rgb(153,153,153)" strokeOpacity="1" strokeWidth="1" d=" M450.1409912109375,-60.224998474121094 C450.1409912109375,-60.224998474121094 380.1409912109375,-60.224998474121094 380.1409912109375,-60.224998474121094 C-0.42100000381469727,-60.224998474121094 -0.42100000381469727,60.224998474121094 -349.8590087890625,60.224998474121094 C-349.8590087890625,60.224998474121094 -450.1409912109375,60.224998474121094 -450.1409912109375,60.224998474121094" />
                  </g>
                </g>
                <g transform="matrix(1,0,0,1,269.8590087890625,189.77499389648438)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" strokeDasharray="1 5" strokeDashoffset="0" stroke="rgb(153,153,153)" strokeOpacity="1" strokeWidth="1" d=" M-450.1409912109375,-60.224998474121094 C-450.1409912109375,-60.224998474121094 -380.1409912109375,-60.224998474121094 -380.1409912109375,-60.224998474121094 C-13.807999610900879,-60.224998474121094 -13.807999610900879,60.224998474121094 349.8590087890625,60.224998474121094 C349.8590087890625,60.224998474121094 450.1409912109375,60.224998474121094 450.1409912109375,60.224998474121094" />
                  </g>
                </g>

                {/* Outer solid curves - top */}
                <g transform="matrix(1,0,0,1,1170.1409912109375,129.27499389648438)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" stroke="#FFFFFF33" strokeWidth="1" d=" M450.1409912109375,-120.7249984741211 C450.1409912109375,-120.7249984741211 380.1409912109375,-120.7249984741211 380.1409912109375,-120.7249984741211 C-67.81500244140625,-120.7249984741211 11.258999824523926,120.7249984741211 -349.8590087890625,120.7249984741211 C-349.8590087890625,120.7249984741211 -450.1409912109375,120.7249984741211 -450.1409912109375,120.7249984741211" />
                  </g>
                </g>
                <g transform="matrix(1,0,0,1,269.8590087890625,129.27499389648438)" opacity="1" style={{ display: "block" }}>
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="4" stroke="#FFFFFF33" strokeWidth="1" d=" M-450.1409912109375,-120.7249984741211 C-450.1409912109375,-120.7249984741211 -380.1409912109375,-120.7249984741211 -380.1409912109375,-120.7249984741211 C67.81500244140625,-120.7249984741211 -11.258999824523926,120.7249984741211 349.8590087890625,120.7249984741211 C349.8590087890625,120.7249984741211 450.1409912109375,120.7249984741211 450.1409912109375,120.7249984741211" />
                  </g>
                </g>

                {/* ── ANIMATED DOTS locked to the exact original path geometry ── */}
                <g transform="matrix(1,0,0,1,269.8590087890625,250)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3s" begin="0s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-L2" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3s" begin="0s" repeatCount="indefinite" />
                  </circle>
                </g>
                <g transform="matrix(1,0,0,1,1170.1409912109375,250)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3s" begin="0s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-R2" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3s" begin="0s" repeatCount="indefinite" />
                  </circle>
                </g>

                <g transform="matrix(1,0,0,1,269.8590087890625,310.2250061035156)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.4s" begin="0.5s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-L3" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.4s" begin="0.5s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.4s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                </g>
                <g transform="matrix(1,0,0,1,1170.1409912109375,310.2250061035156)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.4s" begin="0.5s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-R3" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.4s" begin="0.5s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.4s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                </g>

                <g transform="matrix(1,0,0,1,269.8590087890625,189.77499389648438)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.4s" begin="1.1s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-L4" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.4s" begin="1.1s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.4s" begin="1.1s" repeatCount="indefinite" />
                  </circle>
                </g>
                <g transform="matrix(1,0,0,1,1170.1409912109375,189.77499389648438)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.4s" begin="1.1s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-R4" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.4s" begin="1.1s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.4s" begin="1.1s" repeatCount="indefinite" />
                  </circle>
                </g>

                <g transform="matrix(1,0,0,1,269.8590087890625,129.27499389648438)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.8s" begin="0.25s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-L5" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.8s" begin="0.25s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.8s" begin="0.25s" repeatCount="indefinite" />
                  </circle>
                </g>
                <g transform="matrix(1,0,0,1,1170.1409912109375,129.27499389648438)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.8s" begin="0.25s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-R5" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.8s" begin="0.25s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.8s" begin="0.25s" repeatCount="indefinite" />
                  </circle>
                </g>

                <g transform="matrix(1,0,0,1,269.8590087890625,370.7250061035156)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.8s" begin="1.7s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-L1" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.8s" begin="1.7s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.8s" begin="1.7s" repeatCount="indefinite" />
                  </circle>
                </g>
                <g transform="matrix(1,0,0,1,1170.1409912109375,370.7250061035156)">
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion dur="3.8s" begin="1.7s" repeatCount="indefinite" rotate="none">
                      <mpath href="#dot-path-R1" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.72;1" dur="3.8s" begin="1.7s" repeatCount="indefinite" />
                    <animate attributeName="r" values="0;3;3;0" keyTimes="0;0.08;0.75;1" dur="3.8s" begin="1.7s" repeatCount="indefinite" />
                  </circle>
                </g>

              </g>
            </svg>
          </div>
          <div className="relative py-12 md:py-20 lg:py-24">
            <div className="relative z-10 flex flex-col gap-10 lg:gap-62">
              {/* Header */}
              <div ref={headerRef} className="flex flex-col justify-end space-y-5">
                <h2
                  ref={headingRef}
                  className="max-w-2xl text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                >
                  <span data-split>Carrier results that</span>
                  <br />
                  <span data-split>speak for themselves</span>
                </h2>
                <Button href="/solutions/carrier" surface="on-dark">
                  Explore Carrier
                </Button>
              </div>

              {/* Carrier columns */}
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-0">
                {carrierResults.map((result) => (
                  <CarrierCard key={result.id} result={result} />
                ))}
              </div>
            </div>
          </div>
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

export default CarrierResults;