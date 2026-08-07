"use client";
import { useRef, useEffect, useCallback, useState, type MutableRefObject } from "react";
import { flushSync } from "react-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/magnified-doc";
import { toCanvas } from "html-to-image";

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
  tb: [string, string];
  previewImage: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WIN_W = 640;
const WIN_H = 500;
const WIN_TITLE_H = 42;
const DUR = 500;
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
    id: "loss-run",
    Icon: createDockIcon("/images/app1.svg"),
    label: "Loss Run",
    accent: "#FF6B2A",
    tb: ["#3a1810", "#280f08"],
    previewImage: "/images/content2.svg",
  },
  {
    id: "acord-125",
    Icon: createDockIcon("/images/app2.svg"),
    label: "Acord 125",
    accent: "#FF536A",
    tb: ["#3a1620", "#280f18"],
    previewImage: "/images/content2.svg",
  },
  {
    id: "acord-126",
    Icon: createDockIcon("/images/app3.svg"),
    label: "Acord 126",
    accent: "#1F86F9",
    tb: ["#0a1838", "#061026"],
    previewImage: "/images/content2.svg",
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

  for (let y = 0; y < WIN_H; y++) {
    const { left, right, destY } = rows[y];
    const rowW = right - left;
    if (rowW < 0.05) continue;

    const nextDestY = y < WIN_H - 1 ? rows[y + 1].destY : destY + Math.max(1, scale);
    const destH = Math.max(1.5, nextDestY - destY + 1.25);

    const srcY = Math.min(srcH - 1, Math.floor((y / WIN_H) * srcH));
    ctx.drawImage(off, 0, srcY, srcW, 1, left, destY, rowW, destH);
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

function DocumentPreviewContent({ src }: { src: string }) {
  return (
    <div className="flex h-full w-full items-start justify-center overflow-hidden bg-[#F4F5F7]">
      <img
        src={src}
        alt="document-preview"
        draggable={false}
        className="h-full w-full min-w-full object-cover object-top"
      />
    </div>
  );
}


// ─── Mac window wrapper ───────────────────────────────────────────────────────
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
      className="absolute flex flex-col overflow-hidden"
      style={{
        width: WIN_W,
        height: WIN_H,
        left: winPos.x,
        top: winPos.y,
        borderRadius: 13,
        background: "#1e1e1e",
        zIndex: 40,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: "top left",
        boxShadow:
          "0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.07)",
      }}
    >
      <div
        className="flex items-center px-4 shrink-0 relative"
        style={{
          height: WIN_TITLE_H,
          background: `linear-gradient(180deg,${app.tb[0]},${app.tb[1]})`,
          borderBottom: "1px solid rgba(0,0,0,.45)",
        }}
      >
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full border-none cursor-pointer hover:brightness-90 transition-all"
            style={{ background: "#ff5f57", boxShadow: "0 0 0 0.5px #e0443e" }}
          />
          <button
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full border-none cursor-pointer hover:brightness-90 transition-all"
            style={{ background: "#febc2e", boxShadow: "0 0 0 0.5px #d4a017" }}
          />
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ background: "#28c840", boxShadow: "0 0 0 0.5px #1aab29" }}
          />
        </div>
        <span
          className="absolute inset-x-0 text-center text-xs font-medium pointer-events-none"
          style={{ color: "rgba(255,255,255,.5)" }}
        >
          {app.label}
        </span>
      </div>
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <DocumentPreviewContent src={app.previewImage} />
      </div>
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
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;

    // Capture work - runs after the page has painted.
    const run = async () => {
      try {
        // Wait one more frame so the offscreen MacWindows have laid out.
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        if (cancelled) return;

        // Parallel snapshots - html-to-image's bottleneck is the Image
        // element rasterizing the SVG, which the browser does off the main
        // thread, so capturing in parallel is faster than sequential without
        // overwhelming anything.
        const canvases = await Promise.all(
          refs.current
            .filter((n): n is HTMLDivElement => n !== null)
            .map((node) =>
              toCanvas(node, {
                pixelRatio: 1,
                width: WIN_W,
                height: WIN_H,
                cacheBust: false,
              }),
            ),
        );
        if (cancelled) return;
        onReady(canvases);
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

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        pointerEvents: "none",
      }}
    >
      {APPS.map((a, i) => (
        <div
          key={a.id}
          style={{
            position: "relative",
            width: WIN_W,
            height: WIN_H,
            marginBottom: 20,
          }}
        >
          <MacWindow
            app={a}
            winPos={{ x: 0, y: 0 }}
            onClose={() => {}}
            domRef={(el) => {
              refs.current[i] = el;
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GenieEffect() {
  // Render the interactive pieces client-side after mount.
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
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
      // Fit with extra side padding so the display reads a bit smaller.
      const padX = 28;
      const fit = Math.min(1, (w - padX * 2) / WIN_W);
      const scale = fit * 0.92;
      const scaledW = WIN_W * scale;
      const scaledH = WIN_H * scale;
      const dockReserve = 68;
      return {
        scale,
        pos: {
          x: (w - scaledW) / 2,
          y: Math.max(24, (h - scaledH - dockReserve) / 2 - 8),
        },
      };
    }
    return {
      scale: 1,
      pos: {
        x: (w - WIN_W) / 2,
        y: (h - WIN_H) / 2 - 20,
      },
    };
  }, [getContainerSize, isMobile]);

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
        // flushSync forces React to commit the MacWindow into the DOM
        // synchronously, before clearCanvas runs. Without this, setPhase
        // batches and the canvas would clear one frame BEFORE the MacWindow
        // mounts - the page background shows through that gap, producing
        // the white-shutter flash. With flushSync, by the time clearCanvas
        // runs the MacWindow (z-40) is already on top of the canvas (z-30),
        // so the clear is visually invisible.
        flushSync(() => {
          setPhase("open");
        });
        clearCanvas();
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
      className="relative h-[min(52vh,420px)] min-h-[18rem] w-full select-none overflow-hidden md:h-[min(85vh,860px)] md:min-h-162.5"
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
      <img
        src="/macos.png"
        alt="macos-background"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Aurora blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full blur-3xl opacity-25"
          style={{
            width: 440,
            height: 440,
            left: "8%",
            top: "20%",
            background: "radial-gradient(circle,#2670d2,transparent)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: 360,
            height: 360,
            right: "10%",
            top: "40%",
            background: "radial-gradient(circle,#5a32c8,transparent)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            width: 400,
            height: 400,
            left: "38%",
            top: "3%",
            background: "radial-gradient(circle,#14a0bd,transparent)",
          }}
        />
      </div>

      {/* Menubar - safe to SSR (no motion values, no client-only state) */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 md:px-3"
        style={{
          height: 27,
          zIndex: 50,
          background: "rgba(0,0,0,.3)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <span className="text-white/70 flex max-w-[70%] items-center gap-1 truncate text-[10px] font-semibold tracking-tight md:max-w-none md:text-[11px]">
         <img src="/macicon.png" alt="mac-icon" aria-hidden="true" className="w-4 h-4 shrink-0" />
          <span className="truncate">{app?.label ?? "CoverForce"}</span>
          <span className="hidden md:inline">&nbsp; File &nbsp; Edit &nbsp; View
          &nbsp; Window &nbsp; Help</span>
        </span>
        <span className="text-white/60 text-[10px] font-medium md:text-[11px]">9:41 AM</span>
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