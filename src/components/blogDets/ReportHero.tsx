"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiDownloadLine } from "@remixicon/react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import HeroReveal from "@/components/common/HeroReveal";
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
};

export default function ReportHero({ hero }: ReportHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showDownloadFab, setShowDownloadFab] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const pastHeroRef = useRef(false);
  const moreBlogsVisibleRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const syncFabVisibility = () => {
      setShowDownloadFab(
        pastHeroRef.current && !moreBlogsVisibleRef.current,
      );
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHeroRef.current = !entry.isIntersecting;
        syncFabVisibility();
      },
      { threshold: 0, rootMargin: "0px 0px -1px 0px" },
    );

    heroObserver.observe(section);

    let moreBlogsObserver: IntersectionObserver | null = null;

    const observeMoreBlogs = () => {
      const moreBlogs = document.getElementById("more-blogs");
      if (!moreBlogs || moreBlogsObserver) return;

      moreBlogsObserver = new IntersectionObserver(
        ([entry]) => {
          moreBlogsVisibleRef.current = entry.isIntersecting;
          syncFabVisibility();
        },
        { threshold: 0 },
      );

      moreBlogsObserver.observe(moreBlogs);
    };

    observeMoreBlogs();

    const retryId = window.setTimeout(observeMoreBlogs, 0);

    return () => {
      window.clearTimeout(retryId);
      heroObserver.disconnect();
      moreBlogsObserver?.disconnect();
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative z-20 bg-white text-[#0a143b]">
        <Container borderColor="#53535380">
          <HeroReveal className="pb-8 pt-28 md:pb-10 md:pt-20 lg:pb-12 lg:pt-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-20">
              <div className="flex flex-col items-start">
                <nav className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
                  <Link href="/" className="transition-colors hover:text-[#413CC0]">
                    Home
                  </Link>
                  <span className="text-[#C4C4C4]"> / </span>
                  <span className="text-[#50617a]">
                    {hero.breadcrumbLabel} · {hero.year}
                  </span>
                </nav>

                <h1 className="mt-4 max-w-md font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
                  {hero.title}
                </h1>

                <Button className="mt-8" onClick={() => setDownloadOpen(true)}>
                  {hero.ctaLabel}
                </Button>
              </div>

              <div className="w-full lg:pt-8">
                <p className="w-full text-[0.9375rem] leading-[1.75] text-[#444444]">
                  {hero.summary}
                </p>

                <dl className="mt-8 w-full">
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
            </div>
          </HeroReveal>
        </Container>
      </section>

      <div
        className={`fixed bottom-6 right-5 z-40 md:bottom-8 md:right-8 ${
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
        onClose={() => setDownloadOpen(false)}
      />
    </>
  );
}
