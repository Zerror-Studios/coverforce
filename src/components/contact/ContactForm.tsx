"use client";
import { useEffect, useRef, useState } from "react";
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
const GEO_TIMEOUT_MS = 6000;
const DEVICE_GEO_TIMEOUT_MS = 4500;

function getTimeOfDayPeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function buildGreeting(location: string | null) {
  const period = getTimeOfDayPeriod();
  if (location) {
    return `Hey there! How can we assist you on this ${period} in ${location}?`;
  }
  return `Hey there! How can we assist you on this ${period}?`;
}

function getDeviceCoordinates(): Promise<{ lat: number; lon: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: DEVICE_GEO_TIMEOUT_MS,
        maximumAge: 10 * 60 * 1000,
      },
    );
  });
}

async function fetchGeoLocation(
  signal: AbortSignal,
  coords?: { lat: number; lon: number } | null,
): Promise<string | null> {
  const url =
    coords != null
      ? `/api/geo?lat=${encodeURIComponent(String(coords.lat))}&lon=${encodeURIComponent(String(coords.lon))}`
      : "/api/geo";

  const res = await fetch(url, { signal });
  if (!res.ok) return null;

  const data = (await res.json()) as { location?: string | null };
  return typeof data.location === "string" && data.location ? data.location : null;
}

async function resolveGreetingLocation(signal: AbortSignal): Promise<string | null> {
  const ipPromise = fetchGeoLocation(signal);

  const coords = await getDeviceCoordinates();
  if (coords) {
    const precise = await fetchGeoLocation(signal, coords);
    if (precise) return precise;
  }

  return ipPromise;
}

type FormDataState = {
  businessType: string[];
  problems: string;
  bookSize: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  countryCode: string;
  phone: string;
  email: string;
  jobTitle: string;
  companyName: string;
  heardAboutUs: string[];
  heardAboutUsSingle: string;
  isDigitalBrokerageStartup: "" | "Yes" | "No";
  startupType: string;
  fundraisingStage: string;
  hasActiveBook: "" | "Yes" | "No";
  existingBookGwp: string;
  pcLicense: string;
  hasDirectAppointments: string;
  appointedCarriers: string;
  interestedLobs: string[];
  marketAccessPartners: string;
};

const STARTUP_TYPE_OPTIONS = [
  "Stealth",
  "VC-Backed",
  "Accelerator Participant/Alumni",
  "Bootstrapped",
  "Incubated",
];
const FUNDRAISING_STAGE_OPTIONS = [
  "Accelerator",
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
  "Bootstrapped",
  "Other",
];
const BOOK_GWP_OPTIONS = [
  "$0",
  "$1-$500K",
  "$500K-$1M",
  "$1-$2M",
  "$2-$4M",
  "$4M+",
];
const PC_LICENSE_OPTIONS = [
  "Yes - I have both an individual and entity license",
  "In progress - I have my individual license and my entity application is pending",
  "In progress - I have an individual license only (no entity license yet)",
  "In progress - I'm currently completing my individual licensing (exam / application)",
  "No - I haven't started the licensing process yet",
  "Not sure / I need help understanding what I need",
];
const DIRECT_APPOINTMENT_OPTIONS = [
  "Yes - I have direct appointments with carriers",
  "No - I am in direct appointment discussions with carriers currently",
  "No - I access markets through a wholesaler / MGA / agency network",
  "No - I'm looking for a platform to access carrier markets (no appointments)",
  "Not sure / I don't know what carrier appointments are",
];
const LOB_OPTIONS = [
  "General Liability (GL)",
  "Business Owners' Policy (BOP)",
  "Workers' Compensation (WC)",
  "Cyber Liability",
  "Miscellaneous Professional Liability (MPL)",
  "Inland Marine",
  "Property",
  "Commercial Auto",
  "Other",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]{0,79}$/u;

type FieldErrors = Partial<Record<keyof FormDataState | "form", string>>;

function buildFullPhone(phoneCode: string, phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `${phoneCode}${digits}`;
}

