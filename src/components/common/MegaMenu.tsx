"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import ButtonArrowIcon from "./ButtonArrowIcon";
import AnimatedLinkText from "./AnimatedLinkText";
import type { MegaMenuColumn, MegaMenuConfig, MegaMenuLink } from "@/data/megaMenu";

export const MEGA_MENU_CLIP_CLOSED = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
export const MEGA_MENU_CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
export const CLIP_DURATION_MS = 550;
const CLIP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const CONTENT_SWAP_MS = 320;
const CONTENT_BASE_DELAY = 100;
const CONTENT_STAG = 45;

type MegaMenuProps = {
  open: boolean;
  enterKey: number;
  menuKey: string;
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
  const [hovered, setHovered] = useState(false);

  return (
    <li className="border-t border-[#E5E7EB] first:border-t-0">
      <Link
        href={link.href}
        onClick={onLinkClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group flex w-full items-center justify-between gap-3 py-3.5 font-heading text-[0.9375rem] font-regular leading-none text-[#0a143b] transition-colors duration-200 hover:text-[#413CC0]"
      >
        <span className="flex min-w-0 items-center gap-2">
          <AnimatedLinkText
            hovered={hovered}
            textClip="h-[0.9375rem]"
            textLine="h-[0.9375rem] leading-none"
          >
            {link.label}
          </AnimatedLinkText>
          {link.badge ? (
            <span className="rounded-full border border-[#D1D5DB] px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#6B7280]">
              {link.badge}
            </span>
          ) : null}
        </span>
        <ButtonArrowIcon className="h-2 w-3 shrink-0 text-[#413CC0] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
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
  menuKey,
  config,
  onMouseEnter,
  onClipClosed,
  onLinkClick,
}: MegaMenuProps) {
  const [clipShown, setClipShown] = useState(false);
  const [contentEnter, setContentEnter] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [displayConfig, setDisplayConfig] = useState(config);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevMenuKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (open) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [open, displayConfig.featured.video]);

  useEffect(() => {
    if (open) {
      setClipShown(false);

      const clipFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setClipShown(true));
      });

      return () => {
        cancelAnimationFrame(clipFrame);
      };
    }

    prevMenuKeyRef.current = null;
    setContentEnter(false);
    setContentOpacity(0);
    setClipShown(false);
    const timer = window.setTimeout(() => onClipClosed?.(), CLIP_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [open, onClipClosed]);

  useEffect(() => {
    if (!open || !clipShown) return;

    setContentEnter(false);
    const enterTimer = window.setTimeout(() => setContentEnter(true), 100);
    const fadeTimer = window.setTimeout(() => setContentOpacity(1), 100);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(fadeTimer);
    };
  }, [open, clipShown, enterKey]);

  useEffect(() => {
    if (!open || !clipShown) return;

    const previousMenuKey = prevMenuKeyRef.current;
    prevMenuKeyRef.current = menuKey;

    if (previousMenuKey === null || previousMenuKey === menuKey) {
      return;
    }

    setContentOpacity(0);
    const swapTimer = window.setTimeout(() => {
      setDisplayConfig(config);
      requestAnimationFrame(() => setContentOpacity(1));
    }, CONTENT_SWAP_MS);

    return () => window.clearTimeout(swapTimer);
  }, [menuKey, config, open, clipShown]);

  const featuredDelay = CONTENT_BASE_DELAY + CONTENT_STAG * displayConfig.columns.length;
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
      <div className="relative mx-auto w-full max-w-7xl px-6 py-8  md:py-10 ">
        <div
          className="flex flex-col gap-8 transition-opacity duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none md:flex-row md:items-stretch md:gap-8 lg:gap-10"
          style={{ opacity: contentOpacity }}
        >
          <div className="min-w-0 flex-1 md:max-w-[calc(100%-20rem)] lg:max-w-[calc(100%-23rem)] xl:max-w-[calc(100%-26rem)]">
            <div className="grid gap-8 sm:grid-cols-2 lg:gap-x-14">
              {displayConfig.columns.map((column, index) => (
                <MegaMenuColumnBlock
                  key={`${menuKey}-${column.title}`}
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
              <Button href={displayConfig.cta.href} balanced className="min-w-[14rem] px-9" onClick={onLinkClick}>
                {displayConfig.cta.label}
              </Button>
            </Reveal>
          </div>

          <Reveal
            enter={contentEnter}
            enterKey={enterKey}
            delay={featuredDelay}
            className="w-full shrink-0 md:w-[20rem] lg:w-[23rem] xl:w-[26rem]"
          >
            <Link
              href={displayConfig.featured.href}
              onClick={onLinkClick}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-3 transition-colors duration-200 hover:bg-[#FAFAFA]"
            >
              <div className="overflow-hidden rounded-lg bg-[#0a143b]">
                {displayConfig.featured.video ? (
                  <video
                    ref={videoRef}
                    key={displayConfig.featured.video}
                    src={displayConfig.featured.video}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={displayConfig.featured.imageAlt ?? displayConfig.featured.title}
                  />
                ) : (
                  <Image
                    src={displayConfig.featured.image ?? "/images/mega-menu-promo.png"}
                    alt={displayConfig.featured.imageAlt ?? displayConfig.featured.title}
                    width={480}
                    height={448}
                    className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <p className="mt-3 px-0.5 font-heading text-sm font-regular leading-snug text-[#0a143b] transition-colors duration-200 group-hover:text-[#0032C9]">
                {displayConfig.featured.title}
              </p>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
