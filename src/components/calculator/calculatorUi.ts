/** Shared ROI calculator design tokens — neutral dashboard, site-aligned. */

export const calcText = "#444444";
export const calcTextMuted = "#6B6B6B";
export const calcTextSoft = "#8A8A8A";
export const calcSurface = "#F7F7F7";
export const calcAccent = "#2E2E2E";
export const calcAccentMuted = "#6B6B6B";

export const calcLabel =
  "mb-1.5 block font-mono text-[0.6875rem] font-medium tracking-normal text-[#8A8A8A] md:text-xs";

export const calcEyebrow =
  "font-mono text-[0.6875rem] font-medium tracking-normal text-[#8A8A8A]";

/** KPI / metric label (mono) */
export const calcMetricLabel =
  "font-mono text-[0.6875rem] font-medium tracking-normal text-[#8A8A8A]";

/** Section title inside a card (heading) */
export const calcHeading =
  "font-heading text-lg font-medium tracking-tight text-[#444444]";

/** Supporting copy under a section title (sans) */
export const calcPara =
  "font-sans text-sm leading-relaxed text-[#6B6B6B]";

/** Secondary title within a card (heading) */
export const calcSubheading =
  "font-heading text-sm font-medium tracking-tight text-[#444444]";

/** Caption / helper text (sans) */
export const calcSubpara =
  "font-sans text-xs leading-relaxed text-[#8A8A8A]";

/** Large KPI value (heading) */
export const calcMetricValue =
  "font-heading text-3xl font-medium tracking-tight text-[#2A2A2A] md:text-[2rem] md:leading-none";

/** Secondary KPI value (heading) */
export const calcMetricValueSm =
  "font-heading text-2xl font-medium tracking-tight text-[#2A2A2A] md:text-[1.75rem] md:leading-none";

/** Inline trend / context next to a metric (sans) */
export const calcMetricTrend =
  "font-sans text-xs font-medium tabular-nums";

/** Row label in lists / bars (sans) */
export const calcRowLabel =
  "font-sans text-xs font-medium text-[#444444]";

/** Numeric amount in lists (heading) */
export const calcRowValue =
  "font-heading text-sm font-medium tabular-nums text-[#2A2A2A]";

export const calcBorder = "border border-[#535353]/12";

export const calcCard = `${calcBorder} rounded-md bg-white`;

export const calcPanel = `${calcCard} p-5 md:p-6`;

export const calcKpiCard = `${calcCard} p-5 md:p-6`;

export const calcInputWrap =
  "relative flex items-center overflow-hidden rounded-md border border-[#535353]/15 bg-[#FAFAFA] transition-all focus-within:border-[#444444] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#444444]/10";

export const calcSegmentActive =
  "border-[#5B35E0]/30 bg-[#5B35E0]/8 text-[#3834A4]";

export const calcSegmentIdle =
  "border-[#E4E7EC] bg-[#FAFBFC] text-[#6B7280] hover:border-[#C8CDD6]";

export const calcTextClass = "text-[#444444]";
export const calcMutedClass = "text-[#6B6B6B]";
export const calcSoftClass = "text-[#8A8A8A]";

/** Chart / progress palette — colorful, site-aligned. */
export const calcChart = {
  purple: "#5B35E0",
  purpleSoft: "#7B5CFF",
  green: "#10B981",
  teal: "#0D9488",
  orange: "#F97316",
  indigo: "#6366F1",
  rose: "#F43F5E",
  violet: "#8B5CF6",
  cyan: "#06B6D4",
  slate: "#A1A1AA",
  track: "#F0F0F4",
} as const;

export const calcBarSize = 28;
export const calcBarCategoryGap = "28%";

/** Appetite-section table pattern (intelligence page), adapted for ROI. */
export const calcTableWrap =
  "overflow-x-auto overflow-y-hidden";

export const calcTable = "w-full border-collapse font-sans";

export const calcTh =
  "px-4 py-3.5 font-mono text-sm font-medium text-[#414141] md:px-5 md:py-4";

export const calcThRight = `${calcTh} text-right`;

export const calcTd =
  "px-4 py-3.5 font-sans text-sm font-regular text-[#444444] md:px-5 md:py-4";

export const calcTdRight = `${calcTd} text-right`;

export const calcTdMuted =
  "px-4 py-3.5 font-sans text-sm font-regular text-[#6B6B6B] md:px-5 md:py-4";

export const calcTdMutedRight = `${calcTdMuted} text-right`;

export const calcTr = "border-b border-[#E6E6E6] last:border-b-0";

export const calcTheadRow = "border-b border-[#E6E6E6] bg-[#FAF7FF]";

export const calcSectionRow =
  "border-b border-[#E6E6E6] bg-[#FAF7FF]";

export const calcTotalRow =
  "border-b border-[#E6E6E6] bg-[#FAFAFA] last:border-b-0";
