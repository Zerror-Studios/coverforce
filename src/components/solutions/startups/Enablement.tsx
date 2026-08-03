"use client";

import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";
import { CARD_ACCENT_COLORS, PRIMARY_BUTTON_GRADIENT } from "@/data/wayCardStyles";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Settings2,
  Diamond,
  Sparkle,
  FileText,
  ShieldCheck,
  Triangle,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type NodeDef = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const NODES: NodeDef[] = [
  { id: "market-access", label: "MARKET ACCESS", icon: Building2 },
  { id: "api-integration", label: "API INTEGRATION", icon: Settings2 },
  { id: "custom-policy", label: "CUSTOM POLICY", icon: Diamond },
  { id: "distribution-layer", label: "DISTRIBUTION LAYER", icon: Sparkle },
  { id: "enablement-partner", label: "ENABLEMENT PARTNER", icon: Triangle },
  { id: "compliance", label: "COMPLIANCE", icon: ShieldCheck },
  { id: "licensing-provider", label: "LICENSING PROVIDER", icon: FileText },
];

const CX = 50;
const CY = 50;
/** Hub outer edge (matches w-[14%] hub → r = 7% of size). */
const R_LINE_START = 7;
/** Fallback spoke tip before card sizes are measured. */
const R_LINE_END = 36;
/** Card centers on this orbit. */
const R_ITEM = 38;
const SIGNAL_COLOR = CARD_ACCENT_COLORS.broker;

function wheelPolarPoint(deg: number, radius = 50, cx = CX, cy = CY) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/** Map 0–100 square coords → true circle pixels (uses min side, centered). */
function pctToCirclePx(
  pctX: number,
  pctY: number,
  width: number,
  height: number,
) {
  const size = Math.min(width, height);
  const cx = width / 2;
  const cy = height / 2;
  return {
    x: cx + ((pctX - 50) / 100) * size,
    y: cy + ((pctY - 50) / 100) * size,
  };
}

function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Where a ray from hub hits the near edge of an axis-aligned card. */
function spokeAttachPoint(
  hubX: number,
  hubY: number,
  cardLeft: number,
  cardTop: number,
  cardRight: number,
  cardBottom: number,
) {
  const cardCx = (cardLeft + cardRight) / 2;
  const cardCy = (cardTop + cardBottom) / 2;
  const dx = cardCx - hubX;
  const dy = cardCy - hubY;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const halfW = (cardRight - cardLeft) / 2;
  const halfH = (cardBottom - cardTop) / 2;

  // Exact AABB distance from center to the hub-facing edge along the spoke
  const reachX = Math.abs(ux) > 1e-6 ? halfW / Math.abs(ux) : Number.POSITIVE_INFINITY;
  const reachY = Math.abs(uy) > 1e-6 ? halfH / Math.abs(uy) : Number.POSITIVE_INFINITY;
  const reach = Math.min(reachX, reachY);

  // Nudge 2px into the card so the stroke fully meets the fill (no hairline gap)
  const overlap = 2;
  const attach = Math.max(0, reach - overlap);

  return {
    x: cardCx - ux * attach,
    y: cardCy - uy * attach,
  };
}

