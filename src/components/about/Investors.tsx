"use client";

import Image from "next/image";
import { useRef } from "react";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

const investors = [
  {
    src: "/images/about/Insight.png",
    alt: "Insight Partners",
    href: "https://www.insightpartners.com/",
    width: 286,
    height: 80,
  },
  {
    src: "/images/about/QED.png",
    alt: "QED Investors",
    href: "https://www.qedinvestors.com/",
    width: 287,
    height: 80,
  },
  {
    src: "/images/about/NYCA.png",
    alt: "Nyca Partners",
    href: "https://www.nyca.com/",
    width: 260,
    height: 80,
  },
] as const;

const Investors = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
  });

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <style>{`
        .investor-logos:hover .investor-logo {
          transform: scale(0.9);
          opacity: 0.55;
        }

        .investor-logos .investor-logo:hover {
          transform: scale(1.22);
          opacity: 1;
          margin-inline: 1.75rem;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .investor-logos .investor-logo:hover {
            margin-inline: 2.5rem;
          }
        }
      `}</style>
      <Container borderColor="#53535380" borderBottom>
        <div className="flex flex-col items-center py-20 text-center md:py-24 lg:py-28">
          <div ref={headerRef} className="flex flex-col items-center text-center">
            <EyebrowPill surface="light" className="mb-5">
              Investors
            </EyebrowPill>

            <h2
              ref={headingRef}
              className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#9AA8BC] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>Backed by Investors</span>
              <br />
              <span data-split>Shaping the Future of Insurance</span>
            </h2>
          </div>
          <div className="investor-logos mt-14 flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-10 md:mt-16 md:gap-x-10 lg:mt-20 lg:gap-x-12">
            {investors.map((investor) => (

              <a
              key={ investor.src }
      href={ investor.href }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${investor.alt}`}
            className="investor-logo relative flex h-14 w-40 shrink-0 items-center justify-center transition-[transform,margin,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:h-16 md:w-48 lg:h-[4.5rem] lg:w-56"
    >
            <Image
              src={investor.src}
              alt={investor.alt}
              width={investor.width}
              height={investor.height}
              className="h-full w-full object-contain object-center"
            />
          </a>
  ))}
        </div>
      </div>
    </Container>
    </section >
  );
};

export default Investors;
