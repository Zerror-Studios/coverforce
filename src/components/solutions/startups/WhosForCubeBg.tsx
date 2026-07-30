"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PLANE_COUNT = 5;
const PLANE_SIZE = "min(68vw, 25rem)";
const PLANE_GAP = `calc((${PLANE_SIZE}) / 4)`;
const DOT_COLOR = "rgba(197, 205, 216, 0.9)";

/** Pyramid ring radii (% of plane) - small → large across Z stack */
const PYRAMID_RADII = [28, 38, 48, 58, 68];
const DOT_SPACING = 2.1;
const GRID_COLS = 16;
const GRID_ROWS = 16;
const GRID_PAD = 4;

type MorphDot = {
  id: string;
  gridX: number;
  gridY: number;
  ringX: number;
  ringY: number;
  inRing: boolean;
  size: number;
  /** stagger order when forming the ring */
  angleOrder: number;
};

function buildGridPoints() {
  const points: { x: number; y: number }[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      points.push({
        x: GRID_PAD + (c / (GRID_COLS - 1)) * (100 - 2 * GRID_PAD),
        y: GRID_PAD + (r / (GRID_ROWS - 1)) * (100 - 2 * GRID_PAD),
      });
    }
  }
  return points;
}

function buildRingTargets(planeIndex: number) {
  const radius = PYRAMID_RADII[planeIndex] ?? PYRAMID_RADII[PYRAMID_RADII.length - 1];
  const circumference = 2 * Math.PI * radius;
  // Enough dots that the loop always reads fully closed
  const count = Math.max(24, Math.ceil(circumference / DOT_SPACING));
  const t = planeIndex / Math.max(1, PLANE_COUNT - 1);
  const size = 2.5 + t * 1.2;
  const targets: { x: number; y: number; size: number; angle: number }[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    targets.push({
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      size,
      angle,
    });
  }
  return targets;
}

/** Pair nearest grid cells → ring slots so dots visibly travel into the ring. */
function buildMorphDots(planeIndex: number): MorphDot[] {
  const grid = buildGridPoints();
  const ringTargets = buildRingTargets(planeIndex);
  const radius = PYRAMID_RADII[planeIndex] ?? PYRAMID_RADII[PYRAMID_RADII.length - 1];
  const used = new Set<number>();
  const dots: MorphDot[] = [];

  ringTargets.forEach((target, i) => {
    let best = -1;
    let bestD = Infinity;
    grid.forEach((g, gi) => {
      if (used.has(gi)) return;
      const d = (g.x - target.x) ** 2 + (g.y - target.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = gi;
      }
    });

    // Always create the full ring - never skip a slot when the grid is exhausted
    if (best >= 0) {
      used.add(best);
      dots.push({
        id: `ring-${planeIndex}-${i}`,
        gridX: grid[best].x,
        gridY: grid[best].y,
        ringX: target.x,
        ringY: target.y,
        inRing: true,
        size: target.size,
        angleOrder: target.angle,
      });
    } else {
      const startR = Math.max(8, radius * 0.5);
      dots.push({
        id: `ring-${planeIndex}-${i}`,
        gridX: 50 + Math.cos(target.angle) * startR,
        gridY: 50 + Math.sin(target.angle) * startR,
        ringX: target.x,
        ringY: target.y,
        inRing: true,
        size: target.size,
        angleOrder: target.angle,
      });
    }
  });

  grid.forEach((g, gi) => {
    if (used.has(gi)) return;
    dots.push({
      id: `grid-${planeIndex}-${gi}`,
      gridX: g.x,
      gridY: g.y,
      ringX: 50,
      ringY: 50,
      inRing: false,
      size: 2.35,
      angleOrder: 0,
    });
  });

  return dots;
}

function shortestDeg(from: number, to: number) {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;
  return from + delta;
}

