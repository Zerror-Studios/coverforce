"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  CARD_ACCENT_COLORS,
  CARD_VERTICAL_BACKGROUND_STYLES,
} from "@/data/wayCardStyles";

type Kind = "carrier" | "broker";

type BandNode = {
  key: string;
  kind: Kind;
  name: string;
  poolIndex: number;
  ang: number;
  x: number;
  y: number;
  ax: number;
  ay: number;
  delayMs: number;
};

type Link = {
  nodeKey: string;
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  inbound: boolean;
};

type Particle = {
  linkIndex: number;
  t: number;
  v: number;
};

type Pulse = {
  r: number;
  a: number;
  col: string;
};

type Vec3 = { x: number; y: number; z: number };

const CARRIER_LOGO_POOL = [
  "carrier-berkshire-hathaway.png",
  "carrier-chubb.png",
  "carrier-coalition.png",
  "carrier-compwest.png",
  "carrier-cowbell.png",
  "carrier-employers.png",
  "carrier-markel.png",
  "carrier-merchants-insurance-group.png",
  "carrier-republic-indemnity.png",
].map((file) => `/images/home/carrier/${encodeURIComponent(file)}`);

const BROKER_LOGO_POOL = [
  "broker-diligence-brokerage.png",
  "network-isu-steadfast.png",
  "startup-snapBind.png",
  "startup-anzen.png",
  "startup-broker-buddha-buddhAI.png",
  "startup-coverwatch.png",
  "startup-harper.png",
  "startup-latent-insurance.png",
  "startup-rosella.png",
  "wholesaler-international-underwriting-agency.png",
].map((file) => `/images/home/distributors/${encodeURIComponent(file)}`);

const CARRIER_LABELS = [
  "BerkleyNet",
  "The Hanover",
  "Progressive",
  "CopperPoint",
  "At-Bay",
  "Tokio Marine HCC",
  "Employers",
] as const;

const BROKER_LABELS = [
  "Anzen",
  "CoverWatch",
  "Harper",
  "Latent",
  "Rosella",
  "Snapbind",
] as const;

const LOGO_ROTATE_MS = 7500;
const LOGO_SWAP_MS = 480;
const LOGO_JITTER_MS = 4500;

function wait(ms: number, signal: { cancelled: boolean }) {
  return new Promise<void>((resolve) => {
    const id = window.setTimeout(() => {
      if (!signal.cancelled) resolve();
    }, ms);
    if (signal.cancelled) {
      window.clearTimeout(id);
      resolve();
    }
  });
}

const activeCarrierLogos = new Map<string, number>();
const activeBrokerLogos = new Map<string, number>();

function getNextUniqueLogoIndex(
  nodeKey: string,
  kind: Kind,
  currentIndex: number,
  poolSize: number
): number {
  const activeMap = kind === "carrier" ? activeCarrierLogos : activeBrokerLogos;

  const usedByOthers = new Set<number>();
  activeMap.forEach((idx, key) => {
    if (key !== nodeKey) {
      usedByOthers.add(idx);
    }
  });

  const candidates: number[] = [];
  for (let i = 0; i < poolSize; i++) {
    if (!usedByOthers.has(i) && i !== currentIndex) {
      candidates.push(i);
    }
  }

  let nextIndex: number;
  if (candidates.length > 0) {
    nextIndex = candidates[Math.floor(Math.random() * candidates.length)]!;
  } else {
    nextIndex = (currentIndex + 1) % poolSize;
  }

  activeMap.set(nodeKey, nextIndex);
  return nextIndex;
}