function validateStartupStep(step: number, data: FormDataState): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1 && data.businessType.length === 0) {
    errors.businessType = "Please select a business type.";
  }

  if (step === 2) {
    if (!data.fullName.trim()) errors.fullName = "Full name is required.";
    else if (!NAME_PATTERN.test(data.fullName.trim())) {
      errors.fullName = "Enter a valid full name.";
    }

    if (!data.lastName.trim()) errors.lastName = "Last name is required.";
    else if (!NAME_PATTERN.test(data.lastName.trim())) {
      errors.lastName = "Enter a valid last name.";
    }

    const fullPhone = buildFullPhone(data.phoneCode, data.phone);
    if (!data.phone.trim()) errors.phone = "Phone number is required.";
    else if (!isValidPhoneNumber(fullPhone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!data.email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(data.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!data.jobTitle.trim()) errors.jobTitle = "Job title is required.";
    else if (data.jobTitle.trim().length < 2) {
      errors.jobTitle = "Enter a valid job title.";
    }

    if (!data.companyName.trim()) errors.companyName = "Company name is required.";
    else if (data.companyName.trim().length < 2) {
      errors.companyName = "Enter a valid company name.";
    }
  }

  if (step === 3) {
    if (!data.isDigitalBrokerageStartup) {
      errors.isDigitalBrokerageStartup = "Please select Yes or No.";
    }

    if (!data.heardAboutUsSingle) {
      errors.heardAboutUsSingle = "Please tell us how you heard about CoverForce.";
    }

    if (!data.startupType) errors.startupType = "Please select a startup type.";

    if (!data.fundraisingStage) {
      errors.fundraisingStage = "Please select a fundraising stage.";
    }
  }

  if (step === 4) {
    if (!data.hasActiveBook) {
      errors.hasActiveBook = "Please select Yes or No.";
    }
    if (!data.existingBookGwp) {
      errors.existingBookGwp = "Please select your book size.";
    }
    if (!data.pcLicense) errors.pcLicense = "Please select a license option.";
    if (!data.hasDirectAppointments) {
      errors.hasDirectAppointments = "Please select an appointments option.";
    }
  }

  if (step === 5) {
    if (!data.appointedCarriers.trim()) {
      errors.appointedCarriers = "Please tell us which carriers you are appointed with.";
    }
    if (data.interestedLobs.length === 0) {
      errors.interestedLobs = "Please select an LOB.";
    }
    if (!data.marketAccessPartners.trim()) {
      errors.marketAccessPartners =
        "Please tell us which wholesaler, MGA, or agency network you work with.";
    }
    const problems = data.problems.trim();
    if (!problems) {
      errors.problems = "Please describe which CoverForce capabilities matter most.";
    } else if (problems.length < 10) {
      errors.problems = "Please write a bit more detail (10+ characters).";
    }
  }

  return errors;
}

function validateDefaultStep(step: number, data: FormDataState): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1 && data.businessType.length === 0) {
    errors.businessType = "Please select a business type.";
  }

  if (step === 2) {
    const problems = data.problems.trim();
    if (!problems) errors.problems = "Please describe what CoverForce would solve.";
    else if (problems.length < 10) {
      errors.problems = "Please write at least a couple of sentences (10+ characters).";
    }
  }

  if (step === 3) {
    const bookSize = data.bookSize.trim();
    if (!bookSize) errors.bookSize = "Please enter your book of business size.";
    else if (bookSize.length < 2) {
      errors.bookSize = "Please enter a valid book of business size.";
    }
  }

  if (step === 4) {
    const fullName = data.fullName.trim();
    const email = data.email.trim();
    const jobTitle = data.jobTitle.trim();
    const companyName = data.companyName.trim();
    const fullPhone = buildFullPhone(data.phoneCode, data.phone);

    if (!fullName) errors.fullName = "Full name is required.";
    else if (!NAME_PATTERN.test(fullName)) errors.fullName = "Enter a valid full name.";

    if (!data.phone.trim()) errors.phone = "Phone number is required.";
    else if (!isValidPhoneNumber(fullPhone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!email) errors.email = "Email address is required.";
    else if (!EMAIL_PATTERN.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!jobTitle) errors.jobTitle = "Job title is required.";
    else if (jobTitle.length < 2) errors.jobTitle = "Enter a valid job title.";

    if (!companyName) errors.companyName = "Company name is required.";
    else if (companyName.length < 2) errors.companyName = "Enter a valid company name.";
  }

  if (step === 5 && data.heardAboutUs.length === 0) {
    errors.heardAboutUs = "Please tell us how you heard about us.";
  }

  return errors;
}

