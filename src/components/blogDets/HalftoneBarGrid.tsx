"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

type HalftoneBarGridProps = {
  color: string;
  className?: string;
};

const CELL = 6;
const MIN_COLS = 8;
const MAX_DOT_RATIO = 0.72;
const MIN_DOT_RATIO = 0.12;

function squareSize(progress: number) {
  const range = MAX_DOT_RATIO - MIN_DOT_RATIO;
  return CELL * Math.max(MIN_DOT_RATIO, MAX_DOT_RATIO - Math.pow(progress, 0.9) * range);
}

function buildHalftoneRects(color: string, cols: number, rows: number) {
  const rects: ReactElement[] = [];

  for (let row = 0; row < rows; row += 1) {
    const progress = rows <= 1 ? 0 : row / (rows - 1);
    const size = squareSize(progress);

    for (let col = 0; col < cols; col += 1) {
      const cx = col * CELL + CELL / 2;
      const cy = row * CELL + CELL / 2;

      rects.push(
        <rect
          key={`${row}-${col}`}
          x={cx - size / 2}
          y={cy - size / 2}
          width={size}
          height={size}
          fill={color}
        />,
      );
    }
  }

  return rects;
}

export default function HalftoneBarGrid({
  color,
  className = "",
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
    <div ref={containerRef} className={`h-full w-full ${className}`}>
      {grid.rows > 0 ? (
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          {buildHalftoneRects(color, grid.cols, grid.rows)}
        </svg>
      ) : null}
    </div>
  );
}
