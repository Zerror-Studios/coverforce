import React from "react";
import Button from "@/components/common/Button";
import Container from "../common/Container";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
      <span className="inline-block size-2 shrink-0 bg-linear-to-r from-[#FFFFFF] to-[#AFB3EF] rounded-full" aria-hidden />
      {children}
    </p>
  );
}

const Explore = () => {
  return (
    <section className="relative overflow-hidden  bg-[#141E4B] text-white">
      <Container borderColor="#FFFFFF1A">
        <div className="mx-auto min-h-[calc(100svh-10rem)] flex max-w-2xl flex-col items-center justify-center text-center">
          <Eyebrow>Explore the platform</Eyebrow>

          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            Start a New Quote
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
            Start quoting faster with CoverForce. Submit once, compare carriers,
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
