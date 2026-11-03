"use client";

import { useEffect, useRef, useState } from "react";

type Token = { text: string; fill: string };

const KEYWORD = "#8FB4FF";
const TEXT = "#E6EAF5";
const STRING = "#FBD38D";
const MUTED = "#C9D1E0";
const COMMENT = "#6B7A99";

// Mirrors the code that was drawn inside the quote.ts card of hero-terminal.svg.
const CODE_LINES: Token[][] = [
  [
    { text: "const", fill: KEYWORD },
    { text: " quotes = ", fill: TEXT },
    { text: "await", fill: KEYWORD },
    { text: " cf.quotes.create({", fill: TEXT },
  ],
  [
    { text: "  submission_id: ", fill: TEXT },
    { text: '"sub_91c4e2"', fill: STRING },
    { text: ",", fill: TEXT },
  ],
  [
    { text: "  lines: [", fill: TEXT },
    { text: '"bop"', fill: STRING },
    { text: "],", fill: TEXT },
  ],
  [
    { text: "  carriers: [", fill: TEXT },
    { text: '"hiscox"', fill: STRING },
    { text: ", ", fill: TEXT },
    { text: '"travelers"', fill: STRING },
    { text: ", ", fill: TEXT },
    { text: '"chubb"', fill: STRING },
    { text: "]", fill: TEXT },
  ],
  [{ text: "});", fill: TEXT }],
  [],
  [{ text: "// → 200 OK · 3 bindable quotes · 1.2 s", fill: COMMENT }],
  [
    { text: "render", fill: TEXT },
    { text: "(quotes)", fill: MUTED },
    { text: " // web · mobile · AI", fill: COMMENT },
  ],
];

const LINE_LENGTHS = CODE_LINES.map((line) =>
  line.reduce((sum, token) => sum + token.text.length, 0),
);
const TOTAL_CHARS = LINE_LENGTHS.reduce((sum, n) => sum + n, 0);

// Positions in hero-terminal.svg's 953×501 viewBox.
const CODE_X = 380;
const FIRST_BASELINE = 201.3;
const LINE_HEIGHT = 15.1;
const FONT_SIZE = 9.13;

const START_DELAY_MS = 1100;
const CHAR_MS = 22;
const LINE_PAUSE_MS = 140;
// Loop: hold the finished code, clear it, then type again.
const HOLD_MS = 2500;
const RESTART_MS = 400;

/** Keeps the first `count` characters of a line, split across its tokens. */
function sliceLine(line: Token[], count: number): Token[] {
  const out: Token[] = [];
  let left = count;
  for (const token of line) {
    if (left <= 0) break;
    out.push({ text: token.text.slice(0, left), fill: token.fill });
    left -= token.text.length;
  }
  return out;
}

/** Typewriter overlay for the quote.ts card; sized to sit exactly on hero-terminal.svg. */
export default function HeroQuoteCode({ className = "" }: { className?: string }) {
  const rootRef = useRef<SVGSVGElement>(null);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeoutId = setTimeout(() => setTyped(TOTAL_CHARS), 0);
      return () => clearTimeout(timeoutId);
    }

    let count = 0;

    const restart = () => {
      count = 0;
      setTyped(0);
      timeoutId = setTimeout(tick, RESTART_MS);
    };

    const tick = () => {
      count += 1;
      setTyped(count);
      if (count >= TOTAL_CHARS) {
        timeoutId = setTimeout(restart, HOLD_MS);
        return;
      }

      // Pause briefly whenever a line has just been completed.
      let end = 0;
      const atLineEnd = LINE_LENGTHS.some((len) => (end += len) === count);
      timeoutId = setTimeout(tick, atLineEnd ? LINE_PAUSE_MS : CHAR_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timeoutId = setTimeout(tick, START_DELAY_MS);
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  const finished = typed >= TOTAL_CHARS;
  // Characters visible on each line, given the overall typed count.
  const shownPerLine = LINE_LENGTHS.map((len, i) => {
    const before = LINE_LENGTHS.slice(0, i).reduce((sum, n) => sum + n, 0);
    return Math.max(0, Math.min(len, typed - before));
  });
  // Cursor sits on the first line that isn't fully typed yet.
  const cursorLine = shownPerLine.findIndex((shown, i) => shown < LINE_LENGTHS[i]);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 953 501"
      className={className}
      aria-hidden
      style={{ fontFamily: "var(--font-mono)", fontSize: FONT_SIZE, whiteSpace: "pre" }}
    >
      {CODE_LINES.map((line, i) => {
        const shown = shownPerLine[i];
        const isCursorLine = i === (finished ? CODE_LINES.length - 1 : cursorLine);

        return (
          <text key={i} x={CODE_X} y={FIRST_BASELINE + i * LINE_HEIGHT}>
            {sliceLine(line, shown).map((token, j) => (
              <tspan key={j} fill={token.fill}>
                {token.text}
              </tspan>
            ))}
            {isCursorLine ? (
              <tspan fill={KEYWORD} className="animate-pulse">
                ▍
              </tspan>
            ) : null}
          </text>
        );
      })}
    </svg>
  );
}
