"use client";
import { useRef, useEffect, useCallback, useState, type MutableRefObject } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { RiAppleFill, RiBattery2Fill, RiSearchLine, RiWifiFill } from "@remixicon/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/magnified-doc";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "opening" | "open" | "closing";
type Dir = "open" | "minimize";
interface Pt {
  x: number;
  y: number;
}
interface App {
  id: string;
  Icon: React.FC;
  label: string;
  accent: string;
  previewImage: string;
  /** x where the 705px-wide window frame starts inside the preview SVG. */
  previewFrameX: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
// The preview SVGs differ in size, so each is shifted to put its window frame
// at WIN_FRAME_X. The box fits the largest one (779×405).
const WIN_W = 779;
const WIN_H = 405;
const WIN_FRAME_X = 73.297;
// The 705px frame spans x 73.3–778.3; the strip on its left only holds the
// floating badge. Shift by half that strip so the frame looks centered.
const WIN_VISUAL_OFFSET_X = 36.6;
// Traffic-light dots (close / minimize) in box coords.
const TRAFFIC_LIGHTS_X = [99.297, 112.297];
const TRAFFIC_LIGHTS_Y = 21;
const DUR = 500;
/** Height of the custom menubar drawn on phones (the image's own is cropped). */
const MOBILE_MENUBAR_H = 28;
/** Visible artwork extent inside the 779-wide box (badge left → frame right). */
const MOBILE_CONTENT_LEFT = 44;
const MOBILE_CONTENT_RIGHT = 778;
// DPR is read lazily inside setupCanvas - never at module scope, which would
// run during SSR and either crash or hardcode a value.

// Static dock config - intentionally lightweight to avoid hover lag.
const DOCK_ICON_SIZE = 72;
const DOCK_PAD_X = 18;
const DOCK_PAD_BOTTOM = 6;
const DOCK_PAD_TOP = 8;
const DOCK_GAP = 6;
const DOCK_RADIUS = 20;

// ─── Math ─────────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eioC = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eIn2 = (t: number) => t * t;
const eOut2 = (t: number) => 1 - (1 - t) * (1 - t);

// ─── Dock app icons ───────────────────────────────────────────────────────────
function DockAppIcon({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="icon"
      draggable={false}
      className="size-full object-contain"
    />
  );
}

function createDockIcon(src: string): React.FC {
  return function DockIcon() {
    return <DockAppIcon src={src} />;
  };
}

// ─── Apps ─────────────────────────────────────────────────────────────────────
const APPS: App[] = [
  {
    id: "acord-125",
    Icon: createDockIcon("/images/product/submission-intake/dock-acord-125.svg"),
    label: "Acord 125",
    accent: "#FF536A",
    previewImage: "/images/product/submission-intake/live-demo-1.svg",
    previewFrameX: 73.297,
  },
  {
    id: "loss-run",
    Icon: createDockIcon("/images/product/submission-intake/dock-loss-run.svg"),
    label: "Loss Run",
    accent: "#FF6B2A",
    previewImage: "/images/product/submission-intake/live-demo-2.svg",
    previewFrameX: 26,
  },
  {
    id: "acord-126",
    Icon: createDockIcon("/images/product/submission-intake/dock-acord-126.svg"),
    label: "Prior Policy",
    accent: "#1F86F9",
    previewImage: "/images/product/submission-intake/live-demo-3.svg",
    previewFrameX: 26,
  },
];

// ─── Genie scanline renderer ──────────────────────────────────────────────────
function computeRowSlice(
  y: number,
  rawT: number,
  dir: Dir,
  dock: Pt,
  win: Pt,
  scale = 1,
): { left: number; right: number; destY: number } {
  const r = y / WIN_H;
  const winW = WIN_W * scale;
  const rowXStart = dir === "minimize" ? (1 - r) * 0.65 : r * 0.65;
  const xP = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
  const xE = eioC(xP);
  const rowYStart = dir === "minimize" ? (1 - r) * 0.2 : r * 0.2;
  const yP = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
  const yE = eIn2(yP);
  const destRowY = win.y + y * scale;

  if (dir === "minimize") {
    return {
      left: lerp(win.x, dock.x, xE),
      right: lerp(win.x + winW, dock.x, xE),
      destY: lerp(destRowY, dock.y, yE),
    };
  }

  return {
    left: lerp(dock.x, win.x, xE),
    right: lerp(dock.x, win.x + winW, xE),
    destY: lerp(dock.y, destRowY, yE),
  };
}

function renderGenie(
  ctx: CanvasRenderingContext2D,
  off: HTMLCanvasElement,
  W: number,
  H: number,
  rawT: number,
  dir: Dir,
  dock: Pt,
  win: Pt,
  scale = 1,
): void {
  if (!off) return;
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;

  const rows = Array.from({ length: WIN_H }, (_, y) =>
    computeRowSlice(y, rawT, dir, dock, win, scale),
  );

  const srcW = off.width || WIN_W;
  const srcH = off.height || WIN_H;

  // The preview window is translucent glass, so any vertical overlap between
  // slices stacks alpha and darkens the whole window mid-animation. Snap every
  // slice to whole device pixels and never paint a device row twice - that
  // keeps the warp seamless without double-compositing.
  const dpr = ctx.getTransform().a || 1;
  const snap = (v: number) => Math.round(v * dpr) / dpr;
  const px = 1 / dpr;
  let lastBottom = -Infinity;

  for (let y = 0; y < WIN_H; y++) {
    const { left, right, destY } = rows[y];
    const rowW = right - left;
    if (rowW < 0.05) continue;

    const nextDestY = y < WIN_H - 1 ? rows[y + 1].destY : destY + Math.max(1, scale);
    let top = snap(Math.min(destY, nextDestY));
    let bottom = snap(Math.max(destY, nextDestY));
    if (bottom - top < px) bottom = top + px;
    if (top < lastBottom) top = lastBottom;
    if (bottom <= top) continue;
    lastBottom = bottom;

    const srcY = Math.min(srcH - 1, Math.floor((y / WIN_H) * srcH));
    ctx.drawImage(off, 0, srcY, srcW, 1, left, top, rowW, bottom - top);
  }

  const glowRaw = dir === "minimize" ? rawT : 1 - rawT;
  if (glowRaw > 0.75) {
    const a = eOut2((glowRaw - 0.75) / 0.25) * 0.3;
    const hex = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");
    const g = ctx.createRadialGradient(dock.x, dock.y, 0, dock.x, dock.y, 55);
    g.addColorStop(0, "#ffffff" + hex);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

// ─── Preview window ───────────────────────────────────────────────────────────
// The preview SVG already draws its own window chrome, so this only places it
// and overlays hit areas on the SVG's red/yellow traffic-light dots.
const MacWindow = ({
  app,
  winPos,
  onClose,
  domRef,
  scale = 1,
}: {
  app: App;
  winPos: Pt;
  onClose: () => void;
  domRef: React.RefCallback<HTMLDivElement>;
  /** Mobile-only visual scale; desktop stays 1. */
  scale?: number;
}) => {
  return (
    <div
      ref={domRef}
      className="absolute"
      style={{
        width: WIN_W,
        height: WIN_H,
        left: winPos.x,
        top: winPos.y,
        zIndex: 40,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      <img
        src={app.previewImage}
        alt={app.label}
        draggable={false}
        className="absolute top-0 block max-w-none"
        style={{ left: WIN_FRAME_X - app.previewFrameX }}
      />
      {TRAFFIC_LIGHTS_X.map((cx) => (
        <button
          key={cx}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute size-3 cursor-pointer rounded-full border-none bg-transparent"
          style={{ left: cx - 6, top: TRAFFIC_LIGHTS_Y - 6 }}
        />
      ))}
    </div>
  );
};

// ─── Dock Icon ────────────────────────────────────────────────────────────────
function DockIconButton({
  app,
  isActive,
  showDot,
  hintActive,
  hintDelayMs,
  disabled,
  btnRef,
  onClick,
  iconSize = DOCK_ICON_SIZE,
}: {
  app: App;
  isActive: boolean;
  showDot: boolean;
  hintActive: boolean;
  hintDelayMs: number;
  disabled: boolean;
  btnRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  iconSize?: number;
}) {
  const Icon = app.Icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={btnRef}
          onClick={onClick}
          disabled={disabled}
          style={{
            width: iconSize,
            height: iconSize,
            cursor: disabled ? "default" : "pointer",
            animationDelay: `${hintDelayMs}ms`,
          }}
          className={`relative flex shrink-0 items-end justify-center border-none bg-transparent p-0 transition-transform duration-200 ease-out hover:scale-[1.06] ${
            hintActive ? "animate-[dockHint_2.8s_ease-in-out_infinite]" : ""
          }`}
        >
          <div
            style={{
              width: Math.round(iconSize * 0.92),
              height: Math.round(iconSize * 0.92),
              borderRadius: "22%",
              filter: isActive
                ? `drop-shadow(0 6px 14px ${app.accent}88)`
                : "drop-shadow(0 2px 6px rgba(0,0,0,.45))",
              pointerEvents: "none",
            }}
            className="flex items-center justify-center"
          >
            <Icon />
          </div>
          {showDot && (
            <div
              className="absolute bottom-0 left-1/2 h-0.75 w-0.75 -translate-x-1/2 rounded-full"
              style={{ background: "rgba(255,255,255,.85)" }}
            />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent className="rounded-md px-3 py-1" side="top" sideOffset={8}>
        <p className="text-xs text-primary">{app.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ─── macOS Dock Bar ───────────────────────────────────────────────────────────
function MacDock({
  apps,
  activeApp,
  phase,
  isAnimating,
  snapshotsReady,
  dockRefs,
  onOpen,
  compact = false,
}: {
  apps: App[];
  activeApp: number | null;
  phase: Phase;
  isAnimating: boolean;
  snapshotsReady: boolean;
  dockRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  onOpen: (idx: number) => void;
  compact?: boolean;
}) {
  const iconSize = compact ? 52 : DOCK_ICON_SIZE;
  const padX = compact ? 12 : DOCK_PAD_X;
  const padTop = compact ? 6 : DOCK_PAD_TOP;
  const padBottom = compact ? 5 : DOCK_PAD_BOTTOM;
  const gap = compact ? 4 : DOCK_GAP;

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className="absolute bottom-3 bg-[#303030]/20 rounded-2xl left-1/2 z-50 flex -translate-x-1/2 items-end"
        style={{
          height: iconSize + padTop + padBottom,
          gap,
          paddingLeft: padX,
          paddingRight: padX,
          paddingBottom: padBottom,
          paddingTop: padTop,
          borderRadius: DOCK_RADIUS,
        }}
      >
        {apps.map((a, i) => (
          <DockIconButton
            key={a.id}
            app={a}
            isActive={activeApp === i}
            showDot={phase === "open" && activeApp === i}
            hintActive={snapshotsReady && !isAnimating && activeApp !== i}
            hintDelayMs={i * 180}
            disabled={isAnimating || !snapshotsReady}
            iconSize={iconSize}
            btnRef={(el) => {
              dockRefs.current[i] = el;
            }}
            onClick={() => onOpen(i)}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

// ─── Snapshot Stage ───────────────────────────────────────────────────────────
// Pulled out as its own component so it can render independently of the main
// component's render cycle. Captures all MacWindow textures in parallel
// and only after the page has had a chance to paint (idle callback).
function SnapshotStage({
  onReady,
}: {
  onReady: (canvases: HTMLCanvasElement[]) => void;
}) {
  useEffect(() => {
    let cancelled = false;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    // Each preview is a single SVG, so draw it straight onto a canvas at the
    // same offset MacWindow uses. More reliable than DOM-to-image capture
    // (which can return blank frames, notably in Safari) and much cheaper.
    const snapshot = (app: App) =>
      new Promise<HTMLCanvasElement>((resolve, reject) => {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = WIN_W * ratio;
          canvas.height = WIN_H * ratio;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("2D context unavailable"));
          ctx.scale(ratio, ratio);
          ctx.drawImage(img, WIN_FRAME_X - app.previewFrameX, 0);
          resolve(canvas);
        };
        img.onerror = () => reject(new Error(`Failed to load ${app.previewImage}`));
        img.src = app.previewImage;
      });

    const run = async () => {
      try {
        const canvases = await Promise.all(APPS.map(snapshot));
        if (!cancelled) onReady(canvases);
      } catch (err) {
        console.error("Genie snapshot failed:", err);
        if (!cancelled) onReady([]);
      }
    };

    // Defer to idle time so it doesn't block first paint or first interaction.
    // Falls back to a 50ms setTimeout in browsers without rIC (Safari).
    const ric =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback;
    const cic =
      (window as unknown as { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback;
    let handle: number;
    if (typeof ric === "function") {
      handle = ric(run);
    } else {
      handle = window.setTimeout(run, 50);
    }

    return () => {
      cancelled = true;
      if (typeof cic === "function") cic(handle);
      else clearTimeout(handle);
    };
  }, [onReady]);

  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GenieEffect() {
  // Render the interactive pieces client-side after mount.
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLgOnly, setIsLgOnly] = useState(false);
  useEffect(() => {
    setMounted(true);
    const mobileMql = window.matchMedia("(max-width: 767px)");
    const lgMql = window.matchMedia("(min-width: 1024px) and (max-width: 1279px)");
    const sync = () => {
      setIsMobile(mobileMql.matches);
      setIsLgOnly(lgMql.matches);
    };
    sync();
    mobileMql.addEventListener("change", sync);
    lgMql.addEventListener("change", sync);
    return () => {
      mobileMql.removeEventListener("change", sync);
      lgMql.removeEventListener("change", sync);
    };
  }, []);

  const [phase, setPhase] = useState<Phase>("idle");
  const [activeApp, setActiveApp] = useState<number | null>(null);
  const [winPos, setWinPos] = useState<Pt>({ x: 0, y: 0 });
  const [winScale, setWinScale] = useState(1);
  const [snapshotsReady, setSnapshotsReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // `containerRef` is the source of truth for layout coordinates. All
  // positioning math (window center, dock-center, canvas dimensions) reads
  // from this rect instead of `window.innerWidth/Height`. That way the
  // component drops cleanly into any sized parent (e.g. max-w-4xl h-[600px])
  // and centers correctly within it.
  const containerRef = useRef<HTMLDivElement>(null);
  const dockRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const offRef = useRef<HTMLCanvasElement[]>([]);
  const rafRef = useRef<number>(0);
  const stateRef = useRef<{ phase: Phase; activeApp: number | null }>({
    phase: "idle",
    activeApp: null,
  });

  const handleSnapshotsReady = useCallback((canvases: HTMLCanvasElement[]) => {
    offRef.current = canvases;
    setSnapshotsReady(true);
  }, []);

  // All position helpers below resolve against the container's bounding rect.
  // Falls back to viewport dims if the ref isn't ready yet (shouldn't happen
  // post-mount, but keeps the helpers null-safe).
  const getContainerSize = useCallback((): { w: number; h: number } => {
    const el = containerRef.current;
    if (!el) return { w: window.innerWidth, h: window.innerHeight };
    return { w: el.clientWidth, h: el.clientHeight };
  }, []);

  const getWinLayout = useCallback((): { pos: Pt; scale: number } => {
    const { w, h } = getContainerSize();
    if (isMobile) {
      // As large as fits: the window's real artwork (badge's left edge to the
      // frame's right edge = MOBILE_CONTENT_LEFT..MOBILE_CONTENT_RIGHT in box
      // units, measured from the preview SVGs) fills the width minus a small
      // gutter - the badge stays fully visible.
      const gutter = 6;
      const contentW = MOBILE_CONTENT_RIGHT - MOBILE_CONTENT_LEFT;
      const scale = Math.min(1, (w - gutter * 2) / contentW);
      const scaledH = WIN_H * scale;
      const dockReserve = 68;
      return {
        scale,
        pos: {
          x: (w - contentW * scale) / 2 - MOBILE_CONTENT_LEFT * scale,
          // Below the custom mobile menubar.
          y: Math.max(MOBILE_MENUBAR_H + 12, (h - scaledH - dockReserve) / 2 + MOBILE_MENUBAR_H / 2),
        },
      };
    }
    if (isLgOnly) {
      const scale = 0.82;
      const scaledW = WIN_W * scale;
      const scaledH = WIN_H * scale;
      const dockReserve = 96;
      return {
        scale,
        pos: {
          x: (w - scaledW) / 2 - WIN_VISUAL_OFFSET_X * scale,
          y: Math.max(36, (h - scaledH - dockReserve) / 2 - 12),
        },
      };
    }
    const scale = 1.05;
    return {
      scale,
      pos: {
        x: (w - WIN_W * scale) / 2 - WIN_VISUAL_OFFSET_X * scale,
        y: (h - WIN_H * scale) / 2 - 20,
      },
    };
  }, [getContainerSize, isMobile, isLgOnly]);

  // Returns dock-button center in CONTAINER-LOCAL coords (not viewport coords).
  // The genie canvas draws in container-local coords too, so these match.
  const getDockCenter = useCallback((idx: number): Pt => {
    const btn = dockRefs.current[idx];
    const cont = containerRef.current;
    if (!btn || !cont) return { x: 0, y: 0 };
    const b = btn.getBoundingClientRect();
    const c = cont.getBoundingClientRect();
    return {
      x: b.left - c.left + b.width / 2,
      y: b.top - c.top + b.height / 2,
    };
  }, []);

  const setupCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const { w, h } = getContainerSize();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * dpr;
    c.height = h * dpr;
    c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [getContainerSize]);

  const clearCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    c.style.zIndex = "30";
  }, []);

  const startAnim = useCallback(
    (dir: Dir, appIdx: number, onDone: () => void) => {
      cancelAnimationFrame(rafRef.current);
      const dock = getDockCenter(appIdx);
      const layout = getWinLayout();
      const { w: cw, h: ch } = getContainerSize();
      const off = offRef.current[appIdx];
      if (!off) {
        onDone();
        return;
      }
      let start: number | null = null;
      function frame(ts: number) {
        if (!start) start = ts;
        const rawT = clamp((ts - start) / DUR, 0, 1);
        const c = canvasRef.current;
        if (!c) return;
        renderGenie(
          c.getContext("2d")!,
          off,
          cw,
          ch,
          rawT,
          dir,
          dock,
          layout.pos,
          layout.scale,
        );
        if (rawT < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          onDone();
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [getDockCenter, getWinLayout, getContainerSize],
  );

  const doOpen = useCallback(
    (idx: number) => {
      if (stateRef.current.phase !== "idle") return;
      windowRef.current = null;
      const layout = getWinLayout();
      setupCanvas();
      stateRef.current = { phase: "opening", activeApp: idx };
      setWinPos(layout.pos);
      setWinScale(layout.scale);
      setPhase("opening");
      setActiveApp(idx);
      startAnim("open", idx, () => {
        stateRef.current.phase = "open";
        // Commit the MacWindow synchronously so it's in the DOM (z-40, above
        // the canvas at z-30). Its freshly mounted <img> is NOT painted yet
        // though - it still has to decode. Clearing the canvas now would show
        // the bare desktop for a frame or two (the flicker). So the canvas
        // keeps holding the final genie frame until the image has decoded and
        // been painted, then it's cleared invisibly underneath the window.
        flushSync(() => {
          setPhase("open");
        });
        // The window is translucent glass: if it is visible on top of the
        // canvas's final frame, the two stack and darken, then lighten again
        // when the canvas clears (a blink). So keep the window hidden until
        // its image is decoded, then reveal it and clear the canvas in the
        // SAME frame - a single clean swap.
        const win = windowRef.current;
        if (win) win.style.opacity = "0";
        const img = win?.querySelector("img");
        const decoded =
          img && typeof img.decode === "function"
            ? img.decode().catch(() => undefined)
            : Promise.resolve();
        decoded.then(() => {
          requestAnimationFrame(() => {
            // Skip if a minimize already started and owns the canvas.
            if (stateRef.current.phase !== "open") return;
            if (windowRef.current) windowRef.current.style.opacity = "";
            clearCanvas();
          });
        });
      });
    },
    [getWinLayout, setupCanvas, startAnim, clearCanvas],
  );

  const doMinimize = useCallback(
    (onComplete?: () => void) => {
      const { phase: p, activeApp: a } = stateRef.current;
      if (p !== "open" || a === null) return;

      const cvs = canvasRef.current;
      if (cvs) cvs.style.zIndex = "50";

      setupCanvas();
      const dock = getDockCenter(a);
      const layout = getWinLayout();
      const { w: cw, h: ch } = getContainerSize();
      const ctx = cvs?.getContext("2d");
      if (ctx && cvs) {
        renderGenie(
          ctx,
          offRef.current[a],
          cw,
          ch,
          0,
          "minimize",
          dock,
          layout.pos,
          layout.scale,
        );
      }

      if (windowRef.current) {
        windowRef.current.style.opacity = "0";
        windowRef.current.style.pointerEvents = "none";
      }

      stateRef.current.phase = "closing";
      setPhase("closing");

      startAnim("minimize", a, () => {
        stateRef.current = { phase: "idle", activeApp: null };
        setPhase("idle");
        setActiveApp(null);
        windowRef.current = null;
        clearCanvas();
        onComplete?.();
      });
    },
    [setupCanvas, getDockCenter, getWinLayout, getContainerSize, startAnim, clearCanvas],
  );

  const handleDockClick = useCallback(
    (idx: number) => {
      const { phase: p, activeApp: a } = stateRef.current;

      if (p === "opening" || p === "closing") return;

      if (p === "idle") {
        doOpen(idx);
        return;
      }

      if (p === "open" && a !== null) {
        if (a === idx) {
          doMinimize();
          return;
        }
        doMinimize(() => doOpen(idx));
      }
    },
    [doOpen, doMinimize],
  );

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !snapshotsReady) return;
    if (stateRef.current.phase !== "idle") return;

    const layout = getWinLayout();
    stateRef.current = { phase: "open", activeApp: 0 };
    setWinPos(layout.pos);
    setWinScale(layout.scale);
    setActiveApp(0);
    setPhase("open");
  }, [mounted, snapshotsReady, getWinLayout]);

  // Re-center the open window when the container resizes (browser resize,
  // sidebar collapse, parent flexbox changes, etc.). ResizeObserver fires
  // synchronously with layout so there's no visible jitter.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (stateRef.current.phase === "open") {
        const layout = getWinLayout();
        setWinPos(layout.pos);
        setWinScale(layout.scale);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [getWinLayout]);

  const isAnimating = phase === "opening" || phase === "closing";
  const app = activeApp !== null ? APPS[activeApp] : null;

  return (
    <div
      ref={containerRef}
      className="relative h-[min(46vh,340px)] min-h-[19rem] w-full select-none overflow-hidden md:h-[min(85vh,860px)] md:min-h-162.5"
    >
      <style>{`
        @keyframes blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        @keyframes dockHint {
          0%, 82%, 100% { transform: translateY(0); }
          88% { transform: translateY(-5px); }
          94% { transform: translateY(0); }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">
        {/* The image includes its own menubar. On phones that bar shrinks to
            unreadable and gets cut off at the sides, so the image is drawn
            6.3% taller and shifted up (its bar is 5.9% of its height) to crop
            it, and a real-size menubar is drawn on top instead. */}
        <div className="absolute inset-x-0 bottom-0 top-0 max-md:-top-[6.3%]">
          <Image
            src="/images/product/submission-intake/mac-display.png"
            alt="macos-background"
            aria-hidden="true"
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            quality={90}
            className="object-cover object-top"
          />
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-0 z-[45] flex items-center justify-between bg-[#4b3f8f]/55 px-3 font-sans text-[11px] leading-none text-white md:hidden"
        style={{ height: MOBILE_MENUBAR_H }}
        aria-hidden
      >
        <div className="flex items-center gap-3">
          <RiAppleFill className="size-3.5" />
          <span className="font-semibold">CoverForce</span>
          <span className="text-white/85">File</span>
          <span className="text-white/85">Edit</span>
          <span className="text-white/85">View</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RiBattery2Fill className="size-3.5" />
          <RiWifiFill className="size-3.5" />
          <RiSearchLine className="size-3" />
          <span>12:24 PM</span>
        </div>
      </div>

      {/* Genie canvas - outside clipped scene so the warp isn't cut off */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", zIndex: 30 }}
      />

      {/* Live MacWindow - only renders when phase is open/closing */}
      {(phase === "open" || phase === "closing") && app && (
        <MacWindow
          app={app}
          winPos={winPos}
          scale={winScale}
          onClose={doMinimize}
          domRef={(el) => {
            windowRef.current = el;
          }}
        />
      )}

      {/* Everything below is gated on `mounted` - server skips it entirely,
          client renders it after the first effect fires. */}
      {mounted && (
        <>
          <SnapshotStage onReady={handleSnapshotsReady} />

          <MacDock
            apps={APPS}
            activeApp={activeApp}
            phase={phase}
            isAnimating={isAnimating}
            snapshotsReady={snapshotsReady}
            dockRefs={dockRefs}
            onOpen={handleDockClick}
            compact={isMobile}
          />
        </>
      )}
    </div>
  );
}