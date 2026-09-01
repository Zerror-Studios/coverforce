"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { RiCloseLine } from "@remixicon/react";
import { WAY_MODAL_CLOSE_TOTAL_MS, prefersReducedMotion } from "@/lib/wayModalMotion";
import { lockPageScroll } from "@/lib/scrollLock";
import Button from "@/components/common/Button";

export type ReportDownloadModalData = {
  title: string;
  bullets: string[];
  formTitle: string;
  consentLabel: string;
  consentFinePrint: string;
  submitLabel: string;
};

type ReportDownloadModalProps = {
  open: boolean;
  content: ReportDownloadModalData;
  blogSlug: string;
  onClose: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  companyEmail: string;
  consent: boolean;
};

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  companyEmail: "",
  consent: false,
};

const formBorderClassName = "border-white/30";

const MODAL_HEADING_CLASS =
  "font-heading text-xl font-medium leading-[1.15] tracking-tight sm:text-2xl sm:leading-[1.12] md:text-3xl md:leading-[1.12] lg:text-[1.625rem] lg:leading-[1.12] xl:text-[1.75rem] xl:leading-[1.12]";

const MODAL_SUBHEADING_CLASS =
  "font-heading max-w-full text-base font-medium leading-snug tracking-tight  sm:text-lg sm:leading-snug md:text-xl md:leading-[1.12] lg:text-xl xl:text-[1.375rem] xl:leading-[1.12]";

const MODAL_BODY_CLASS =
  "font-sans text-sm leading-[1.7] sm:text-[0.9375rem] sm:leading-[1.75]";

const MODAL_CAPTION_CLASS =
  "font-sans text-[0.6875rem] leading-relaxed sm:text-xs sm:leading-relaxed";

const inputClassName =
  `report-download-input w-full rounded-md border ${formBorderClassName} bg-white/10 px-3 py-2 sm:py-2.5 ${MODAL_BODY_CLASS} text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none backdrop-blur-sm transition-colors placeholder:text-white/35 focus:bg-white/15`;

const labelClassName = `mb-1 block sm:mb-1.5 ${MODAL_CAPTION_CLASS} font-medium text-white`;

const formMetaClassName = MODAL_CAPTION_CLASS;

const formGlassClassName =
  `rounded-lg border ${formBorderClassName} bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md backdrop-saturate-150 sm:rounded-xl sm:p-4 md:p-5`;

