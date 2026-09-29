"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { MICRO_BAR_MS, MICRO_EASE } from "@/lib/motion";

type HalftoneBarGridProps = {
  color: string;
  className?: string;
  animate?: boolean;
  delay?: number;
};

const CELL = 6;
const MIN_COLS = 8;
const MAX_DOT_RATIO = 0.72;
const MIN_DOT_RATIO = 0.12;

function dotRadius(progress: number) {
  const range = MAX_DOT_RATIO - MIN_DOT_RATIO;
  return (CELL * Math.max(MIN_DOT_RATIO, MAX_DOT_RATIO - Math.pow(progress, 0.9) * range)) / 2;
}

function buildHalftoneCircles(color: string, cols: number, rows: number) {
  const circles: ReactElement[] = [];

  for (let row = 0; row < rows; row += 1) {
    const progress = rows <= 1 ? 0 : row / (rows - 1);
    const radius = dotRadius(progress);

    for (let col = 0; col < cols; col += 1) {
      const cx = col * CELL + CELL / 2;
      const cy = row * CELL + CELL / 2;

      circles.push(
        <circle
          key={`${row}-${col}`}
          cx={cx}
          cy={cy}
          r={radius}
          fill={color}
        />,
      );
    }
  }

  return circles;
}

export default function HalftoneBarGrid({
  color,
  className = "",
  animate = true,
  delay = 0,
}: HalftoneBarGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: MIN_COLS, rows: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateGrid = () => {
      const { clientWidth, clientHeight } = element;
      setGrid({
        cols: Math.max(MIN_COLS, Math.floor(clientWidth / CELL)),
        rows: Math.max(0, Math.floor(clientHeight / CELL)),
      });
    };

    updateGrid();

    const observer = new ResizeObserver(updateGrid);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const width = grid.cols * CELL;
  const height = Math.max(grid.rows * CELL, 1);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full ${className}`}
      style={{
        opacity: animate ? 1 : 0,
        transitionProperty: "opacity",
        transitionDuration: `${MICRO_BAR_MS}ms`,
        transitionTimingFunction: MICRO_EASE,
        transitionDelay: `${delay + 120}ms`,
      }}
    >
      {grid.rows > 0 ? (
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          {buildHalftoneCircles(color, grid.cols, grid.rows)}
        </svg>
      ) : null}
    </div>
  );
}
