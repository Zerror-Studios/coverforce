"use client";

/**
 * HeroToCardsDots — five dots with a two-phase scroll journey:
 *
 *  Phase 1 (ThreeWays): dots emerge near the OpticalFiber, ride down the
 *    container borders (3 left, 2 right) and peel into each card's EyebrowPill,
 *    turning white and handing off to the pill dot.
 *
 *  Phase 2 (ProcessFlow, lg+ only): dots drop from above onto the Container
 *    left border as the section enters; further scroll peels each into its
 *    step pill — white handoff to the pill dot. Skipped below lg.
 *
 * All positions/targets are measured live every frame so the dots track the page.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHomeIntro } from "@/contexts/HomeIntroContext";

const DOT_COLOR = "#121C49";
// Match the EyebrowPill dot (size-1.5 = 0.375rem = 6px) throughout.
const DOT_SIZE = 6;
const PARK_GAP = 0.06;
// ThreeWays: pill viewport position (height fractions) over which the dot travels.
const PEEL_START = 1.12;
const PEEL_END = 0.48;
// ProcessFlow: drop from above onto the Container left border, then peel to pills.
const PF_DROP_START = 1.05; // section top vs vh — drop begins
const PF_DROP_END = 0.55; // section top vs vh — all parked on the border
const PF_PEEL_START = 0.58;
const PF_PEEL_END = 0.32;
const PF_DOT_COLOR = "#FFFFFF";
const PF_DOT_COUNT = 5;

type DotConfig = { label: string; side: "left" | "right"; rank: number };

const DOTS: DotConfig[] = [
  { label: "Wholesalers", side: "left", rank: 0 },
  { label: "Developers", side: "left", rank: 1 },
  { label: "Startups", side: "left", rank: 2 },
  { label: "Brokers", side: "right", rank: 0 },
  { label: "Carriers", side: "right", rank: 1 },
];

export default function HeroToCardsDots() {
  const layerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { enabled: introEnabled, phase: introPhase } = useHomeIntro();

  useEffect(() => {
    if (introEnabled && introPhase !== "done") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;

    const section = document.querySelector<HTMLElement>("[data-threeways]");
    if (!section) return;

    const container = section.firstElementChild as HTMLElement | null;
    const originEl = document.querySelector<HTMLElement>("[data-hero-dots-origin]");
    const ease = gsap.parseEase("power2.inOut");

    const update = () => {
      const vh = window.innerHeight || 1;
      const sRect = section.getBoundingClientRect();
      const contRect = (container ?? section).getBoundingClientRect();
      const leftX = contRect.left;
      const rightX = contRect.right;

      // ── ProcessFlow phase detection ──
      const pf = document.querySelector<HTMLElement>("[data-processflow]");
      const pfRect = pf?.getBoundingClientRect();
      const pfCont = (pf?.firstElementChild as HTMLElement | null)?.getBoundingClientRect();
      const inPF =
        !!pfRect && pfRect.top < vh * 0.85 && pfRect.bottom > vh * 0.15;

      // ── ThreeWays visibility (tied to the OpticalFiber emergence) ──
      const originRect = originEl?.getBoundingClientRect();
      const twEnter = originRect
        ? gsap.utils.clamp(0, 1, (vh * 0.9 - originRect.top) / (vh * 0.3))
        : gsap.utils.clamp(0, 1, (vh * 1.2 - sRect.top) / (vh * 0.3));
      const twExit = gsap.utils.clamp(0, 1, sRect.bottom / (vh * 0.2));
      const twVis = Math.min(twEnter, twExit);

      // ── ProcessFlow visibility ──
      let pfVis = 0;
      if (pfRect) {
        const pfEnter = gsap.utils.clamp(0, 1, (vh - pfRect.top) / (vh * 0.4));
        const pfLeave = gsap.utils.clamp(0, 1, pfRect.bottom / (vh * 0.25));
        pfVis = Math.min(pfEnter, pfLeave);
      }

      const isPfDesktop = window.matchMedia("(min-width: 1024px)").matches;

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const cfg = DOTS[i];

        if (inPF && pfCont) {
          if (!isPfDesktop) {
            dot.style.opacity = "0";
            return;
          }

          // ── Phase 2: ProcessFlow ──────────────────────────────────────────
          // 1) Section enters → dots fall from above onto the Container left border.
          // 2) Further scroll → each peels to its step pill as that step arrives.
          const targetEl = pf?.querySelector<HTMLElement>(`[data-card-dot="step-${i}"]`);
          const target = targetEl?.getBoundingClientRect();
          if (!target || !targetEl || (target.width === 0 && target.height === 0)) {
            dot.style.opacity = "0";
            return;
          }

          // Same left edge ThreeWays uses — Container dotted border.
          const lineX = pfCont.left;

          // Park slots spaced along the viewport on that border so all 5 show at once.
          const railTop = vh * 0.18;
          const railBottom = vh * 0.82;
          const parkT = PF_DOT_COUNT <= 1 ? 0.5 : i / (PF_DOT_COUNT - 1);
          const parkY = gsap.utils.interpolate(railTop, railBottom, parkT);

          // Drop from above → park, staggered so they cascade like the same dots arriving.
          const dropRaw = pfRect
            ? gsap.utils.clamp(
                0,
                1,
                (PF_DROP_START * vh - pfRect.top) /
                  ((PF_DROP_START - PF_DROP_END) * vh),
              )
            : 1;
          const dropStagger = (i / Math.max(1, PF_DOT_COUNT - 1)) * 0.28;
          const drop = gsap.utils.clamp(0, 1, (dropRaw - dropStagger) / (1 - dropStagger * 0.85));
          const dropE = ease(drop);

          const startY = -0.08 * vh - i * 18; // above the viewport, slight cascade
          const settledY = startY + (parkY - startY) * dropE;

          const tx = target.left + target.width / 2;
          const ty = target.top + target.height / 2;

          // Peel only after the drop has mostly settled, when this step's pill rises.
          const peelRaw = gsap.utils.clamp(
            0,
            1,
            (PF_PEEL_START * vh - ty) / ((PF_PEEL_START - PF_PEEL_END) * vh),
          );
          const peel = dropE > 0.85 ? peelRaw * gsap.utils.clamp(0, 1, (dropE - 0.85) / 0.15) : 0;
          const e = ease(peel);

          const x = lineX + (tx - lineX) * e;
          const y = settledY + (ty - settledY) * e;

          dot.style.width = `${DOT_SIZE}px`;
          dot.style.height = `${DOT_SIZE}px`;
          dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          const colorT = gsap.utils.clamp(0, 1, (peel - 0.55) / 0.45);
          dot.style.background = gsap.utils.interpolate(DOT_COLOR, PF_DOT_COLOR, colorT);
          dot.style.boxShadow =
            peel < 0.85 ? `0 0 ${8 * (1 - Math.max(e, dropE)) + 1}px ${DOT_COLOR}33` : "none";

          const arrived = gsap.utils.clamp(0, 1, (peel - 0.9) / 0.1);
          // Show once the drop has started; hand off on pill arrival.
          dot.style.opacity = String(drop > 0.02 ? pfVis * (1 - arrived) : 0);
          targetEl.style.opacity = String(arrived);
          return;
        }

        // ── Phase 1: ThreeWays — fiber → card pill ──
        const target = document.querySelector<HTMLElement>(
          `[data-card-dot="${cfg.label}"]`,
        );
        if (!target) {
          dot.style.opacity = "0";
          return;
        }

        const tr = target.getBoundingClientRect();
        const tx = tr.left + tr.width / 2;
        const ty = tr.top + tr.height / 2;
        const borderX = cfg.side === "left" ? leftX : rightX;

        const topPark = (0.12 + cfg.rank * PARK_GAP) * vh;
        const bottomPark = (0.9 - cfg.rank * PARK_GAP) * vh;

        const peel = gsap.utils.clamp(
          0,
          1,
          (PEEL_START * vh - ty) / ((PEEL_START - PEEL_END) * vh),
        );
        const e = ease(peel);

        const y = gsap.utils.clamp(topPark, bottomPark, ty);
        const x = borderX + (tx - borderX) * e;

        dot.style.width = `${DOT_SIZE}px`;
        dot.style.height = `${DOT_SIZE}px`;
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        const colorT = gsap.utils.clamp(0, 1, (peel - 0.6) / 0.4);
        dot.style.background = gsap.utils.interpolate(DOT_COLOR, "#FFFFFF", colorT);
        dot.style.boxShadow = `0 0 ${10 * (1 - e) + 2}px ${DOT_COLOR}`;

        // On arrival, hand off: fade the traveling dot out and the pill dot in.
        const arrived = gsap.utils.clamp(0, 1, (peel - 0.9) / 0.1);
        dot.style.opacity = String(twVis * (1 - arrived));
        target.style.opacity = String(arrived);
      });
    };

    update();

    const lenis = window.lenis;
    const onScroll = () => update();
    lenis?.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      lenis?.off("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      DOTS.forEach((cfg) => {
        const target = document.querySelector<HTMLElement>(
          `[data-card-dot="${cfg.label}"]`,
        );
        if (target) target.style.opacity = "";
      });
      for (let i = 0; i < DOTS.length; i++) {
        const pf = document.querySelector<HTMLElement>("[data-processflow]");
        const stepTarget = pf?.querySelector<HTMLElement>(
          `[data-card-dot="step-${i}"]`,
        );
        if (stepTarget) stepTarget.style.opacity = "";
      }
    };
  }, [introEnabled, introPhase]);

  return (
    <div ref={layerRef} className="pointer-events-none fixed inset-0 z-[60] hidden lg:block" aria-hidden>
      {DOTS.map((cfg, i) => (
        <div
          key={cfg.label}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 rounded-full will-change-transform"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            background: DOT_COLOR,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
