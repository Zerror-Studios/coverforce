"use client";
import { getCalApi } from "@calcom/embed-react";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/common/Button";
import Container from "../common/Container";
import { SplitText } from "@/lib/SplitText";
import { getCountries, getCountryCallingCode } from "react-phone-number-input/input";
import { isValidPhoneNumber } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import Flags from "react-phone-number-input/flags";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_EASE = "power3.out";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]{1,49}$/u;

type FormDataState = {
  businessType: string[];
  problems: string;
  bookSize: string;
  fullName: string;
  phoneCode: string;
  countryCode: string;
  phone: string;
  email: string;
  jobTitle: string;
  companyName: string;
  heardAboutUs: string[];
};

type FieldErrors = Partial<Record<keyof FormDataState | "form", string>>;

function buildFullPhone(phoneCode: string, phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `${phoneCode}${digits}`;
}

function validateStep(step: number, data: FormDataState): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1 && data.businessType.length === 0) {
    errors.businessType = "Please select at least one business type.";
  }

  if (step === 2) {
    const problems = data.problems.trim();
    if (!problems) {
      errors.problems = "Please describe what CoverForce would solve.";
    } else if (problems.length < 10) {
      errors.problems = "Please write at least a couple of sentences (10+ characters).";
    }
  }

  if (step === 3 && !data.bookSize.trim()) {
    errors.bookSize = "Please select your book of business size.";
  }

  if (step === 4) {
    const fullName = data.fullName.trim();
    const email = data.email.trim();
    const jobTitle = data.jobTitle.trim();
    const companyName = data.companyName.trim();
    const fullPhone = buildFullPhone(data.phoneCode, data.phone);

    if (!fullName) errors.fullName = "Full name is required.";
    else if (!NAME_PATTERN.test(fullName)) {
      errors.fullName = "Enter a valid full name.";
    }

    if (!data.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!isValidPhoneNumber(fullPhone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!email) errors.email = "Email address is required.";
    else if (!EMAIL_PATTERN.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!jobTitle) errors.jobTitle = "Job title is required.";
    else if (jobTitle.length < 2) {
      errors.jobTitle = "Enter a valid job title.";
    }

    if (!companyName) errors.companyName = "Company name is required.";
    else if (companyName.length < 2) {
      errors.companyName = "Enter a valid company name.";
    }
  }

  if (step === 5 && data.heardAboutUs.length === 0) {
    errors.heardAboutUs = "Please tell us how you heard about us.";
  }

  return errors;
}

function fieldBorderClass(hasError: boolean) {
  return hasError
    ? "border-red-400 focus:border-red-300"
    : "border-white/40 focus:border-white";
}

const ContactForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>({
    businessType: [],
    problems: "",
    bookSize: "",
    fullName: "",
    phoneCode: "+1",
    countryCode: "US",
    phone: "",
    email: "",
    jobTitle: "",
    companyName: "",
    heardAboutUs: [],
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const [borderOpacity, setBorderOpacity] = useState(0);

  const cleanupSplits = () => {
    splitsRef.current.forEach((split) => split.revert());
    splitsRef.current = [];
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#1e2a5e" },
          dark: { "cal-brand": "#ffffff" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        setBorderOpacity(1);
        gsap.set(content, { opacity: 1, y: 0 });
        return;
      }

      cleanupSplits();

      const heading = content.querySelector("[data-heading]");
      const buttonsContainer = content.querySelector("[data-buttons-container]");
      const animateBtns = content.querySelectorAll("[data-animate-btn]");
      const animateFields = content.querySelectorAll("[data-animate-field]");

      const borderProxy = { value: borderOpacity };

      const chars: HTMLSpanElement[] = [];
      if (heading) {
        const lines = heading.querySelectorAll<HTMLElement>("[data-split]");
        lines.forEach((el) => {
          const split = new SplitText(el, {
            type: "chars",
            charsClass: "explore-split-char",
            wordsClass: "explore-split-word",
          });
          splitsRef.current.push(split);
          split.words.forEach((word) => {
            word.style.display = "inline-block";
            word.style.whiteSpace = "nowrap";
          });
          chars.push(...split.chars);
        });
        gsap.set(heading, { opacity: 0 });
        gsap.set(chars, { opacity: 0, y: 14, force3D: true });
      }

      gsap.set(content, { opacity: 1, y: step === 0 ? 48 : 0 });

      if (buttonsContainer && step === 0) gsap.set(buttonsContainer, { opacity: 0, y: 18 });
      if (animateBtns.length) gsap.set(animateBtns, { opacity: 0, y: 30 });
      if (animateFields.length) gsap.set(animateFields, { opacity: 0, y: 30 });

      const reveal = () => {
        gsap.to(borderProxy, {
          value: 1,
          duration: 1,
          ease: REVEAL_EASE,
          onUpdate: () => setBorderOpacity(borderProxy.value),
        });

        if (step === 0) {
          gsap.to(content, { y: 0, duration: 1, ease: REVEAL_EASE });
        }

        if (heading) gsap.set(heading, { opacity: 1 });

        const tl = gsap.timeline({ delay: step === 0 ? 0.2 : 0 });

        if (chars.length) {
          tl.to(chars, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.015,
            ease: "power2.out",
            onComplete: () => gsap.set(chars, { clearProps: "transform" }),
          });
        }

        if (buttonsContainer && step === 0) {
          tl.to(
            buttonsContainer,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              onComplete: () => gsap.set(buttonsContainer, { clearProps: "transform" }),
            },
            "-=0.15",
          );
        }

        if (animateBtns.length) {
          tl.to(
            animateBtns,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.025,
              ease: "power2.out",
              onComplete: () => gsap.set(animateBtns, { clearProps: "transform" }),
            },
            "-=0.2",
          );
        }

        if (animateFields.length) {
          tl.to(
            animateFields,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.025,
              ease: "power2.out",
              onComplete: () => gsap.set(animateFields, { clearProps: "transform" }),
            },
            "-=0.2",
          );
        }
      };

      if (step === 0) {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 82%",
          once: true,
          onEnter: reveal,
        });

        const lenis = window.lenis;
        const onLenisScroll = () => ScrollTrigger.update();
        lenis?.on("scroll", onLenisScroll);

        return () => {
          lenis?.off("scroll", onLenisScroll);
          st.kill();
        };
      }

      reveal();
    },
    { dependencies: [step], scope: sectionRef },
  );

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateData = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
    setSubmitError(null);
  };

  const goNext = () => {
    const errors = validateStep(step, formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitError(null);
    setStep((s) => Math.min(s + 1, 6));
  };

  const prevStep = () => {
    setSubmitError(null);
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const errors = validateStep(5, formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitError("Please fix the highlighted fields before submitting.");
      return;
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

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          jobTitle: formData.jobTitle.trim(),
          companyName: formData.companyName.trim(),
          problems: formData.problems.trim(),
          bookSize: formData.bookSize.trim(),
          heardAboutUs: formData.heardAboutUs,
          phone: formData.phone.replace(/\D/g, ""),
          submittedAt: new Date().toISOString(),
          pageUri: typeof window !== "undefined" ? window.location.href : undefined,
          pageName: "Contact",
          hutk,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setStep(6);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    "Agency Network",
    "AMS",
    "MGA",
    "Association",
    "Brokerage",
    "Carrier",
    "Independent Agent",
    "Wholesaler",
    "Technology Provider",
    "Other",
  ];

  const bookSizes = [
    "Under $25k",
    "$25k – $50k",
    "$50k – $250k",
    "$250k – $1M",
    "$1M – $5M",
    "$5M – $10M",
    "$10M+",
  ];

  const heardAboutUsOptions = [
    "Search (Google, other engine)",
    "AI Tool (Claude, ChatGPT, etc)",
    "Blog post or article",
    "Newsletter",
    "Online advertisement",
    "Referral from an existing CoverForce carrier",
    "Referral from an existing CoverForce customer",
    "Referral from an investor or advisor",
    "Other referral (word of mouth, partner, integration, etc)",
    "Event or conference",
    "LinkedIn or social media",
    "Other",
  ];

  const countryCodes = getCountries()
    .map((country) => ({
      code: `+${getCountryCallingCode(country)}`,
      countryCode: country,
      country: (en as Record<string, string>)[country],
    }))
    .sort((a, b) => a.country.localeCompare(b.country));

  const toggleBusinessType = (type: string) => {
    setFormData((prev) => {
      const current = prev.businessType;
      if (current.includes(type)) {
        return { ...prev, businessType: current.filter((t) => t !== type) };
      }
      return { ...prev, businessType: [...current, type] };
    });
    clearFieldError("businessType");
    setSubmitError(null);
  };

  const toggleHeardAboutUs = (option: string) => {
    setFormData((prev) => {
      const current = prev.heardAboutUs;
      if (current.includes(option)) {
        return { ...prev, heardAboutUs: current.filter((o) => o !== option) };
      }
      return { ...prev, heardAboutUs: [...current, option] };
    });
    clearFieldError("heardAboutUs");
    setSubmitError(null);
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      <section
        ref={sectionRef}
        className="relative flex h-full items-center overflow-hidden text-white"
      >
        <Container
          borderColor="#FFFFFF33"
          borderOpacity={borderOpacity}
          className="relative z-10 flex h-full w-full items-center"
        >
          <div
            ref={contentRef}
            className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center"
          >
            {step > 0 && step < 6 && (
              <div className="mb-8 text-sm font-medium uppercase tracking-widest text-white/60">
                0{step} / <span className="opacity-30"> 05</span>
              </div>
            )}

            {step === 0 && (
              <div className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mt-5 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>
                    Hey there! How can we assist you on this afternoon in Chicago, USA?
                  </span>
                </h2>

                <div
                  data-buttons-container
                  className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
                >
                  <Button
                    onClick={() => setStep(1)}
                    balanced
                    surface="on-dark"
                    autoAnimateMs={2000}
                  >
                    Get Started Today
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>Type of Business</span>
                </h2>
                <div className="flex w-full flex-wrap justify-center gap-4">
                  {businessTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      data-animate-btn
                      onClick={() => toggleBusinessType(type)}
                      className={`rounded-[5px] border px-8 py-3 transition-colors ${
                        formData.businessType.includes(type)
                          ? "border-transparent bg-white text-[#2E2E2E]"
                          : "border-white/40 bg-transparent text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {fieldErrors.businessType && (
                  <p className="mt-6 text-sm text-red-300" role="alert">
                    {fieldErrors.businessType}
                  </p>
                )}
                <div className="mt-16" data-animate-btn>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>
                    Please describe in a few sentences what problems CoverForce would solve for
                    your company *
                  </span>
                </h2>
                <div className="w-full" data-animate-field>
                  <input
                    type="text"
                    value={formData.problems}
                    onChange={(e) => updateData("problems", e.target.value)}
                    aria-invalid={Boolean(fieldErrors.problems)}
                    className={`w-full border-b bg-transparent pb-3 text-center text-lg text-white outline-none transition-colors ${fieldBorderClass(Boolean(fieldErrors.problems))}`}
                  />
                  {fieldErrors.problems && (
                    <p className="mt-3 text-sm text-red-300" role="alert">
                      {fieldErrors.problems}
                    </p>
                  )}
                </div>
                <div className="mt-16 flex w-full items-center justify-between" data-animate-field>
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>
                    How big is your existing commercial book of business ($ of Gross Written
                    Premium)?*
                  </span>
                </h2>
                <div className="flex w-full flex-wrap justify-center gap-4">
                  {bookSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      data-animate-btn
                      onClick={() => updateData("bookSize", size)}
                      className={`min-w-[140px] rounded-[5px] border px-8 py-3 transition-colors ${
                        formData.bookSize === size
                          ? "border-transparent bg-white text-[#2E2E2E]"
                          : "border-white/40 bg-transparent text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {fieldErrors.bookSize && (
                  <p className="mt-6 text-sm text-red-300" role="alert">
                    {fieldErrors.bookSize}
                  </p>
                )}
                <div className="mt-16 flex w-full items-center justify-between" data-animate-btn>
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>Almost there! Tell us about you and your company.</span>
                </h2>

                <div className="mt-4 grid w-full grid-cols-1 gap-x-12 gap-y-10 text-left md:grid-cols-2">
                  <div className="flex flex-col gap-2 md:col-span-2" data-animate-field>
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/70">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      placeholder="Arjun Sharma"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={(e) => updateData("fullName", e.target.value)}
                      aria-invalid={Boolean(fieldErrors.fullName)}
                      className={`w-full border-b bg-transparent pb-2 text-white outline-none transition-colors ${fieldBorderClass(Boolean(fieldErrors.fullName))}`}
                    />
                    {fieldErrors.fullName && (
                      <p className="text-xs text-red-300" role="alert">
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/70">
                      PHONE NUMBER *
                    </label>
                    <div
                      className={`relative flex items-center border-b pb-2 transition-colors ${
                        fieldErrors.phone
                          ? "border-red-400 focus-within:border-red-300"
                          : "border-white/40 focus-within:border-white"
                      }`}
                    >
                      <div
                        className="mr-2 flex cursor-pointer select-none items-center gap-x-2 text-sm opacity-100"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === "phone" ? null : "phone")
                        }
                      >
                        <div className="flex w-6 items-center justify-center">
                          {(() => {
                            const ActiveFlag = Flags[formData.countryCode as keyof typeof Flags];
                            return ActiveFlag ? (
                              <span className="flex w-5 items-center justify-center">
                                <ActiveFlag title={formData.countryCode} />
                              </span>
                            ) : (
                              <span>{formData.countryCode}</span>
                            );
                          })()}
                        </div>
                        <span
                          className={`text-[10px] transition-transform duration-200 ${activeDropdown === "phone" ? "rotate-180" : ""}`}
                        >
                          ▼
                        </span>
                        {activeDropdown === "phone" && (
                          <div
                            data-lenis-prevent
                            className="custom-scrollbar absolute top-full left-0 z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-white/20 bg-[#1e2a5e] shadow-xl"
                          >
                            {countryCodes.map((c) => {
                              const Flag = Flags[c.countryCode as keyof typeof Flags];
                              return (
                                <div
                                  key={`${c.country}-${c.code}`}
                                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      phoneCode: c.code,
                                      countryCode: c.countryCode,
                                    }));
                                    clearFieldError("phone");
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <div className="flex w-6 items-center justify-center">
                                    {Flag ? (
                                      <span className="flex w-5 items-center justify-center">
                                        <Flag title={c.countryCode} />
                                      </span>
                                    ) : (
                                      <span>{c.countryCode}</span>
                                    )}
                                  </div>
                                  <span className="w-12 text-white/70">{c.code}</span>
                                  <span className="flex-1 truncate" title={c.country}>
                                    {c.country}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span className="mr-2 select-none text-sm text-white/60">
                        {formData.phoneCode}
                      </span>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          updateData("phone", e.target.value.replace(/[^\d\s()-]/g, ""))
                        }
                        aria-invalid={Boolean(fieldErrors.phone)}
                        className="w-full bg-transparent text-white outline-none"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-300" role="alert">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/70">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="arjun@company.com"
                      value={formData.email}
                      onChange={(e) => updateData("email", e.target.value)}
                      aria-invalid={Boolean(fieldErrors.email)}
                      className={`w-full border-b bg-transparent pb-2 text-white outline-none transition-colors ${fieldBorderClass(Boolean(fieldErrors.email))}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-300" role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/70">
                      JOB TITLE *
                    </label>
                    <input
                      type="text"
                      autoComplete="organization-title"
                      placeholder="Product Manager"
                      value={formData.jobTitle}
                      onChange={(e) => updateData("jobTitle", e.target.value)}
                      aria-invalid={Boolean(fieldErrors.jobTitle)}
                      className={`w-full border-b bg-transparent pb-2 text-white outline-none transition-colors ${fieldBorderClass(Boolean(fieldErrors.jobTitle))}`}
                    />
                    {fieldErrors.jobTitle && (
                      <p className="text-xs text-red-300" role="alert">
                        {fieldErrors.jobTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/70">
                      COMPANY NAME *
                    </label>
                    <input
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Technologies"
                      value={formData.companyName}
                      onChange={(e) => updateData("companyName", e.target.value)}
                      aria-invalid={Boolean(fieldErrors.companyName)}
                      className={`w-full border-b bg-transparent pb-2 text-white outline-none transition-colors ${fieldBorderClass(Boolean(fieldErrors.companyName))}`}
                    />
                    {fieldErrors.companyName && (
                      <p className="text-xs text-red-300" role="alert">
                        {fieldErrors.companyName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-16 flex w-full items-center justify-between" data-animate-field>
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
                {submitError && (
                  <p className="mt-4 text-sm text-red-300" role="alert" data-animate-field>
                    {submitError}
                  </p>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>How did you hear about us?</span>
                </h2>
                <div className="flex w-full flex-wrap justify-center gap-4">
                  {heardAboutUsOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      data-animate-btn
                      onClick={() => toggleHeardAboutUs(option)}
                      className={`rounded-[5px] border px-8 py-3 transition-colors ${
                        formData.heardAboutUs.includes(option)
                          ? "border-transparent bg-white text-[#2E2E2E]"
                          : "border-white/40 bg-transparent text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {fieldErrors.heardAboutUs && (
                  <p className="mt-6 text-sm text-red-300" role="alert">
                    {fieldErrors.heardAboutUs}
                  </p>
                )}
                <div className="mt-16 flex w-full items-center justify-between" data-animate-btn>
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button
                    surface="on-dark"
                    onClick={handleSubmit}
                    balanced
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                  </Button>
                </div>
                {submitError && (
                  <p className="mt-4 text-sm text-red-300" role="alert" data-animate-btn>
                    {submitError}
                  </p>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-6 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>Thank you! Your request has been submitted.</span>
                </h2>
                <p
                  className="mb-12 mt-4 max-w-xl px-2 text-balance text-base text-white/90 sm:px-0 md:text-lg"
                  data-animate-field
                >
                  Want to move faster? Schedule a call with our team at a time that works for you.
                </p>
                <div
                  data-animate-field
                  data-cal-namespace="15min"
                  data-cal-link="sunny-cal/15min"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}'
                >
                  <Button surface="on-dark" balanced>
                    SCHEDULE A CALL
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
};

export default ContactForm;
