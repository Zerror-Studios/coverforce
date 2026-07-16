"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine } from "@remixicon/react";
import { useForm } from "react-hook-form";
import { useRequestDemo } from "@/contexts/RequestDemoContext";
import {
  LobCheckboxField,
  PhoneField,
  SelectField,
  TextInputField,
  YesNoField,
} from "@/components/request-demo/RequestDemoFields";
import {
  LOB_OPTIONS,
  REQUEST_DEMO_DEFAULT_VALUES,
  REQUEST_DEMO_STEP_FIELDS,
  type RequestDemoFormValues,
} from "@/types/requestDemo";
import { WAY_MODAL_CLOSE_TOTAL_MS, prefersReducedMotion } from "@/lib/wayModalMotion";
import { lockPageScroll } from "@/lib/scrollLock";

const TOTAL_STEPS = 4;

const startupTypeOptions = [
  { value: "digital-brokerage", label: "Digital Brokerage" },
  { value: "insurtech", label: "InsurTech" },
  { value: "mga", label: "MGA" },
  { value: "agency", label: "Traditional Agency" },
  { value: "other", label: "Other" },
];

const fundraisingOptions = [
  { value: "pre-seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b-plus", label: "Series B+" },
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "na", label: "N/A" },
];

const bookSizeOptions = [
  { value: "under-1m", label: "Under $1M" },
  { value: "1m-5m", label: "$1M – $5M" },
  { value: "5m-25m", label: "$5M – $25M" },
  { value: "25m-plus", label: "$25M+" },
];

const licenseOptions = [
  { value: "both", label: "Yes – Individual and Entity" },
  { value: "individual", label: "Yes – Individual only" },
  { value: "entity", label: "Yes – Entity only" },
  { value: "no", label: "No" },
];

const appointmentOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "in-progress", label: "In progress" },
];

