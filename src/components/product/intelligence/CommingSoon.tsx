"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import { SplitText } from "@/lib/SplitText";

const WavePlaneCanvas = dynamic(
  () => import("@/components/product/Waveplane3d").then((m) => ({ default: m.WavePlaneCanvas })),
  { ssr: false },
);

const INTELLIGENCE_COLOURS = ["#0045FF", "#008EFF", "#6BCAFF", "#C3EBFF"];

gsap.registerPlugin(ScrollTrigger);
const REVEAL_EASE = "power3.out";

const CommingSoon = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const [borderOpacity, setBorderOpacity] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const heading = headingRef.current;
      const desc = descRef.current;
      const buttons = buttonsRef.current;
      if (!section || !content || !heading || !desc || !buttons) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        setBorderOpacity(1);
        gsap.set(content, { opacity: 1, y: 0 });
        gsap.set([desc, buttons], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(content, { opacity: 1, y: 48 });
      gsap.set(heading, { opacity: 0 });
      gsap.set(desc, { opacity: 0, y: 18 });
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
        tl.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.028,
          ease: "power2.out",
          onComplete: () => gsap.set(chars, { clearProps: "transform" }),
        })
          .to(
            desc,
            { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
            "-=0.15",
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
            "-=0.3",
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
    <section
      id="coming-soon"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#151f4d] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(49, 78, 155, 0.55) 0%, rgba(18, 28, 73, 0.92) 52%, #121C49 100%)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[60%] w-full"
        aria-hidden
      >
        <WavePlaneCanvas className="h-full w-full" colors={INTELLIGENCE_COLOURS} />
      </div>

      <Container borderColor="#FFFFFF33" borderOpacity={borderOpacity} className="relative z-10">
        <div
          ref={contentRef}
          className="relative z-10 mx-auto flex min-h-[calc(100svh-2rem)] max-w-2xl flex-col items-center justify-center text-center will-change-transform"
        >
          <h2
            ref={headingRef}
            className="mt-5 text-3xl font-heading font-regular leading-tight tracking-tight md:text-5xl lg:text-5xl lg:leading-[1.1]"
          >
            <span data-split>Predictive intelligence, <br /> coming soon</span>
          </h2>

          <p
            ref={descRef}
            className="mt-5 font-sans font-regular text-sm leading-[1.4] text-[#FFFFFF] md:text-[1.125rem]"
          >
           140,000+ proprietary carrier interactions. Every<br /> transaction makes the platform smarter.
          </p>

          <div
            ref={buttonsRef}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
          >
            <Button href="/contact" balanced surface="on-dark">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CommingSoon;
