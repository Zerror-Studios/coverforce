"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import CmsImage from "./CmsImage";
import ButtonArrowIcon from "./ButtonArrowIcon";
import AnimatedLinkText from "./AnimatedLinkText";
import { containerPadding } from "./containerStyles";
import {
  MEGA_MENU_COLUMNS_MIN_HEIGHT_REM,
  MEGA_MENU_FIXED_HEIGHT_REM,
  MEGA_MENU_LEFT_MIN_HEIGHT_REM,
  type MegaMenuColumn,
  type MegaMenuConfig,
  type MegaMenuLink,
} from "@/data/megaMenu";

export const MEGA_MENU_CLIP_CLOSED = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
export const MEGA_MENU_CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
export const CLIP_DURATION_MS = 550;
export const CLIP_CLOSE_MS = 620;
const CLIP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const CLIP_CLOSE_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
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
  resetKey,
  enterKey,
  delay,
  as: Component = "div",
  className = "",
  children,
}: {
  resetKey: string;
  enterKey: number;
  delay: number;
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Component className={`mega-menu-reveal-slot ${className}`}>
      <div
        key={`${resetKey}-${enterKey}-${delay}`}
        className="mega-menu-reveal"
        style={{ "--mega-menu-stagger": `${delay}ms` } as CSSProperties}
      >
        {children}
      </div>
    </Component>
  );
}

function MegaMenuLinkItem({
  link,
  enterKey,
  resetKey,
  delay,
  onClose,
  onNavigate,
}: {
  link: MegaMenuLink;
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
        className={`group flex w-full justify-between gap-3 py-3.5 font-heading text-[0.9375rem] font-regular text-[#3D3D3D] transition-colors duration-200 hover:text-[#151F4D] ${
          link.multiline ? "items-start" : "items-center"
        }`}
      >
        <span className={`flex min-w-0 flex-1 gap-2 ${link.multiline ? "items-start" : "items-center"}`}>
          {link.multiline ? (
            <span className="min-w-0 leading-snug">{link.label}</span>
          ) : (
            <AnimatedLinkText
              hovered={hovered}
              textClip="h-[0.9375rem]"
              textLine="h-[0.9375rem] leading-none"
            >
              {link.label}
            </AnimatedLinkText>
          )}
          {link.badge ? (
            <span className="rounded-full border border-[#D1D5DB] px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#3D3D3D]">
              {link.badge}
            </span>
          ) : null}
        </span>
        <ButtonArrowIcon className={`h-2 w-3 shrink-0 text-[#151F4D] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 ${link.multiline ? "mt-1" : ""}`} />
      </Link>
    </Reveal>
  );
}

