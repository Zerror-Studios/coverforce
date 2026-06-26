"use client";

import { useEffect, useRef, useState } from "react";

const CODE_LINES = [
  { text: "$ npx @coverforce/sdk init", className: "text-[#7DD3FC]" },
  { text: "✓ Sandbox connected · API key verified", className: "text-[#86EFAC]" },
  { text: "", className: "" },
  { text: "import { Coverforce } from '@coverforce/sdk';", className: "text-[#C4B5FD]" },
  { text: "", className: "" },
  { text: "const cf = Coverforce({", className: "text-[#E2E8F0]" },
  { text: "  env: 'production',", className: "text-[#FDE68A]" },
  { text: "  apiKey: process.env.CF_API_KEY,", className: "text-[#FDE68A]" },
  { text: "});", className: "text-[#E2E8F0]" },
  { text: "", className: "" },
  { text: "const submission = await cf.submissions.create({", className: "text-[#E2E8F0]" },
  { text: "  lob: 'commercial_auto',", className: "text-[#FDE68A]" },
  { text: "  state: 'TX',", className: "text-[#FDE68A]" },
  { text: "  business: { name: 'Acme Logistics', fein: '12-3456789' },", className: "text-[#FDE68A]" },
  { text: "});", className: "text-[#E2E8F0]" },
  { text: "", className: "" },
  { text: "const quote = await cf.quotes.run({", className: "text-[#E2E8F0]" },
  { text: "  submissionId: submission.id,", className: "text-[#FDE68A]" },
  { text: "  carriers: ['nationwide', 'chubb', 'liberty'],", className: "text-[#FDE68A]" },
  { text: "});", className: "text-[#E2E8F0]" },
  { text: "", className: "" },
  { text: "quote.results.forEach((r) => {", className: "text-[#E2E8F0]" },
  { text: "  console.log(r.carrier, r.premium, r.status);", className: "text-[#94A3B8]" },
  { text: "});", className: "text-[#E2E8F0]" },
  { text: "", className: "" },
  { text: "await cf.bind.create({ quoteId: quote.id, carrier: 'nationwide' });", className: "text-[#E2E8F0]" },
  { text: "// → policy_issued webhook dispatched", className: "text-[#94A3B8]" },
] as const;

const CHAR_MS = 20;
const LINE_PAUSE_MS = 100;
const EMPTY_LINE_MS = 60;

export default function DeveloperTerminalBg() {
  const rootRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const startedRef = useRef(false);
  const typingStartedRef = useRef(false);
  const [completedLines, setCompletedLines] = useState<(typeof CODE_LINES)[number][]>([]);
  const [activeLine, setActiveLine] = useState("");
  const [activeMeta, setActiveMeta] = useState<(typeof CODE_LINES)[number] | null>(null);
  const [showCursor, setShowCursor] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setShowCursor(true);
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showCursor || typingStartedRef.current) return;
    typingStartedRef.current = true;

    let lineIdx = 0;
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const line = CODE_LINES[lineIdx];
      if (!line) {
        setFinished(true);
        return;
      }

      if (line.text === "") {
        setCompletedLines((prev) => [...prev, line]);
        lineIdx += 1;
        charIdx = 0;
        setActiveLine("");
        setActiveMeta(CODE_LINES[lineIdx] ?? null);
        timeoutId = setTimeout(tick, EMPTY_LINE_MS);
        return;
      }

      if (charIdx < line.text.length) {
        charIdx += 1;
        setActiveMeta(line);
        setActiveLine(line.text.slice(0, charIdx));
        timeoutId = setTimeout(tick, CHAR_MS);
        return;
      }

      setCompletedLines((prev) => [...prev, line]);
      lineIdx += 1;
      charIdx = 0;
      setActiveLine("");
      setActiveMeta(CODE_LINES[lineIdx] ?? null);

      if (lineIdx >= CODE_LINES.length) {
        setFinished(true);
        return;
      }

      timeoutId = setTimeout(tick, LINE_PAUSE_MS);
    };

    setActiveMeta(CODE_LINES[0]);
    timeoutId = setTimeout(tick, 280);

    return () => clearTimeout(timeoutId);
  }, [showCursor]);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    pre.scrollTop = pre.scrollHeight;
  }, [completedLines, activeLine]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#33259F_0%,#000000_100%)]" />

      <div className="absolute inset-0 flex flex-col px-4 pb-20 pt-[11rem] md:px-6 md:pb-24 md:pt-[12rem] lg:px-8 lg:pb-28 lg:pt-[12.5rem]">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#FF5F57]/80" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]/80" />
          <span className="size-2.5 rounded-full bg-[#28C840]/80" />
          <span className="ml-2 font-mono text-[10px] text-white/35 md:text-xs">coverforce — zsh</span>
        </div>

        <pre
          ref={preRef}
          className="min-h-0 flex-1 overflow-y-auto font-mono text-[9px] leading-relaxed [scrollbar-width:none] md:text-[10px] lg:text-[11px] [&::-webkit-scrollbar]:hidden"
        >
          {completedLines.map((line, i) => (
            <div key={`${line.text}-${i}`} className={line.className || "text-[#E2E8F0]"}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {activeMeta && !finished ? (
            <div className={activeMeta.className || "text-[#E2E8F0]"}>
              {activeLine}
              <span className="ml-px inline-block h-[1em] w-[6px] animate-pulse bg-[#A483FE]/90 align-middle" />
            </div>
          ) : null}
          {finished ? (
            <div className="text-[#94A3B8]">
              <span className="inline-block h-[1em] w-[6px] animate-pulse bg-[#A483FE]/70 align-middle" />
            </div>
          ) : null}
        </pre>
      </div>

    
    </div>
  );
}
