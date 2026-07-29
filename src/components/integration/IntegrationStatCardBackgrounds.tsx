"use client";

import { useEffect, useRef, useState } from "react";

const INK = "#0a143b";
const INK_MUTED = "#151f4d";
const INK_SOFT = "rgba(10, 20, 59, 0.55)";
const INK_FAINT = "rgba(10, 20, 59, 0.35)";

const CODE_LINE_CLASS = "text-[#151f4d]";
const CODE_COMMENT_CLASS = "text-[#151f4d]/60";

const CODE_LINES = [
  { text: "$ cf.submissions.create({", className: CODE_LINE_CLASS },
  { text: "  lob: 'commercial_auto',", className: CODE_LINE_CLASS },
  { text: "  state: 'TX',", className: CODE_LINE_CLASS },
  { text: "});", className: CODE_LINE_CLASS },
  { text: "", className: "" },
  { text: "const quote = await cf.quotes.run({", className: CODE_LINE_CLASS },
  { text: "  carriers: ['nationwide', 'chubb'],", className: CODE_LINE_CLASS },
  { text: "});", className: CODE_LINE_CLASS },
  { text: "// → policy_issued", className: CODE_COMMENT_CLASS },
] as const;

const CHAR_MS = 22;
const LINE_PAUSE_MS = 90;