export default function ReportDownloadModal({
  open,
  content,
  blogSlug,
  onClose,
}: ReportDownloadModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [stored, setStored] = useState<ReportDownloadModalData | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  const [formContentMinHeight, setFormContentMinHeight] = useState<number>();
  contentRef.current = content;

  useLayoutEffect(() => {
    if (!open) return;

    setStored(contentRef.current);
    setIsClosing(false);
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setForm(EMPTY_FORM);
    setFormContentMinHeight(undefined);
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

  useLayoutEffect(() => {
    if (!open && !isClosing) return;

    const unlockScroll = lockPageScroll();
    return unlockScroll;
  }, [open, isClosing]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, handleClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formContentRef.current) {
      setFormContentMinHeight(formContentRef.current.offsetHeight);
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const hutk =
        typeof document !== "undefined"
          ? document.cookie
              .split("; ")
              .find((row) => row.startsWith("hubspotutk="))
              ?.split("=")[1]
          : undefined;

      const response = await fetch("/api/request-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.companyEmail,
          companyName: form.companyName,
          blogSlug,
          pageUri: typeof window !== "undefined" ? window.location.href : undefined,
          pageName: "Report Downloads",
          hutk,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Something went wrong. Please try again.",
        );
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible || !stored || typeof document === "undefined") return null;

  const overlayAnim = isClosing ? "way-modal-overlay-exit" : "way-modal-overlay-enter";
  const panelAnim = isClosing ? "way-modal-panel-exit" : "way-modal-panel-enter";

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="presentation"
    >
      <div
        ref={overlayRef}
        className={`${overlayAnim} fixed inset-0 bg-[rgb(10_20_59/0.72)] backdrop-blur-[10px]`}
        aria-hidden
        onClick={handleClose}
      />

      <div
        className="relative z-10 flex min-h-full items-end justify-center px-3 pb-10 pt-8 sm:items-center sm:p-5 sm:pb-7 md:p-8 md:pb-9 lg:p-10 xl:p-10"
        onClick={handleClose}
      >
        <div className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[980px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute right-3 top-0 z-30 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0a143b] shadow-[0_8px_24px_rgba(10,20,59,0.18)] transition-colors hover:bg-[#F5F7FA] sm:right-0 sm:size-8 sm:translate-x-1/2 md:size-8"
            aria-label="Close"
          >
            <RiCloseLine className="size-3.5 sm:size-4" aria-hidden />
          </button>

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-download-modal-title"
            className={`${panelAnim} way-modal-panel relative w-full overflow-hidden rounded-xl shadow-[0_28px_90px_rgba(10,20,59,0.45)] sm:rounded-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/images/outer-bg.png"
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 640px) calc(100vw - 1.5rem), (max-width: 1024px) 672px, 980px"
            />

            <div className="relative z-10 grid grid-cols-1 gap-6 px-4 py-8 sm:gap-7 sm:px-6 sm:py-10 md:gap-8 md:px-8 md:py-12 lg:grid-cols-[minmax(0,32fr)_minmax(0,55fr)] lg:items-stretch lg:gap-8 lg:px-10 lg:py-12 xl:grid-cols-[minmax(0,30fr)_minmax(0,52fr)] xl:gap-10 xl:px-12 xl:py-14">
              <div className="flex flex-col lg:min-h-full">
                <div className="way-modal-reveal-slot">
                  <div
                    className="way-modal-reveal"
                    style={{ "--way-modal-stagger": "0ms" } as CSSProperties}
                  >
                    <h2
                      id="report-download-modal-title"
                      className={`max-w-none sm:max-w-[16rem] lg:max-w-xs ${MODAL_HEADING_CLASS} text-white`}
                    >
                      {stored.title}
                    </h2>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4 lg:mt-auto lg:max-w-xs">
                  {stored.bullets.map((bullet, index) => (
                    <li key={bullet}>
                      <div className="way-modal-reveal-slot">
                        <div
                          className="way-modal-reveal flex items-start gap-3"
                          style={
                            {
                              "--way-modal-stagger": `${80 + index * 55}ms`,
                            } as CSSProperties
                          }
                        >
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-white/80"
                            aria-hidden
                          />
                          <span className={`${MODAL_BODY_CLASS} text-white/85`}>
                            {bullet}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="way-modal-reveal-slot w-full lg:mt-0 lg:max-w-[27rem] lg:justify-self-end xl:mt-1 xl:max-w-[29rem]">
                <div
                  className="way-modal-reveal w-full"
                  style={{ "--way-modal-stagger": "120ms" } as CSSProperties}
                >
                  <div className={`relative w-full overflow-hidden rounded-lg sm:rounded-xl ${formGlassClassName}`}>
                   

                    <div className="relative z-10 overflow-hidden rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-5">
                    <Image
                      src="/images/inner-bg.png"
                      alt=""
                      fill
                      className="-z-1 object-cover object-center"
                      sizes="(max-width: 1024px) min(100vw - 2.5rem, 432px), 464px"
                    />
                      <div
                        ref={formContentRef}
                        className={
                          submitted
                            ? "flex items-center justify-center text-center"
                            : ""
                        }
                        style={
                          formContentMinHeight
                            ? ({ minHeight: formContentMinHeight } as CSSProperties)
                            : undefined
                        }
                      >
                        {!submitted ? (
                          <p className={`${MODAL_SUBHEADING_CLASS} text-white`}>
                            {stored.formTitle}
                          </p>
                        ) : null}

                        {submitted ? (
                          <p className={`${MODAL_BODY_CLASS} text-white/90`}>
                            Thank you. Your download link will be sent to{" "}
                            <span className="font-medium text-white">{form.companyEmail}</span>.
                          </p>
                        ) : (
                          <form
                            className="mt-4 space-y-3.5 sm:mt-6 sm:space-y-4"
                            onSubmit={handleSubmit}
                          >
                          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                            <div>
                              <label className={labelClassName} htmlFor="report-first-name">
                                First name*
                              </label>
                              <input
                                id="report-first-name"
                                name="firstName"
                                type="text"
                                required
                                autoComplete="given-name"
                                value={form.firstName}
                                onChange={(e) =>
                                  setForm((prev) => ({ ...prev, firstName: e.target.value }))
                                }
                                className={inputClassName}
                              />
                            </div>
                            <div>
                              <label className={labelClassName} htmlFor="report-last-name">
                                Last name*
                              </label>
                              <input
                                id="report-last-name"
                                name="lastName"
                                type="text"
                                required
                                autoComplete="family-name"
                                value={form.lastName}
                                onChange={(e) =>
                                  setForm((prev) => ({ ...prev, lastName: e.target.value }))
                                }
                                className={inputClassName}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={labelClassName} htmlFor="report-company-email">
                              Email*
                            </label>
                            <input
                              id="report-company-email"
                              name="companyEmail"
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              required
                              value={form.companyEmail}
                              onChange={(e) =>
                                setForm((prev) => ({ ...prev, companyEmail: e.target.value }))
                              }
                              className={inputClassName}
                            />
                          </div>

                          <div>
                            <label className={labelClassName} htmlFor="report-company-name">
                              Company name*
                            </label>
                            <input
                              id="report-company-name"
                              name="companyName"
                              type="text"
                              required
                              autoComplete="organization"
                              value={form.companyName}
                              onChange={(e) =>
                                setForm((prev) => ({ ...prev, companyName: e.target.value }))
                              }
                              className={inputClassName}
                            />
                          </div>

                          <label className="flex cursor-pointer items-start gap-2.5">
                            <input
                              type="checkbox"
                              name="consent"
                              required
                              checked={form.consent}
                              onChange={(e) =>
                                setForm((prev) => ({ ...prev, consent: e.target.checked }))
                              }
                              className={`mt-0.5 size-4 shrink-0 rounded border ${formBorderClassName} bg-transparent accent-white`}
                            />
                            <span className={`${formMetaClassName} text-white`}>
                              {stored.consentLabel}
                            </span>
                          </label>

                          <p className={`${formMetaClassName} text-white`}>
                            {stored.consentFinePrint}
                          </p>

                          <Button
                            type="submit"
                            surface="on-dark"
                            balanced
                            disabled={isSubmitting}
                            className="mt-2 !w-full max-w-none justify-center hover:bg-[#F5F7FA]"
                          >
                            {isSubmitting ? "Submitting..." : stored.submitLabel}
                          </Button>

                          {submitError ? (
                            <p className={`${formMetaClassName} text-red-200`}>
                              {submitError}
                            </p>
                          ) : null}
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
