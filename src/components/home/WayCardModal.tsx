"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { RiArrowRightSLine, RiCheckLine, RiCloseLine } from "@remixicon/react";

import type { WayCardModalContent } from "@/data/wayCardModals";
import { WAY_MODAL_CLOSE_TOTAL_MS, prefersReducedMotion } from "@/lib/wayModalMotion";
import Button from "@/components/common/Button";

type WayCardModalProps = {
  open: boolean;
  content: WayCardModalContent | null;
  preview: ReactNode;
  onClose: () => void;
};

type StoredModal = {
  content: WayCardModalContent;
  preview: ReactNode;
};

export default function WayCardModal({
  open,
  content,
  preview,
  onClose,
}: WayCardModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [stored, setStored] = useState<StoredModal | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  const previewNodeRef = useRef(preview);

  contentRef.current = content;
  previewNodeRef.current = preview;

  useEffect(() => {
    if (!open || !contentRef.current) return;

    setStored({
      content: contentRef.current,
      preview: previewNodeRef.current,
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

          <div className="grid gap-10 px-6 pb-8 pt-14 sm:px-10 sm:pb-10 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12 lg:pb-12">
            <div className="space-y-8">
              <div className="space-y-5 pr-8 sm:pr-10">
                <p className="text-sm font-mono font-medium uppercase tracking-[0.14em] text-[#4F63E8]">
                  {stored.content.id}
                </p>
                <h2
                  id="way-card-modal-title"
                  className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#0a143b] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                >
                  {stored.content.title}
                </h2>
                <p className="max-w-xl font-sans text-sm font-regular leading-[1.4] text-[#50617a] md:text-[1.125rem]">
                  {stored.content.description}
                </p>
              </div>

              <Button
                href={stored.content.primaryCta.href}
                variant="outline"
                icon={RiArrowRightSLine}
              >
                {stored.content.primaryCta.label}
              </Button>
            </div>

            <ul className="space-y-4 border-t border-[#535353]/10 pt-8 lg:border-t-0 lg:pt-2">
              {stored.content.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-[#4F63E8]/20 bg-[#4F63E8]/8 text-[#4F63E8]">
                    <RiCheckLine size={14} />
                  </span>
                  <span className="font-sans text-sm font-regular leading-[1.4] text-[#50617a] md:text-[1.0625rem]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#535353]/10 bg-[#F5F7FA] px-6 py-12 sm:px-10 sm:py-14">
            <div className="way-modal-preview-slot pointer-events-none relative mx-auto flex h-[300px] w-full max-w-[820px] items-center justify-center sm:h-[360px] [&>*]:!relative [&>*]:!top-auto [&>*]:!right-auto [&>*]:!bottom-auto [&>*]:!left-auto [&>*]:mx-auto [&>*]:scale-[1.1] sm:[&>*]:scale-[1.2]">
              {stored.preview}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
