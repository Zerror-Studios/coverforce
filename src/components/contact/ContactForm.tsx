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
import en from "react-phone-number-input/locale/en.json";
import Flags from "react-phone-number-input/flags";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_EASE = "power3.out";

const ContactForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    businessType: [] as string[],
    problems: "",
    bookSize: "",
    firstName: "",
    lastName: "",
    phoneCode: "+1",
    countryCode: "US",
    phone: "",
    email: "",
    jobTitle: "",
    companyName: ""
  });
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
      const cal = await getCalApi({ "namespace": "15min" });
      cal("ui", { "cssVarsPerTheme": { "light": { "cal-brand": "#1e2a5e" }, "dark": { "cal-brand": "#ffffff" } }, "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, [])

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
          tl.to(buttonsContainer, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            onComplete: () => gsap.set(buttonsContainer, { clearProps: "transform" }),
          }, "-=0.15");
        }

        if (animateBtns.length) {
          tl.to(animateBtns, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.025,
            ease: "power2.out",
            onComplete: () => gsap.set(animateBtns, { clearProps: "transform" }),
          }, "-=0.2");
        }

        if (animateFields.length) {
          tl.to(animateFields, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.025,
            ease: "power2.out",
            onComplete: () => gsap.set(animateFields, { clearProps: "transform" }),
          }, "-=0.2");
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
      } else {
        reveal();
      }
    },
    { dependencies: [step], scope: sectionRef }
  );

  const updateData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => {
    setSubmitError(null);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setStep(5);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    "Agency Network", "AMS", "MGA", "Association",
    "Brokerage", "Carrier", "Independent Agent", "Wholesaler",
    "Technology Provider", "Other"
  ];

  const bookSizes = [
    "25k-50k", "25k-50k ", " 25k-50k", "25k-50k  ",
    " 25k-50k ", "  25k-50k", "10M+"
  ];

  const jobTitles = ["Product Manager", "Software Engineer", "CEO", "CTO", "Designer", "Other"];
  const dummyCompanies = ["Acme Technologies", "Stark Industries", "Wayne Enterprises", "Globex Corporation"];

  const countryCodes = getCountries().map(country => ({
    code: `+${getCountryCallingCode(country)}`,
    countryCode: country,
    country: (en as any)[country]
  })).sort((a, b) => a.country.localeCompare(b.country));

  const toggleBusinessType = (type: string) => {
    setFormData(prev => {
      const current = prev.businessType;
      if (current.includes(type)) {
        return { ...prev, businessType: current.filter(t => t !== type) };
      }
      return { ...prev, businessType: [...current, type] };
    });
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
      <section ref={sectionRef} className="relative bg-[#151f4d] text-white  flex items-center">
        <Container borderColor="#FFFFFF33" borderOpacity={borderOpacity} className="relative min-h-[calc(100svh-2rem)] flex items-center w-full">
          <div ref={contentRef} className="mx-auto w-full max-w-3xl flex flex-col items-center justify-center text-center">

            {step > 0 && step < 5 && (
              <div className="text-sm font-medium tracking-widest text-white/60 mb-8 uppercase">
                0{step} / <span className="opacity-30"> 04</span>
              </div>
            )}

            {step === 0 && (
              <div className="w-full flex flex-col items-center">
                <h2
                  data-heading
                  className="mt-5 max-w-2xl px-2 text-balance text-[1.625rem] font-heading font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]"
                >
                  <span data-split>
                    Hey there! How can we assist you on this afternoon in Chicago, USA?
                  </span>
                </h2>

                <div
                  data-buttons-container
                  className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
                >
                  <Button onClick={() => setStep(1)} balanced surface="on-dark">
                    Get Started Today
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="w-full flex flex-col items-center">
                <h2 data-heading className="mb-12 max-w-2xl px-2 text-balance text-[1.625rem] font-heading font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]">
                  <span data-split>Type of Business</span>
                </h2>
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {businessTypes.map(type => (
                    <button
                      key={type}
                      data-animate-btn
                      onClick={() => toggleBusinessType(type)}
                      className={`px-8 py-3 rounded-[5px] transition-colors border ${formData.businessType.includes(type) ? 'bg-white text-[#2E2E2E] border-transparent' : 'bg-transparent text-white border-white/40 hover:bg-white/[0.08]'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="mt-16" data-animate-btn>
                  <Button surface="on-dark" onClick={nextStep} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="w-full flex flex-col items-center">
                <h2 data-heading className="mb-12 max-w-2xl px-2 text-balance text-[1.625rem] font-heading font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]">
                  <span data-split>Please describe in a few sentences what problems CoverForce would solve for your company *</span>
                </h2>
                <div className="w-full" data-animate-field>
                  <input
                    type="text"
                    value={formData.problems}
                    onChange={e => updateData("problems", e.target.value)}
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-center text-lg text-white outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="mt-16 w-full  flex items-center justify-between" data-animate-field>
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={nextStep} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="w-full flex flex-col items-center">
                <h2 data-heading className="mb-12 max-w-2xl px-2 text-balance text-[1.625rem] font-heading font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]">
                  <span data-split>How big is your existing commercial book of business ($ of Gross Written Premium)?*</span>
                </h2>
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {bookSizes.map((size, i) => (
                    <button
                      key={i}
                      data-animate-btn
                      onClick={() => updateData("bookSize", size)}
                      className={`px-8 py-3 rounded-[5px] transition-colors border min-w-[140px] ${formData.bookSize === size ? 'bg-white text-[#2E2E2E] border-transparent' : 'bg-transparent text-white border-white/40 hover:bg-white/[0.08]'}`}
                    >
                      {size.trim()}
                    </button>
                  ))}
                </div>
                <div className="mt-16 w-full flex items-center justify-between" data-animate-btn>
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={nextStep} balanced>
                    NEXT
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="w-full flex flex-col items-center">
                <h2 data-heading className="mb-12 max-w-2xl px-2 text-balance text-[1.625rem] font-heading font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]">
                  <span data-split>Almost there! Tell us about you and your company.</span>
                </h2>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left mt-4">
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] uppercase tracking-widest text-white/70 font-medium">FULL NAME *</label>
                    <input
                      type="text"
                      placeholder="Arjun"
                      value={formData.firstName}
                      onChange={e => updateData("firstName", e.target.value)}
                      className="w-full bg-transparent border-b border-white/40 pb-2 text-white outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] uppercase tracking-widest text-white/70 font-medium">FULL NAME *</label>
                    <input
                      type="text"
                      placeholder="Sharma"
                      value={formData.lastName}
                      onChange={e => updateData("lastName", e.target.value)}
                      className="w-full bg-transparent border-b border-white/40 pb-2 text-white outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] uppercase tracking-widest text-white/70 font-medium">PHONE NUMBER</label>
                    <div className="flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors relative">
                      <div
                        className="mr-2 text-sm opacity-100 flex gap-x-2 items-center cursor-pointer select-none"
                        onClick={() => setActiveDropdown(activeDropdown === "phone" ? null : "phone")}
                      >
                        <div className="w-6 flex items-center justify-center">
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
                        <span className={`text-[10px] transition-transform duration-200 ${activeDropdown === "phone" ? "rotate-180" : ""}`}>▼</span>
                        {activeDropdown === "phone" && (
                          <div data-lenis-prevent className="absolute top-full left-0 mt-1 w-full bg-[#1e2a5e] border border-white/20 rounded-md shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                            {countryCodes.map(c => {
                              const Flag = Flags[c.countryCode as keyof typeof Flags];
                              return (
                                <div
                                  key={`${c.country}-${c.code}`}
                                  className="px-3 py-2 hover:bg-white/10 cursor-pointer text-sm flex items-center gap-2 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData(prev => ({ ...prev, phoneCode: c.code, countryCode: c.countryCode }));
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <div className="w-6 flex items-center justify-center">
                                    {Flag ? (
                                      <span className="flex w-5 items-center justify-center">
                                        <Flag title={c.countryCode} />
                                      </span>
                                    ) : (
                                      <span>{c.countryCode}</span>
                                    )}
                                  </div>
                                  <span className="w-12 text-white/70">{c.code}</span>
                                  <span className="truncate flex-1" title={c.country}>{c.country}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-white/60 mr-2 text-sm select-none">{formData.phoneCode}</span>
                      <input
                        type="text"
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={e => updateData("phone", e.target.value)}
                        className="w-full bg-transparent text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2" data-animate-field>
                    <label className="text-[11px] uppercase tracking-widest text-white/70 font-medium">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      placeholder="arjun@company.com"
                      value={formData.email}
                      onChange={e => updateData("email", e.target.value)}
                      className="w-full bg-transparent border-b border-white/40 pb-2 text-white outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2 relative" data-animate-field>
                    <label className="text-[11px] uppercase tracking-widest text-white/70 font-medium">JOB TITLE *</label>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setActiveDropdown(activeDropdown === "jobTitle" ? null : "jobTitle")}
                    >
                      <input
                        type="text"
                        readOnly
                        placeholder="Select Job Title"
                        value={formData.jobTitle}
                        className="w-full bg-transparent border-b border-white/40 pb-2 text-white outline-none cursor-pointer focus:border-white transition-colors pr-6"
                      />
                      <span className={`absolute right-0 bottom-3 text-[10px] opacity-70 transition-transform duration-200 ${activeDropdown === "jobTitle" ? "rotate-180" : ""}`}>▼</span>
                    </div>
                    {activeDropdown === "jobTitle" && (
                      <div data-lenis-prevent className="absolute top-full left-0 mt-1 w-full bg-[#1e2a5e] border border-white/20 rounded-md shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                        {jobTitles.map(title => (
                          <div
                            key={title}
                            className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm transition-colors"
                            onClick={(e) => { e.stopPropagation(); updateData("jobTitle", title); setActiveDropdown(null); }}
                          >
                            {title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 relative" data-animate-field>
                    <label className="text-[11px] uppercase tracking-widest text-white/70 font-medium">COMPANY NAME *</label>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setActiveDropdown(activeDropdown === "companyName" ? null : "companyName")}
                    >
                      <input
                        type="text"
                        readOnly
                        placeholder="Select Company"
                        value={formData.companyName}
                        className="w-full bg-transparent border-b border-white/40 pb-2 text-white outline-none cursor-pointer focus:border-white transition-colors pr-6"
                      />
                      <span className={`absolute right-0 bottom-3 text-[10px] opacity-70 transition-transform duration-200 ${activeDropdown === "companyName" ? "rotate-180" : ""}`}>▼</span>
                    </div>
                    {activeDropdown === "companyName" && (
                      <div data-lenis-prevent className="absolute top-full left-0 mt-1 w-full bg-[#1e2a5e] border border-white/20 rounded-md shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                        {dummyCompanies.map(company => (
                          <div
                            key={company}
                            className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm transition-colors"
                            onClick={(e) => { e.stopPropagation(); updateData("companyName", company); setActiveDropdown(null); }}
                          >
                            {company}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-16 flex items-center justify-between w-full" data-animate-field>
                  <Button surface="on-dark" variant="outline" onClick={prevStep} balanced>
                    GO BACK
                  </Button>
                  <Button surface="on-dark" onClick={handleSubmit} balanced disabled={isSubmitting}>
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                  </Button>
                </div>
                {submitError && (
                  <p className="mt-4 text-sm text-red-300" data-animate-field>
                    {submitError}
                  </p>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="w-full flex flex-col items-center">
                <h2 data-heading className="mb-6 max-w-2xl px-2 text-balance text-[1.625rem] font-heading font-regular leading-[1.15] tracking-tight sm:px-0 sm:text-3xl md:text-5xl lg:leading-[1.1]">
                  <span data-split>Thank you! Your request has been submitted.</span>
                </h2>
                <p className="mb-12 mt-4 max-w-xl px-2 text-balance text-base text-white/90 sm:px-0 md:text-lg" data-animate-field>
                  Want to move faster? Schedule a call with our team at a time that works for you.
                </p>
                <div data-animate-field data-cal-namespace="15min"
                  data-cal-link="sunny-cal/15min"

                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}'>
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