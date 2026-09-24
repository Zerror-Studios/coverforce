"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { toCanvas } from "html-to-image";
import { RiCloseLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHomeIntro } from "@/contexts/HomeIntroContext";
import { lockPageScroll } from "@/lib/scrollLock";

type Phase = "waiting" | "open" | "minimizing" | "strip" | "dismissed";
type MinimizeStep = "strip-in" | "overlay-out" | "genie" | "expand";

const SHOW_DELAY_MS = 3500;
const STRIP_APPEAR_MS = 260;
const OVERLAY_FADE_MS = 380;
const GENIE_MS = 580;
const EXPAND_MS = 360;
const STRIP_EXIT_MS = 260;
const STRIP_HEIGHT = 44;

const STRIP_GRADIENT =
  "linear-gradient(135deg, #E8894F 0%, #FFA36C 55%, #FFA36C 100%)";

const BANNER_ASSETS = {
  desktop: "/banner1-desktop.svg",
  mobile: "/banner1-mobile.svg",
} as const;

const ANNOUNCEMENT = {
  eyebrow: "Announcement",
  title: "CoverForce Startup Program is open",
  body: "Apply for preferred pricing, carrier access, and the infrastructure to launch your brokerage faster.",
  ctaLabel: "Apply now",
  ctaHref: "/contact",
  stripSegments: [
    { text: "First MCP Connector for Commercial Insurance", bold: false },
    { text: "In ChatGPT and Claude", bold: true },
    { text: "Quote 30+ Carriers Without Leaving the Chat", bold: false },
  ] as const,
};

type Rect = { x: number; y: number; w: number; h: number };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eioC = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eIn2 = (t: number) => t * t;
const eOut2 = (t: number) => 1 - (1 - t) * (1 - t);

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getTopCenterStripWidth(viewportW: number) {
  return clamp(viewportW * 0.2, 96, 152);
}

function getTopCenterStripRect(viewportW: number, topY: number): Rect {
  const stripW = getTopCenterStripWidth(viewportW);
  return {
    x: (viewportW - stripW) / 2,
    y: topY,
    w: stripW,
    h: STRIP_HEIGHT,
  };
}

function getFullStripRect(viewportW: number, topY: number, height: number): Rect {
  return { x: 0, y: topY, w: viewportW, h: height };
}

function fillStripGradient(ctx: CanvasRenderingContext2D, rect: Rect) {
  const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
  gradient.addColorStop(0, "#E8894F");
  gradient.addColorStop(0.55, "#FFA36C");
  gradient.addColorStop(1, "#FFA36C");
  ctx.fillStyle = gradient;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

function computeGenieRowSlice(
  rowIndex: number,
  rowCount: number,
  progress: number,
  win: Rect,
  dockCenterX: number,
  dock: Rect,
) {
  // r=0 is top of card, r=1 is bottom. Strip is above, so top rows
  // collapse first and the rest follow upward into the strip.
  const r = rowIndex / Math.max(1, rowCount - 1);
  const rowXStart = r * 0.65;
  const xP = clamp((progress - rowXStart) / Math.max(0.001, 1 - rowXStart), 0, 1);
  const xE = eioC(xP);
  const rowYStart = r * 0.2;
  const yP = clamp((progress - rowYStart) / Math.max(0.001, 1 - rowYStart), 0, 1);
  const yE = eIn2(yP);

  const srcRowY = win.y + (rowIndex / rowCount) * win.h;
  const targetRowY = dock.y + r * dock.h;

  return {
    left: lerp(win.x, dockCenterX, xE),
    right: lerp(win.x + win.w, dockCenterX, xE),
    destY: lerp(srcRowY, targetRowY, yE),
  };
}

function renderGenieFrame(
  ctx: CanvasRenderingContext2D,
  snapshot: HTMLCanvasElement,
  progress: number,
  win: Rect,
  dock: Rect,
) {
  const W = ctx.canvas.width / (window.devicePixelRatio || 1);
  const H = ctx.canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  fillStripGradient(ctx, dock);

  const dockCenterX = dock.x + dock.w / 2;
  const rowCount = clamp(Math.round(win.h * 0.85), 64, 140);
  const srcW = snapshot.width;
  const srcH = snapshot.height;
  const rowSlices = Array.from({ length: rowCount }, (_, rowIndex) =>
    computeGenieRowSlice(rowIndex, rowCount, progress, win, dockCenterX, dock),
  );

  for (let y = 0; y < rowCount; y += 1) {
    const { left, right, destY } = rowSlices[y]!;
    const rowW = right - left;
    if (rowW < 0.5) continue;

    const nextDestY = y < rowCount - 1 ? rowSlices[y + 1]!.destY : destY + Math.max(1.5, dock.h / rowCount);
    const destH = Math.max(1.5, nextDestY - destY + 1.25);
    const srcY = Math.min(srcH - 1, Math.floor((y / rowCount) * srcH));

    ctx.save();
    if (progress > 0.72) {
      ctx.globalAlpha = clamp(1 - (progress - 0.72) / 0.28, 0, 1);
    }
    ctx.drawImage(snapshot, 0, srcY, srcW, 1, left, destY, rowW, destH);
    ctx.restore();
  }

  if (progress > 0.78) {
    const glowAlpha = eOut2((progress - 0.78) / 0.22) * 0.22;
    const glow = ctx.createRadialGradient(dockCenterX, dock.y + dock.h / 2, 0, dockCenterX, dock.y + dock.h / 2, dock.w * 0.8);
    glow.addColorStop(0, `rgba(255,255,255,${glowAlpha})`);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }
}

function renderExpandFrame(
  ctx: CanvasRenderingContext2D,
  progress: number,
  from: Rect,
  to: Rect,
) {
  const W = ctx.canvas.width / (window.devicePixelRatio || 1);
  const H = ctx.canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, W, H);

  const t = eOut2(progress);
  const width = lerp(from.w, to.w, t);
  const height = lerp(from.h, to.h, t);
  const centerX = lerp(from.x + from.w / 2, to.x + to.w / 2, t);
  const y = lerp(from.y, to.y, t);

  fillStripGradient(ctx, {
    x: centerX - width / 2,
    y,
    w: width,
    h: height,
  });
}

