"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import ButtonArrowIcon from "./ButtonArrowIcon";
import AnimatedLinkText from "./AnimatedLinkText";
import {
  MEGA_MENU_COLUMNS_MIN_HEIGHT_REM,
  MEGA_MENU_LEFT_MIN_HEIGHT_REM,
  type MegaMenuColumn,
  type MegaMenuConfig,
  type MegaMenuLink,
} from "@/data/megaMenu";

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
  onClose?: () => void;
  onNavigate?: (href: string) => void;
};

function handleMenuLinkClick(
  e: MouseEvent<HTMLElement>,
  href: string,
  onClose?: () => void,
  onNavigate?: (href: string) => void,
) {
  onClose?.();

  if (!onNavigate) return;

  e.preventDefault();
  onNavigate(href);
}

function Reveal({
  enter,
  enterKey,
  resetKey,
  delay,
  mode = "slide",
  as: Component = "div",
  className = "",
  children,
}: {
  enter: boolean;
  enterKey: number;
  resetKey: string;
  delay: number;
  mode?: "slide" | "fade";
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
}) {
  const settledRef = useRef(false);

  useEffect(() => {
    settledRef.current = false;
  }, [enterKey, resetKey]);

  useEffect(() => {
    if (!enter) return;
    const timer = window.setTimeout(() => {
      settledRef.current = true;
    }, 480 + delay);
    return () => window.clearTimeout(timer);
  }, [enter, delay, enterKey]);

  const visible = enter || settledRef.current;
  const hiddenClass = mode === "slide" ? "translate-y-3 opacity-0" : "opacity-0";
  const visibleClass = "translate-y-0 opacity-100";
  const transition = enter
    ? mode === "slide"
      ? `opacity 480ms ${CLIP_EASE} ${delay}ms, transform 480ms ${CLIP_EASE} ${delay}ms`
      : `opacity 320ms ease ${delay}ms`
    : "none";

  return (
    <Component
      className={`${visible ? visibleClass : hiddenClass} ${className}`}
      style={{ transition }}
    >
      {children}
    </Component>
  );
}

function MegaMenuLinkItem({
  link,
  enter,
  enterKey,
  resetKey,
  delay,
  onClose,
  onNavigate,
}: {
  link: MegaMenuLink;
  enter: boolean;
  enterKey: number;
  resetKey: string;
  delay: number;
  onClose?: () => void;
  onNavigate?: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal
      as="li"
      enter={enter}
      enterKey={enterKey}
      resetKey={resetKey}
      delay={delay}
      className="border-t border-[#E5E7EB] first:border-t-0"
    >
      <Link
        href={link.href}
        onClick={(e) => handleMenuLinkClick(e, link.href, onClose, onNavigate)}
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
    </Reveal>
  );
}

function MegaMenuColumnBlock({
  column,
  enter,
  enterKey,
  resetKey,
  onClose,
  onNavigate,
}: {
  column: MegaMenuColumn;
  enter: boolean;
  enterKey: number;
  resetKey: string;
  onClose?: () => void;
  onNavigate?: (href: string) => void;
}) {
  return (
    <div>
      <Reveal
        enter={enter}
        enterKey={enterKey}
        resetKey={resetKey}
        delay={CONTENT_BASE_DELAY}
        mode="fade"
      >
        <p className="mb-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#9CA3AF]">
          {column.title}
        </p>
      </Reveal>
      <ul>
        {column.links.map((link, index) => (
          <MegaMenuLinkItem
            key={link.label}
            link={link}
            enter={enter}
            enterKey={enterKey}
            resetKey={resetKey}
            delay={CONTENT_BASE_DELAY + CONTENT_STAG * index}
            onClose={onClose}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}

export default function MegaMenu({
  open,
  enterKey,
  menuKey,
  config,
  onMouseEnter,
  onClipClosed,
  onClose,
  onNavigate,
}: MegaMenuProps) {
  const [clipShown, setClipShown] = useState(false);
  const [contentEnter, setContentEnter] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [displayConfig, setDisplayConfig] = useState(config);
  const [displayMenuKey, setDisplayMenuKey] = useState(menuKey);
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
    const isFirstShow = previousMenuKey === null;
    prevMenuKeyRef.current = menuKey;

    if (isFirstShow || previousMenuKey === menuKey) {
      setDisplayConfig(config);
      setDisplayMenuKey(menuKey);
      return;
    }

    setContentEnter(false);
    setContentOpacity(0);

    const swapTimer = window.setTimeout(() => {
      setDisplayConfig(config);
      setDisplayMenuKey(menuKey);
      requestAnimationFrame(() => {
        setContentEnter(true);
        setContentOpacity(1);
      });
    }, CONTENT_SWAP_MS);

    return () => window.clearTimeout(swapTimer);
  }, [menuKey, config, open, clipShown]);

  const maxColumnLinks = Math.max(
    ...displayConfig.columns.map((column) => column.links.length),
    0,
  );
  const featuredDelay = CONTENT_BASE_DELAY + CONTENT_STAG * maxColumnLinks;
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
      <div
        className="relative mx-auto w-full max-w-7xl px-6 py-8 transition-[height] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none md:py-10"
        style={{ minHeight: `${MEGA_MENU_LEFT_MIN_HEIGHT_REM + 4}rem` }}
      >
        <div
          className="flex flex-col gap-8 transition-opacity duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none md:flex-row md:items-stretch md:gap-8 lg:gap-10"
          style={{ opacity: contentOpacity }}
        >
          <div
            className="flex min-w-0 flex-1 flex-col md:max-w-[calc(100%-20rem)] lg:max-w-[calc(100%-23rem)] xl:max-w-[calc(100%-26rem)]"
            style={{ minHeight: `${MEGA_MENU_LEFT_MIN_HEIGHT_REM}rem` }}
          >
            <div
              className="grid gap-8 sm:grid-cols-2 lg:gap-x-14"
              style={{ minHeight: `${MEGA_MENU_COLUMNS_MIN_HEIGHT_REM}rem` }}
            >
              {displayConfig.columns.map((column) => (
                <MegaMenuColumnBlock
                  key={`${displayMenuKey}-${column.title}`}
                  column={column}
                  enter={contentEnter}
                  enterKey={enterKey}
                  resetKey={displayMenuKey}
                  onClose={onClose}
                  onNavigate={onNavigate}
                />
              ))}
            </div>

            <Reveal
              enter={contentEnter}
              enterKey={enterKey}
              resetKey={displayMenuKey}
              delay={footerDelay}
              mode="fade"
              className="mt-8 border-t border-[#E5E7EB] pt-6"
            >
              <Button
                href={displayConfig.cta.href}
                balanced
                className="min-w-[14rem] px-9"
                onClick={(e) =>
                  handleMenuLinkClick(e, displayConfig.cta.href, onClose, onNavigate)
                }
              >
                {displayConfig.cta.label}
              </Button>
            </Reveal>
          </div>

          <Reveal
            enter={contentEnter}
            enterKey={enterKey}
            resetKey={displayMenuKey}
            delay={featuredDelay}
            mode="fade"
            className="w-full shrink-0 md:w-[20rem] lg:w-[23rem] xl:w-[26rem]"
          >
            <Link
              href={displayConfig.featured.href}
              onClick={(e) =>
                handleMenuLinkClick(e, displayConfig.featured.href, onClose, onNavigate)
              }
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
