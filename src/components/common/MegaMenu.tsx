"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
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

/**
 * A single card-style menu item matching the screenshot:
 * [icon]  Title
 *         Short description text
 */
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
        className="group flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-[#dceaff]"
      >
        {/* Icon placeholder — swap for link.icon if your data shape includes it */}
        {link.icon ? (
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-[#E8ECF0] bg-white text-[#0032C9]">
            <link.icon className="size-4" aria-hidden />
          </div>
        ) : (
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-[#E8ECF0] bg-white">
            <svg
              className="size-4 text-[#0032C9]"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.7" />
            </svg>
          </div>
        )}

        <div className="min-w-0">
          <p className="font-heading text-sm font-medium text-[#0a143b] transition-colors group-hover:text-[#0032C9]">
            {link.label}
          </p>
          {link.description ? (
            <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#6B7A99]">
              {link.description}
            </p>
          ) : null}
        </div>
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

  // Flatten all links from all columns into one array for the grid
  const allLinks = config.columns.flatMap((col) => col.links);

  return (
    <div
      className="absolute inset-x-0 top-full  z-40 w-fit left-1/2 -translate-x-1/2 -mt-px border-t border-[#E8ECF0] bg-white shadow-[0_24px_48px_-12px_rgba(10,20,59,0.14)] will-change-[clip-path] motion-reduce:transition-none"
      style={{
        clipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        WebkitClipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        transition: `clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}, -webkit-clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
    >
      <Container className="py-6 md:py-8">
        {/*
          Two-column card grid matching the screenshot.
          Each cell: icon | title + description
        */}
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:max-w-2xl">
          {allLinks.map((link, index) => (
            <MegaMenuCard
              key={link.label}
              link={link}
              enter={contentEnter}
              enterKey={enterKey}
              delay={CONTENT_BASE_DELAY + CONTENT_STAG * index}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}