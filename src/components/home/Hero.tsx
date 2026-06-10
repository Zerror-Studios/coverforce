"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/common/Button";
import Container from "../common/Container";
import SectionRadialGlow from "../common/SectionRadialGlow";
import Image from "next/image";

type StatItem = {
  value: string;
  label: string;
};

const stats: StatItem[] = [
  { value: "140K+", label: "AI-labeled Carrier Interactions" },
  { value: "40+", label: "Carrier & MGA Integrations" },
  { value: "15,000+", label: "Agencies on Platform" },
  { value: "$500M+", label: "Gross Quoted Premium" },
];

const Hero = () => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const statCount = useMemo(() => stats.length, []);

  useLayoutEffect(() => {
    const update = () => {
      const listEl = listRef.current;
      const itemEl = itemRefs.current[activeIndex];
      if (!listEl || !itemEl) return;

      const listRect = listEl.getBoundingClientRect();
      const itemRect = itemEl.getBoundingClientRect();
      setIndicator({
        left: itemRect.left - listRect.left,
        width: itemRect.width,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeIndex, statCount]);

  return (
    <section className="relative isolate overflow-hidden bg-[#121C49] text-white">
      <Container borderColor="#FFFFFF1A" className="px-0!">
        <div className="relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-between py-16 md:py-20 lg:py-24">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="mt-6 max-w-4xl text-3xl font-heading font-regular  leading-[1.1] tracking-tight md:text-4xl lg:text-5xl xl:text-5xl">
              AI-Native Insurance <br /> Distribution Platform
            </h1>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Button href="/" variant="primary">
                Request demo
              </Button>
            </div>
          </div>

          <div className="mt-16 md:mt-20 ">
            <ul
              ref={listRef}
              className="relative grid grid-cols-2 gap-x-6 gap-y-10 md:flex md:py-10"
              onMouseLeave={() => setActiveIndex(1)}
            >
              <div className="pointer-events-none w-full absolute inset-y-0 hidden md:block" aria-hidden>
                {/* Top full-width line + moving segment */}
                <div className="absolute left-0 top-0 h-[0.05rem] w-full bg-white/5">
                  <div
                    className="h-full rounded-full linear-line_color transition-[transform,width] duration-300 ease-out"
                    style={{
                      width: `${indicator.width}px`,
                      transform: `translateX(${indicator.left}px)`,
                    }}
                  />
                </div>

                {/* Bottom full-width line + moving segment */}
                <div className="absolute left-0 bottom-0 h-[0.05rem] w-full bg-white/5">
                  <div
                    className="h-full rounded-full linear-line_color transition-[transform,width] duration-300 ease-out"
                    style={{
                      width: `${indicator.width}px`,
                      transform: `translateX(${indicator.left}px)`,
                    }}
                  />
                </div>
              </div>
              {stats.map((stat, index) => (
                <li
                  key={stat.label}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="flex flex-col items-center gap-2 md:flex-1 md:px-8 "
                >
                  <p
                    className={`text-2xl font-heading font-regular tracking-tight transition-colors md:text-3xl lg:text-4xl ${
                      index === activeIndex ? "text-white" : "text-[#8296B0]"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs font-sans font-regular text-center leading-relaxed transition-colors md:text-lg ${
                      index === activeIndex ? "text-white/80" : "text-[#8296B0]"
                    }`}
                  >
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative h-[min(420px,55vw)] w-full md:h-[480px] lg:h-[450px] -mb-10">
          <SectionRadialGlow className="absolute left-1/2 top-20 z-0 -translate-x-1/2 -translate-y-1/3 md:top-20" />
          <div className="relative z-10 h-full w-full " aria-label="Partner network" >
            <Image src="/images/network.svg" alt="Hero background" width={100} height={100} className="h-full w-full object-contain " />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
