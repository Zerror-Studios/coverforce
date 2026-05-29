import React from "react";
import Button from "@/components/common/Button";
import Container from "../common/Container";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
      <span className="inline-block size-2 shrink-0 bg-[#5B35E0]" aria-hidden />
      {children}
    </p>
  );
}

const Explore = () => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#1e3a8a_0%,#0f1d4a_45%,#0a143b_100%)] py-20 text-white md:py-24 lg:py-28">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
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