function PartnerLogoCard({
  nodeKey,
  kind,
  name,
  ang,
  x,
  y,
  delayMs,
  initialPoolIndex,
}: {
  nodeKey: string;
  kind: Kind;
  name: string;
  ang: number;
  x: number;
  y: number;
  delayMs: number;
  initialPoolIndex: number;
}) {
  const pool = kind === "carrier" ? CARRIER_LOGO_POOL : BROKER_LOGO_POOL;
  const [logoIndex, setLogoIndex] = useState(() => {
    const initial = initialPoolIndex % pool.length;
    const activeMap = kind === "carrier" ? activeCarrierLogos : activeBrokerLogos;
    activeMap.set(nodeKey, initial);
    return initial;
  });
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const activeMap = kind === "carrier" ? activeCarrierLogos : activeBrokerLogos;
    activeMap.set(nodeKey, logoIndex);
    return () => {
      activeMap.delete(nodeKey);
    };
  }, [nodeKey, kind, logoIndex]);

  useEffect(() => {
    if (pool.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const signal = { cancelled: false };

    (async () => {
      await wait(delayMs + Math.random() * LOGO_ROTATE_MS, signal);
      while (!signal.cancelled) {
        await wait(LOGO_ROTATE_MS + Math.random() * LOGO_JITTER_MS, signal);
        if (signal.cancelled) break;

        // Slide back on X (toward hub) + fade out
        setHiding(true);
        await wait(LOGO_SWAP_MS, signal);
        if (signal.cancelled) break;

        setLogoIndex((current) =>
          getNextUniqueLogoIndex(nodeKey, kind, current, pool.length)
        );
        // Come forward again with the new logo
        setHiding(false);
      }
    })();

    return () => {
      signal.cancelled = true;
    };
  }, [delayMs, kind, nodeKey, pool.length]);

  // Move back toward hub on X (and slightly Y so it tracks the radial)
  const retreatX = -Math.cos(ang) * 14;
  const retreatY = -Math.sin(ang) * 6;

  return (
    <div
      data-band-node={nodeKey}
      className="network-band-node absolute z-10 h-10 w-16 sm:h-11 sm:w-[4.75rem] md:h-12 md:w-20"
      style={{
        left: x,
        top: y,
        animationDelay: `${delayMs}ms`,
      }}
      title={name}
    >
      <div
        className="flex size-full items-center justify-center overflow-hidden rounded-md bg-white px-1.5 py-1 transition-[transform,opacity] duration-500 ease-out"
        style={{
          opacity: hiding ? 0 : 1,
          transform: hiding
            ? `translate(${retreatX}px, ${retreatY}px)`
            : "translate(0px, 0px)",
        }}
      >
        <Image
          src={pool[logoIndex]!}
          alt={name}
          width={64}
          height={36}
          className="h-full w-full object-contain"
          unoptimized
        />
      </div>
    </div>
  );
}

function hexToRgb(h: string): [number, number, number] {
  const raw = h.replace("#", "").trim();
  return [
    parseInt(raw.slice(0, 2), 16),
    parseInt(raw.slice(2, 4), 16),
    parseInt(raw.slice(4, 6), 16),
  ];
}

function rgba(h: string, a: number) {
  const [r, g, b] = hexToRgb(h);
  return `rgba(${r},${g},${b},${a})`;
}

function rot(p: Vec3, ry: number, rx: number): Vec3 {
  const cA = Math.cos(ry);
  const sA = Math.sin(ry);
  const x = p.x * cA - p.z * sA;
  const z1 = p.x * sA + p.z * cA;
  const cB = Math.cos(rx);
  const sB = Math.sin(rx);
  return { x, y: p.y * cB - z1 * sB, z: p.y * sB + z1 * cB };
}

function bez(
  l: Link,
  t: number,
): { x: number; y: number } {
  const u = 1 - t;
  return {
    x: u * u * l.p0.x + 2 * u * t * l.p1.x + t * t * l.p2.x,
    y: u * u * l.p0.y + 2 * u * t * l.p1.y + t * t * l.p2.y,
  };
}

type NetworkBandProps = {
  className?: string;
  showHeader?: boolean;
  showLegend?: boolean;
};

/**
 * Network band concept — globe + signal flow from the design prototype.
 * Partner cards reuse CoverForce logo tiles (carriers / distributors).
 */