function StripSegments({
  className = "",
  "aria-hidden": ariaHidden,
}: {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <span
      className={`inline-flex items-center gap-x-2 whitespace-nowrap sm:gap-x-3 ${className}`}
      aria-hidden={ariaHidden}
    >
      {ANNOUNCEMENT.stripSegments.map((segment, index) => (
        <span key={`${segment.text}-${index}`} className="inline-flex items-center gap-x-2 sm:gap-x-3">
          {index > 0 ? (
            <span className="shrink-0 text-white/50" aria-hidden>
              |
            </span>
          ) : null}
          <span className={segment.bold ? "font-semibold" : undefined}>{segment.text}</span>
        </span>
      ))}
    </span>
  );
}

export default function AnnouncementBanner() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { enabled: introEnabled, phase: introPhase } = useHomeIntro();
  const introReady = !introEnabled || introPhase === "done";

  const [phase, setPhase] = useState<Phase>("waiting");
  const [minimizeStep, setMinimizeStep] = useState<MinimizeStep | null>(null);
  const [stripContentReady, setStripContentReady] = useState(false);
  const [stripExiting, setStripExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);
  const stripAnchorRef = useRef<HTMLDivElement>(null);
  const stripTargetRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const closingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isHome || !introReady || phase !== "waiting") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 800 : SHOW_DELAY_MS;
    const timer = window.setTimeout(() => setPhase("open"), delay);
    return () => window.clearTimeout(timer);
  }, [mounted, isHome, introReady, phase]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "strip") {
      setStripContentReady(false);
      return;
    }

    const frame = requestAnimationFrame(() => setStripContentReady(true));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const dismissFully = useCallback(() => {
    if (stripExiting) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("dismissed");
      setMinimizeStep(null);
      return;
    }

    setStripExiting(true);
    window.setTimeout(() => {
      setPhase("dismissed");
      setMinimizeStep(null);
      setStripExiting(false);
    }, STRIP_EXIT_MS);
  }, [stripExiting]);

  const setupCanvas = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return null;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }, []);

  const runGenieAnimation = useCallback(
    (ctx: CanvasRenderingContext2D, snapshot: HTMLCanvasElement, win: Rect, dock: Rect) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          const t = clamp((now - start) / GENIE_MS, 0, 1);
          renderGenieFrame(ctx, snapshot, t, win, dock);
          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          resolve();
        };
        rafRef.current = requestAnimationFrame(tick);
      }),
    [],
  );

  const runExpandAnimation = useCallback(
    (ctx: CanvasRenderingContext2D, from: Rect, to: Rect) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          const t = clamp((now - start) / EXPAND_MS, 0, 1);
          renderExpandFrame(ctx, t, from, to);
          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          resolve();
        };
        rafRef.current = requestAnimationFrame(tick);
      }),
    [],
  );

  const minimizeToStrip = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("strip");
      closingRef.current = false;
      return;
    }

    setPhase("minimizing");
    setMinimizeStep("overlay-out");
    await wait(OVERLAY_FADE_MS);

    setMinimizeStep("strip-in");
    await wait(STRIP_APPEAR_MS);

    const banner = bannerRef.current;
    if (!banner) {
      setPhase("strip");
      setMinimizeStep(null);
      closingRef.current = false;
      return;
    }

    try {
      const rect = banner.getBoundingClientRect();
      const snapshot = await toCanvas(banner, {
        pixelRatio: Math.min(2, window.devicePixelRatio || 1),
        cacheBust: true,
        backgroundColor: "#FFA36C",
      });

      const ctx = setupCanvas();
      if (!ctx) {
        setPhase("strip");
        setMinimizeStep(null);
        closingRef.current = false;
        return;
      }

      const viewportW = window.innerWidth;
      const stripTargetRect = stripTargetRef.current?.getBoundingClientRect();
      const topY = stripTargetRect?.top ?? stripAnchorRef.current?.getBoundingClientRect().top ?? 0;
      const topStripH = Math.max(stripTargetRect?.height ?? STRIP_HEIGHT, STRIP_HEIGHT);

      const win: Rect = {
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: Math.max(1, Math.round(rect.height)),
      };
      const topCenterStrip: Rect = stripTargetRect
        ? {
            x: stripTargetRect.left,
            y: stripTargetRect.top,
            w: stripTargetRect.width,
            h: stripTargetRect.height,
          }
        : getTopCenterStripRect(viewportW, topY);
      const fullStrip = getFullStripRect(viewportW, topY, topStripH);

      setMinimizeStep("genie");
      await runGenieAnimation(ctx, snapshot, win, topCenterStrip);

      setMinimizeStep("expand");
      await runExpandAnimation(ctx, topCenterStrip, fullStrip);

      ctx.clearRect(0, 0, viewportW, window.innerHeight);
      setMinimizeStep(null);
      setPhase("strip");
    } catch {
      setMinimizeStep(null);
      setPhase("strip");
    } finally {
      closingRef.current = false;
    }
  }, [runExpandAnimation, runGenieAnimation, setupCanvas]);

  useEffect(() => {
    if (phase !== "open") return;

    const unlockScroll = lockPageScroll();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") minimizeToStrip();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [phase, minimizeToStrip]);

  if (!isHome || !mounted || phase === "dismissed") {
    return (
      <div
        ref={stripAnchorRef}
        className="pointer-events-none absolute left-0 top-0 h-0 w-full"
        aria-hidden
      />
    );
  }

  if (phase === "waiting") {
    return (
      <div
        ref={stripAnchorRef}
        className="pointer-events-none absolute left-0 top-0 h-0 w-full"
        aria-hidden
      />
    );
  }

  const stripVisible = phase === "strip";
  const stripSlotExpanded =
    (phase === "minimizing" &&
      (minimizeStep === "strip-in" ||
        minimizeStep === "genie" ||
        minimizeStep === "expand")) ||
    (phase === "strip" && !stripExiting);
  const modalVisible = phase === "open" || phase === "minimizing";
  const showStripTarget = phase === "minimizing" && minimizeStep === "strip-in";
  const keepStripTargetMeasure =
    phase === "minimizing" &&
    (minimizeStep === "genie" || minimizeStep === "expand");
  const cardVisible =
    phase === "open" ||
    minimizeStep === "overlay-out" ||
    minimizeStep === "strip-in";
  const overlayFading = minimizeStep === "overlay-out";
  const overlayOpen = phase === "open";
  const canvasVisible = minimizeStep === "genie" || minimizeStep === "expand";

  return (
    <>
      <div
        ref={stripAnchorRef}
        className={`announcement-strip-slot relative w-full ${
          stripSlotExpanded ? "is-expanded" : ""
        }`}
        style={{ "--announcement-strip-height": `${STRIP_HEIGHT}px` } as CSSProperties}
      >
        {showStripTarget || keepStripTargetMeasure ? (
          <div
            ref={stripTargetRef}
            className={`mx-auto ${
              showStripTarget
                ? "announcement-strip-target"
                : "announcement-strip-target-placeholder pointer-events-none invisible"
            }`}
            style={{
              height: STRIP_HEIGHT,
              background: STRIP_GRADIENT,
            }}
            aria-hidden
          />
        ) : null}

        {stripVisible ? (
          <div
            role="status"
            className={`flex min-h-[44px] w-full items-center gap-2 px-2 py-2.5 text-white sm:gap-3 sm:px-6 md:px-8 ${
              stripExiting ? "announcement-strip-full-exit" : "announcement-strip-full-enter"
            }`}
            style={{ background: STRIP_GRADIENT }}
          >
            <div
              className={`min-w-0 flex-1 overflow-hidden sm:hidden ${
                stripContentReady ? "announcement-strip-content-in" : "opacity-0"
              }`}
            >
              <div className="announcement-strip-marquee">
                <div className="announcement-strip-marquee-track">
                  <StripSegments className="font-sans text-[11px] font-regular tracking-wide" />
                  <StripSegments
                    className="font-sans text-[11px] font-regular tracking-wide"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <p
              className={`hidden min-w-0 flex-1 items-center justify-center gap-x-2 overflow-hidden text-center font-sans text-[11px] font-regular tracking-wide sm:flex sm:gap-x-3 sm:text-xs md:text-sm ${
                stripContentReady ? "announcement-strip-content-in" : "opacity-0"
              }`}
            >
              <StripSegments />
            </p>

            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={dismissFully}
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white ${
                stripContentReady ? "announcement-strip-content-in" : "opacity-0"
              }`}
              style={{ animationDelay: "80ms" }}
            >
              <RiCloseLine className="size-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      {modalVisible && typeof document !== "undefined"
        ? createPortal(
            <div
              data-lenis-prevent
              className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
              role="presentation"
            >
              <canvas
                ref={overlayCanvasRef}
                className={`pointer-events-none fixed inset-0 z-[210] transition-opacity duration-150 ${
                  canvasVisible ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden
              />

              <div
                className={`fixed inset-0 bg-black/55 backdrop-blur-[6px] ${
                  overlayFading
                    ? "announcement-overlay-exit"
                    : overlayOpen
                      ? "way-modal-overlay-enter"
                      : "pointer-events-none opacity-0"
                }`}
                aria-hidden
                onClick={phase === "open" ? minimizeToStrip : undefined}
              />

              <div
                className={`relative z-10 flex min-h-full items-center justify-center p-3 sm:p-5 sm:pb-8 md:p-8 ${
                  cardVisible ? "" : "pointer-events-none invisible"
                }`}
                onClick={phase === "open" ? minimizeToStrip : undefined}
              >
                <div className="relative w-full max-w-[min(100%,90rem)]">
                  <div
                    ref={bannerRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="announcement-title"
                    aria-describedby="announcement-body"
                    aria-hidden={!cardVisible}
                    className="way-modal-panel-enter way-modal-panel relative w-full overflow-hidden rounded-[20px] shadow-[0_24px_80px_rgba(10,20,59,0.18)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={minimizeToStrip}
                      className="absolute right-3 top-3 z-20 flex size-10 items-center justify-center rounded-sm border border-black/10 bg-white/90 text-[#0a143b] backdrop-blur-sm transition-colors hover:bg-white sm:right-4 sm:top-4"
                      aria-label="Minimize announcement"
                    >
                      <RiCloseLine size={20} />
                    </button>

                    <h2 id="announcement-title" className="sr-only">
                      {ANNOUNCEMENT.title}
                    </h2>
                    <p id="announcement-body" className="sr-only">
                      {ANNOUNCEMENT.body}
                    </p>

                    <Link
                      href={ANNOUNCEMENT.ctaHref}
                      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322696]"
                      aria-label={ANNOUNCEMENT.ctaLabel}
                    >
                      <Image
                        src={BANNER_ASSETS.mobile}
                        alt={ANNOUNCEMENT.title}
                        width={382}
                        height={561}
                        className="h-auto w-full md:hidden"
                        priority
                        unoptimized
                      />
                      <Image
                        src={BANNER_ASSETS.desktop}
                        alt=""
                        width={1440}
                        height={520}
                        className="hidden h-auto w-full md:block"
                        priority
                        unoptimized
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