export function IntegrationCodeTypingBg() {
  const rootRef = useRef<HTMLDivElement>(null);
  const typingStartedRef = useRef(false);
  const [completedLines, setCompletedLines] = useState<(typeof CODE_LINES)[number][]>([]);
  const [activeLine, setActiveLine] = useState("");
  const [activeMeta, setActiveMeta] = useState<(typeof CODE_LINES)[number] | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || typingStartedRef.current) return;
        typingStartedRef.current = true;

        let lineIdx = 0;
        let charIdx = 0;

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
            timeoutId = setTimeout(tick, 50);
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
        timeoutId = setTimeout(tick, 320);
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute right-0 top-0 z-0 h-[58%] w-[min(72%,15rem)] overflow-hidden sm:w-[min(68%,17rem)] lg:w-[min(62%,19rem)] [mask-image:linear-gradient(225deg,black_42%,transparent_88%)]"
      aria-hidden
    >
      <div className="absolute inset-0 px-3 pb-3 pt-3 md:px-4 md:pt-4">
        <div className="mb-2 flex items-center gap-1">
          <span className="size-2 rounded-full bg-[#FF5F57]/80" />
          <span className="size-2 rounded-full bg-[#FEBC2E]/80" />
          <span className="size-2 rounded-full bg-[#28C840]/80" />
          <span className="ml-1.5 font-mono text-[8px] text-[#151f4d]/50 md:text-[9px]">api.ts</span>
        </div>
        <pre className="overflow-hidden font-mono text-[7px] leading-relaxed md:text-[8px] lg:text-[9px]">
          {completedLines.map((line, i) => (
            <div key={`${line.text}-${i}`} className={line.className || CODE_LINE_CLASS}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {activeMeta && !finished ? (
            <div className={activeMeta.className || CODE_LINE_CLASS}>
              {activeLine}
              <span className="ml-px inline-block h-[1em] w-1 animate-pulse bg-[#151f4d] align-middle" />
            </div>
          ) : null}
        </pre>
      </div>
    </div>
  );
}

export function IntegrationAutomationBg() {
  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-0 h-[62%] w-[min(74%,15.5rem)] overflow-hidden sm:w-[min(70%,17.5rem)] lg:w-[min(64%,19rem)] [mask-image:linear-gradient(225deg,black_40%,transparent_88%)]"
      aria-hidden
    >
      <svg
        viewBox="0 0 240 180"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="auto-path-left" d="M48 54 C78 54, 96 66, 108 78" />
          <path id="auto-path-right" d="M192 54 C162 54, 144 66, 132 78" />
          <path id="auto-path-down" d="M120 110 C120 118, 120 124, 120 132" />
          <path id="auto-path-out-l" d="M96 144 C84 148, 72 152, 54 152" />
          <path id="auto-path-out-r" d="M144 144 C156 148, 168 152, 186 152" />
          <mask
            id="auto-hide-under-tabs"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="240"
            height="180"
          >
            <rect width="240" height="180" fill="white" />
            {/* Punch out tabs + hub so lines/orbits never show under them */}
            <rect x="20" y="24" width="56" height="32" rx="8" fill="black" />
            <rect x="164" y="24" width="56" height="32" rx="8" fill="black" />
            <circle cx="120" cy="88" r="24" fill="black" />
            <rect x="28" y="146" width="52" height="28" rx="7" fill="black" />
            <rect x="94" y="130" width="52" height="28" rx="7" fill="black" />
            <rect x="160" y="146" width="52" height="28" rx="7" fill="black" />
          </mask>
        </defs>

        <g mask="url(#auto-hide-under-tabs)">
          {/* Orbit rings around AI hub */}
          <g style={{ transformOrigin: "120px 88px" }}>
            <circle
              cx="120"
              cy="88"
              r="34"
              stroke={INK_FAINT}
              strokeWidth="1"
              strokeDasharray="2 5"
              className="animate-[spin_18s_linear_infinite]"
              style={{ transformOrigin: "120px 88px" }}
            />
          </g>
          <g style={{ transformOrigin: "120px 88px" }}>
            <circle
              cx="120"
              cy="88"
              r="48"
              stroke="rgba(10,20,59,0.18)"
              strokeWidth="1"
              strokeDasharray="1 7"
              className="animate-[spin_28s_linear_infinite]"
              style={{ transformOrigin: "120px 88px", animationDirection: "reverse" }}
            />
          </g>

          {/* Flow paths */}
          <use href="#auto-path-left" stroke={INK_SOFT} strokeWidth="1.25" />
          <use href="#auto-path-right" stroke={INK_SOFT} strokeWidth="1.25" />
          <use href="#auto-path-down" stroke={INK_SOFT} strokeWidth="1.25" />
          <use href="#auto-path-out-l" stroke={INK_FAINT} strokeWidth="1.1" />
          <use href="#auto-path-out-r" stroke={INK_FAINT} strokeWidth="1.1" />

          {/* Traveling dots */}
          <circle r="2.4" fill={INK_MUTED}>
            <animateMotion dur="2.4s" repeatCount="indefinite" begin="0s">
              <mpath href="#auto-path-left" />
            </animateMotion>
          </circle>
          <circle r="2.4" fill={INK_MUTED}>
            <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.5s">
              <mpath href="#auto-path-right" />
            </animateMotion>
          </circle>
          <circle r="2.2" fill={INK}>
            <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.9s">
              <mpath href="#auto-path-down" />
            </animateMotion>
          </circle>
          <circle r="2" fill={INK_SOFT}>
            <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.4s">
              <mpath href="#auto-path-out-l" />
            </animateMotion>
          </circle>
          <circle r="2" fill={INK_SOFT}>
            <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.7s">
              <mpath href="#auto-path-out-r" />
            </animateMotion>
          </circle>
        </g>

        {/* Input nodes */}
        <rect x="22" y="26" width="52" height="28" rx="7" fill="rgba(10,20,59,0.07)" stroke={INK_MUTED} strokeOpacity="0.55" />
        <text x="48" y="43" textAnchor="middle" fill={INK_MUTED} fontSize="7.5" fontFamily="ui-monospace, monospace">
          Intake
        </text>

        <rect x="166" y="26" width="52" height="28" rx="7" fill="rgba(10,20,59,0.07)" stroke={INK_MUTED} strokeOpacity="0.55" />
        <text x="192" y="43" textAnchor="middle" fill={INK_MUTED} fontSize="7.5" fontFamily="ui-monospace, monospace">
          Appetite
        </text>

        {/* AI hub */}
        <circle cx="120" cy="88" r="22" fill="rgba(10,20,59,0.1)" stroke={INK} strokeWidth="1.4" />
        <circle cx="120" cy="88" r="14" fill="rgba(10,20,59,0.14)" stroke={INK_MUTED} strokeWidth="1" className="animate-pulse" />
        <text x="120" y="86" textAnchor="middle" fill={INK} fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600">
          AI
        </text>
        <text x="120" y="97" textAnchor="middle" fill={INK_SOFT} fontSize="6" fontFamily="ui-monospace, monospace">
          agent
        </text>

        {/* Output nodes */}
        <rect x="30" y="148" width="48" height="24" rx="6" fill="rgba(10,20,59,0.06)" stroke={INK_SOFT} />
        <text x="54" y="163" textAnchor="middle" fill={INK_SOFT} fontSize="7" fontFamily="ui-monospace, monospace">
          Quote
        </text>

        <rect x="96" y="132" width="48" height="24" rx="6" fill="rgba(10,20,59,0.08)" stroke={INK_MUTED} strokeOpacity="0.65" />
        <text x="120" y="147" textAnchor="middle" fill={INK_MUTED} fontSize="7" fontFamily="ui-monospace, monospace">
          Bind
        </text>

        <rect x="162" y="148" width="48" height="24" rx="6" fill="rgba(10,20,59,0.06)" stroke={INK_SOFT} />
        <text x="186" y="163" textAnchor="middle" fill={INK_SOFT} fontSize="7" fontFamily="ui-monospace, monospace">
          Sync
        </text>
      </svg>
    </div>
  );
}