const RING_POSE = { rotationX: -18, rotationY: 28 };
const SPIN_DURATION = 24;
/** Settle spin → target pose (seconds) */
const SETTLE_DURATION = 1.45;
/** Dot morph starts slightly into settle so motion feels continuous */
const DOT_MORPH_DELAY = 0.28;
const DOT_MORPH_DURATION = 1.25;

function DotPlane({
  index,
  mode,
}: {
  index: number;
  mode: "cube" | "rings";
}) {
  const planeRef = useRef<HTMLDivElement>(null);
  const zOffset = `calc((${index} - ${(PLANE_COUNT - 1) / 2}) * (${PLANE_GAP}))`;
  const dist = Math.abs(index - (PLANE_COUNT - 1) / 2);
  const opacity = Math.max(0.4, 1 - dist * 0.12);
  const dots = useMemo(() => buildMorphDots(index), [index]);

  useEffect(() => {
    const root = planeRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = root.querySelectorAll<HTMLElement>("[data-morph-dot]");

    els.forEach((el) => {
      const i = Number(el.dataset.dotIndex);
      const d = dots[i];
      if (!d) return;

      if (mode === "rings") {
        gsap.to(el, {
          left: `${d.ringX}%`,
          top: `${d.ringY}%`,
          opacity: d.inRing ? 1 : 0,
          scale: d.inRing ? 1 : 0.2,
          duration: reduced ? 0 : d.inRing ? DOT_MORPH_DURATION : 0.85,
          delay: reduced
            ? 0
            : DOT_MORPH_DELAY +
              (d.inRing
                ? (d.angleOrder / (Math.PI * 2)) * 0.28 + index * 0.05
                : 0.08 + Math.random() * 0.18),
          ease: d.inRing ? "power2.inOut" : "power2.in",
          overwrite: true,
        });
      } else {
        gsap.to(el, {
          left: `${d.gridX}%`,
          top: `${d.gridY}%`,
          opacity: 1,
          scale: 1,
          duration: reduced ? 0 : 0.95,
          delay: reduced ? 0 : (1 - d.angleOrder / (Math.PI * 2)) * 0.2,
          ease: "power2.inOut",
          overwrite: true,
        });
      }
    });
  }, [mode, dots, index]);

  return (
    <div
      ref={planeRef}
      data-ring-plane
      data-plane-index={index}
      className="absolute left-1/2 top-1/2 origin-center overflow-visible will-change-transform"
      style={{
        width: PLANE_SIZE,
        height: PLANE_SIZE,
        opacity,
        transform: `translate(-50%, -50%) translateY(var(--lift-y, 0px)) translateZ(${zOffset})`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        ["--lift-y" as string]: "0px",
      }}
    >
      {dots.map((d, i) => (
        <span
          key={d.id}
          data-morph-dot
          data-dot-index={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full will-change-[left,top,opacity,transform]"
          style={{
            left: `${d.gridX}%`,
            top: `${d.gridY}%`,
            width: d.size,
            height: d.size,
            background: DOT_COLOR,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Same Z-facing planes. Spin is GSAP-driven so cube→rings can settle
 * seamlessly from the live pose (no CSS animation snap).
 */
export default function WhosForCubeBg() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const [mode, setMode] = useState<"cube" | "rings">("cube");

  useGSAP(
    () => {
      const program = document.getElementById("program-overview");
      const spinner = spinnerRef.current;
      if (!program || !spinner) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const startSpin = (fromCurrent = false) => {
        spinTweenRef.current?.kill();
        if (!fromCurrent) {
          gsap.set(spinner, { rotationX: 0, rotationY: 0 });
        }
        if (reduced) return;
        spinTweenRef.current = gsap.to(spinner, {
          rotationX: "+=360",
          rotationY: "-=360",
          duration: SPIN_DURATION,
          ease: "none",
          repeat: -1,
        });
      };

      const settleToRings = () => {
        // Pause at the live spin pose - never reset to 0
        spinTweenRef.current?.pause();
        spinTweenRef.current?.kill();
        spinTweenRef.current = null;

        if (reduced) {
          gsap.set(spinner, RING_POSE);
          setMode("rings");
          return;
        }

        const fromX = Number(gsap.getProperty(spinner, "rotationX")) || 0;
        const fromY = Number(gsap.getProperty(spinner, "rotationY")) || 0;

        gsap.fromTo(
          spinner,
          { rotationX: fromX, rotationY: fromY },
          {
            rotationX: shortestDeg(fromX, RING_POSE.rotationX),
            rotationY: shortestDeg(fromY, RING_POSE.rotationY),
            duration: SETTLE_DURATION,
            ease: "power2.inOut",
            overwrite: true,
          },
        );

        setMode("rings");
      };

      const returnToCube = () => {
        gsap.killTweensOf(spinner);
        const planes = spinner.querySelectorAll<HTMLElement>("[data-ring-plane]");
        planes.forEach((plane) => {
          plane.style.setProperty("--lift-y", "0px");
          plane.style.opacity = "";
        });
        setMode("cube");
        // Resume spin from current settled pose (no snap to origin)
        startSpin(true);
      };

      startSpin(false);

      const modeSt = ScrollTrigger.create({
        trigger: program,
        start: "top 72%",
        end: "top 28%",
        onEnter: () => settleToRings(),
        onLeaveBack: () => returnToCube(),
        onEnterBack: () => settleToRings(),
      });

      const liftSt = ScrollTrigger.create({
        trigger: program,
        start: "top 45%",
        end: "bottom top",
        scrub: reduced ? false : 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const planes = spinner.querySelectorAll<HTMLElement>("[data-ring-plane]");
          const liftMax = Math.min(window.innerHeight * 0.75, 560);
          const staggerWindow = 0.42;

          planes.forEach((plane) => {
            const i = Number(plane.dataset.planeIndex) || 0;
            const dist = Math.abs(i - (PLANE_COUNT - 1) / 2);
            const baseOpacity = Math.max(0.4, 1 - dist * 0.12);
            const offset =
              ((PLANE_COUNT - 1 - i) / Math.max(1, PLANE_COUNT - 1)) * staggerWindow;
            const local = gsap.utils.clamp(0, 1, (p - offset) / (1 - staggerWindow));
            const eased = gsap.parseEase("power2.in")(local);

            plane.style.setProperty("--lift-y", `${-eased * liftMax}px`);
            plane.style.opacity = String(baseOpacity * Math.max(0, 1 - eased * 1.05));
          });
        },
        onLeaveBack: () => {
          const planes = spinner.querySelectorAll<HTMLElement>("[data-ring-plane]");
          planes.forEach((plane) => {
            const i = Number(plane.dataset.planeIndex) || 0;
            const dist = Math.abs(i - (PLANE_COUNT - 1) / 2);
            plane.style.setProperty("--lift-y", "0px");
            plane.style.opacity = String(Math.max(0.4, 1 - dist * 0.12));
          });
        },
      });

      if (modeSt.progress > 0) settleToRings();

      const lenis = window.lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on("scroll", onLenisScroll);

      return () => {
        lenis?.off("scroll", onLenisScroll);
        spinTweenRef.current?.kill();
        modeSt.kill();
        liftSt.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-0 flex h-full w-full items-center justify-center overflow-visible"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 55%, rgba(40, 55, 110, 0.45) 0%, rgba(18, 28, 73, 0) 70%)",
        }}
      />

      <div
        className="relative aspect-square h-[min(80vw,34rem)] w-[min(80vw,34rem)] translate-y-10 overflow-visible md:h-[36rem] md:w-[36rem] md:translate-y-12"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          ref={spinnerRef}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {Array.from({ length: PLANE_COUNT }, (_, i) => (
            <DotPlane key={i} index={i} mode={mode} />
          ))}
        </div>
      </div>
    </div>
  );
}
