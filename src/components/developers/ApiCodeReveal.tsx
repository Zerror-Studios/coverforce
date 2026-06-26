"use client";

import { useEffect, useRef, useState } from "react";

type Token = { text: string; className: string };

const PUNCT = "text-[#5E6E92]";
const KEY = "text-[#9AAAD0]";
const STRING = "text-[#C7D2EA]";
const BOOL = "text-[#E0B978]";

const CODE_LINES: Token[][] = [
  [{ text: "{", className: PUNCT }],
  [
    { text: '  "carrier_ids"', className: KEY },
    { text: ": [", className: PUNCT },
    { text: '"amtrust"', className: STRING },
    { text: ",", className: PUNCT },
    { text: '"travelers"', className: STRING },
    { text: ",", className: PUNCT },
    { text: '"cna"', className: STRING },
    { text: "],", className: PUNCT },
  ],
  [
    { text: '  "policy_type"', className: KEY },
    { text: ": ", className: PUNCT },
    { text: '"WC"', className: STRING },
    { text: ",", className: PUNCT },
  ],
  [
    { text: '  "application_id"', className: KEY },
    { text: ": ", className: PUNCT },
    { text: '"APP-7f3a9b..."', className: STRING },
    { text: ",", className: PUNCT },
  ],
  [
    { text: '  "include_appetite"', className: KEY },
    { text: ": ", className: PUNCT },
    { text: "true", className: BOOL },
    { text: ",", className: PUNCT },
  ],
  [{ text: "}", className: PUNCT }],
];

const CHAR_MS = 18;
const LINE_PAUSE_MS = 120;

type RenderToken = { text: string; className: string };

export default function ApiCodeReveal({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const typingStartedRef = useRef(false);
  const [completedLines, setCompletedLines] = useState<RenderToken[][]>([]);
  const [activeLine, setActiveLine] = useState<RenderToken[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setCompletedLines(CODE_LINES);
      setFinished(true);
      startedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setStarted(true);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || typingStartedRef.current) return;
    typingStartedRef.current = true;

    let lineIdx = 0;
    let tokenIdx = 0;
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const line = CODE_LINES[lineIdx];
      if (!line) {
        setFinished(true);
        return;
      }

      const token = line[tokenIdx];

      if (token && charIdx < token.text.length) {
        charIdx += 1;
        const partial: RenderToken[] = [
          ...line.slice(0, tokenIdx),
          { text: token.text.slice(0, charIdx), className: token.className },
        ];
        setActiveLine(partial);
        timeoutId = setTimeout(tick, CHAR_MS);
        return;
      }

      if (token) {
        tokenIdx += 1;
        charIdx = 0;
        timeoutId = setTimeout(tick, CHAR_MS);
        return;
      }

      setCompletedLines((prev) => [...prev, line]);
      setActiveLine([]);
      lineIdx += 1;
      tokenIdx = 0;
      charIdx = 0;

      if (lineIdx >= CODE_LINES.length) {
        setFinished(true);
        return;
      }

      timeoutId = setTimeout(tick, LINE_PAUSE_MS);
    };

    timeoutId = setTimeout(tick, 250);
    return () => clearTimeout(timeoutId);
  }, [started]);

  return (
    <div ref={rootRef} className={className} aria-hidden>
      <pre className="font-mono text-[10px] leading-[1.9] md:text-xs lg:text-[13px] lg:leading-[2]">
        {completedLines.map((line, i) => (
          <div key={i}>
            {line.length ? (
              line.map((token, j) => (
                <span key={j} className={token.className}>
                  {token.text}
                </span>
              ))
            ) : (
              <span>{"\u00A0"}</span>
            )}
          </div>
        ))}
        {!finished ? (
          <div>
            {activeLine.map((token, j) => (
              <span key={j} className={token.className}>
                {token.text}
              </span>
            ))}
            <span className="ml-px inline-block h-[1em] w-[6px] animate-pulse bg-[#8FA6CF]/90 align-middle" />
          </div>
        ) : null}
      </pre>
    </div>
  );
}
