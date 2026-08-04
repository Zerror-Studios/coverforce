"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";

import type { WayCardModalContent } from "@/data/wayCardModals";
import {
  CARD_BACKGROUND_STYLES,
  CARD_UI_GRADIENT_STYLES,
  type CardBackground,
} from "@/data/wayCardStyles";
import { WAY_MODAL_CLOSE_TOTAL_MS, prefersReducedMotion } from "@/lib/wayModalMotion";
import { lockPageScroll } from "@/lib/scrollLock";
import RequestDemoCta from "@/components/request-demo/RequestDemoCta";
import EyebrowPill from "@/components/common/EyebrowPill";
import dynamic from "next/dynamic";

const WayCardDotGridScene = dynamic(() => import("./WayCardDotGridScene"), {
  ssr: false,
  loading: () => null,
});

type WayCardModalProps = {
  open: boolean;
  content: WayCardModalContent | null;
  preview: ReactNode;
  label?: string;
  background?: CardBackground;
  variant?: "dark" | "light";
  dotGrid?: boolean;
  backgroundScene?: ReactNode;
  backgroundSceneBlendScreen?: boolean;
  previewAlign?: "center" | "right";
  onClose: () => void;
};

type StoredModal = {
  content: WayCardModalContent;
  preview: ReactNode;
  label?: string;
  background?: CardBackground;
  variant: "dark" | "light";
  dotGrid?: boolean;
  backgroundScene?: ReactNode;
  backgroundSceneBlendScreen?: boolean;
  previewAlign: "center" | "right";
};

