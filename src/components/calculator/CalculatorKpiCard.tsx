import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { calcKpiCard } from "./calculatorUi";

type CalculatorKpiCardProps = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon: LucideIcon;
  accent?: boolean;
};

export function CalculatorKpiCard({
  label,
  value,
  sub,
  icon: Icon,
}: CalculatorKpiCardProps) {
  return (
    <div className={calcKpiCard}>
      <div className="mb-4 flex items-start justify-between">
        <div className="font-heading text-xs font-medium uppercase tracking-[0.12em] text-[#50617a] md:text-sm">
          {label}
        </div>
        <div className="rounded-xl bg-[#F5F7FA] p-2 text-[#0a143b]">
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
      <div className="mb-1 font-heading text-3xl font-medium tracking-tight text-[#0a143b] md:text-4xl">
        {value}
      </div>
      {sub ? <div className="mt-2 font-sans text-xs text-[#50617a]">{sub}</div> : null}
    </div>
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
    <div className={`rounded-xl border border-[#535353]/10 bg-white p-6 md:p-8 ${className}`}>
      <h3 className="font-heading text-lg font-medium text-[#0a143b] md:text-xl">{title}</h3>
      {description ? (
        <p className="mb-6 mt-2 font-sans text-sm leading-relaxed text-[#50617a]">{description}</p>
      ) : (
        <div className="mb-4" />
      )}
      {children}
    </div>
  );
}
