import Link from "next/link";
import Container from "@/components/common/Container";
import type { ContentStat } from "@/components/blogDets/StaticBlogContent";

type CaseStudyContentProps = {
  bodyHtml: string;
  stats: ContentStat[];
  tags?: string[];
};

const ARTICLE_PROSE_CLASS =
  "space-y-4 text-[0.9375rem] leading-[1.75] text-[#444444] [&_a]:text-[#413CC0] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-[#E1E1E1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_figure]:my-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-[#444444] [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-[#444444] [&_img]:h-auto [&_img]:w-full [&_img]:rounded-md [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5";

const SECTION_TITLE_CLASS =
  "font-heading text-xl font-medium tracking-tight text-[#444444]";

const STAT_BODY_CLASS =
  "text-[0.9375rem] leading-[1.75] text-[#444444]";

function StatBox({ value, label }: ContentStat) {
  return (
    <div className="border-l-2 border-[#413CC0] pl-4">
      <p className={SECTION_TITLE_CLASS}>{value}</p>
      <p className={`mt-2 ${STAT_BODY_CLASS}`}>{label}</p>
    </div>
  );
}

export default function CaseStudyContent({
  bodyHtml,
  stats,
  tags = [],
}: CaseStudyContentProps) {
  return (
    <section className="bg-white text-[#444444]">
      <Container borderColor="#53535380">
        <div className="mx-auto max-w-4xl border-b border-[#E8E8EE] pb-16 md:pb-20 lg:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
            {stats.length > 0 ? (
              <aside className="flex flex-col gap-8 sm:flex-row sm:flex-wrap lg:sticky lg:top-24 lg:flex-col lg:gap-10">
                {stats.map((stat) => (
                  <StatBox key={stat.label} {...stat} />
                ))}
              </aside>
            ) : null}

            <div className="min-w-0">
              <article
                className={ARTICLE_PROSE_CLASS}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-dashed border-[#E1E1E1] pt-8 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
                  <span className="text-sm text-[#5B35E0]">
                    Read more about :
                  </span>
                  {tags.map((tag, index) => (
                    <span key={tag} className="flex items-center gap-2 text-sm">
                      {index > 0 ? (
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
