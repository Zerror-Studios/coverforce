"use client";
import { useRef, useEffect, useCallback, useState, type MutableRefObject } from "react";
import { flushSync } from "react-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/magnified-doc";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
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

// Magnification config - tuned to match macOS dock proportions
const DOCK_ICON_BASE = 68;
const DOCK_ICON_PEAK = 112;
const DOCK_MAG_RANGE = 160;
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
): { left: number; right: number; destY: number } {
  const r = y / WIN_H;
  const rowXStart = dir === "minimize" ? (1 - r) * 0.65 : r * 0.65;
  const xP = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
  const xE = eioC(xP);
  const rowYStart = dir === "minimize" ? (1 - r) * 0.2 : r * 0.2;
  const yP = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
  const yE = eIn2(yP);

  if (dir === "minimize") {
    return {
      left: lerp(win.x, dock.x, xE),
      right: lerp(win.x + WIN_W, dock.x, xE),
      destY: lerp(win.y + y, dock.y, yE),
    };
  }

  return {
    left: lerp(dock.x, win.x, xE),
    right: lerp(dock.x, win.x + WIN_W, xE),
    destY: lerp(dock.y, win.y + y, yE),
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
): void {
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;

  const rows = Array.from({ length: WIN_H }, (_, y) =>
    computeRowSlice(y, rawT, dir, dock, win),
  );

  const srcW = off.width || WIN_W;
  const srcH = off.height || WIN_H;

  for (let y = 0; y < WIN_H; y++) {
    const { left, right, destY } = rows[y];
    const rowW = right - left;
    if (rowW < 0.05) continue;

    const nextDestY = y < WIN_H - 1 ? rows[y + 1].destY : destY + 1;
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
}: {
  app: App;
  winPos: Pt;
  onClose: () => void;
  domRef: React.RefCallback<HTMLDivElement>;
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

// ─── Magnified Dock Icon ──────────────────────────────────────────────────────
// This component uses framer-motion's useSpring/useTransform - both produce
// floating-point values whose last-digit precision can differ between Node
// (server) and V8 (client), which causes hydration mismatches. So this whole
// component only renders client-side via the `mounted` flag in <GenieEffect>.
function MagnifiedDockIcon({
  app,
  isActive,
  showDot,
  hinted,
  disabled,
  btnRef,
  onClick,
  mouseX,
}: {
  app: App;
  isActive: boolean;
  showDot: boolean;
  hinted: boolean;
  disabled: boolean;
  btnRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  mouseX: MotionValue<number>;
}) {
  const localRef = useRef<HTMLButtonElement>(null);
  const setRefs = useCallback(
    (el: HTMLButtonElement | null) => {
      localRef.current = el;
      btnRef(el);
    },
    [btnRef],
  );

  const distance = useTransform(mouseX, (val) => {
    const bounds = localRef.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, (dist) => {
    const t = clamp(1 - Math.abs(dist) / DOCK_MAG_RANGE, 0, 1);
    return lerp(DOCK_ICON_BASE, DOCK_ICON_PEAK, eioC(t));
  });
  const size = useSpring(sizeSync, {
    mass: 0.1,
    stiffness: 220,
    damping: 18,
  });

  const innerSize = useTransform(size, (s) => s * 0.92);

  const Icon = app.Icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          ref={setRefs}
          onClick={onClick}
          disabled={disabled}
          style={{
            width: size,
            height: size,
            cursor: disabled ? "default" : "pointer",
          }}
          className={`relative flex shrink-0 items-end justify-center border-none bg-transparent p-0 ${
            hinted
              ? "animate-[live-demo-dock-pulse_3s_ease-in-out_infinite] hover:[animation-play-state:paused]"
              : ""
          }`}
        >
          <motion.div
            style={{
              width: innerSize,
              height: innerSize,
              borderRadius: "22%",
              filter: isActive
                ? `drop-shadow(0 6px 14px ${app.accent}88)`
                : "drop-shadow(0 2px 6px rgba(0,0,0,.45))",
              pointerEvents: "none",
            }}
            className="flex size-full items-center justify-center"
          >
            <Icon />
          </motion.div>
          {showDot && (
            <div
              className="absolute bottom-0 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full"
              style={{ background: "rgba(255,255,255,.85)" }}
            />
          )}
        </motion.button>
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
  pulseHint,
  isAnimating,
  snapshotsReady,
  dockRefs,
  onOpen,
}: {
  apps: App[];
  activeApp: number | null;
  phase: Phase;
  pulseHint: boolean;
  isAnimating: boolean;
  snapshotsReady: boolean;
  dockRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  onOpen: (idx: number) => void;
}) {
  const mouseX = useMotionValue(Infinity);

  const dockHeight = useTransform(mouseX, (mx) => {
    let maxSize = DOCK_ICON_BASE;
    if (Number.isFinite(mx)) {
      dockRefs.current.forEach((btn) => {
        if (!btn) return;
        const b = btn.getBoundingClientRect();
        const center = b.left + b.width / 2;
        const dist = Math.abs(mx - center);
        const t = clamp(1 - dist / DOCK_MAG_RANGE, 0, 1);
        maxSize = Math.max(
          maxSize,
          lerp(DOCK_ICON_BASE, DOCK_ICON_PEAK, eioC(t)),
        );
      });
    }
    return maxSize + DOCK_PAD_TOP + DOCK_PAD_BOTTOM;
  });

  const dockHeightSpring = useSpring(dockHeight, {
    mass: 0.12,
    stiffness: 200,
    damping: 18,
  });

  return (
    <TooltipProvider delayDuration={400}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="absolute bottom-3 bg-[#303030]/20 rounded-2xl left-1/2 z-50 flex -translate-x-1/2 items-end"
        style={{
          height: dockHeightSpring,
          gap: DOCK_GAP,
          paddingLeft: DOCK_PAD_X,
          paddingRight: DOCK_PAD_X,
          paddingBottom: DOCK_PAD_BOTTOM,
        }}
      >
        {apps.map((a, i) => (
          <MagnifiedDockIcon
            key={a.id}
            app={a}
            isActive={activeApp === i}
            showDot={phase === "open" && activeApp === i}
            hinted={pulseHint}
            disabled={isAnimating || !snapshotsReady}
            btnRef={(el) => {
              dockRefs.current[i] = el;
            }}
            onClick={() => onOpen(i)}
            mouseX={mouseX}
          />
        ))}
      </motion.div>
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
  // `mounted` is the SSR-safety gate. Server renders `mounted=false` →
  // matches the first client render → hydration succeeds. Then this effect
  // fires, mounted flips to true, and the framer-motion-using bits mount.
  // No floating-point divergence, no hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [phase, setPhase] = useState<Phase>("idle");
  const [activeApp, setActiveApp] = useState<number | null>(null);
  const [winPos, setWinPos] = useState<Pt>({ x: 0, y: 0 });
  const [snapshotsReady, setSnapshotsReady] = useState(false);
  const [pulseHint, setPulseHint] = useState(false);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPulseHint(entry.isIntersecting);
      },
      { threshold: 0.45 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  // All position helpers below resolve against the container's bounding rect.
  // Falls back to viewport dims if the ref isn't ready yet (shouldn't happen
  // post-mount, but keeps the helpers null-safe).
  const getContainerSize = useCallback((): { w: number; h: number } => {
    const el = containerRef.current;
    if (!el) return { w: window.innerWidth, h: window.innerHeight };
    return { w: el.clientWidth, h: el.clientHeight };
  }, []);

  const getWinPos = useCallback((): Pt => {
    const { w, h } = getContainerSize();
    return {
      x: (w - WIN_W) / 2,
      y: (h - WIN_H) / 2 - 20,
    };
  }, [getContainerSize]);

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
      const win = getWinPos();
      const { w: cw, h: ch } = getContainerSize();
      const off = offRef.current[appIdx];
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
          win,
        );
        if (rawT < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          onDone();
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [getDockCenter, getWinPos, getContainerSize],
  );

  const doOpen = useCallback(
    (idx: number) => {
      if (stateRef.current.phase !== "idle") return;
      windowRef.current = null;
      const wp = getWinPos();
      setupCanvas();
      stateRef.current = { phase: "opening", activeApp: idx };
      setWinPos(wp);
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
    [getWinPos, setupCanvas, startAnim, clearCanvas],
  );

  const doMinimize = useCallback(
    (onComplete?: () => void) => {
      const { phase: p, activeApp: a } = stateRef.current;
      if (p !== "open" || a === null) return;

      const cvs = canvasRef.current;
      if (cvs) cvs.style.zIndex = "50";

      setupCanvas();
      const dock = getDockCenter(a);
      const win = getWinPos();
      const { w: cw, h: ch } = getContainerSize();
      const ctx = cvs?.getContext("2d");
      if (ctx && cvs) {
        renderGenie(ctx, offRef.current[a], cw, ch, 0, "minimize", dock, win);
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
    [setupCanvas, getDockCenter, getWinPos, getContainerSize, startAnim, clearCanvas],
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

  // Open the first app by default once dock snapshots are ready.
  useEffect(() => {
    if (!mounted || !snapshotsReady) return;
    if (stateRef.current.phase !== "idle") return;

    const wp = getWinPos();
    stateRef.current = { phase: "open", activeApp: 0 };
    setWinPos(wp);
    setActiveApp(0);
    setPhase("open");
  }, [mounted, snapshotsReady, getWinPos]);

  // Re-center the open window when the container resizes (browser resize,
  // sidebar collapse, parent flexbox changes, etc.). ResizeObserver fires
  // synchronously with layout so there's no visible jitter.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (stateRef.current.phase === "open") {
        setWinPos(getWinPos());
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [getWinPos]);

  const isAnimating = phase === "opening" || phase === "closing";
  const app = activeApp !== null ? APPS[activeApp] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[650px] h-[min(85vh,860px)] select-none"
    >
      <style>{`
        @keyframes blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        @keyframes live-demo-dock-pulse {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-6px) scale(1.06); }
          60% { transform: translateY(0) scale(1.02); }
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
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-3"
        style={{
          height: 27,
          zIndex: 50,
          background: "rgba(0,0,0,.3)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <span className="text-white/70 flex items-center text-[11px] gap-1 font-semibold tracking-tight">
         <img src="/macicon.png" alt="mac-icon" aria-hidden="true" className="w-4 h-4" />{app?.label ?? "CoverForce"} &nbsp; File &nbsp; Edit &nbsp; View
          &nbsp; Window &nbsp; Help
        </span>
        <span className="text-white/60 text-[11px] font-medium">9:41 AM</span>
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
            pulseHint={pulseHint}
            isAnimating={isAnimating}
            snapshotsReady={snapshotsReady}
            dockRefs={dockRefs}
            onOpen={handleDockClick}
          />
        </>
      )}
    </div>
  );
}