function MegaMenuColumnBlock({
  column,
  columnIndex,
  enterKey,
  resetKey,
  onClose,
  onNavigate,
}: {
  column: MegaMenuColumn;
  columnIndex: number;
  enterKey: number;
  resetKey: string;
  onClose?: () => void;
  onNavigate?: (href: string) => void;
}) {
  const columnBaseDelay = CONTENT_BASE_DELAY + columnIndex * CONTENT_STAG * 2;

  return (
    <div>
      <Reveal enterKey={enterKey} resetKey={resetKey} delay={columnBaseDelay}>
        <p className="mb-1 max-w-[9.5rem] font-mono text-[0.6875rem] font-medium uppercase leading-snug tracking-[0.14em] text-[#3D3D3D] whitespace-normal">
          {column.title}
        </p>
      </Reveal>
      <ul>
        {column.links.map((link, index) => (
          <MegaMenuLinkItem
            key={link.label}
            link={link}
            enterKey={enterKey}
            resetKey={resetKey}
            delay={columnBaseDelay + CONTENT_STAG * (index + 1)}
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
  const prevMenuKeyRef = useRef<string | null>(null);

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
    setContentOpacity(0);
    setClipShown(false);
    const timer = window.setTimeout(() => {
      setContentEnter(false);
      onClipClosed?.();
    }, CLIP_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [open, onClipClosed]);

  useEffect(() => {
    if (!open || !clipShown) return;

    setContentEnter(false);
    setContentOpacity(1);
    const enterTimer = window.setTimeout(() => setContentEnter(true), 100);

    return () => {
      window.clearTimeout(enterTimer);
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

  const featuredDelay =
    Math.max(
      ...displayConfig.columns.map((column, columnIndex) => {
        const columnBaseDelay = CONTENT_BASE_DELAY + columnIndex * CONTENT_STAG * 2;
        return columnBaseDelay + CONTENT_STAG * column.links.length;
      }),
      CONTENT_BASE_DELAY,
    ) + CONTENT_STAG;
  return (
    <div
      className="absolute inset-x-0 top-full z-20 -mt-px w-full border-t border-[#E8ECF0] bg-white shadow-[0_24px_48px_-12px_rgba(10,20,59,0.1)] will-change-[clip-path] motion-reduce:transition-none"
      style={{
        clipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        WebkitClipPath: clipShown ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
        transition: open
          ? `clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}, -webkit-clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}`
          : `clip-path ${CLIP_CLOSE_MS}ms ${CLIP_CLOSE_EASE}, -webkit-clip-path ${CLIP_CLOSE_MS}ms ${CLIP_CLOSE_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
    >
      <div
        className={`relative mx-auto w-full max-w-7xl ${containerPadding} py-6 transition-[height] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none md:py-7`}
        style={{ minHeight: `${MEGA_MENU_FIXED_HEIGHT_REM}rem` }}
      >
        <div
        className={`flex h-full flex-col gap-6 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none md:flex-row md:items-stretch md:gap-8 lg:gap-10 ${contentEnter ? "mega-menu-enter" : ""}`}
        style={{
          opacity: contentOpacity,
          transition: open ? "opacity 300ms cubic-bezier(0.76,0,0.24,1)" : "opacity 380ms cubic-bezier(0.33,1,0.68,1)",
        }}
        >
          <div
            className="flex min-w-0 flex-1 flex-col md:max-w-[calc(100%-20rem)] lg:max-w-[calc(100%-23rem)] xl:max-w-[calc(100%-26rem)]"
            style={{ minHeight: `${MEGA_MENU_LEFT_MIN_HEIGHT_REM}rem` }}
          >
            <div
              className="grid gap-8 sm:grid-cols-2 lg:gap-x-14"
              style={{ minHeight: `${MEGA_MENU_COLUMNS_MIN_HEIGHT_REM}rem` }}
            >
              {displayConfig.columns.map((column, columnIndex) => (
                <MegaMenuColumnBlock
                  key={`${displayMenuKey}-${column.title}`}
                  column={column}
                  columnIndex={columnIndex}
                  enterKey={enterKey}
                  resetKey={displayMenuKey}
                  onClose={onClose}
                  onNavigate={onNavigate}
                />
              ))}
            </div>

          </div>

          <Reveal
            enterKey={enterKey}
            resetKey={displayMenuKey}
            delay={featuredDelay}
            className="h-full w-full shrink-0 md:w-[20rem] lg:w-[23rem] xl:w-[26rem]"
          >
            <Link
              href={displayConfig.featured.href}
              onClick={(e) =>
                handleMenuLinkClick(e, displayConfig.featured.href, onClose, onNavigate)
              }
              className="group flex h-full flex-col overflow-hidden rounded-xl bg-white p-3 transition-colors duration-200 hover:bg-[#FAFAFA]"
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-[#F7F7FB]">
                <CmsImage
                  src={displayConfig.featured.image ?? "/images/mega-menu-promo.png"}
                  alt={displayConfig.featured.imageAlt ?? displayConfig.featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 26rem"
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-3 px-0.5 font-heading text-sm font-regular leading-snug text-[#3D3D3D] transition-colors duration-200 group-hover:text-[#151F4D]">
                {displayConfig.featured.title}
              </p>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
