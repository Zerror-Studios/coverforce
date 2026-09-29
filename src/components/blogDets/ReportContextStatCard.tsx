"use client";

import HalftoneBarGrid from "@/components/blogDets/HalftoneBarGrid";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import {
  MICRO_BAR_MS,
  MICRO_BAR_STAGGER_MS,
  MICRO_EASE,
} from "@/lib/motion";
import type { ReportContextStat } from "@/components/blogDets/ReportContext";

const ARTICLE_PROSE_CLASS =
  "text-[0.9375rem] leading-[1.75] text-[#444444]";

const STAT_VALUE_CLASS =
  "font-heading text-xl font-medium leading-none tracking-tight text-[#0a143b] sm:text-2xl lg:text-[1.625rem]";

function parsePercentFromValue(value: string): number {
  const parsed = Number.parseFloat(value.replace("%", "").trim());
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, parsed));
}

type ReportContextStatCardProps = ReportContextStat & {
  index?: number;
};

export default function ReportContextStatCard({
  label,
  value,
  barColor,
  index = 0,
}: ReportContextStatCardProps) {
  const [ref, visible] = useInViewOnce<HTMLDivElement>();
  const percent = parsePercentFromValue(value);
  const showBar = percent > 0;
  const targetHeight = `calc((100% - 1.75rem) * ${percent / 100})`;
  const delay = index * MICRO_BAR_STAGGER_MS;

  return (
    <div ref={ref}>
      <p className={`mb-3 ${ARTICLE_PROSE_CLASS}`}>{label}</p>
      <div className="flex h-72 flex-col overflow-hidden rounded-xl border border-dashed border-[#E1E1E1] p-5 md:h-80">
        <div className="flex h-full min-h-0 w-full flex-col justify-end overflow-hidden">
          <p className={`mb-1 shrink-0 leading-none ${STAT_VALUE_CLASS}`}>
            {value}
          </p>
          {showBar ? (
            <div
              className="min-h-0 overflow-hidden rounded-[3px] bg-white transition-[height] motion-reduce:transition-none"
              style={{
                height: visible ? targetHeight : 0,
                transitionDuration: `${MICRO_BAR_MS}ms`,
                transitionTimingFunction: MICRO_EASE,
                transitionDelay: `${delay}ms`,
              }}
            >
              <HalftoneBarGrid color={barColor} animate={visible} delay={delay} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
