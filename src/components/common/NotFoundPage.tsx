"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import SectionRadialGlow from "./SectionRadialGlow";
import Button from "./Button";

export default function NotFoundPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#121C49] text-white">
      <Container borderColor="#FFFFFF33" borderOpacity={1} className="relative">
        <SectionRadialGlow className="absolute left-1/2 top-[8%] z-0 -translate-x-1/2 md:top-[10%]" />

        <div
          className={`relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-2xl flex-col items-center justify-center px-4 pt-24 pb-16 text-center transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[#9AA8BC]">
            Error 404
          </p>

          <div className="relative mt-6 w-full">
            <p
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] font-heading text-[clamp(7rem,32vw,13rem)] font-medium leading-none tracking-tight text-[#0032C9]/22"
              aria-hidden
            >
              404
            </p>

            <h1 className="relative text-3xl font-heading font-medium leading-tight tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              This page isn&apos;t on our map
            </h1>
          </div>

          <p className="mt-5 max-w-md font-sans text-sm leading-[1.5] text-[#BCC5D6] md:text-lg">
            The link may be broken or the page may have moved. Head back to the
            platform to keep quoting, routing, and binding in one workflow.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button href="/" variant="primary">
              Back to home
            </Button>
            <Button href="/" variant="secondary">
              Request demo
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
