"use client";

import { useEffect, useRef, useState } from "react";
import { RiDownloadLine } from "@remixicon/react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import HeroReveal from "@/components/common/HeroReveal";
import BlogBreadcrumbNav from "@/components/blogDets/BlogBreadcrumbNav";
import ReportDownloadModal, {
  type ReportDownloadModalData,
} from "@/components/blogDets/ReportDownloadModal";
import { PRIMARY_BUTTON_GRADIENT } from "@/data/wayCardStyles";

export type ReportHeroMetaField = {
  label: string;
  value: string;
};

export type ReportHeroData = {
  breadcrumbLabel: string;
  year: string;
  title: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  downloadModal: ReportDownloadModalData;
  meta: ReportHeroMetaField[];
};

type ReportHeroProps = {
  hero: ReportHeroData;
  blogSlug: string;
};

export default function ReportHero({ hero, blogSlug }: ReportHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showDownloadFab, setShowDownloadFab] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const hasPassedHeroRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          hasPassedHeroRef.current = true;
        }
        setShowDownloadFab(hasPassedHeroRef.current);
      },
      { threshold: 0, rootMargin: "0px 0px -1px 0px" },
    );

    heroObserver.observe(section);

    return () => {
      heroObserver.disconnect();
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative z-20 bg-white text-[#0a143b]">
        <Container borderColor="#53535380">
          <HeroReveal
            className="grid grid-cols-1 gap-10 border-b border-dashed border-[#E1E1E1] pb-8 pt-28 md:pb-10 md:pt-20 lg:grid-cols-2 lg:items-start lg:gap-16 lg:pb-12 lg:pt-24 xl:gap-20"
            delay={0.45}
            stagger={0.12}
          >
            <div className="flex flex-col items-start">
              <BlogBreadcrumbNav label={hero.breadcrumbLabel} />

              <h1 className="mt-4 max-w-md font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
                {hero.title}
              </h1>

              {hero.summary ? (
                <p className="mt-4 max-w-md text-[0.9375rem] leading-[1.75] text-[#444444]">
                  {hero.summary}
                </p>
              ) : null}

              <Button className="mt-8" onClick={() => setDownloadOpen(true)}>
                {hero.ctaLabel}
              </Button>
            </div>

            {hero.meta.length > 0 ? (
              <div className="w-full lg:pt-8">
                <dl className="w-full">
                  {hero.meta.map((field, index) => (
                    <div
                      key={field.label}
                      className={`flex items-baseline justify-between gap-6 py-4 ${
                        index > 0 ? "border-t border-dashed border-[#E1E1E1]" : ""
                      }`}
                    >
                      <dt className="shrink-0 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#6259ce] md:text-xs">
                        {field.label}:
                      </dt>
                      <dd className="text-right font-heading text-base font-semibold leading-snug text-[#333333] md:text-lg">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </HeroReveal>
        </Container>
      </section>

      <div
        className={`fixed bottom-6 right-5 z-50 md:bottom-8 md:right-8 ${
          showDownloadFab
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        } transition-all duration-300 ease-out`}
      >
        <div className="group relative">
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0a143b] px-3 py-2 font-sans text-xs font-medium text-white opacity-0 shadow-[0_8px_24px_rgba(10,20,59,0.18)] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {hero.ctaLabel}
          </span>
          <button
            type="button"
            aria-label={hero.ctaLabel}
            onClick={() => setDownloadOpen(true)}
            className="flex size-11 items-center justify-center rounded-full text-white shadow-[0_8px_22px_rgba(10,20,59,0.2)] transition-transform hover:scale-105"
            style={{ background: PRIMARY_BUTTON_GRADIENT }}
          >
            <RiDownloadLine
              className="report-download-fab-bounce size-5 motion-reduce:animate-none"
              aria-hidden
            />
          </button>
        </div>
      </div>

      <ReportDownloadModal
        open={downloadOpen}
        content={hero.downloadModal}
        blogSlug={blogSlug}
        onClose={() => setDownloadOpen(false)}
      />
    </>
  );
}
