import Container from "@/components/common/Container";
import HalftoneBarGrid from "@/components/blogDets/HalftoneBarGrid";

const ARTICLE_PROSE_CLASS =
  "text-[0.9375rem] leading-[1.75] text-[#444444]";

const SECTION_HEADING_CLASS =
  "font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]";

const STAT_VALUE_CLASS =
  "font-heading text-xl font-medium leading-none tracking-tight text-[#0a143b] sm:text-2xl lg:text-[1.625rem]";

function parsePercentFromValue(value: string): number {
  const parsed = Number.parseFloat(value.replace("%", "").trim());
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, parsed));
}

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

function ContextStatCard({
  label,
  value,
  barColor,
}: ReportContextStat) {
  const percent = parsePercentFromValue(value);
  const showBar = percent > 0;

  return (
    <div>
      <p className={`mb-3 ${ARTICLE_PROSE_CLASS}`}>
        {label}
      </p>
      <div className="flex h-72 flex-col overflow-hidden rounded-xl border border-[#D1D5DB] p-5 md:h-80">
        <div className="flex h-full min-h-0 w-full flex-col justify-end overflow-hidden">
          <p className={`mb-1 shrink-0 leading-none ${STAT_VALUE_CLASS}`}>
            {value}
          </p>
          {showBar ? (
            <div
              className="min-h-0 overflow-hidden rounded-[3px] bg-white"
              style={{
                height: `calc((100% - 1.75rem) * ${percent / 100})`,
              }}
            >
              <HalftoneBarGrid color={barColor} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ReportContext({ context }: ReportContextProps) {
  return (
    <section className="bg-white text-[#444444]">
      <Container borderColor="#53535380">
        <div className="border-b border-[#E8E8EE] pb-16 pt-4 md:pb-20 lg:pb-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20">
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
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4">
            {context.stats.map((stat) => (
              <ContextStatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
