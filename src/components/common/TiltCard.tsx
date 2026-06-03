"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type TiltCardProps = {
  children: ReactNode;
  /** Visual card (background, shadow, radius) */
  className?: string;
  /** Positioning / layout on perspective wrapper */
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  maxTilt?: number;
  perspective?: number;
  hoverScale?: number;
};

export default function TiltCard({
  children,
  className = "",
  wrapperClassName = "",
  wrapperStyle,
  maxTilt = 10,
  perspective = 1000,
  hoverScale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const applyTilt = useCallback(
    (clientX: number, clientY: number) => {
      const el = cardRef.current;
      if (!el || reducedMotion) return;

      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      const rotateY = x * maxTilt * 2;
      const rotateX = -y * maxTilt * 2;

      setTransform(
        `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${hoverScale}, ${hoverScale}, ${hoverScale})`,
      );
    },
    [maxTilt, hoverScale, reducedMotion],
  );

  const resetTilt = useCallback(() => {
    setTransform("rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyTilt(e.clientX, e.clientY));
    },
    [applyTilt],
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    resetTilt();
  }, [resetTilt]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={wrapperClassName}
      style={{ perspective: `${perspective}px`, ...wrapperStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d] ${className}`}
        style={{ transform }}
      >
        {children}
      </div>
    </div>
  );
}
