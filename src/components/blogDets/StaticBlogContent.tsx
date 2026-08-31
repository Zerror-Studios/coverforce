import Link from "next/link";
import Image from "next/image";
import Container from "@/components/common/Container";

export type ContentStat = {
  value: string;
  label: string;
};

export type ContentFeatureItem = {
  title: string;
  description: string;
};

export type ContentSection = {
  id: string;
  title: string;
  intro?: string;
  eyebrow?: string;
  bullets?: string[];
  items?: ContentFeatureItem[];
  paragraphs?: string[];
  image?: string;
  imageAlt?: string;
};

type StaticBlogContentProps = {
  stats: ContentStat[];
  sections: ContentSection[];
  tags?: string[];
};

const ARTICLE_PROSE_CLASS =
  "text-[0.9375rem] leading-[1.75] text-[#444444] [&_a]:text-[#413CC0] [&_a]:underline [&_a]:underline-offset-2";

const SECTION_TITLE_CLASS =
  "font-heading text-xl font-medium tracking-tight text-[#444444]";

const SUBSECTION_TITLE_CLASS =
  "font-heading text-lg font-medium text-[#444444]";

function StatBox({ value, label }: ContentStat) {
  return (
    <div>
      <div className="border-l-2 border-[#413CC0] pl-4">
        <p className={SECTION_TITLE_CLASS}>{value}</p>
      </div>
      <p className={`mt-2 pl-4 ${ARTICLE_PROSE_CLASS}`}>{label}</p>
    </div>
  );
}

function ContentSectionBlock({
  section,
  isFirst,
}: {
  section: ContentSection;
  isFirst: boolean;
}) {
  return (
    <section id={section.id} className="scroll-mt-28 space-y-4">
      <h2 className={`${SECTION_TITLE_CLASS} ${isFirst ? "" : "pt-6"}`}>
        {section.title}
      </h2>

      {section.intro ? <p className={ARTICLE_PROSE_CLASS}>{section.intro}</p> : null}

      {section.eyebrow ? (
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#6259ce] md:text-xs">
          {section.eyebrow}
        </p>
      ) : null}

      {section.bullets && section.bullets.length > 0 ? (
        <ul
          className={`list-disc pl-5 ${ARTICLE_PROSE_CLASS} [&_li]:my-1`}
        >
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}

      {section.items && section.items.length > 0 ? (
        <ul className="space-y-4">
          {section.items.map((item) => (
            <li key={item.title}>
              <p className={`pt-4 ${SUBSECTION_TITLE_CLASS}`}>{item.title}</p>
              <p className={`mt-2 ${ARTICLE_PROSE_CLASS}`}>{item.description}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {section.paragraphs && section.paragraphs.length > 0
        ? section.paragraphs.map((paragraph) => (
            <p key={paragraph} className={ARTICLE_PROSE_CLASS}>
              {paragraph}
            </p>
          ))
        : null}

      {section.image ? (
        <div className="relative overflow-hidden rounded-md bg-[#F7F7FB]">
          <Image
            src={section.image}
            alt={section.imageAlt ?? section.title}
            width={1200}
            height={675}
            className="h-auto w-full rounded-md object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}

export default function StaticBlogContent({
  stats,
  sections,
  tags = [],
}: StaticBlogContentProps) {
  return (
    <section className="bg-white text-[#444444]">
      <Container borderColor="#53535380">
        <div className="mx-auto max-w-4xl border-b border-[#E8E8EE] pb-16 md:pb-20 lg:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
            <aside className="flex flex-col gap-8 sm:flex-row sm:flex-wrap lg:sticky lg:top-24 lg:flex-col lg:gap-10">
              {stats.map((stat) => (
                <StatBox key={stat.label} {...stat} />
              ))}
            </aside>

            <div className="min-w-0 space-y-4">
              {sections.map((section, index) => (
                <ContentSectionBlock
                  key={section.id}
                  section={section}
                  isFirst={index === 0}
                />
              ))}

              {tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-dashed border-[#E1E1E1] pt-8 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
                  <span className="text-sm text-[#5B35E0]">
                    Read more about :
                  </span>
                  {tags.map((tag, i) => (
                    <span key={tag} className="flex items-center gap-2 text-sm">
                      {i > 0 ? (
                        <span className="font-sans font-semibold text-[#444444]">
                          /
                        </span>
                      ) : null}
                      <Link
                        href="/blog"
                        className="font-sans font-semibold text-[#444444] transition-colors hover:text-[#413CC0]"
                      >
                        {tag}
                      </Link>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
