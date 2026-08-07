"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { SplitText } from "@/lib/SplitText";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_EASE = "power3.out";

const ExplorePlatform = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const [borderOpacity, setBorderOpacity] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const eyebrow = eyebrowRef.current;
      const heading = headingRef.current;
      const desc = descRef.current;
      const cta = ctaRef.current;
      if (!section || !content || !eyebrow || !heading || !desc || !cta) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        setBorderOpacity(1);
        gsap.set(content, { opacity: 1, y: 0 });
        gsap.set([eyebrow, desc, cta], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(content, { opacity: 1, y: 48 });
      gsap.set(eyebrow, { opacity: 0, y: 12 });
      gsap.set(heading, { opacity: 0 });
      gsap.set(desc, { opacity: 0, y: 18 });
      gsap.set(cta, { opacity: 0, y: 18 });

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

        gsap.to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
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

        const tl = gsap.timeline({ delay: 0.12 });
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
            cta,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              onComplete: () => gsap.set(cta, { clearProps: "transform" }),
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
      id="explore-platform"
      ref={sectionRef}
      className="relative  bg-[#121C49] text-white"
    >
      <Container borderColor="#FFFFFF33" borderOpacity={borderOpacity} className="relative">
        <SectionRadialGlow className="absolute left-1/2 top-[10%] z-0 -translate-x-1/2 md:top-[12%]" />
        <div
          ref={contentRef}
          className="relative z-10 mx-auto flex min-h-[calc(100svh-2rem)] max-w-3xl flex-col items-center justify-center px-4 text-center will-change-transform"
        >
          <p
            ref={eyebrowRef}
            className="flex items-center justify-center gap-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white md:text-xs"
          >
            <span className="size-2 shrink-0 rounded-full bg-white" aria-hidden />
            Explore the platform
          </p>

          <h2
            ref={headingRef}
            className="mt-5 text-3xl font-heading font-regular leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            <span data-split>Powered by 350K+ CoverForce carrier interactions.</span>
          </h2>

          <p
            ref={descRef}
            className="mt-5 max-w-xl font-sans text-sm font-regular leading-[1.5] text-white/80 md:text-[1.125rem]"
          >
            Start quoting faster with CoverForce.
            <br />
            Submit once, compare carriers, and bind in one platform.
          </p>

          <div ref={ctaRef} className="mt-10">
            <Button href="/product/quote-bind" balanced surface="on-dark">
              Get full appetite data with coverforce
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExplorePlatform;
