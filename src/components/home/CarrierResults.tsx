"use client";

import { useRef } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

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
    logo: "/images/Employers.svg",
    logoAlt: "Employers",
    title: "0% Error Rate",
    description:
      "Only integration partner to achieve 0% API error rate on submission data.",
  },
  {
    id: "nationwide",
    logo: "/images/Nationwide.svg",
    logoAlt: "Nationwide",
    title: "Live in 12 Weeks",
    description:
      "BOP integration: under 12 weeks, less than 10 hours carrier eng time.",
  },
  {
    id: "chubb",
    logo: "/images/chubb.svg",
    logoAlt: "Chubb",
    title: "Trust & Quality",
    description:
      "Submission quality → first wholesale partner appointed in 2+ years.",
  },
  {
    id: "liberty",
    logo: "/images/liverty.svg",
    logoAlt: "Liberty Mutual",
    title: "5-Point Bind Advantage",
    description:
      "Only integration partner to achieve 0% API error rate on submission data.",
  },
];

function CarrierLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-10 w-[132px] max-w-full md:h-11 md:w-[148px]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-left"
        sizes="(max-width: 768px) 132px, 148px"
      />
    </div>
  );
}

function CarrierCard({ result }: { result: CarrierResult }) {
  return (
    <article className="flex flex-col gap-10 lg:gap-12 lg:px-8 xl:px-10 first:lg:pl-0 last:lg:pr-0">
      <div className="min-h-[2.75rem]">
        <CarrierLogo src={result.logo} alt={result.logoAlt} />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-heading font-regular text-white md:text-xl tracking-tight">
          {result.title}
        </h3>
        <p className="max-w-[240px] text-sm font-sans font-regular leading-relaxed text-white/55">
          {result.description}
        </p>
      </div>
    </article>
  );
}

const CarrierResults = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({ scopeRef: sectionRef, headerRef, headingRef, descRef, theme: "dark" });

  return (
    <section ref={sectionRef} className="bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33" borderBottom={true}>
        <div
          className="absolute left-0 -top-20 z-0 w-full lg:h-full opacity-75"
          aria-hidden
        >
          {/*
            Original SVG kept pixel-perfect.
            Triangles/squares removed (display:none groups dropped).
            Dots added via animateMotion on <defs> path refs —
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

              {/* Outer solid curves — top */}
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
        <div className="relative py-16 md:py-20 lg:py-24">
          <div className="relative z-10 flex flex-col gap-62">
            {/* Header */}
            <div
              ref={headerRef}
              className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12"
            >
              <div className="flex flex-col justify-end space-y-5">
                <h2
                  ref={headingRef}
                  className="max-w-md text-3xl font-heading font-regular leading-tight tracking-tight text-[#9AA8BC] md:text-4xl lg:text-3xl lg:leading-[1.15]"
                >
                  <span data-split>Carrier results that</span>
                  <br />
                  <span data-split>speak for themselves</span>
                </h2>
                <p
                  ref={descRef}
                  className="font-sans font-regular text-sm leading-[1.4] text-[#D1D1D1] md:text-[1.125rem] lg:hidden"
                >
                  Named outcomes provide clear, organized quote comparisons from
                  appointed carriers, helping agents from production carrier
                  partnerships.
                </p>
                <Button href="/" surface="on-dark">
                  Explore Carrier
                </Button>
              </div>

              <div className="flex max-w-md flex-col items-start justify-end gap-6 text-left lg:ml-auto">
                <p
                  className="hidden font-sans font-regular text-sm leading-[1.4] text-[#D1D1D1] md:text-[1.125rem] lg:block"
                >
                  Named outcomes provide clear, organized quote comparisons from
                  appointed carriers, helping agents from production carrier
                  partnerships.
                </p>
              </div>
            </div>

            {/* Carrier columns */}
            <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {carrierResults.map((result) => (
                <CarrierCard key={result.id} result={result} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CarrierResults;