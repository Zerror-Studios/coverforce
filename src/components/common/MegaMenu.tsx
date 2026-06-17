"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { MegaMenuConfig, MegaMenuLink } from "@/data/megaMenu";

export const MEGA_MENU_CLIP_CLOSED = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
export const MEGA_MENU_CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
export const CLIP_DURATION_MS = 550;
const CLIP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const CONTENT_BASE_DELAY = 120;
const CONTENT_STAG = 55;

type MegaMenuProps = {
  open: boolean;
  enterKey: number;
  config: MegaMenuConfig;
  onMouseEnter: () => void;
  onClipClosed?: () => void;
  onLinkClick?: () => void;
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
      className={`${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"} ${className}`}
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

function MegaMenuItem({
  link,
  enter,
  enterKey,
  delay,
  onLinkClick,
}: {
  link: MegaMenuLink;
  enter: boolean;
  enterKey: number;
  delay: number;
  onLinkClick?: () => void;
}) {
  const Icon = link.icon;

  return (
    <div className="h-full bg-white">
      <Reveal enter={enter} enterKey={enterKey} delay={delay} className="h-full">
        <Link
          href={link.href}
          onClick={onLinkClick}
          className="group flex h-full flex-col gap-2.5 bg-white px-6 py-6 transition-colors duration-200 hover:bg-[#F7F9FC] lg:px-8 lg:py-7"
        >
          <Icon className="size-4 shrink-0 text-[#0032C9]" aria-hidden />
          <div className="space-y-1">
            <p className="font-heading text-sm font-medium text-[#0a143b] transition-colors duration-200 group-hover:text-[#0032C9]">
              {link.label}
            </p>
            {link.description ? (
              <p className="font-sans text-xs leading-relaxed text-[#6B7280]">
                {link.description}
              </p>
            ) : null}
          </div>
        </Link>
      </Reveal>
    </div>
  );
}

function flattenLinks(config: MegaMenuConfig): MegaMenuLink[] {
  return config.columns.flatMap((column) => column.links);
}

export default function MegaMenu({
  open,
  enterKey,
  config,
  onMouseEnter,
  onClipClosed,
  onLinkClick,
}: MegaMenuProps) {
  const [clipShown, setClipShown] = useState(false);
  const [contentEnter, setContentEnter] = useState(false);
  const links = useMemo(() => flattenLinks(config), [config]);

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
      className="absolute inset-x-0 top-full z-20 -mt-px w-full border-t border-[#E8ECF0] bg-white shadow-[0_24px_48px_-12px_rgba(10,20,59,0.14)] will-change-[clip-path] motion-reduce:transition-none"
      style={{
        clipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        WebkitClipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        transition: `clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}, -webkit-clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
    >
      <div className="relative mx-auto w-full max-w-7xl px-2 py-6 md:px-4 md:py-8 lg:px-6 xl:px-6">
        <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] bg-white sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
          {links.map((link, index) => (
            <MegaMenuItem
              key={link.label}
              link={link}
              enter={contentEnter}
              enterKey={enterKey}
              delay={CONTENT_BASE_DELAY + CONTENT_STAG * index}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
