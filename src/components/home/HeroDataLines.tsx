"use client";

import { useMemo } from "react";

type DataLine = {
  id: number;
  left: number;
  lineHeight: number;
  duration: number;
  delay: number;
  opacity: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

type HeroDataLinesProps = {
  visible?: boolean;
};

const LINE_COUNT = 5;

const HeroDataLines = ({ visible = true }: HeroDataLinesProps) => {
  const lines = useMemo<DataLine[]>(
    () =>
      Array.from({ length: LINE_COUNT }, (_, i) => ({
        id: i,
        left: 4 + seededRandom(i + 1) * 92,
        lineHeight: 20 + seededRandom(i + 2) * 36,
        duration: 4.5 + seededRandom(i + 3) * 4,
        delay: seededRandom(i + 4) * 10,
        opacity: 0.2 + seededRandom(i + 5) * 0.28,
      })),
    [],
  );

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden"
      aria-hidden
    >
      {lines.map((line) => (
        <div
          key={line.id}
          className="hero-data-drop absolute top-0 -translate-x-1/2 will-change-transform"
          style={{
            left: `${line.left}%`,
            ["--line-opacity" as string]: String(line.opacity),
            animationDuration: `${line.duration}s`,
            animationDelay: `${line.delay}s`,
          }}
        >
          <div
            className="hero-data-line w-px rounded-full bg-gradient-to-b from-transparent via-[#7F7AFF] to-[#9792FF]"
            style={{ height: `${line.lineHeight}px` }}
          />
        </div>
      ))}
    </div>
  );
};

export default HeroDataLines;
