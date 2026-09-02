"use client";

import Image from "next/image";
import Container from "@/components/common/Container";
import HeroReveal from "@/components/common/HeroReveal";
import BlogBreadcrumbNav from "@/components/blogDets/BlogBreadcrumbNav";
import type { CaseStudyHeroData, HeroMetaField } from "@/data/staticBlogDetails";

export type { CaseStudyHeroData };

function HeroMetaBar({ fields }: { fields: HeroMetaField[] }) {
  return (
    <div className="flex w-full flex-wrap items-start justify-start gap-x-8 gap-y-6 lg:justify-between lg:gap-x-0">
      {fields.map((field, index) => (
        <div
          key={field.label}
          className={`w-fit shrink-0 ${
            index > 0
              ? "lg:border-l lg:border-[#D1D5DB] lg:pl-8 xl:pl-10"
              : ""
          }`}
        >
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#6259ce] md:text-xs">
            {field.label}
          </p>
          <p className="mt-2 font-heading text-base font-semibold leading-snug text-[#333333] md:text-lg lg:whitespace-nowrap">
            {field.value}
          </p>
        </div>
      ))}
    </div>
  );
}

type CaseStudyHeroProps = {
  hero: CaseStudyHeroData;
  heroMeta?: HeroMetaField[];
};

export default function CaseStudyHero({ hero, heroMeta }: CaseStudyHeroProps) {
  const logoSrc = hero.logo ?? "/images/startups/center-logo.svg";

  return (
    <section className="relative z-20 bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <HeroReveal className="mx-auto max-w-4xl pb-8 pt-28 md:pb-10 md:pt-20 lg:pb-12 lg:pt-24">
          <BlogBreadcrumbNav label="Case Study" />

          <div className="relative mt-5 aspect-[16/10] min-h-[22rem] w-full overflow-hidden rounded-md sm:min-h-[24rem] md:aspect-[16/9] md:min-h-[26rem] lg:min-h-[28rem]">
            <Image
              src={hero.backgroundImage}
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 72rem"
            />

            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <p className="font-heading text-sm font-medium uppercase tracking-[0.08em] text-white sm:text-base md:text-lg">
                  {hero.label}
                </p>
                <div className="relative h-6 w-24 shrink-0 sm:h-7 sm:w-28 md:h-8 md:w-32">
                  <Image
                    src={logoSrc}
                    alt="CoverForce"
                    fill
                    className="object-contain object-right brightness-0 invert"
                    sizes="128px"
                  />
                </div>
              </div>

              <div className="flex flex-1 items-center py-6 sm:py-8 md:py-10">
                <h1 className="max-w-[48%] font-heading text-2xl font-semibold uppercase leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.06] xl:text-5xl">
                  {hero.title}
                </h1>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-6">
                <p className="max-w-[40%] font-mono text-[0.625rem] font-medium uppercase leading-relaxed tracking-[0.12em] text-white/90 sm:text-[0.6875rem]">
                  {hero.tagline}
                </p>
                <p className="shrink-0 font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-white/90 sm:text-[0.6875rem]">
                  {hero.date}
                  <span className="mx-2 text-white/60" aria-hidden>
                    •
                  </span>
                  {hero.readTime}
                </p>
              </div>
            </div>
          </div>

          {heroMeta ? (
            <div className="relative z-30 mt-6">
              <HeroMetaBar fields={heroMeta} />
            </div>
          ) : null}
        </HeroReveal>
      </Container>
    </section>
  );
}
