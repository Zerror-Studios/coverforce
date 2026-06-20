"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import type { MegaMenuColumn, MegaMenuConfig, MegaMenuLink } from "@/data/megaMenu";

export const MEGA_MENU_CLIP_CLOSED = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
export const MEGA_MENU_CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
export const CLIP_DURATION_MS = 550;
const CLIP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const CONTENT_BASE_DELAY = 100;
const CONTENT_STAG = 45;

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

function MegaMenuLinkItem({
  link,
  onLinkClick,
}: {
  link: MegaMenuLink;
  onLinkClick?: () => void;
}) {
  return (
    <li className="border-t border-[#E5E7EB] first:border-t-0">
      <Link
        href={link.href}
        onClick={onLinkClick}
        className="group flex items-center gap-2 py-3.5 font-heading text-[0.9375rem] font-regular leading-none text-[#0a143b] transition-colors duration-200 hover:text-[#0032C9]"
      >
        <span>{link.label}</span>
        {link.badge ? (
          <span className="rounded-full border border-[#D1D5DB] px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#6B7280]">
            {link.badge}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function MegaMenuColumnBlock({
  column,
  enter,
  enterKey,
  delay,
  onLinkClick,
}: {
  column: MegaMenuColumn;
  enter: boolean;
  enterKey: number;
  delay: number;
  onLinkClick?: () => void;
}) {
  return (
    <Reveal enter={enter} enterKey={enterKey} delay={delay}>
      <div>
        <p className="mb-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#9CA3AF]">
          {column.title}
        </p>
        <ul>
          {column.links.map((link) => (
            <MegaMenuLinkItem key={link.label} link={link} onLinkClick={onLinkClick} />
          ))}
        </ul>
      </div>
    </Reveal>
  );
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

  const featuredDelay = CONTENT_BASE_DELAY + CONTENT_STAG * config.columns.length;
  const footerDelay = featuredDelay + CONTENT_STAG;

  return (
    <div
      className="absolute inset-x-0 top-full z-20 -mt-px w-full border-t border-[#E8ECF0] bg-white shadow-[0_24px_48px_-12px_rgba(10,20,59,0.1)] will-change-[clip-path] motion-reduce:transition-none"
      style={{
        clipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        WebkitClipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        transition: `clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}, -webkit-clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
    >
      <div className="relative mx-auto w-full max-w-7xl px-6 py-8 md:px-8 md:py-10 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10 lg:gap-14">
          <div className="min-w-0 flex-1">
            <div className="grid gap-8 sm:grid-cols-2 lg:gap-x-14">
              {config.columns.map((column, index) => (
                <MegaMenuColumnBlock
                  key={column.title}
                  column={column}
                  enter={contentEnter}
                  enterKey={enterKey}
                  delay={CONTENT_BASE_DELAY + CONTENT_STAG * index}
                  onLinkClick={onLinkClick}
                />
              ))}
            </div>

            <Reveal
              enter={contentEnter}
              enterKey={enterKey}
              delay={footerDelay}
              className="mt-8 border-t border-[#E5E7EB] pt-6"
            >
              <Button href={config.cta.href} balanced className="min-w-[14rem] px-9" onClick={onLinkClick}>
                {config.cta.label}
              </Button>
            </Reveal>
          </div>

          <Reveal
            enter={contentEnter}
            enterKey={enterKey}
            delay={featuredDelay}
            className="w-full shrink-0 md:w-[240px] lg:w-[260px] xl:w-[280px]"
          >
            <Link
              href={config.featured.href}
              onClick={onLinkClick}
              className="group flex flex-col overflow-hidden rounded-xl bg-white p-3 transition-colors duration-200 hover:bg-[#FAFAFA]"
            >
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={config.featured.image}
                  alt={config.featured.imageAlt ?? config.featured.title}
                  width={280}
                  height={260}
                  className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-3 px-0.5 font-heading text-sm font-regular leading-snug text-[#0a143b] transition-colors duration-200 group-hover:text-[#0032C9]">
                {config.featured.title}
              </p>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