function validateStep(
  step: number,
  data: FormDataState,
  isStartupFlow: boolean,
): FieldErrors {
  return isStartupFlow
    ? validateStartupStep(step, data)
    : validateDefaultStep(step, data);
}

const ContactForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>({
    businessType: [],
    problems: "",
    bookSize: "",
    fullName: "",
    firstName: "",
    lastName: "",
    phoneCode: "+1",
    countryCode: "US",
    phone: "",
    email: "",
    jobTitle: "",
    companyName: "",
    heardAboutUs: [],
    heardAboutUsSingle: "",
    isDigitalBrokerageStartup: "",
    startupType: "",
    fundraisingStage: "",
    hasActiveBook: "",
    existingBookGwp: "",
    pcLicense: "",
    hasDirectAppointments: "",
    appointedCarriers: "",
    interestedLobs: [],
    marketAccessPartners: "",
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [greetingReady, setGreetingReady] = useState(false);
  const [greeting, setGreeting] = useState(() => buildGreeting(null));

  const isStartupFlow = formData.businessType[0] === "Startup / InsurTech";
  const thankYouStep = 6;
  const totalSteps = 5;

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const [borderOpacity, setBorderOpacity] = useState(0);

  useEffect(() => {
    setFieldErrors({});
    setSubmitError(null);
  }, [step]);

  useEffect(() => {
    let cancelled = false;
    let settled = false;
    const controller = new AbortController();

    const finish = (location: string | null) => {
      if (cancelled || settled) return;
      settled = true;
      setGreeting(buildGreeting(location));
      setGreetingReady(true);
    };

    const timeoutId = window.setTimeout(() => {
      finish(null);
      controller.abort();
    }, GEO_TIMEOUT_MS);

    resolveGreetingLocation(controller.signal)
      .then((location) => {
        window.clearTimeout(timeoutId);
        finish(location);
      })
      .catch(() => {
        window.clearTimeout(timeoutId);
        finish(null);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const cleanupSplits = () => {
    splitsRef.current.forEach((split) => split.revert());
    splitsRef.current = [];
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;
      if (step === 0 && !greetingReady) return;

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

      const clearAnimatedProps = () => {
        if (buttonsContainer) gsap.set(buttonsContainer, { clearProps: "opacity,transform" });
        if (animateBtns.length) gsap.set(animateBtns, { clearProps: "opacity,transform" });
        if (animateFields.length) gsap.set(animateFields, { clearProps: "opacity,transform" });
        if (heading) gsap.set(heading, { clearProps: "opacity" });
        if (chars.length) gsap.set(chars, { clearProps: "opacity,transform" });
      };

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

        const tl = gsap.timeline({
          delay: step === 0 ? 0.2 : 0,
          onComplete: clearAnimatedProps,
        });

        if (chars.length) {
          tl.to(chars, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.015,
            ease: "power2.out",
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
            },
            "-=0.2",
          );
        }

        return tl;
      };

      if (step === 0) {
        let revealTl: gsap.core.Timeline | null = null;
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 82%",
          once: true,
          onEnter: () => {
            revealTl = reveal();
          },
        });

        const lenis = window.lenis;
        const onLenisScroll = () => ScrollTrigger.update();
        lenis?.on("scroll", onLenisScroll);

        return () => {
          lenis?.off("scroll", onLenisScroll);
          st.kill();
          revealTl?.kill();
          clearAnimatedProps();
        };
      }

      const revealTl = reveal();
      return () => {
        revealTl.kill();
        clearAnimatedProps();
      };
    },
    { dependencies: [step, greeting, greetingReady], scope: sectionRef },
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
    if (isSubmitting) return;
    const errors = validateStep(step, formData, isStartupFlow);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitError(null);
    setStep((s) => Math.min(s + 1, thankYouStep));
  };

  const prevStep = () => {
    setFieldErrors({});
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const errors = validateStep(5, formData, isStartupFlow);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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

      const payload = isStartupFlow
        ? {
            flow: "startup" as const,
            businessType: formData.businessType,
            fullName: formData.fullName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phoneCode: formData.phoneCode,
            phone: formData.phone.replace(/\D/g, ""),
            companyName: formData.companyName.trim(),
            jobTitle: formData.jobTitle.trim(),
            isDigitalBrokerageStartup: formData.isDigitalBrokerageStartup,
            startupType: formData.startupType,
            fundraisingStage: formData.fundraisingStage,
            hasActiveBook: formData.hasActiveBook,
            existingBookGwp: formData.existingBookGwp,
            pcLicense: formData.pcLicense,
            hasDirectAppointments: formData.hasDirectAppointments,
            appointedCarriers: formData.appointedCarriers.trim(),
            interestedLobs: formData.interestedLobs,
            marketAccessPartners: formData.marketAccessPartners.trim(),
            heardAboutUsSingle: formData.heardAboutUsSingle,
            problems: formData.problems.trim(),
            pageUri: typeof window !== "undefined" ? window.location.href : undefined,
            pageName: "API Access",
            hutk,
          }
        : {
            flow: "contact" as const,
            businessType: formData.businessType,
            problems: formData.problems.trim(),
            bookSize: formData.bookSize.trim(),
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phoneCode: formData.phoneCode,
            phone: formData.phone.replace(/\D/g, ""),
            companyName: formData.companyName.trim(),
            jobTitle: formData.jobTitle.trim(),
            heardAboutUs: formData.heardAboutUs,
            pageUri: typeof window !== "undefined" ? window.location.href : undefined,
            pageName: "Contact Us",
            hutk,
          };

      console.log("[ContactForm] submit payload", payload);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      console.log("[ContactForm] submit response", {
        status: response.status,
        ok: response.ok,
        result,
      });

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Something went wrong. Please try again.",
        );
      }

      setStep(thankYouStep);
    } catch (error) {
      console.error("[ContactForm] submit error", error);
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
    "Brokerage",
    "Carrier",
    "Independent Agent",
    "Wholesaler",
    "Technology Provider",
    "Startup / InsurTech",
    "Other",
  ];

  const heardAboutUsOptions = [
    "Search (Google, other engine)",
    "AI Tool (Claude, ChatGPT, etc)",
    "LinkedIn or social media",
    "Newsletter",
    "Online advertisement",
    "Referral from an investor or advisor",
    "Other referral (word of mouth, etc)",
    "Event or conference",
    "Other",
  ];

  const countryCodes = getCountries()
    .map((country) => ({
      code: `+${getCountryCallingCode(country)}`,
      countryCode: country,
      country: (en as Record<string, string>)[country],
    }))
    .sort((a, b) => a.country.localeCompare(b.country));

  const selectBusinessType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      businessType: prev.businessType[0] === type ? [] : [type],
    }));
    clearFieldError("businessType");
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

  const fieldLabelClass =
    "text-left text-[11px] font-medium uppercase tracking-widest text-white/70";
  const underlineInputClass = (hasError = false) =>
    `w-full border-b bg-transparent pb-2 text-left text-white outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-300" : "border-white/40 focus:border-white"
    }`;
  const selectClass = (hasError = false) =>
    `w-full appearance-none border-b bg-transparent pb-2 pr-6 text-left text-white outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-300" : "border-white/40 focus:border-white"
    }`;
  const fieldErrorClass = "mt-2 text-left text-sm text-red-300";
  const radioOptionClass =
    "flex cursor-pointer items-center gap-2.5 text-sm text-white/90";
  const radioInputClass =
    "size-4 shrink-0 accent-white cursor-pointer";

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
        className="relative flex h-auto min-h-svh items-center overflow-visible pt-24 pb-10 text-white lg:h-full lg:min-h-0 lg:overflow-hidden lg:pt-0 lg:pb-0"
      >
        <Container
          borderColor="#FFFFFF33"
          borderOpacity={borderOpacity}
          className="relative z-10 flex h-auto w-full flex-1 items-center overflow-visible lg:h-full lg:overflow-hidden"
        >
          <div
            ref={contentRef}
            data-lenis-prevent
            className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center overflow-visible py-8 text-center lg:max-h-full lg:overflow-y-auto lg:overscroll-contain [-webkit-overflow-scrolling:touch]"
          >
            {step > 0 && step < thankYouStep && (
              <div className="mb-8 text-sm font-medium uppercase tracking-widest text-white/60">
                0{step} / <span className="opacity-30"> 0{totalSteps}</span>
              </div>
            )}

            {step === 0 && greetingReady && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mt-5 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>
                    {greeting}
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
              <div data-lenis-prevent className="flex w-full flex-col items-center">
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
                      onClick={() => selectBusinessType(type)}
                      className={`rounded-[5px] border px-8 py-3 transition-colors ${
                        formData.businessType[0] === type
                          ? "border-transparent bg-white text-[#2E2E2E]"
                          : "border-white/40 bg-transparent text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="mt-16">
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
                {fieldErrors.businessType && (
                  <p className="mt-4 text-sm text-red-300" role="alert">
                    {fieldErrors.businessType}
                  </p>
                )}
              </div>
            )}

            {/* ── Startup flow ── */}
            {isStartupFlow && step === 2 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>Tell us how to reach you</span>
                </h2>

                <div className="mt-4 grid w-full grid-cols-1 gap-x-12 gap-y-10 text-left md:grid-cols-2">
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Arjun Sharma"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={(e) => updateData("fullName", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.fullName))}
                    />
                    {fieldErrors.fullName && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Last Name *</label>
                    <input
                      type="text"
                      placeholder="Sharma"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.lastName))}
                    />
                    {fieldErrors.lastName && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Phone Number *</label>
                    <div
                      className={`relative flex items-center border-b pb-2 transition-colors ${
                        fieldErrors.phone
                          ? "border-red-400 focus-within:border-red-300"
                          : "border-white/40 focus-within:border-white"
                      }`}
                    >
                      <div
                        className="mr-2 flex cursor-pointer select-none items-center gap-x-2 text-sm"
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
                        placeholder="646 355 6077"
                        value={formData.phone}
                        onChange={(e) =>
                          updateData("phone", e.target.value.replace(/[^\d\s()-]/g, ""))
                        }
                        className="w-full bg-transparent text-white outline-none"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Email Address *</label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="arjun@company.com"
                      value={formData.email}
                      onChange={(e) => updateData("email", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.email))}
                    />
                    {fieldErrors.email && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Job Title *</label>
                    <input
                      type="text"
                      autoComplete="organization-title"
                      placeholder="Product Manager"
                      value={formData.jobTitle}
                      onChange={(e) => updateData("jobTitle", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.jobTitle))}
                    />
                    {fieldErrors.jobTitle && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.jobTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Company Name *</label>
                    <input
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Technologies"
                      value={formData.companyName}
                      onChange={(e) => updateData("companyName", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.companyName))}
                    />
                    {fieldErrors.companyName && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.companyName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-16 flex w-full items-center justify-between">
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {isStartupFlow && step === 3 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>A bit more about your company</span>
                </h2>
                <div className="flex w-full max-w-xl flex-col gap-8 text-left">
                  <div className="flex flex-col gap-3" data-animate-field>
                    <label className={fieldLabelClass}>
                      Are you a digital brokerage startup? *
                    </label>
                    <div
                      className="flex flex-wrap gap-6"
                      role="radiogroup"
                      aria-label="Digital brokerage startup"
                    >
                      {(["Yes", "No"] as const).map((option) => (
                        <label key={option} className={radioOptionClass}>
                          <input
                            type="radio"
                            name="isDigitalBrokerageStartup"
                            value={option}
                            checked={formData.isDigitalBrokerageStartup === option}
                            onChange={() => updateData("isDigitalBrokerageStartup", option)}
                            className={radioInputClass}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {fieldErrors.isDigitalBrokerageStartup && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.isDigitalBrokerageStartup}
                      </p>
                    )}
                  </div>
                  <div className="relative flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>
                      How did you hear about CoverForce? *
                    </label>
                    <select
                      value={formData.heardAboutUsSingle}
                      onChange={(e) => updateData("heardAboutUsSingle", e.target.value)}
                      className={selectClass(Boolean(fieldErrors.heardAboutUsSingle))}
                    >
                      <option value="" disabled className="bg-[#1e2a5e] text-white">
                        Select an option
                      </option>
                      {heardAboutUsOptions.map((option) => (
                        <option key={option} value={option} className="bg-[#1e2a5e] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.heardAboutUsSingle && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.heardAboutUsSingle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Startup Type *</label>
                    <select
                      value={formData.startupType}
                      onChange={(e) => updateData("startupType", e.target.value)}
                      className={selectClass(Boolean(fieldErrors.startupType))}
                    >
                      <option value="" disabled className="bg-[#1e2a5e] text-white">
                        Select an option
                      </option>
                      {STARTUP_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#1e2a5e] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.startupType && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.startupType}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>Startup Fundraising Stage *</label>
                    <select
                      value={formData.fundraisingStage}
                      onChange={(e) => updateData("fundraisingStage", e.target.value)}
                      className={selectClass(Boolean(fieldErrors.fundraisingStage))}
                    >
                      <option value="" disabled className="bg-[#1e2a5e] text-white">
                        Select an option
                      </option>
                      {FUNDRAISING_STAGE_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#1e2a5e] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.fundraisingStage && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.fundraisingStage}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-16 flex w-full items-center justify-between">
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {isStartupFlow && step === 4 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>Tell us about your startup</span>
                </h2>
                <div className="flex w-full max-w-xl flex-col gap-8 text-left">
                  <div className="flex flex-col gap-3" data-animate-field>
                    <label className={fieldLabelClass}>
                      Do you have an existing agency/brokerage with an active book? *
                    </label>
                    <div
                      className="flex flex-wrap gap-6"
                      role="radiogroup"
                      aria-label="Existing agency or brokerage with active book"
                    >
                      {(["Yes", "No"] as const).map((option) => (
                        <label key={option} className={radioOptionClass}>
                          <input
                            type="radio"
                            name="hasActiveBook"
                            value={option}
                            checked={formData.hasActiveBook === option}
                            onChange={() => updateData("hasActiveBook", option)}
                            className={radioInputClass}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {fieldErrors.hasActiveBook && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.hasActiveBook}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>
                      How big is your existing book ($ in GWP)? *
                    </label>
                    <select
                      value={formData.existingBookGwp}
                      onChange={(e) => updateData("existingBookGwp", e.target.value)}
                      className={selectClass(Boolean(fieldErrors.existingBookGwp))}
                    >
                      <option value="" disabled className="bg-[#1e2a5e] text-white">
                        Select an option
                      </option>
                      {BOOK_GWP_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#1e2a5e] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.existingBookGwp && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.existingBookGwp}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>
                      Do you have an individual and an entity level P&amp;C license? *
                    </label>
                    <select
                      value={formData.pcLicense}
                      onChange={(e) => updateData("pcLicense", e.target.value)}
                      className={selectClass(Boolean(fieldErrors.pcLicense))}
                    >
                      <option value="" disabled className="bg-[#1e2a5e] text-white">
                        Select an option
                      </option>
                      {PC_LICENSE_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#1e2a5e] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.pcLicense && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.pcLicense}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>
                      Do you have direct carrier appointments? *
                    </label>
                    <select
                      value={formData.hasDirectAppointments}
                      onChange={(e) => updateData("hasDirectAppointments", e.target.value)}
                      className={selectClass(Boolean(fieldErrors.hasDirectAppointments))}
                    >
                      <option value="" disabled className="bg-[#1e2a5e] text-white">
                        Select an option
                      </option>
                      {DIRECT_APPOINTMENT_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#1e2a5e] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.hasDirectAppointments && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.hasDirectAppointments}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-16 flex w-full items-center justify-between">
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {isStartupFlow && step === 5 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>Markets and coverage interest</span>
                </h2>
                <div className="flex w-full max-w-xl flex-col gap-8 text-left">
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>
                      Which carriers are you appointed with? *
                    </label>
                    <input
                      type="text"
                      value={formData.appointedCarriers}
                      onChange={(e) => updateData("appointedCarriers", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.appointedCarriers))}
                    />
                    {fieldErrors.appointedCarriers && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.appointedCarriers}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>What LOBs are you interested in? *</label>
                    <select
                      value={formData.interestedLobs[0] ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          interestedLobs: value ? [value] : [],
                        }));
                        clearFieldError("interestedLobs");
                      }}
                      className={selectClass(Boolean(fieldErrors.interestedLobs))}
                    >
                      <option value="" disabled className="bg-[#1e2a5e] text-white">
                        Select an option
                      </option>
                      {LOB_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#1e2a5e] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.interestedLobs && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.interestedLobs}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>
                      Which wholesaler, MGA, or agency network do you work with for market access
                      today? *
                    </label>
                    <input
                      type="text"
                      value={formData.marketAccessPartners}
                      onChange={(e) => updateData("marketAccessPartners", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.marketAccessPartners))}
                    />
                    {fieldErrors.marketAccessPartners && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.marketAccessPartners}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className={fieldLabelClass}>
                      Which CoverForce capabilities are most relevant to your needs? *
                    </label>
                    <input
                      type="text"
                      value={formData.problems}
                      onChange={(e) => updateData("problems", e.target.value)}
                      className={underlineInputClass(Boolean(fieldErrors.problems))}
                    />
                    {fieldErrors.problems && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.problems}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-16 flex w-full items-center justify-between">
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
                  <p className="mt-4 text-sm text-red-300" role="alert" data-animate-field>
                    {submitError}
                  </p>
                )}
              </div>
            )}

            {/* ── Default contact flow ── */}
            {!isStartupFlow && step === 2 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
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
                    className={`w-full border-b bg-transparent pb-3 text-center text-lg text-white outline-none transition-colors ${
                      fieldErrors.problems
                        ? "border-red-400 focus:border-red-300"
                        : "border-white/40 focus:border-white"
                    }`}
                  />
                  {fieldErrors.problems && (
                    <p className="mt-3 text-sm text-red-300" role="alert">
                      {fieldErrors.problems}
                    </p>
                  )}
                </div>
                <div className="mt-16 flex w-full items-center justify-between">
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {!isStartupFlow && step === 3 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-12 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>
                    How big is your existing commercial book of business ($ of Gross Written
                    Premium)?*
                  </span>
                </h2>
                <div className="w-full" data-animate-field>
                  <input
                    type="text"
                    value={formData.bookSize}
                    onChange={(e) => updateData("bookSize", e.target.value)}
                    className={`w-full border-b bg-transparent pb-3 text-center text-lg text-white outline-none transition-colors ${
                      fieldErrors.bookSize
                        ? "border-red-400 focus:border-red-300"
                        : "border-white/40 focus:border-white"
                    }`}
                  />
                  {fieldErrors.bookSize && (
                    <p className="mt-3 text-sm text-red-300" role="alert">
                      {fieldErrors.bookSize}
                    </p>
                  )}
                </div>
                <div className="mt-16 flex w-full items-center justify-between">
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {!isStartupFlow && step === 4 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
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
                      className={underlineInputClass(Boolean(fieldErrors.fullName))}
                    />
                    {fieldErrors.fullName && (
                      <p className={fieldErrorClass} role="alert">
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
                        placeholder="646 355 6077"
                        value={formData.phone}
                        onChange={(e) =>
                          updateData("phone", e.target.value.replace(/[^\d\s()-]/g, ""))
                        }
                        className="w-full bg-transparent text-white outline-none"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className={fieldErrorClass} role="alert">
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
                      className={underlineInputClass(Boolean(fieldErrors.email))}
                    />
                    {fieldErrors.email && (
                      <p className={fieldErrorClass} role="alert">
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
                      className={underlineInputClass(Boolean(fieldErrors.jobTitle))}
                    />
                    {fieldErrors.jobTitle && (
                      <p className={fieldErrorClass} role="alert">
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
                      className={underlineInputClass(Boolean(fieldErrors.companyName))}
                    />
                    {fieldErrors.companyName && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.companyName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-16 flex w-full items-center justify-between">
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={goNext} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {!isStartupFlow && step === 5 && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
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
                <div className="mt-16 flex w-full items-center justify-between">
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
                {fieldErrors.heardAboutUs && (
                  <p className="mt-4 text-sm text-red-300" role="alert">
                    {fieldErrors.heardAboutUs}
                  </p>
                )}
                {submitError && (
                  <p className="mt-4 text-sm text-red-300" role="alert" data-animate-btn>
                    {submitError}
                  </p>
                )}
              </div>
            )}

            {step === thankYouStep && (
              <div data-lenis-prevent className="flex w-full flex-col items-center">
                <h2
                  data-heading
                  className="mb-6 max-w-2xl px-2 text-balance font-heading text-[1.625rem] font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>Thank you! Your request has been submitted.</span>
                </h2>
                <p
                  className="mb-4 mt-4 max-w-xl px-2 text-balance text-base text-white/90 sm:px-0 md:text-lg"
                  data-animate-field
                >
                  Our team will be in touch with you shortly.
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
};

export default ContactForm;