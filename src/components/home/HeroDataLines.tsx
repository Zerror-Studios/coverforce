"use client";

import { useMemo } from "react";

type DataLine = {
  id: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function DataLineMarker() {
  return (
    <div className="relative flex size-12 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[#7653F19E] blur-[20px]" />
      <div className="relative flex size-4 items-center justify-center rounded-full">
        <div className="h-full w-[1.2px] rounded-full bg-gradient-to-b from-[#7F7AFF] via-[#504ADE] to-[#9792FF]" />
      </div>
    </div>
  );
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
          <DataLineMarker />
        </div>
      ))}
    </div>
  );
};

export default HeroDataLines;
