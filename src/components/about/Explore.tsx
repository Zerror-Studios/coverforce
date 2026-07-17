"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { SplitText } from "@/lib/SplitText";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_EASE = "power3.out";

const Explore = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const [borderOpacity, setBorderOpacity] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const eyebrow = eyebrowRef.current;
      const heading = headingRef.current;
      const buttons = buttonsRef.current;
      if (!section || !content || !eyebrow || !heading || !buttons) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        setBorderOpacity(1);
        gsap.set(content, { opacity: 1, y: 0 });
        gsap.set([eyebrow, buttons], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(content, { opacity: 1, y: 48 });
      gsap.set(heading, { opacity: 0 });
      gsap.set(eyebrow, { opacity: 0, y: 18 });
      gsap.set(buttons, { opacity: 0, y: 18 });

      const reveal = () => {
        const borderProxy = { value: borderOpacity };
        gsap.to(borderProxy, {
          value: 1,
          duration: 1,
          ease: REVEAL_EASE,
          onUpdate: () => setBorderOpacity(borderProxy.value),
        });

        gsap.to(content, {
          y: 0,
          duration: 1,
          ease: REVEAL_EASE,
        });

        const lines = heading.querySelectorAll<HTMLElement>("[data-split]");
        const splits: SplitText[] = [];
        const chars: HTMLSpanElement[] = [];

        lines.forEach((el) => {
          const split = new SplitText(el, {
            type: "chars",
            charsClass: "explore-split-char",
            wordsClass: "explore-split-word",
          });
          splits.push(split);
          split.words.forEach((word) => {
            word.style.display = "inline";
            word.style.whiteSpace = "normal";
          });
          chars.push(...split.chars);
        });

        splitsRef.current = splits;
        gsap.set(heading, { opacity: 1 });
        gsap.set(chars, { opacity: 0, y: 14, force3D: true });

        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
          .to(
            chars,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.028,
              ease: "power2.out",
              onComplete: () => gsap.set(chars, { clearProps: "transform" }),
            },
            "-=0.25",
          )
          .to(
            buttons,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              onComplete: () => gsap.set(buttons, { clearProps: "transform" }),
            },
            "-=0.2",
          );
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 82%",
        once: true,
        onEnter: reveal,
      });

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);

      return () => {
        lenis?.off("scroll", onLenisScroll);
        st.kill();
        splitsRef.current.forEach((split) => split.revert());
        splitsRef.current = [];
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative bg-[#151f4d] text-white">
      <Container
        borderColor="#FFFFFF33"
        borderOpacity={borderOpacity}
        borderBottom={true}
        className="relative flex min-h-[calc(100svh-2rem)] flex-col !px-0 py-20 md:py-24"
      >
        <SectionRadialGlow className="absolute left-1/2 top-[10%] z-0 w-[95vw] -translate-x-1/2 md:top-[12%] md:w-[85vw] lg:w-[78vw] " />

        <div
          ref={contentRef}
          className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6  text-center will-change-transform "
        >
          <div ref={eyebrowRef}>
            <EyebrowPill surface="dark" className="mx-auto mb-0">
              Careers
            </EyebrowPill>
          </div>

          <h2
            ref={headingRef}
            className="mt-5 text-3xl font-heading font-regular leading-tight tracking-tight md:text-5xl lg:text-5xl lg:leading-[1.1]"
          >
            <span data-split>Join a team of</span>
            <br />
            <span data-split>Industry Experts</span>
          </h2>

          <div
            ref={buttonsRef}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
          >
            <Button href="/careers" balanced surface="on-dark">
              Explore open positions
            </Button>
          </div>
        </div>

      </Container>
    </section>
  );
};

export default Explore;
