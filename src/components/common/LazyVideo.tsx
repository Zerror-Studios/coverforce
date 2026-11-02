"use client";

import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

type LazyVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "autoPlay"> & {
  src: string;
};

/**
 * Muted looping background video that only downloads once it nears the
 * viewport, and pauses decoding while scrolled out of view.
 */
export default function LazyVideo({ src, ...props }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      {...props}
    />
  );
}
