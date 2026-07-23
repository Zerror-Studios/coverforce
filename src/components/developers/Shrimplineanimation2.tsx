// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// // Path runs bottom-left ("-40, 913.5") -> top-right ("...2062.5") in raw coordinates.
// const PATH_D =
//   "M-40 913.5H604C615.046 913.5 624 904.546 624 893.5V483C624 471.954 632.954 463 644 463H905C916.046 463 925 454.046 925 443V228C925 216.954 933.954 208 945 208H1543.5C1554.55 208 1563.5 216.954 1563.5 228V326C1563.5 337.046 1572.45 346 1583.5 346H1704.5C1715.55 346 1724.5 337.046 1724.5 326V21C1724.5 9.9543 1733.45 1 1744.5 1H2062.5";

// const VIEWBOX_W = 1920;
// const VIEWBOX_H = 915;

// interface ShrimpLineAnimationProps {
//   className?: string;
// }

// /**
//  * ShrimpLineAnimation
//  *
//  * - No stretching: each copy of the SVG keeps its natural aspect ratio
//  *   (scales by width only, like object-fit sizing based on width).
//  * - Full width, "object-cover"-style: the wrapper clips overflow, so if the
//  *   stacked copies run a little past the bottom, the extra is simply cropped
//  *   instead of squishing anything.
//  * - Auto-repeats: measures the parent's height and works out how many
//  *   copies of the line are needed, stacked top to bottom, to reach all the
//  *   way down. If one copy doesn't reach the bottom, another copy starts
//  *   directly below it.
//  * - Sequential draw: all copies share ONE scroll-scrubbed timeline — the
//  *   2nd copy's draw-in starts right where the 1st copy's finishes, and so on,
//  *   as the user scrolls through the parent section.
//  *
//  * Usage:
//  *   <section className="relative min-h-screen ...">
//  *     <ShrimpLineAnimation className="h-full" />
//  *     ...rest of section content...
//  *   </section>
//  */
// export default function ShrimpLineAnimation({
//   className = "",
// }: ShrimpLineAnimationProps) {
//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   const pathRefs = useRef<(SVGPathElement | null)[]>([]);
//   const pulseRefs = useRef<(SVGPathElement | null)[]>([]);
//   const [repeatCount, setRepeatCount] = useState(1);

//   // Measure the wrapper and work out how many stacked copies are needed
//   // to cover its full height at natural (non-stretched) aspect ratio.
//   useLayoutEffect(() => {
//     const el = wrapperRef.current;
//     if (!el) return;

//     const recalc = () => {
//       const { width, height } = el.getBoundingClientRect();
//       if (!width || !height) return;
//       const naturalCopyHeight = (width / VIEWBOX_W) * VIEWBOX_H;
//       const needed = Math.max(1, Math.ceil(height / naturalCopyHeight));
//       setRepeatCount(needed);
//     };

//     recalc();
//     const ro = new ResizeObserver(recalc);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   // Build the sequential scroll-scrubbed draw animation whenever the
//   // number of copies changes (refs are re-populated on each render).
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ defaults: { ease: "none" } });

//       pathRefs.current.slice(0, repeatCount).forEach((pathEl, i) => {
//         const pulseEl = pulseRefs.current[i];
//         // No position arg -> each copy's draw is appended right after
//         // the previous one finishes, so they play in sequence on scroll.
//         tl.fromTo(
//           pathEl,
//           { strokeDashoffset: -1000 },
//           { strokeDashoffset: 0 }
//         );
//         if (pulseEl) {
//           tl.fromTo(
//             pulseEl,
//             { strokeDashoffset: -1000 },
//             { strokeDashoffset: 200 },
//             "<" // start alongside this copy's base line
//           );
//         }
//       });

//       ScrollTrigger.create({
//         trigger: wrapperRef.current,
//         start: "top bottom",
//         end: "bottom top",
//         scrub: 1,
//         animation: tl,
//         // markers: true, // uncomment while debugging
//       });

//       // Subtle continuous glow on every pulse line once drawn in
//       pulseRefs.current.slice(0, repeatCount).forEach((pulseEl) => {
//         if (!pulseEl) return;
//         gsap.to(pulseEl, {
//           opacity: 0.4,
//           duration: 1.4,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//         });
//       });
//     }, wrapperRef);

//     return () => ctx.revert();
//   }, [repeatCount]);

//   return (
//     <div
//       ref={wrapperRef}
//       className={`absolute inset-0 top-2.5 left-7 h-full w-full overflow-hidden pointer-events-none bg-transparent ${className}`}
//     >
//       <div className="flex w-full flex-col">
//         {Array.from({ length: repeatCount }).map((_, i) => {
//           const gradId = `shrimpGradMain-${i}`;
//           return (
//             <svg
//               key={i}
//               className="block w-full h-auto shrink-0"
//               viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
//               fill="none"
//               preserveAspectRatio="xMidYMid meet"
//               style={{
//                 transform: i % 2 === 1 ? "scaleX(-1)" : undefined,
//               }}
//             >
//               <defs>
//                 <linearGradient
//                   id={gradId}
//                   x1="1896"
//                   y1="-46.9999"
//                   x2="13.5"
//                   y2="937.5"
//                   gradientUnits="userSpaceOnUse"
//                 >
//                   <stop stopColor="#044AB3" stopOpacity={0} />
//                   <stop offset="0.5" stopColor="#044AB3" />
//                   <stop offset="1" stopColor="#044AB3" stopOpacity={0} />
//                 </linearGradient>
//               </defs>

//               {/* Base line for this copy */}
//               <path
//                 ref={(el) => {
//                   pathRefs.current[i] = el;
//                 }}
//                 d={PATH_D}
//                 stroke={`url(#${gradId})`}
//                 strokeOpacity={0.35}
//                 strokeWidth={1}
//                 pathLength={1000}
//                 strokeDasharray="1000"
//                 strokeDashoffset="-1000"
//               />

//               {/* Pulse for this copy */}
//               <path
//                 ref={(el) => {
//                   pulseRefs.current[i] = el;
//                 }}
//                 d={PATH_D}
//                 stroke="#044AB3"
//                 fill="none"
//                 strokeWidth={1}
//                 pathLength={1000}
//                 strokeDasharray="120 880"
//                 strokeDashoffset="-1000"
//               />
//             </svg>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

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
 * pinned to the parent's height, so the gap never gets clipped off — no
 * more `absolute inset-0 h-full` + overflow-hidden cutting off the second
 * copy or the space between them.
 *
 * Both copies share ONE scroll-scrubbed timeline — copy 2's draw-in starts
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
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      pathRefs.current.forEach((pathEl, i) => {
        const pulseEl = pulseRefs.current[i];
        // No position arg -> each copy's draw is appended right after
        // the previous one finishes, so they play in sequence on scroll.
        tl.fromTo(
          pathEl,
          { strokeDashoffset: -1000 },
          { strokeDashoffset: 0 }
        );
        if (pulseEl) {
          tl.fromTo(
            pulseEl,
            { strokeDashoffset: -1000 },
            { strokeDashoffset: 200 },
            "<" // start alongside this copy's base line
          );
        }
      });

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        animation: tl,
        // markers: true, // uncomment while debugging
      });

      // Subtle continuous glow on every pulse line once drawn in
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
      className={` absolute inset-0 left-2.5 top-7 w-full pointer-events-none bg-transparent ${className}`}
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