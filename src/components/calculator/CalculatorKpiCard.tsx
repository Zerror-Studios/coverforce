import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  calcHeading,
  calcMetricLabel,
  calcMetricTrend,
  calcMetricValue,
  calcMetricValueSm,
  calcPara,
  calcSubpara,
} from "./calculatorUi";

export type KpiTone =
  | "purple"
  | "green"
  | "teal"
  | "orange"
  | "indigo"
  | "rose"
  | "slate";

const TONE_STYLES: Record<
  KpiTone,
  {
    trend: string;
    badge: string;
  }
> = {
  purple: {
    trend: "text-[#5B35E0]",
    badge: "bg-[#EFE8FF] text-[#4C2FC9]",
  },
  green: {
    trend: "text-[#059669]",
    badge: "bg-[#DCFCE7] text-[#047857]",
  },
  teal: {
    trend: "text-[#0D9488]",
    badge: "bg-[#CCFBF1] text-[#0F766E]",
  },
  orange: {
    trend: "text-[#EA580C]",
    badge: "bg-[#FFEDD5] text-[#C2410C]",
  },
  indigo: {
    trend: "text-[#4F46E5]",
    badge: "bg-[#E0E7FF] text-[#4338CA]",
  },
  rose: {
    trend: "text-[#E11D48]",
    badge: "bg-[#FFE4E6] text-[#BE123C]",
  },
  slate: {
    trend: "text-[#6B6B6B]",
    badge: "bg-[#F4F4F5] text-[#3F3F46]",
  },
};

const COLS: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/** Divider-separated KPI row - analytics-style, no boxes. */
export function CalculatorKpiRow({
  children,
  cols = 3,
  className = "",
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 divide-y divide-[#E8E8EC] ${COLS[cols]} md:divide-x md:divide-y-0 ${className}`}
    >
      {children}
    </div>
  );
}

type CalculatorKpiCardProps = {
  label: string;
  value: ReactNode;
  /** Short secondary next to the value (trend / context). */
  trend?: ReactNode;
  /** Longer caption under the value. */
  sub?: ReactNode;
  icon?: LucideIcon;
  tone?: KpiTone;
  className?: string;
};

export function CalculatorKpiCard({
  label,
  value,
  trend,
  sub,
  tone = "purple",
  className = "",
}: CalculatorKpiCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className={`px-0 py-5 md:px-6 md:py-1 first:md:pl-0 last:md:pr-0 ${className}`}>
      <p className={calcMetricLabel}>{label}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <div className={calcMetricValue}>{value}</div>
        {trend ? (
          <div className={`${calcMetricTrend} ${styles.trend}`}>{trend}</div>
        ) : null}
      </div>
      {sub ? <div className={`mt-2 ${calcSubpara}`}>{sub}</div> : null}
    </div>
  );
}

/** Compact metric in a divider row - same analytics layout. */
export function CalculatorStatCard({
  label,
  value,
  trend,
  tone = "slate",
}: {
  label: string;
  value: ReactNode;
  trend?: ReactNode;
  icon?: LucideIcon;
  tone?: KpiTone;
}) {
  const styles = TONE_STYLES[tone];

  return (
    <div className="px-0 py-5 md:px-6 md:py-1 first:md:pl-0 last:md:pr-0">
      <p className={calcMetricLabel}>{label}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <div className={calcMetricValueSm}>{value}</div>
        {trend ? (
          <div className={`${calcMetricTrend} ${styles.trend}`}>{trend}</div>
        ) : null}
      </div>
    </div>
  );
}

export function CalculatorSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#E8E8EC] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)] md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function CalculatorBadge({
  children,
  tone = "purple",
}: {
  children: ReactNode;
  tone?: KpiTone;
}) {
  const styles = TONE_STYLES[tone];
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[0.6875rem] font-semibold ${styles.badge}`}
    >
      {children}
    </span>
  );
}

export function CalculatorPanel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <CalculatorSection className={className}>
      <div className="mb-5">
        <h3 className={calcHeading}>{title}</h3>
        {description ? (
          <p className={`mt-1.5 max-w-2xl ${calcPara}`}>{description}</p>
        ) : null}
      </div>
      {children}
    </CalculatorSection>
  );
}