export default function NetworkBand({
  className,
  showHeader = true,
  showLegend = true,
}: NetworkBandProps = {}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<BandNode[]>([]);
  const linksRef = useRef<Link[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const cloudRef = useRef<Vec3[]>([]);
  const hotspotsRef = useRef<Array<Vec3 & { ph: number }>>([]);
  const ringsRef = useRef<Array<{ inc: number; off: number }>>([
    { inc: 0.34, off: 0 },
    { inc: -0.55, off: 1.1 },
    { inc: 1.15, off: 2.3 },
  ]);
  const metricsRef = useRef({
    W: 0,
    H: 0,
    cx: 0,
    cy: 0,
    R: 0,
    NR: 0,
    mobile: false,
  });
  const thetaRef = useRef(0);
  const lastRef = useRef(0);
  const runningRef = useRef(true);
  const visibleRef = useRef(true);
  const reduceRef = useRef(false);
  const colorsRef = useRef({
    mesh: "#3A5A8A",
    // Globe surface highlight (unchanged cyan)
    meshBright: "#45C8F0",
    // Inbound signals (carrier → hub)
    inbound: CARD_ACCENT_COLORS.carrier,
    outbound: "#4ADE9B",
    hub: "#FF6B35",
  });

  const hubImageRef = useRef<HTMLImageElement | null>(null);

  const [nodes, setNodes] = useState<BandNode[]>([]);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/startups/center-logo.svg";
    img.onload = () => {
      hubImageRef.current = img;
    };
  }, []);

  const buildCloud = useCallback(() => {
    const { mobile } = metricsRef.current;
    const N = mobile ? 560 : 1150;
    const cloud: Vec3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = phi * i;
      cloud.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r });
    }
    cloudRef.current = cloud;

    const hotspots: Array<Vec3 & { ph: number }> = [];
    for (let i = 0; i < 9; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      hotspots.push({
        x: Math.cos(a) * r,
        y: u,
        z: Math.sin(a) * r,
        ph: Math.random() * 6.28,
      });
    }
    hotspotsRef.current = hotspots;
  }, []);

  const buildLinks = useCallback(() => {
    const { cx, cy } = metricsRef.current;
    const links: Link[] = nodesRef.current.map((n) => {
      const mx = (n.ax + cx) / 2;
      const my = (n.ay + cy) / 2;
      const dx = cx - n.ax;
      const dy = cy - n.ay;
      const L = Math.hypot(dx, dy) || 1;
      const side = n.ax < cx ? 1 : -1;
      const bow = L * 0.11 * side;
      return {
        nodeKey: n.key,
        p0: { x: n.ax, y: n.ay },
        p2: { x: cx, y: cy },
        p1: { x: mx + (-dy / L) * bow, y: my + (dx / L) * bow },
        inbound: n.kind === "carrier",
      };
    });
    linksRef.current = links;

    const { mobile } = metricsRef.current;
    const particles: Particle[] = [];
    links.forEach((_, i) => {
      const k = mobile ? 1 : 2;
      for (let j = 0; j < k; j++) {
        particles.push({
          linkIndex: i,
          t: (i * 0.19 + j * 0.5 + Math.random() * 0.2) % 1,
          v: 0.2 + Math.random() * 0.16,
        });
      }
    });
    particlesRef.current = particles;
  }, []);

  const placeNodes = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Re-read stage box so icon coords match the canvas circle exactly.
    const rect = stage.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const cx = W / 2;
    const cy = H / 2;
    const { R } = metricsRef.current;
    // Centers sit on the globe boundary (same radius as the drawn circle).
    const NR = R;

    metricsRef.current = {
      ...metricsRef.current,
      W,
      H,
      cx,
      cy,
      NR,
    };

    const next = nodesRef.current.map((n) => {
      const x = cx + Math.cos(n.ang) * NR;
      const y = cy + Math.sin(n.ang) * NR;
      return {
        ...n,
        x,
        y,
        ax: x,
        ay: y,
      };
    });

    // Measure card boxes after paint for link anchors (inner edge toward hub).
    requestAnimationFrame(() => {
      const stageRect = stage.getBoundingClientRect();
      const measured = next.map((n) => {
        const el = stage.querySelector<HTMLElement>(`[data-band-node="${n.key}"]`);
        if (!el) return n;
        const b = el.getBoundingClientRect();
        const hw = b.width * 0.5;
        const hh = b.height * 0.5;
        // Convert from viewport px into stage-local canvas space
        const scaleX = W / stageRect.width;
        const scaleY = H / stageRect.height;
        const localHw = hw * scaleX;
        const localHh = hh * scaleY;
        let dx = cx - n.x;
        let dy = cy - n.y;
        const L = Math.hypot(dx, dy) || 1;
        dx /= L;
        dy /= L;
        const t = Math.min(
          Math.abs(dx) > 1e-4 ? localHw / Math.abs(dx) : 1e9,
          Math.abs(dy) > 1e-4 ? localHh / Math.abs(dy) : 1e9,
        );
        return { ...n, ax: n.x + dx * t, ay: n.y + dy * t };
      });
      nodesRef.current = measured;
      buildLinks();
    });

    nodesRef.current = next;
    setNodes(next);
  }, [buildLinks]);

  const buildNodes = useCallback(() => {
    const { mobile } = metricsRef.current;
    const nCar = mobile ? 4 : CARRIER_LABELS.length;
    const nBro = mobile ? 3 : BROKER_LABELS.length;
    const carrierCount = Math.min(nCar, CARRIER_LABELS.length);
    const brokerCount = Math.min(nBro, BROKER_LABELS.length);
    const total = carrierCount + brokerCount;

    // Even spacing around the full circle; topmost slots → carriers, bottom → distributors.
    const slots = Array.from({ length: total }, (_, i) => {
      const ang = -Math.PI / 2 + ((i + 0.5) * (Math.PI * 2)) / total;
      return { ang, y: Math.sin(ang) };
    });
    const byAltitude = [...slots].sort((a, b) => a.y - b.y);
    const carrierSlots = byAltitude
      .slice(0, carrierCount)
      .sort((a, b) => a.ang - b.ang);
    const brokerSlots = byAltitude
      .slice(carrierCount)
      .sort((a, b) => a.ang - b.ang);

    const toNodes = (
      labels: readonly string[],
      angles: Array<{ ang: number }>,
      kind: Kind,
      prefix: string,
      poolSize: number,
    ): BandNode[] =>
      angles.map((slot, i) => ({
        key: `${prefix}-${i}-${labels[i]!}`,
        kind,
        name: labels[i]!,
        poolIndex: i % poolSize,
        ang: slot.ang,
        x: 0,
        y: 0,
        ax: 0,
        ay: 0,
        delayMs: 120 + i * 55,
      }));

    const built = [
      ...toNodes(
        CARRIER_LABELS,
        carrierSlots,
        "carrier",
        "top",
        CARRIER_LOGO_POOL.length,
      ),
      ...toNodes(
        BROKER_LABELS,
        brokerSlots,
        "broker",
        "bot",
        BROKER_LOGO_POOL.length,
      ),
    ];
    nodesRef.current = built;
    placeNodes();
  }, [placeNodes]);

  const resize = useCallback(() => {
    const stage = stageRef.current;
    const cv = canvasRef.current;
    if (!stage || !cv) return;

    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = rect.width;
    const H = rect.height;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = W < 680;
    const cx = W / 2;
    const cy = H / 2;
    // True circle: radius from the shorter stage axis.
    const R = Math.min(W, H) * (mobile ? 0.38 : 0.42);
    const NR = R;

    metricsRef.current = { W, H, cx, cy, R, NR, mobile };
    buildCloud();
    buildNodes();
  }, [buildCloud, buildNodes]);

  useLayoutEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    runningRef.current = !reduceRef.current;
    resize();

    const onResize = () => {
      window.clearTimeout((window as unknown as { __networkBandRz?: number }).__networkBandRz);
      (window as unknown as { __networkBandRz?: number }).__networkBandRz = window.setTimeout(
        resize,
        120,
      );
    };
    window.addEventListener("resize", onResize);

    const stage = stageRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && stage
        ? new ResizeObserver(() => resize())
        : null;
    if (stage && ro) ro.observe(stage);

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    if (stage) io.observe(stage);

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      io.disconnect();
    };
  }, [resize]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    lastRef.current = performance.now();
    let raf = 0;

    const draw = (dt: number) => {
      const { W, H, cx, cy, R, mobile } = metricsRef.current;
      const C = colorsRef.current;
      const theta = thetaRef.current;
      // No tilt — keeps the point cloud optically centered on the hub.
      const tilt = 0;

      const proj = (p: Vec3) => {
        // Orthographic — perspective made the globe read as an ellipse.
        return { x: cx + p.x * R, y: cy + p.y * R, s: 1, z: p.z };
      };

      ctx.clearRect(0, 0, W, H);

      // Soft circular disc so the globe reads round on a wide stage
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = rgba(C.mesh, 0.12);
      ctx.fill();

      for (const p of cloudRef.current) {
        const q = proj(rot(p, theta, tilt));
        const front = q.z > 0;
        const a = front ? 0.22 + q.z * 0.48 : 0.08;
        const r = (front ? 1.15 + q.z * 0.85 : 0.8) * (mobile ? 0.9 : 1);
        ctx.fillStyle = rgba(front && q.z > 0.72 ? C.meshBright : C.mesh, a);
        ctx.beginPath();
        ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (const rg of ringsRef.current) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 90; i++) {
          const a = (i / 90) * Math.PI * 2 + rg.off;
          const p = rot(
            {
              x: Math.cos(a),
              y: Math.sin(a) * Math.sin(rg.inc),
              z: Math.sin(a) * Math.cos(rg.inc),
            },
            theta,
            tilt,
          );
          const q = proj(p);
          if (q.z < -0.05) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(q.x, q.y);
            started = true;
          } else {
            ctx.lineTo(q.x, q.y);
          }
        }
        ctx.strokeStyle = rgba(C.mesh, 0.4);
        ctx.stroke();
      }

      const hp = hotspotsRef.current.map((h) => proj(rot(h, theta, tilt)));
      ctx.strokeStyle = rgba(C.meshBright, 0.14);
      for (let i = 0; i < hp.length; i++) {
        for (let j = i + 1; j < hp.length; j++) {
          const a = hp[i]!;
          const b = hp[j]!;
          if (a.z < 0.05 || b.z < 0.05) continue;
          if (Math.hypot(a.x - b.x, a.y - b.y) > R * 0.55) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      hp.forEach((q, i) => {
        if (q.z < 0) return;
        const pulse =
          0.6 + 0.4 * Math.sin(theta * 3 + hotspotsRef.current[i]!.ph);
        ctx.fillStyle = rgba(C.meshBright, 0.7 * pulse * q.z + 0.22);
        ctx.beginPath();
        ctx.arc(q.x, q.y, 2.7 * q.s, 0, Math.PI * 2);
        ctx.fill();
      });

      const links = linksRef.current;
      links.forEach((l) => {
        ctx.beginPath();
        ctx.moveTo(l.p0.x, l.p0.y);
        ctx.quadraticCurveTo(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
        ctx.strokeStyle = rgba(l.inbound ? C.inbound : C.outbound, 0.16);
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      if (!reduceRef.current) {
        particlesRef.current.forEach((p) => {
          p.t += p.v * dt;
          const lk = links[p.linkIndex];
          if (!lk) return;
          if (p.t >= 1) {
            p.t %= 1;
            p.v = 0.2 + Math.random() * 0.16;
            pulsesRef.current.push({
              r: 0,
              a: 0.5,
              col: lk.inbound ? C.inbound : C.outbound,
            });
          }
          const dir = lk.inbound ? p.t : 1 - p.t;
          const pt = bez(lk, dir);
          const col = lk.inbound ? C.inbound : C.outbound;
          const tail = bez(
            lk,
            Math.max(0, Math.min(1, dir + (lk.inbound ? -0.07 : 0.07))),
          );
          const g = ctx.createLinearGradient(tail.x, tail.y, pt.x, pt.y);
          g.addColorStop(0, rgba(col, 0));
          g.addColorStop(1, rgba(col, 0.9));
          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.lineTo(pt.x, pt.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.fillStyle = rgba(col, 0.95);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.9, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      pulsesRef.current = pulsesRef.current.filter((p) => p.a > 0.01);
      const hubOuter = Math.max(36, R * 0.28);
      const hubInner = hubOuter * 0.72;
      pulsesRef.current.forEach((p) => {
        p.r += 90 * dt;
        p.a *= 1 - 2.4 * dt;
        ctx.beginPath();
        ctx.arc(cx, cy, hubOuter * 0.92 + p.r, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(p.col, p.a);
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Hub drawn on canvas at exact globe center (avoids DOM/SVG offset drift).
      const glowR = hubOuter * 1.55;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0, rgba("#ECE7FF", 0.4));
      glow.addColorStop(1, rgba("#ECE7FF", 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, hubOuter / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = "rgba(236,231,255,0.95)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, hubInner / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ECE7FF";
      ctx.fill();

      const hubImg = hubImageRef.current;
      if (hubImg?.complete) {
        // SVG artboard is 55×41 — fit and center inside the inner disc.
        const maxW = hubInner * 0.58;
        const maxH = hubInner * 0.58;
        const aspect = 55 / 41;
        let dw = maxW;
        let dh = dw / aspect;
        if (dh > maxH) {
          dh = maxH;
          dw = dh * aspect;
        }
        ctx.drawImage(hubImg, cx - dw / 2, cy - dh / 2, dw, dh);
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      if (runningRef.current && visibleRef.current) {
        thetaRef.current += dt * 0.05;
      }
      if (visibleRef.current) {
        draw(runningRef.current ? dt : 0);
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const defaultPadding = showHeader
    ? "px-6 pb-16 pt-14 md:pb-20 md:pt-16 lg:pb-28 lg:pt-20"
    : "px-0 pb-4 pt-2 md:pb-6 md:pt-2";

  return (
    <div
      className={`network-band relative overflow-hidden text-white ${
        className !== undefined ? className : defaultPadding
      }`}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[52%] aspect-square w-[min(1100px,120vw)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(69,200,240,0.10) 0%, rgba(21,31,77,0) 62%)",
        }}
        aria-hidden
      />

      {showHeader && (
        <>
          <p className="relative mb-3 text-center font-sans text-xs tracking-wide text-white/55 sm:text-sm">
            One integration · 40+ carriers
          </p>
          <h2 className="relative z-10 mx-auto mb-2 max-w-xl text-center font-heading text-2xl font-medium leading-[1.15] tracking-tight text-white/55 sm:mb-3 sm:text-3xl sm:leading-[1.12] md:mb-4 md:text-4xl lg:mb-5 lg:text-[1.625rem] lg:leading-[1.12]">
            The network between{" "}
            <span className="text-white">carriers</span> and{" "}
            <span className="text-white">brokers</span>.
          </h2>
          <p className="relative mx-auto max-w-xl text-center font-sans text-sm leading-relaxed text-white/70 md:text-[1.0625rem]">
            Brokers send one submission. CoverForce distributes it, normalises every
            response, and returns bindable quotes — in real time.
          </p>
        </>
      )}

      <div className="relative mt-4 w-full sm:mt-6">
        <div
          ref={stageRef}
          className="relative z-10 mx-auto aspect-square w-full max-w-[min(100%,680px)]"
          aria-label="CoverForce network globe"
        >
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          />

          {/* Partner logo cards — slide back on X + fade, then new logo */}
          {nodes.map((n) => (
            <PartnerLogoCard
              key={n.key}
              nodeKey={n.key}
              kind={n.kind}
              name={n.name}
              ang={n.ang}
              x={n.x}
              y={n.y}
              delayMs={n.delayMs}
              initialPoolIndex={n.poolIndex}
            />
          ))}
        </div>

        {showLegend && (
          <div className="relative z-10 mt-6 flex flex-col items-center gap-2.5 text-sm text-white/70 md:absolute md:right-0 md:top-1/2 md:mt-0 md:-translate-y-1/2 md:items-start lg:right-4 xl:right-8">
            {[
              {
                label: "Carriers",
                background: CARD_VERTICAL_BACKGROUND_STYLES.carrier,
              },
              {
                label: "Distributors",
                background: CARD_VERTICAL_BACKGROUND_STYLES.startup,
              },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <span
                  className="inline-block size-2.5 shrink-0 rounded-full"
                  style={{ background: item.background }}
                />
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .network-band-node {
          opacity: 0;
          transform: translate(-50%, -50%);
          animation: network-band-pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes network-band-pop {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .network-band-node {
            animation: none;
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
}
