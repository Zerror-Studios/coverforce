import React, { type ReactNode } from "react";
import Button from "@/components/common/Button";
import Container from "../common/Container";
import SectionRadialGlow from "../common/SectionRadialGlow";

function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center justify-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] ${className}`}
    >
      <span
        className="inline-block size-2 shrink-0 rounded-full bg-linear-to-r from-[#FFFFFF] to-[#AFB3EF]"
        aria-hidden
      />
      {children}
    </p>
  );
}

const Explore = () => {
  return (
    <section className="relative overflow-hidden  bg-[#141E4B] text-white">
      <Container borderColor="#FFFFFF1A" className="relative">
        <SectionRadialGlow className="absolute left-1/2 top-[10%] z-0 -translate-x-1/2 md:top-[12%] lg:top-[14%]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-2rem)] max-w-2xl flex-col items-center justify-center text-center">
          <Eyebrow className="text-[#FFFFFF80]">Explore the platform</Eyebrow>

          <h2 className="mt-5 text-3xl font-heading font-regular leading-tight tracking-tight md:text-5xl lg:text-5xl lg:leading-[1.1]">
            Start a New Quote
          </h2>

          <p className="mt-5 text-sm font-sans font-regular leading-relaxed text-[#FFFFFF]">
            Start quoting faster with CoverForce. <br /> Submit once, compare carriers,
            and bind in one platform.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button href="/" variant="primary">
              Request demo
            </Button>
            <Button href="/" variant="secondary">
              Book a call
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Explore;