export default function WayCardModal({
  open,
  content,
  preview,
  label,
  background,
  variant = "light",
  dotGrid,
  backgroundScene,
  backgroundSceneBlendScreen,
  previewAlign = "center",
  onClose,
}: WayCardModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [stored, setStored] = useState<StoredModal | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  const previewNodeRef = useRef(preview);
  const labelRef = useRef(label);
  const backgroundRef = useRef(background);
  const variantRef = useRef(variant);
  const dotGridRef = useRef(dotGrid);
  const backgroundSceneRef = useRef(backgroundScene);
  const backgroundSceneBlendScreenRef = useRef(backgroundSceneBlendScreen);
  const previewAlignRef = useRef(previewAlign);

  contentRef.current = content;
  previewNodeRef.current = preview;
  labelRef.current = label;
  backgroundRef.current = background;
  variantRef.current = variant;
  dotGridRef.current = dotGrid;
  backgroundSceneRef.current = backgroundScene;
  backgroundSceneBlendScreenRef.current = backgroundSceneBlendScreen;
  previewAlignRef.current = previewAlign;

  useEffect(() => {
    if (!open || !contentRef.current) return;

    setStored({
      content: contentRef.current,
      preview: previewNodeRef.current,
      label: labelRef.current,
      background: backgroundRef.current,
      variant: variantRef.current,
      dotGrid: dotGridRef.current,
      backgroundScene: backgroundSceneRef.current,
      backgroundSceneBlendScreen: backgroundSceneBlendScreenRef.current,
      previewAlign: previewAlignRef.current,
    });
    setIsClosing(false);
  }, [open]);

  const visible = (open || isClosing) && stored !== null;

  const finishClose = useCallback(() => {
    setIsClosing(false);
    setStored(null);
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (isClosing || !stored) return;
    setIsClosing(true);
  }, [isClosing, stored]);

  useEffect(() => {
    if (!isClosing) return;

    const duration = prefersReducedMotion() ? 0 : WAY_MODAL_CLOSE_TOTAL_MS;

    const onEnd = (e: AnimationEvent) => {
      if (e.target !== overlayRef.current) return;
      finishClose();
    };

    const overlay = overlayRef.current;
    if (duration === 0) {
      finishClose();
      return;
    }

    const fallback = window.setTimeout(finishClose, duration + 80);
    overlay?.addEventListener("animationend", onEnd);

    return () => {
      window.clearTimeout(fallback);
      overlay?.removeEventListener("animationend", onEnd);
    };
  }, [isClosing, finishClose]);

  useEffect(() => {
    if (!visible) return;

    const unlockScroll = lockPageScroll();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, handleClose]);

  if (!visible || !stored || typeof document === "undefined") return null;

  const cardBackground = stored.background ?? "light";
  const chromeGradient = CARD_UI_GRADIENT_STYLES[cardBackground];

  const overlayAnim = isClosing ? "way-modal-overlay-exit" : "way-modal-overlay-enter";
  const panelAnim = isClosing ? "way-modal-panel-exit" : "way-modal-panel-enter";

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
      role="presentation"
    >
      <div
        ref={overlayRef}
        className={`${overlayAnim} fixed inset-0 bg-[rgb(229_237_245/0.92)] backdrop-blur-[8px]`}
        aria-hidden
        onClick={handleClose}
      />

      <div
        className="relative z-10 flex min-h-full items-end justify-center p-4 pb-6 sm:items-center sm:p-6 sm:pb-8 md:p-10"
        onClick={handleClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="way-card-modal-title"
          className={`${panelAnim} way-modal-panel relative w-full max-w-[1080px] overflow-hidden border border-[#535353]/10 bg-white shadow-[0_24px_80px_rgba(10,20,59,0.14)]`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-5 top-5 z-20 flex size-10 items-center justify-center rounded-sm border border-[#535353]/15 bg-white text-[#0a143b] transition-colors hover:bg-[#F5F7FA] sm:right-6 sm:top-6"
            aria-label="Close"
          >
            <RiCloseLine size={20} />
          </button>

          <div className="px-6 pb-8 pt-14 sm:px-10 sm:pb-10 sm:pt-16 lg:px-12 lg:pb-12">
            <div className="flex flex-col gap-5 pr-8 sm:pr-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-8 lg:gap-y-5">
              {stored.label ? (
                <div className="way-modal-reveal-slot order-1 lg:col-start-1 lg:row-start-1">
                  <div
                    className="way-modal-reveal"
                    style={{ "--way-modal-stagger": "0ms" } as CSSProperties}
                  >
                    <EyebrowPill surface="light" background={chromeGradient} className="mb-0">
                      {stored.label}
                    </EyebrowPill>
                  </div>
                </div>
              ) : null}

              <div className="way-modal-reveal-slot order-2 lg:col-start-1 lg:row-start-2">
                <div
                  className="way-modal-reveal"
                  style={{ "--way-modal-stagger": "60ms" } as CSSProperties}
                >
                  <h2
                    id="way-card-modal-title"
                    className="max-w-xl text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                  >
                    {stored.content.title}
                  </h2>
                </div>
              </div>

              <div className="way-modal-reveal-slot order-3 max-w-md lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-1 lg:justify-self-end">
                <div
                  className="way-modal-reveal"
                  style={{ "--way-modal-stagger": "90ms" } as CSSProperties}
                >
                  <p className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]">
                    {stored.content.description}
                  </p>
                </div>
              </div>

              <div className="way-modal-reveal-slot order-4 p-px lg:col-start-1 lg:row-start-3">
                <div
                  className="way-modal-reveal"
                  style={{ "--way-modal-stagger": "120ms" } as CSSProperties}
                >
                  <div className="flex min-h-10 flex-wrap items-center gap-3">
                    <RequestDemoCta
                      label={stored.content.primaryCta.label}
                      href={stored.content.primaryCta.href}
                      className="!border-0 !text-white"
                      style={{ background: chromeGradient }}
                    />
                    <RequestDemoCta
                      label={stored.content.secondaryCta.label}
                      href={stored.content.secondaryCta.href}
                      variant="secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <ul className="mt-10 space-y-3 border-t border-[#535353]/10 pt-8 sm:mt-12">
              {stored.content.features.map((feature, index) => (
                <li key={feature}>
                  <div className="way-modal-reveal-slot">
                    <div
                      className="way-modal-reveal flex items-start gap-2.5"
                      style={{ "--way-modal-stagger": `${180 + index * 55}ms` } as CSSProperties}
                    >
                      <span
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ background: chromeGradient }}
                      >
                        <RiCheckLine size={11} />
                      </span>
                      <span className="font-sans text-xs font-regular leading-[1.45] text-[#50617a] md:text-sm">
                        {feature}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`relative overflow-hidden border-t border-[#535353]/10 pt-14 pb-12 sm:py-14 ${
              stored.previewAlign === "right"
                ? "pl-6 pr-0 sm:pl-10"
                : "px-6 sm:px-10"
            }`}
            style={{
              background: stored.background
                ? CARD_BACKGROUND_STYLES[stored.background]
                : "#F5F7FA",
            }}
          >
            {stored.dotGrid ? (
              <WayCardDotGridScene variant={stored.variant} active track="window" />
            ) : null}
            {stored.backgroundScene ? (
              <div
                className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
                style={
                  stored.backgroundSceneBlendScreen
                    ? { mixBlendMode: "screen" }
                    : undefined
                }
                aria-hidden
              >
                {stored.backgroundScene}
              </div>
            ) : null}
            <div
              className={`way-modal-preview-slot pointer-events-none relative z-10 h-[300px] w-full sm:h-[360px] ${
                stored.previewAlign === "right"
                  ? ""
                  : "mx-auto flex max-w-[820px] items-center justify-center max-md:[&>*]:scale-[0.82] md:[&>*]:scale-100 [&>*]:!relative [&>*]:!inset-auto [&>*]:!top-auto [&>*]:!right-auto [&>*]:!bottom-auto [&>*]:!left-auto [&>*]:!translate-x-0 [&>*]:!translate-y-0"
              }`}
            >
              {stored.preview}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
