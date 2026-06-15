"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Container from "./Container";
import type { MegaMenuConfig } from "@/data/megaMenu";

export const MEGA_MENU_CLIP_CLOSED = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
export const MEGA_MENU_CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
export const CLIP_DURATION_MS = 550;
const CLIP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const CONTENT_BASE_DELAY = 120;
const CONTENT_STAG = 60;

type MegaMenuProps = {
  open: boolean;
  enterKey: number;
  config: MegaMenuConfig;
  onMouseEnter: () => void;
  onClipClosed?: () => void;
};

function Reveal({
  enter,
  enterKey,
  delay,
  className = "",
  children,
}: {
  enter: boolean;
  enterKey: number;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  const settledRef = useRef(false);

  useEffect(() => {
    settledRef.current = false;
  }, [enterKey]);

  useEffect(() => {
    if (!enter) return;
    const timer = window.setTimeout(() => {
      settledRef.current = true;
    }, 480 + delay);
    return () => window.clearTimeout(timer);
  }, [enter, delay, enterKey]);

  const visible = enter || settledRef.current;

  return (
    <div
      className={`${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${className}`}
      style={{
        transition: enter
          ? `opacity 480ms ${CLIP_EASE} ${delay}ms, transform 480ms ${CLIP_EASE} ${delay}ms`
          : "none",
      }}
    >
      {children}
    </div>
  );
}

/* ── Default icon ────────────────────────────────────────────── */
function DefaultIcon() {
  return (
    <svg className="size-4 text-[#0032C9]" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.75" />
      <rect x="9"   y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.35" />
      <rect x="1.5" y="9"   width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.35" />
      <rect x="9"   y="9"   width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

/* ── Single card item ────────────────────────────────────────── */
function MegaMenuCard({
  link,
  enter,
  enterKey,
  delay,
}: {
  link: MegaMenuConfig["columns"][number]["links"][number];
  enter: boolean;
  enterKey: number;
  delay: number;
}) {
  return (
    <Reveal enter={enter} enterKey={enterKey} delay={delay}>
      <Link
        href={link.href}
        className="group flex items-center gap-3  p-2 transition-colors duration-200 hover:bg-[#EEF4FF]"
      >
        {/* Icon box */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#E4EAF4] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          <DefaultIcon />
        </div>

        {/* Label */}
        <p className="font-heading text-[0.8125rem] font-medium text-[#0a143b] transition-colors duration-200 group-hover:text-[#0032C9]">
          {link.label}
        </p>
      </Link>
    </Reveal>
  );
}

export default function MegaMenu({
  open,
  enterKey,
  config,
  onMouseEnter,
  onClipClosed,
}: MegaMenuProps) {
  const [clipShown, setClipShown] = useState(false);
  const [contentEnter, setContentEnter] = useState(false);

  useEffect(() => {
    if (open) {
      setClipShown(false);
      setContentEnter(false);

      const clipFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setClipShown(true));
      });
      const contentTimer = window.setTimeout(() => setContentEnter(true), 100);

      return () => {
        cancelAnimationFrame(clipFrame);
        window.clearTimeout(contentTimer);
      };
    }

    setContentEnter(false);
    setClipShown(false);
    const timer = window.setTimeout(() => onClipClosed?.(), CLIP_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [open, onClipClosed]);

  return (
    <div
      className="absolute w-fit left-1/2 -translate-x-1/2 inset-x-0 top-full z-40 -mt-px border-t border-[#E8ECF0] bg-white shadow-[0_24px_48px_-12px_rgba(10,20,59,0.14)] will-change-[clip-path] motion-reduce:transition-none"
      style={{
        clipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        WebkitClipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        transition: `clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}, -webkit-clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
    >
      <Container className="py-5 md:py-6">
        <div className="grid gap-x-6" style={{ gridTemplateColumns: `repeat(${config.columns.length}, minmax(0, 1fr))` }}>
          {config.columns.map((column, colIndex) => {
            const colBaseDelay = CONTENT_BASE_DELAY + colIndex * CONTENT_STAG * (column.links.length + 2);
            return (
              <div key={column.title} className="flex flex-col gap-0.5">
                {/* Column title */}
                <Reveal enter={contentEnter} enterKey={enterKey} delay={colBaseDelay}>
                  <p className="mb-1 px-3 font-heading text-[0.6rem] font-semibold tracking-[0.14em] text-[#9DAABF]">
                    {column.title}
                  </p>
                </Reveal>

                {/* Link cards */}
                {column.links.map((link, linkIndex) => (
                  <MegaMenuCard
                    key={link.label}
                    link={link}
                    enter={contentEnter}
                    enterKey={enterKey}
                    delay={colBaseDelay + CONTENT_STAG + CONTENT_STAG * linkIndex}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}