function EnablementWheel({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spokeProgressRef = useRef<number[]>([]);
  const spokeEndsRef = useRef<Array<{ x: number; y: number }>>([]);
  const spokeStartsRef = useRef<Array<{ x: number; y: number }>>([]);
  const signalsEnabledRef = useRef(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [nodePx, setNodePx] = useState<Array<{ x: number; y: number }> | null>(
    null,
  );

  const items = useMemo(() => {
    const segment = 360 / NODES.length;
    return NODES.map((node, i) => {
      const angle = -90 + i * segment;
      return {
        ...node,
        angle,
        start: wheelPolarPoint(angle, R_LINE_START),
        end: wheelPolarPoint(angle, R_LINE_END),
        pos: wheelPolarPoint(angle, R_ITEM),
      };
    });
  }, []);

  useEffect(() => {
    spokeProgressRef.current = items.map(() => 0);
    signalsEnabledRef.current = false;
  }, [items]);

  const measureLayoutRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const hubX = rect.width / 2;
      const hubY = rect.height / 2;
      const hubR = size * (R_LINE_START / 100);

      setNodePx(
        items.map((item) =>
          pctToCirclePx(item.pos.x, item.pos.y, rect.width, rect.height),
        ),
      );

      spokeStartsRef.current = items.map((item) => {
        const tip = pctToCirclePx(
          item.start.x,
          item.start.y,
          rect.width,
          rect.height,
        );
        const dx = tip.x - hubX;
        const dy = tip.y - hubY;
        const d = Math.hypot(dx, dy) || 1;
        return { x: hubX + (dx / d) * hubR, y: hubY + (dy / d) * hubR };
      });

      spokeEndsRef.current = items.map((item, i) => {
        const nodeEl = container.querySelector<HTMLElement>(
          `[data-enablement-wheel-node="${i}"]`,
        );
        const cardEl = nodeEl?.firstElementChild as HTMLElement | null;
        if (!cardEl) {
          return pctToCirclePx(item.end.x, item.end.y, rect.width, rect.height);
        }
        const cardRect = cardEl.getBoundingClientRect();
        return spokeAttachPoint(
          hubX,
          hubY,
          cardRect.left - rect.left,
          cardRect.top - rect.top,
          cardRect.right - rect.left,
          cardRect.bottom - rect.top,
        );
      });
    };

    measureLayoutRef.current = measure;

    const raf = requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(measure);
    });
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(container);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [items]);

  useEffect(() => {
    // Re-attach after hover scale changes the card box
    const id = requestAnimationFrame(() => measureLayoutRef.current());
    return () => cancelAnimationFrame(id);
  }, [hovered]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const nodes = items
        .map((_, index) =>
          container.querySelector<HTMLElement>(
            `[data-enablement-wheel-node="${index}"]`,
          ),
        )
        .filter(Boolean) as HTMLElement[];

      const lineProgress = items.map(() => ({ value: 0 }));

      if (reducedMotion) {
        gsap.set(nodes, { opacity: 1, scale: 1 });
        lineProgress.forEach((entry) => {
          entry.value = 1;
        });
        spokeProgressRef.current = items.map(() => 1);
        signalsEnabledRef.current = true;
        measureLayoutRef.current();
        return;
      }

      gsap.set(nodes, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 55%",
          once: true,
        },
      });

      timeline.to(nodes, {
        opacity: 1,
        scale: 1,
        duration: 0.48,
        ease: "back.out(1.7)",
        stagger: 0.07,
        onComplete: () => measureLayoutRef.current(),
      });

      timeline.to(
        lineProgress,
        {
          value: 1,
          duration: 0.42,
          ease: "power2.out",
          stagger: 0.05,
          onUpdate: () => {
            spokeProgressRef.current = lineProgress.map((entry) => entry.value);
          },
          onComplete: () => {
            signalsEnabledRef.current = true;
            measureLayoutRef.current();
          },
        },
        ">+=0.05",
      );
    },
    { scope: containerRef, dependencies: [items] },
  );

  useEffect(() => {
    const containerEl = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!containerEl || !canvasEl) return;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const container: HTMLDivElement = containerEl;
    const canvas: HTMLCanvasElement = canvasEl;
    const context: CanvasRenderingContext2D = ctx;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    type Particle = {
      itemIndex: number;
      t: number;
      v: number;
      toHub: boolean;
    };
    type Pulse = { r: number; a: number };

    let W = 0;
    let H = 0;
    let dpr = 1;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];

    function initParticles() {
      particles = items.flatMap((_, i) => [
        {
          itemIndex: i,
          t: (i * 0.137) % 1,
          v: 0.14 + (i % 3) * 0.035,
          toHub: true,
        },
        {
          itemIndex: i,
          t: (i * 0.137 + 0.5) % 1,
          v: 0.13 + ((i + 1) % 3) * 0.035,
          toHub: false,
        },
      ]);
    }

    function toPx(pctX: number, pctY: number) {
      return pctToCirclePx(pctX, pctY, W, H);
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(dt: number) {
      context.clearRect(0, 0, W, H);
      const size = Math.min(W, H);
      const hub = { x: W / 2, y: H / 2 };
      const hubR = size * (R_LINE_START / 100);

      items.forEach((item, i) => {
        const lineProgress = spokeProgressRef.current[i] ?? 1;
        if (lineProgress <= 0) return;

        const nearNode =
          spokeEndsRef.current[i] ?? toPx(item.end.x, item.end.y);
        const nearHub =
          spokeStartsRef.current[i] ?? toPx(item.start.x, item.start.y);
        const lineX = nearHub.x + (nearNode.x - nearHub.x) * lineProgress;
        const lineY = nearHub.y + (nearNode.y - nearHub.y) * lineProgress;
        const dashed = i % 2 === 1;

        context.beginPath();
        context.moveTo(nearHub.x, nearHub.y);
        context.lineTo(lineX, lineY);
        context.strokeStyle = dashed
          ? "rgba(148,136,228,0.55)"
          : "rgba(148,136,228,0.35)";
        context.lineWidth = 1;
        context.setLineDash(dashed ? [3, 6] : []);
        context.stroke();

        if (lineProgress < 1) {
          context.beginPath();
          context.arc(lineX, lineY, 2.2, 0, Math.PI * 2);
          context.fillStyle = hexToRgba(SIGNAL_COLOR, 0.95);
          context.fill();
        }
      });
      context.setLineDash([]);

      if (!reduceMotion && signalsEnabledRef.current) {
        particles.forEach((p) => {
          const item = items[p.itemIndex]!;
          const lineProgress = spokeProgressRef.current[p.itemIndex] ?? 1;
          if (lineProgress < 1) return;

          p.t += p.v * dt;
          const hubPt =
            spokeStartsRef.current[p.itemIndex] ??
            toPx(item.start.x, item.start.y);
          const nodePt =
            spokeEndsRef.current[p.itemIndex] ?? toPx(item.end.x, item.end.y);
          const from = p.toHub ? nodePt : hubPt;
          const to = p.toHub ? hubPt : nodePt;

          if (p.t >= 1) {
            p.t %= 1;
            p.v = 0.13 + Math.random() * 0.09;
            if (p.toHub) {
              pulses.push({ r: 0, a: 0.55 });
            }
          }

          const pt = {
            x: from.x + (to.x - from.x) * p.t,
            y: from.y + (to.y - from.y) * p.t,
          };
          const tailT = Math.max(0, p.t - 0.12);
          const tail = {
            x: from.x + (to.x - from.x) * tailT,
            y: from.y + (to.y - from.y) * tailT,
          };

          const grad = context.createLinearGradient(tail.x, tail.y, pt.x, pt.y);
          grad.addColorStop(0, hexToRgba(SIGNAL_COLOR, 0));
          grad.addColorStop(1, hexToRgba(SIGNAL_COLOR, 0.9));
          context.beginPath();
          context.moveTo(tail.x, tail.y);
          context.lineTo(pt.x, pt.y);
          context.strokeStyle = grad;
          context.lineWidth = 1.6;
          context.stroke();

          context.beginPath();
          context.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          context.fillStyle = hexToRgba(SIGNAL_COLOR, 0.95);
          context.fill();
        });
      }

      pulses = pulses.filter((p) => p.a > 0.02);
      pulses.forEach((p) => {
        p.r += 34 * dt;
        p.a *= 1 - 2.2 * dt;
        context.beginPath();
        context.arc(hub.x, hub.y, hubR + p.r, 0, Math.PI * 2);
        context.strokeStyle = hexToRgba(SIGNAL_COLOR, p.a);
        context.lineWidth = 1;
        context.stroke();
      });
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible) draw(reduceMotion ? 0 : dt);
      raf = requestAnimationFrame(frame);
    }

    resize();
    initParticles();
    last = performance.now();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [items]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto aspect-square h-full w-full max-w-[720px] ${className}`}
      aria-label="Program partner capabilities radiating from CoverForce"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />

      <div
        className={`absolute top-1/2 left-1/2 z-10 flex aspect-square w-[14%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ECE7FF] bg-white transition-transform duration-200 ${
          hovered !== null ? "scale-105" : ""
        }`}
      >
        <div className="flex aspect-square w-[72%] items-center justify-center rounded-full bg-[#ECE7FF]">
          <Image
            src="/images/startups/center-logo.svg"
            alt="CoverForce logo"
            width={36}
            height={36}
            className="h-[58%] w-[58%] object-contain"
          />
        </div>
      </div>

      <div className="absolute inset-0">
        {items.map((item, i) => {
          const Icon = item.icon;
          const isActive = hovered === i;
          const px = nodePx?.[i];
          return (
            <div
              key={item.id}
              data-enablement-wheel-node={i}
              className="group absolute -translate-x-1/2 -translate-y-1/2 opacity-0"
              style={{
                left: px ? `${px.x}px` : `${item.pos.x}%`,
                top: px ? `${px.y}px` : `${item.pos.y}%`,
                zIndex: isActive ? 30 : 20,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={`flex items-center gap-1.5 rounded-[5px] border border-transparent py-1.5 pl-1.5 pr-2.5 text-white transition-all duration-200 sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-3 ${
                  isActive
                    ? "scale-110 shadow-[0_10px_28px_rgba(50,38,150,0.42)]"
                    : "shadow-[0_4px_14px_rgba(50,38,150,0.26)] group-hover:scale-110 group-hover:shadow-[0_10px_28px_rgba(50,38,150,0.42)]"
                }`}
                style={{ background: PRIMARY_BUTTON_GRADIENT }}
              >
                <div className="flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-white/20 ring-1 ring-white/30">
                  <Icon size={11} strokeWidth={2.25} className="text-white" />
                </div>
                <span className="whitespace-nowrap font-mono text-[0.5625rem] font-semibold leading-none tracking-[0.07em] text-white sm:text-[0.625rem]">
                  {item.label}
                </span>
    </div>
  </div>
);
        })}
    </div>
  </div>
);
}

const Enablement = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
    descRef,
  });

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-10 lg:pb-12">
          <div
            ref={headerRef}
            className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-5"
          >
            <h2
              ref={headingRef}
              className="order-1 max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:col-start-1 lg:row-start-1 lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>
                Interested in becoming a program partner?
              </span>
            </h2>

            <div className="order-2 flex max-w-md flex-col items-start gap-6 text-left lg:col-start-2 lg:row-start-1 lg:ml-auto lg:items-end">
              <p
                ref={descRef}
                className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
              >
                We partner with market access and enablement providers that help
                early-stage digital brokerages launch faster. If your business
                supports that journey, we&apos;d like to hear from you.
              </p>
            </div>

            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <Button href="/contact">Book a Call</Button>
            </div>
          </div>

          <div className="relative mt-10 w-full md:mt-14">
            <div className="relative z-10 mx-auto aspect-square w-full max-w-[min(100%,720px)]">
              <EnablementWheel className="h-full w-full max-w-none" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Enablement;
