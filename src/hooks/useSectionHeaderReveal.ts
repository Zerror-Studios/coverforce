import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

import { animateSplitTextReveal, type SplitTextColorTheme } from "@/lib/animateSplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

type SectionHeaderRevealRefs = {
  scopeRef: RefObject<HTMLElement | null>;
  headerRef?: RefObject<HTMLElement | null>;
  headingRef: RefObject<HTMLElement | null>;
  descRef?: RefObject<HTMLElement | null>;
  theme?: SplitTextColorTheme;
};

export function useSectionHeaderReveal({
  scopeRef,
  headerRef,
  headingRef,
  descRef,
  theme = "light",
}: SectionHeaderRevealRefs) {
  useGSAP(
    () => {
      const heading = headingRef.current;
      const header = headerRef?.current ?? heading;
      const desc = descRef?.current;
      if (!header || !heading) return;

      const cleanups: (() => void)[] = [];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cleanups.push(animateSplitTextReveal(heading, { trigger: header, theme }));

      if (desc) {
        if (reducedMotion) {
          gsap.set(desc, { opacity: 1 });
        } else {
          gsap.set(desc, { opacity: 0 });

          const fadeTl = gsap.timeline({
            scrollTrigger: {
              trigger: header,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          });

          fadeTl.to(desc, { opacity: 1, duration: 0.8, ease: "power2.out" });

          const lenis = window.lenis;
          const onLenisScroll = () => ScrollTrigger.update();
          lenis?.on("scroll", onLenisScroll);

          cleanups.push(() => {
            lenis?.off("scroll", onLenisScroll);
            fadeTl.scrollTrigger?.kill();
            fadeTl.kill();
          });
        }
      }

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: scopeRef },
  );
}
