import Image from "next/image";
import Container from "@/components/common/Container";

const Hero = () => {
  return (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#121C49] pb-24 text-white md:pb-32">
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(49, 78, 155, 0.55) 0%, rgba(18, 28, 73, 0.92) 52%, #121C49 100%)",
      }}
      aria-hidden
    />

    <Image
      src="/images/product/porduct-bg.svg"
      alt=""
      width={1440}
      height={400}
      className="pointer-events-none absolute -bottom-16 left-0 z-[1] h-auto w-full"
      priority
      aria-hidden
    />

    <Container className="relative z-10">
      <div className="mx-auto flex max-w-3xl -translate-y-6 flex-col items-center px-6 py-16 text-center md:-translate-y-10 md:py-20">
        <h1 className="max-w-2xl text-3xl font-heading font-normal leading-[1.15] tracking-tight md:text-4xl lg:text-5xl xl:text-5xl">
          Read docs. Skip the
          <br />
          manual work.
        </h1>

        <p className="mt-8 max-w-xl font-sans text-sm font-regular leading-relaxed text-white/85 md:text-sm">
          Upload ACORDs, loss runs, and proposals. AI extracts every field,
          pre-fills 40+ carrier applications, and delivers bindable quotes in 8
          minutes instead of 115.
        </p>
      </div>
    </Container>
  </section>
  );
};

export default Hero;
