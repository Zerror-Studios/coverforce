import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Path runs bottom-left ("-40, 913.5") -> top-right ("...2062.5") in raw coordinates.
const PATH_D =
  "M-40 913.5H604C615.046 913.5 624 904.546 624 893.5V483C624 471.954 632.954 463 644 463H905C916.046 463 925 454.046 925 443V228C925 216.954 933.954 208 945 208H1543.5C1554.55 208 1563.5 216.954 1563.5 228V326C1563.5 337.046 1572.45 346 1583.5 346H1704.5C1715.55 346 1724.5 337.046 1724.5 326V21C1724.5 9.9543 1733.45 1 1744.5 1H2062.5";

const VIEWBOX_W = 1920;
const VIEWBOX_H = 915;

interface ShrimpLineAnimationProps {
  className?: string;
  /** Space between the two copies, e.g. "4rem", "80px", "10vh". */
  gap?: string;
}

/**
 * ShrimpLineAnimation
 *
 * Renders exactly TWO copies of the line, stacked vertically with a real,
 * always-visible gap between them:
 *   - Copy 1: normal orientation (draws left -> right).
 *   - Copy 2: horizontally flipped via scaleX(-1) (draws right -> left).
 *
 * The wrapper sizes itself to its content (2 copies + gap) instead of being
 * pinned to the parent's height, so the gap never gets clipped off - no
 * more `absolute inset-0 h-full` + overflow-hidden cutting off the second
 * copy or the space between them.
 *
 * Both copies share ONE scroll-scrubbed timeline - copy 2's draw-in starts
 * right where copy 1's finishes, as the user scrolls through the parent
 * section.
 *
 * Usage:
 *   <section className="relative ...">
 *     <ShrimpLineAnimation gap="6rem" />
 *     ...rest of section content...
 *   </section>
 */
export default function ShrimpLineAnimation({
  className = "",
  gap = "6rem",
}: ShrimpLineAnimationProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const pulseRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      pathRefs.current.forEach((pathEl, i) => {
        if (!pathEl) return;
        const pulseEl = pulseRefs.current[i];
        const trigger = pathEl.closest("svg") ?? pathEl;
        const lineTl = gsap.timeline({ defaults: { ease: "none" } });

        lineTl.fromTo(
          pathEl,
          { strokeDashoffset: -1000 },
          { strokeDashoffset: 0, duration: 1 },
        );
        if (pulseEl) {
          lineTl.fromTo(
            pulseEl,
            { strokeDashoffset: -1000 },
            { strokeDashoffset: 200, duration: 1 },
            0,
          );
        }

        // Draw each line as it enters the viewport so the second copy
        // does not wait for the first and miss the screen.
        ScrollTrigger.create({
          trigger,
          start: "top 65%",
          end: "bottom bottom",
          scrub: 1,
          animation: lineTl,
        });
      });

      pulseRefs.current.forEach((pulseEl) => {
        if (!pulseEl) return;
        gsap.to(pulseEl, {
          opacity: 0.4,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={` absolute inset-0 max-sm:hidden left-0 top-0 w-full pointer-events-none bg-transparent ${className}`}
    >
      <div className="flex w-full flex-col" style={{ gap, rowGap: gap }}>
        {[0, 1].map((i) => {
          const gradId = `shrimpGradMain-${i}`;
          const flipped = i === 1;
          return (
            <svg
              key={i}
              className="block w-full h-auto shrink-0 mt-40"
              viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              style={{
                transform: flipped ? "scaleX(-1)" : undefined,
              }}
            >
              <defs>
                <linearGradient
                  id={gradId}
                  x1="1896"
                  y1="-46.9999"
                  x2="13.5"
                  y2="937.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#044AB3" stopOpacity={0} />
                  <stop offset="0.5" stopColor="#044AB3" />
                  <stop offset="1" stopColor="#044AB3" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Base line for this copy */}
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={PATH_D}
                stroke={`url(#${gradId})`}
                strokeOpacity={0.35}
                strokeWidth={1}
                pathLength={1000}
                strokeDasharray="1000"
                strokeDashoffset="-1000"
              />

              {/* Pulse for this copy */}
              <path
                ref={(el) => {
                  pulseRefs.current[i] = el;
                }}
                d={PATH_D}
                stroke="#044AB3"
                fill="none"
                strokeWidth={1}
                pathLength={1000}
                strokeDasharray="120 880"
                strokeDashoffset="-1000"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
}