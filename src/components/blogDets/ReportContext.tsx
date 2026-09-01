"use client";

import Container from "@/components/common/Container";
import HeroReveal from "@/components/common/HeroReveal";
import ReportContextStatCard from "@/components/blogDets/ReportContextStatCard";

const ARTICLE_PROSE_CLASS =
  "text-[0.9375rem] leading-[1.75] text-[#444444]";

const SECTION_HEADING_CLASS =
  "font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]";

export type ReportContextStat = {
  label: string;
  value: string;
  barColor: string;
};

export type ReportContextData = {
  title: string;
  paragraphs: string[];
  stats: ReportContextStat[];
};

type ReportContextProps = {
  context: ReportContextData;
};

export default function ReportContext({ context }: ReportContextProps) {
  return (
    <section className="bg-white text-[#444444]">
      <Container borderColor="#53535380">
        <div className="border-b border-[#E8E8EE] pb-16 pt-8 md:pb-20 md:pt-10 lg:pb-24 lg:pt-12">
          <HeroReveal
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20"
            delay={0.55}
            stagger={0.12}
          >
            <h2 className={`max-w-md ${SECTION_HEADING_CLASS}`}>
              {context.title}
            </h2>

            <div className="space-y-4">
              {context.paragraphs.map((paragraph) => (
                <p key={paragraph} className={ARTICLE_PROSE_CLASS}>
                  {paragraph}
                </p>
              ))}
            </div>
          </HeroReveal>

          <HeroReveal
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4"
            delay={0.75}
            stagger={0.1}
          >
            {context.stats.map((stat, index) => (
              <ReportContextStatCard key={stat.label} index={index} {...stat} />
            ))}
          </HeroReveal>
        </div>
      </Container>
    </section>
  );
}