export default function RequestDemoModal() {
  const { isOpen, close } = useRequestDemo();
  const [isClosing, setIsClosing] = useState(false);
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestDemoFormValues>({
    defaultValues: REQUEST_DEMO_DEFAULT_VALUES,
    mode: "onTouched",
  });

  const visible = isOpen || isClosing;

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const finishClose = useCallback(() => {
    setIsClosing(false);
    close();
    setStep(1);
    setSubmitError(null);
    reset(REQUEST_DEMO_DEFAULT_VALUES);
  }, [close, reset]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
  }, [isClosing]);

  useEffect(() => {
    if (!isClosing) return;

    const duration = prefersReducedMotion() ? 0 : WAY_MODAL_CLOSE_TOTAL_MS;

    const onEnd = (event: AnimationEvent) => {
      if (event.target !== overlayRef.current) return;
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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, handleClose]);

  const goNext = async () => {
    if (step >= TOTAL_STEPS) return;

    const fields = REQUEST_DEMO_STEP_FIELDS[step];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) return;

    if (step === 3) {
      await handleSubmit(onSubmit)();
      return;
    }

    setStep((current) => current + 1);
  };

  const goPrevious = () => {
    if (step <= 1) return;
    setSubmitError(null);
    setStep((current) => current - 1);
  };

  const onSubmit = async (data: RequestDemoFormValues) => {
    setSubmitError(null);

    try {
      const response = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setStep(4);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  if (!visible || typeof document === "undefined") return null;

  const progress = step === 4 ? 100 : (step / TOTAL_STEPS) * 100;
  const overlayAnim = isClosing ? "way-modal-overlay-exit" : "way-modal-overlay-enter";
  const panelAnim = isClosing ? "way-modal-panel-exit" : "way-modal-panel-enter";

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[200] overflow-hidden overscroll-contain"
      role="presentation"
    >
      <div
        ref={overlayRef}
        className={`${overlayAnim} fixed inset-0 bg-[#0a143b]/55 backdrop-blur-[2px]`}
        aria-hidden
        onClick={handleClose}
      />

      <div
        className="relative z-10 flex min-h-full items-end justify-center p-4 pb-6 sm:items-center sm:p-6 sm:pb-8"
        onClick={handleClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-demo-title"
          className={`${panelAnim} way-modal-panel relative flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-[0_24px_80px_rgba(10,20,59,0.18)]`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-sm border border-[#535353]/15 bg-white text-[#0a143b] transition-colors hover:bg-[#F5F7FA] sm:right-5 sm:top-5"
            aria-label="Close"
          >
            <RiCloseLine size={20} />
          </button>

          <div
            data-lenis-prevent
            className="overflow-y-auto overscroll-contain px-6 pb-8 pt-14 sm:px-10 sm:pb-10 sm:pt-16"
          >
            {step < 4 ? (
              <>
                <div className="way-modal-reveal-slot">
                  <div
                    className="way-modal-reveal"
                    style={{ "--way-modal-stagger": "0ms" } as CSSProperties}
                  >
                    <h2
                      id="request-demo-title"
                      className="max-w-2xl font-heading text-2xl font-medium leading-tight text-[#2B409E] sm:text-[2rem]"
                    >
                      Request Access to our API Documentation
                    </h2>
                  </div>
                </div>

                {step === 1 ? (
                  <div className="way-modal-reveal-slot mt-5">
                    <div
                      className="way-modal-reveal space-y-4 font-sans text-sm leading-[1.7] text-[#3D3D3D]"
                      style={{ "--way-modal-stagger": "60ms" } as CSSProperties}
                    >
                      <p>
                        CoverForce provides API infrastructure to quote and bind commercial insurance
                        with 40+ carriers. Complete this form to request access to our developer
                        documentation and sandbox environment.
                      </p>
                      <p>
                        <span className="font-medium">Access is granted upon request.</span> Our team
                        reviews each submission to ensure the right fit for your use case.
                      </p>
                    </div>
                  </div>
                ) : null}

                <form className="way-modal-reveal-slot mt-8" onSubmit={(event) => event.preventDefault()}>
                  <div
                    className="way-modal-reveal space-y-5"
                    style={{ "--way-modal-stagger": "120ms" } as CSSProperties}
                  >
                    {step === 1 ? (
                      <>
                        <TextInputField
                          register={register}
                          name="firstName"
                          label="First Name"
                          placeholder="Enter first name"
                          required
                          error={errors.firstName}
                        />
                        <TextInputField
                          register={register}
                          name="lastName"
                          label="Last Name"
                          placeholder="Enter last name"
                          required
                          error={errors.lastName}
                        />
                        <TextInputField
                          register={register}
                          name="email"
                          label="Email"
                          placeholder="Enter email address"
                          type="email"
                          required
                          error={errors.email}
                        />
                        <p className="font-sans text-xs italic leading-relaxed text-[#9AA8BC]">
                          Current CoverForce customers — please reach out to support@coverforce.com or
                          your Customer Support Manager for prompt help.
                        </p>
                      </>
                    ) : null}

                    {step === 2 ? (
                      <>
                        <PhoneField control={control} phoneError={errors.phoneNumber} />
                        <TextInputField
                          register={register}
                          name="companyName"
                          label="Company name"
                          placeholder="Enter company name"
                          required
                          error={errors.companyName}
                        />
                        <TextInputField
                          register={register}
                          name="jobTitle"
                          label="Job Title"
                          placeholder="Enter job title"
                          required
                          error={errors.jobTitle}
                        />
                        <YesNoField
                          register={register}
                          name="digitalBrokerageStartup"
                          label="Are you a digital brokerage startup?"
                          error={errors.digitalBrokerageStartup}
                        />
                      </>
                    ) : null}

                    {step === 3 ? (
                      <>
                        <SelectField
                          register={register}
                          name="startupType"
                          label="Startup Type"
                          required
                          error={errors.startupType}
                          options={startupTypeOptions}
                        />
                        <SelectField
                          register={register}
                          name="fundraisingStage"
                          label="Startup Fundraising Stage"
                          required
                          error={errors.fundraisingStage}
                          options={fundraisingOptions}
                        />
                        <YesNoField
                          register={register}
                          name="existingBook"
                          label="Do you have an existing agency/brokerage with an active book?"
                          error={errors.existingBook}
                        />
                        <SelectField
                          register={register}
                          name="bookSize"
                          label="How big is your existing book ($ in GWP)?"
                          required
                          error={errors.bookSize}
                          options={bookSizeOptions}
                        />
                        <SelectField
                          register={register}
                          name="pcLicense"
                          label="Do you have an individual and an entity level P&C license?"
                          required
                          error={errors.pcLicense}
                          options={licenseOptions}
                        />
                        <SelectField
                          register={register}
                          name="carrierAppointments"
                          label="Do you have direct carrier appointments?"
                          required
                          error={errors.carrierAppointments}
                          options={appointmentOptions}
                        />
                        <TextInputField
                          register={register}
                          name="appointedCarriers"
                          label="Which carriers are you appointed with?"
                          placeholder="Enter carrier names"
                          error={errors.appointedCarriers}
                        />
                        <LobCheckboxField
                          register={register}
                          options={LOB_OPTIONS}
                          error={errors.lobs}
                        />
                        <TextInputField
                          register={register}
                          name="wholesalerNetwork"
                          label="Which wholesaler, MGA, or agency network do you work with for market access today?"
                          placeholder="Enter wholesaler, MGA, or network"
                          required
                          error={errors.wholesalerNetwork}
                        />
                      </>
                    ) : null}
                  </div>
                </form>
              </>
            ) : (
              <div className="py-6 sm:py-10">
                <div className="way-modal-reveal-slot">
                  <div
                    className="way-modal-reveal"
                    style={{ "--way-modal-stagger": "0ms" } as CSSProperties}
                  >
                    <h2
                      id="request-demo-title"
                      className="font-heading text-2xl font-medium leading-tight text-[#2B409E] sm:text-[2rem]"
                    >
                      Thanks for your request
                    </h2>
                    <p className="mt-5 max-w-2xl font-sans text-sm leading-[1.7] text-[#3D3D3D] sm:text-base">
                      Our team will review your submission and reach out shortly with access to the API
                      documentation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#E8ECF0] bg-white px-6 py-5 sm:px-10">
            {step < 4 ? (
              <>
                <p className="font-heading text-sm font-medium text-[#2B409E]">
                  {step}/{TOTAL_STEPS}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E8ECF0]">
                  <div
                    className="h-full rounded-full bg-[#121C49] transition-[width] duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {submitError ? (
                  <p className="mt-3 font-sans text-xs text-red-600">{submitError}</p>
                ) : null}

                <div className="mt-5 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goPrevious}
                      className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-[5px] bg-[#121C49] px-6 font-heading text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      Previous
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isSubmitting}
                    className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-[5px] bg-[#121C49] px-6 font-heading text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {step === 3 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-[5px] bg-[#121C49] px-6 font-heading text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}