"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";

import type { WayCardModalContent } from "@/data/wayCardModals";
import { CARD_BACKGROUNDS, type CardBackground } from "@/data/wayCardStyles";
import { WAY_MODAL_CLOSE_TOTAL_MS, prefersReducedMotion } from "@/lib/wayModalMotion";
import Button from "@/components/common/Button";
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

  contentRef.current = content;
  previewNodeRef.current = preview;
  labelRef.current = label;
  backgroundRef.current = background;
  variantRef.current = variant;
  dotGridRef.current = dotGrid;
  backgroundSceneRef.current = backgroundScene;
  backgroundSceneBlendScreenRef.current = backgroundSceneBlendScreen;

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

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, handleClose]);

  if (!visible || !stored || typeof document === "undefined") return null;

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
            <div className="flex items-start justify-between gap-8 pr-8 sm:pr-10">
              <div className="min-w-0 flex-1">
                {stored.label ? (
                  <div className="way-modal-reveal-slot">
                    <div
                      className="way-modal-reveal"
                      style={{ "--way-modal-stagger": "0ms" } as CSSProperties}
                    >
                      <EyebrowPill surface="light" className="mb-0">
                        {stored.label}
                      </EyebrowPill>
                    </div>
                  </div>
                ) : null}
                <div className={`way-modal-reveal-slot ${stored.label ? "mt-5" : ""}`}>
                  <div
                    className="way-modal-reveal"
                    style={{ "--way-modal-stagger": "60ms" } as CSSProperties}
                  >
                    <h2
                      id="way-card-modal-title"
                      className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#0a143b] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                    >
                      {stored.content.title}
                    </h2>
                    <div className="mt-6 h-10">
                      <Button href={stored.content.primaryCta.href}>
                        {stored.content.primaryCta.label}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="way-modal-reveal-slot mt-4 max-w-md shrink-0">
                <div
                  className="way-modal-reveal"
                  style={{ "--way-modal-stagger": "90ms" } as CSSProperties}
                >
                  <p className="font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]">
                    {stored.content.description}
                  </p>
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
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[#4F63E8]/20 bg-[#4F63E8]/8 text-[#4F63E8]">
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
            className={`relative overflow-hidden border-t border-[#535353]/10 px-6 py-12 sm:px-10 sm:py-14 ${
              stored.background ? CARD_BACKGROUNDS[stored.background] : "bg-[#F5F7FA]"
            }`}
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
            <div className="way-modal-preview-slot pointer-events-none relative z-10 mx-auto flex h-[300px] w-full max-w-[820px] items-center justify-center sm:h-[360px] [&>*]:!relative [&>*]:!top-auto [&>*]:!right-auto [&>*]:!bottom-auto [&>*]:!left-auto [&>*]:mx-auto [&>*]:scale-[1.1] sm:[&>*]:scale-[1.2]">
              {stored.preview}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
