"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { RiCloseLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHomeIntro } from "@/contexts/HomeIntroContext";
import { lockPageScroll } from "@/lib/scrollLock";

type Phase = "waiting" | "open" | "strip" | "dismissed";

const SHOW_DELAY_MS = 3500;
const STRIP_EXIT_MS = 220;
const STRIP_HEIGHT = 44;

const STRIP_GRADIENT =
  "linear-gradient(135deg, #E8894F 0%, #FFA36C 55%, #FFA36C 100%)";

const BANNER_ASSETS = {
  desktop: "/banner-desktop.webp",
  mobile: "/banner-mobile.webp",
} as const;

const ANNOUNCEMENT = {
  title: "CoverForce Startup Program is open",
  body: "Apply for preferred pricing, carrier access, and the infrastructure to launch your brokerage faster.",
  ctaLabel: "Apply now",
  ctaHref: "/contact",
  stripSegments: [
    { text: "First MCP Connector for Commercial Insurance", bold: false },
    { text: "In ChatGPT and Claude", bold: true },
    { text: "Quote 30+ Carriers Without Leaving the Chat", bold: false },
  ] as const,
};

function StripSegments({
  className = "",
  "aria-hidden": ariaHidden,
}: {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <span
      className={`inline-flex items-center gap-x-2 whitespace-nowrap sm:gap-x-3 ${className}`}
      aria-hidden={ariaHidden}
    >
      {ANNOUNCEMENT.stripSegments.map((segment, index) => (
        <span
          key={`${segment.text}-${index}`}
          className="inline-flex items-center gap-x-2 sm:gap-x-3"
        >
          {index > 0 ? (
            <span className="shrink-0 text-white/50" aria-hidden>
              |
            </span>
          ) : null}
          <span className={segment.bold ? "font-semibold" : undefined}>
            {segment.text}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function AnnouncementBanner() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { enabled: introEnabled, phase: introPhase } = useHomeIntro();
  const introReady = !introEnabled || introPhase === "done";

  const [phase, setPhase] = useState<Phase>("waiting");
  const [mounted, setMounted] = useState(false);
  const [stripContentReady, setStripContentReady] = useState(false);
  const [stripExiting, setStripExiting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isHome || !introReady || phase !== "waiting") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 800 : SHOW_DELAY_MS;
    const timer = window.setTimeout(() => setPhase("open"), delay);
    return () => window.clearTimeout(timer);
  }, [mounted, isHome, introReady, phase]);

  useEffect(() => {
    if (phase !== "strip") {
      setStripContentReady(false);
      return;
    }

    const frame = requestAnimationFrame(() => setStripContentReady(true));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const closeToStrip = useCallback(() => {
    setPhase("strip");
  }, []);

  const dismissStrip = useCallback(() => {
    if (stripExiting) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("dismissed");
      return;
    }

    setStripExiting(true);
    window.setTimeout(() => {
      setPhase("dismissed");
      setStripExiting(false);
    }, STRIP_EXIT_MS);
  }, [stripExiting]);

  useEffect(() => {
    if (phase !== "open") return;

    const unlockScroll = lockPageScroll();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeToStrip();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [phase, closeToStrip]);

  if (!isHome || !mounted || phase === "dismissed" || phase === "waiting") {
    return null;
  }

  return (
    <>
      {phase === "strip" ? (
        <div
          className="announcement-strip-slot is-expanded relative w-full"
          style={
            {
              "--announcement-strip-height": `${STRIP_HEIGHT}px`,
            } as CSSProperties
          }
        >
          <div
            role="status"
            className={`flex min-h-11 w-full items-center gap-2 px-2 py-2.5 text-white sm:gap-3 sm:px-6 md:px-8 ${
              stripExiting
                ? "announcement-strip-full-exit"
                : "announcement-strip-full-enter"
            }`}
            style={{ background: STRIP_GRADIENT }}
          >
            <div
              className={`min-w-0 flex-1 overflow-hidden sm:hidden ${
                stripContentReady ? "announcement-strip-content-in" : "opacity-0"
              }`}
            >
              <div className="announcement-strip-marquee">
                <div className="announcement-strip-marquee-track">
                  <StripSegments className="font-sans text-[11px] font-regular tracking-wide" />
                  <StripSegments
                    className="font-sans text-[11px] font-regular tracking-wide"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <p
              className={`hidden min-w-0 flex-1 items-center justify-center gap-x-2 overflow-hidden text-center font-sans text-[11px] font-regular tracking-wide sm:flex sm:gap-x-3 sm:text-xs md:text-sm ${
                stripContentReady ? "announcement-strip-content-in" : "opacity-0"
              }`}
            >
              <StripSegments />
            </p>

            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={dismissStrip}
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white ${
                stripContentReady ? "announcement-strip-content-in" : "opacity-0"
              }`}
              style={{ animationDelay: "80ms" }}
            >
              <RiCloseLine className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      {phase === "open" && typeof document !== "undefined"
        ? createPortal(
            <div
              data-lenis-prevent
              className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
              role="presentation"
            >
              <div
                className="way-modal-overlay-enter fixed inset-0 bg-black/55 backdrop-blur-[6px]"
                aria-hidden
                onClick={closeToStrip}
              />

              <div
                className="relative z-10 flex min-h-full items-center justify-center p-3 sm:p-5 sm:pb-8 md:p-8"
                onClick={closeToStrip}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="announcement-title"
                  aria-describedby="announcement-body"
                  className="way-modal-panel-enter way-modal-panel relative w-full max-w-[min(100%,90rem)] overflow-hidden rounded-[20px] shadow-[0_24px_80px_rgba(10,20,59,0.18)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={closeToStrip}
                    className="absolute right-3 top-3 z-20 flex size-10 items-center justify-center rounded-sm border border-black/10 bg-white/90 text-[#0a143b] backdrop-blur-sm transition-colors hover:bg-white sm:right-4 sm:top-4"
                    aria-label="Close announcement"
                  >
                    <RiCloseLine size={20} />
                  </button>

                  <h2 id="announcement-title" className="sr-only">
                    {ANNOUNCEMENT.title}
                  </h2>
                  <p id="announcement-body" className="sr-only">
                    {ANNOUNCEMENT.body}
                  </p>

                  <Link
                    href={ANNOUNCEMENT.ctaHref}
                    className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322696]"
                    aria-label={ANNOUNCEMENT.ctaLabel}
                  >
                    <Image
                      src={BANNER_ASSETS.mobile}
                      alt={ANNOUNCEMENT.title}
                      width={382}
                      height={561}
                      className="h-auto w-full md:hidden"
                      sizes="100vw"
                      priority
                    />
                    <Image
                      src={BANNER_ASSETS.desktop}
                      alt=""
                      width={1440}
                      height={520}
                      className="hidden h-auto w-full md:block"
                      sizes="(min-width: 768px) min(100vw, 90rem), 100vw"
                      priority
                      aria-hidden
                    />
                  </Link>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
