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

    let inView = false;

    // Only ever plays while on screen and the tab is visible - so our own
    // pauses (scrolled away / tab hidden) are never undone by onPause below.
    const play = () => {
      if (!inView || document.hidden || !el.paused) return;
      el.play().catch(() => {});
    };

    const pause = () => el.pause();

    // Browsers can pause a muted background video on their own (power
    // saving, decoder pressure, a stalled loop seek). If that happens while
    // it's on screen, resume it rather than leaving a frozen frame.
    const onPause = () => requestAnimationFrame(play);

    const onVisibility = () => {
      if (document.hidden) pause();
      else play();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          setShouldLoad(true);
          play();
        } else {
          pause();
        }
      },
      { rootMargin: "300px 0px" },
    );

    el.addEventListener("pause", onPause);
    el.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", onVisibility);
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.removeEventListener("pause", onPause);
      el.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", onVisibility);
    };
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
