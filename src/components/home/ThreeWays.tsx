import React, { type ReactNode } from "react";
import Image from "next/image";

import Container from "../common/Container";
type WayCardProps = {
  label: string;
  tagline: string;
  taglinePosition?: "left" | "right";
  variant: "dark" | "light";
  children: ReactNode;
  className?: string;
  wide?: boolean;
  accent?: boolean;
  cardBg?: string;
  cardBgImage?: string;
};

function CardBottomStrip({ label, tagline }: { label: string; tagline: string }) {
  return (
    <div
      className="-mx-5 -mb-5 mt-auto flex items-center justify-between gap-4 border-t border-[#E8E0F5]/60 px-4 py-3 md:-mx-6 md:-mb-6 md:px-5 md:py-3.5"
      style={{ background: "linear-gradient(90deg, #F8F3FF 0%, #F1F1FF 100%)" }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#797979]" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#797979]">{label}</span>
      </div>
      <p className="shrink-0 text-right text-xl font-heading font-medium leading-tight tracking-tight text-[#545353] max-w-[12rem]">{tagline}</p>
    </div>
  );
}

function WayCard({ label, tagline, taglinePosition = "right", variant, children, className = "", wide = false, accent = false, cardBg, cardBgImage }: WayCardProps) {
  const isDark = variant === "dark";
  const isLightText = accent || (isDark && !cardBg);

  return (
    <article
      className={`relative flex w-full flex-col overflow-hidden rounded-sm p-5 md:p-6 ${wide ? "aspect-[1179/530]" : "aspect-[580/530]"} ${cardBg ? "text-[#0a143b]" : accent ? "bg-[#9F7CFF] text-white" : isDark ? "bg-gradient-to-br from-[#5B35E0] via-[#4a2d9e] to-[#3d2878] text-white" : "bg-gradient-to-br from-[#EDE8F8] via-[#F5F3FA] to-white text-[#0a143b]"} ${className}`}
      style={cardBg ? { backgroundColor: cardBg } : undefined}
    >
      {cardBgImage && (
        <div className="pointer-events-none absolute -translate-y-1/5 left-1/2 z-0 h-[150%] w-[150%] -translate-x-1/2 md:-top-24 lg:-top-28">
          <Image src={cardBgImage} alt="" fill className="object-cover object-center w-full h-full" sizes="(max-width: 768px) 100vw, 50vw" aria-hidden />
        </div>
      )}
      {accent && (
        <span className="pointer-events-none absolute -left-8 -top-2 z-0 aspect-square w-[200%] rounded-full bg-[#2C33BB] md:-left-12 md:-top-4 blur-3xl" aria-hidden />
      )}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className={`flex items-start gap-4 ${cardBgImage ? "justify-end" : "justify-between"}`}>
          {!cardBgImage && (
            <p className="flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#FFFFFF]">
            <span className="inline-block size-2 shrink-0 rounded-full bg-[#FFFFFF]" aria-hidden />
            {label}
          </p>
          )}
          <span className="cursor-pointer flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#8E68F9]">
            <Image src="/images/expandicon.svg" alt="" width={20} height={20} className="size-5" aria-hidden />
          </span>
        </div>
        <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center py-2">
          {children}
        </div>
        {cardBgImage ? (
          <CardBottomStrip label={label} tagline={tagline} />
        ) : (
          <div className={`flex items-center  w-full ${taglinePosition === "left" ? "justify-start" : "justify-end"}`}>
            <p className={`text-xl font-heading font-medium leading-tight tracking-tight text-[#545353] ${taglinePosition === "left" ? "max-w-xs" : "max-w-[12rem]"}  ${taglinePosition === "left" ? "text-left" : "text-right"} text-white`}>
              {tagline}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Wholesaler / Carrier Mock ───────────────────────────────────────────────
function WholesalerMock() {
  return (
    <div className="relative w-full max-w-[290px] -ml-32">

      {/* ── Floating Email Intake card (top-right) ── */}
      <div className="absolute top-0 -right-32 z-20 w-full rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2.5">
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-neutral-100">
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <rect x="0.5" y="0.5" width="10" height="8" rx="1.5" stroke="#9ca3af" strokeWidth="0.9"/>
              <path d="M0.5 2L5.5 5.5L10.5 2" stroke="#9ca3af" strokeWidth="0.9" strokeLinecap="round"/>
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold leading-tight text-[#0a143b]">Email Intake</p>
            <p className="truncate text-[9px] leading-tight text-neutral-400">submissions@coverforce.com</p>
          </div>
        </div>
        {/* Message body */}
        <div className="px-3 py-5">
          <div className="flex items-start justify-between gap-1">
            <p className="text-[10px] font-medium leading-[1.4] text-[#0a143b]">
              New submission from<br />Summit Risk Advisors
            </p>
            <span className="shrink-0 pt-0.5 text-[9px] text-neutral-400">9:14 AM</span>
          </div>
        </div>
        {/* Attachments */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-3 py-2">
          <div className="flex items-center gap-1 text-[9px] text-neutral-400">
            <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
              <path d="M0.5 3.5C2 1 9 1 10.5 3.5C9 6 2 6 0.5 3.5Z" stroke="#9ca3af" strokeWidth="0.7"/>
              <circle cx="5.5" cy="3.5" r="1.3" stroke="#9ca3af" strokeWidth="0.7"/>
            </svg>
            5 attachments
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-1.5">
              <span className="size-[18px] overflow-hidden rounded-full border-[1.5px] border-white bg-amber-400 flex items-center justify-center text-[7px] font-bold text-white">A</span>
              <span className="size-[18px] overflow-hidden rounded-full border-[1.5px] border-white bg-blue-400 flex items-center justify-center text-[7px] font-bold text-white">B</span>
            </div>
            <span className="ml-1 flex size-[18px] items-center justify-center rounded-full bg-[#7C5CFC] text-[7px] font-bold text-white">+2</span>
          </div>
        </div>
      </div>

      {/* ── ACORD 25 main card ── */}
      <div className="mt-[72px] rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-2.5">
          <span className="flex size-[22px] items-center justify-center rounded-md bg-neutral-100 shrink-0">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect x="0.5" y="0.5" width="9" height="11" rx="1.5" stroke="#9ca3af" strokeWidth="0.9"/>
              <path d="M2.5 4h5M2.5 6h5M2.5 8h3" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="text-[13px] font-bold text-[#0a143b]">ACORD 25</span>
        </div>

        {/* Two insured rows */}
        <div className="divide-y divide-neutral-100 border-b border-neutral-100">
          {[0, 1].map((n) => (
            <div key={n} className="grid grid-cols-2 gap-x-3 px-4 py-2">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">Insured</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="size-3 shrink-0 rounded-sm bg-neutral-200" />
                  <p className="text-[9px] font-medium text-[#0a143b]">Construction LLC</p>
                </div>
              </div>
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">Policy Number</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="size-3 shrink-0 rounded-sm bg-neutral-200" />
                  <p className="text-[9px] font-medium text-[#0a143b]">GL-2024-98</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Limits summary heading */}
        <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
          <p className="text-[10px] font-semibold text-[#0a143b]">Limits Summary</p>
          <span className="text-[9px] font-semibold text-[#5B35E0]">View All</span>
        </div>

        {/* Limit rows */}
        <div className="divide-y divide-neutral-100 px-4">
          {[
            { label: "General Liability",   value: "$1,000,000" },
            { label: "Automobile Liability", value: "$500,000"   },
            { label: "Umbrella Liability",   value: "$5,000,000" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2">
              <span className="text-[10px] text-neutral-500">{row.label}</span>
              <span className="text-[10px] font-semibold text-[#0a143b]">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/70 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="flex size-[14px] shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3l2 2 4-4" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wide text-emerald-600 leading-tight">Verified</p>
              <p className="text-[7px] leading-tight text-neutral-400">This certificate is valid.</p>
            </div>
          </div>
          <span className="text-[8px] text-neutral-400">ACORD 25 Standard</span>
        </div>
      </div>
    </div>
  );
}

function BrokerMock() {
  return (
    <div className="relative w-full" style={{ height: "260px", maxWidth: "300px" }}>

      {/* ── Back card: 40+ carriers + bar chart (top-right, partially cropped left) ── */}
      <div
        className="absolute top-0 w-full -right-20 rounded-2xl bg-white overflow-hidden"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        {/* Top section */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Quotes Returned Today</p>
          <p className="mt-1 text-[22px] font-bold leading-tight text-[#0a143b]">40+ carriers</p>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100" />

        {/* Bottom section: text left + bars right */}
        <div className="flex items-end px-5 pt-3 pb-4 gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#0a143b]">AI pre-filled application</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Pipeline visible</p>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-[5px] shrink-0">
            {[15, 25, 35, 45, 55,65, 75, 85].map((h, i) => (
              <div
                key={i}
                className="rounded-t-[3px]"
                style={{
                  width: "10px",
                  height: `${h}px`,
                  background: "#5B35E0",
                  opacity: 0.35 + i * 0.09,
                }}
              />
            ))}
            {/* TIME vertical label */}
            <div className="flex items-center self-stretch ml-0.5">
              <span
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "7px",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#a3a3a3",
                  lineHeight: 1,
                }}
              >
                Time
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Front card: Broker Workflow (bottom-left, overlaps back card) ── */}
      <div
        className="absolute w-full bottom-0 -left-20 rounded-2xl bg-white overflow-hidden"
        style={{
          zIndex: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        }}
      >
        {/* Header: avatar icon + title + subtitle */}
        <div className="flex items-center gap-3 px-4 py-3">
          <span
            className="flex shrink-0 items-center justify-center rounded-full bg-neutral-100"
            style={{ width: "32px", height: "32px" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="5" r="2.8" stroke="#9ca3af" strokeWidth="1"/>
              <path d="M2 13c0-3.038 2.462-5.5 5.5-5.5S13 9.962 13 13" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </span>
          <div>
            <p className="text-[13px] font-bold leading-tight text-[#0a143b]">Broker Workflow</p>
            <p className="text-[10px] leading-tight text-neutral-400">One workflow for every producer</p>
          </div>
        </div>

        {/* Dashed separator */}
        <div style={{ borderTop: "1.5px dashed #e5e7eb", marginLeft: "16px", marginRight: "16px" }} />

        {/* Stats row: 60% left | INTAKE BIND right */}
        <p className="px-4 pt-3 text-[34px] font-bold leading-none text-[#0a143b]">60%</p>
        <div className="flex items-start gap-4 px-4 pt-3 pb-4">
          {/* Left: big stat */}
          <div className="shrink-0">
            
            <p
              className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "#5B35E0" }}
            >
              Faster Quoting
            </p>
            <p className="text-[9px] text-neutral-400 mt-0.5">Quote time reduction</p>
          </div>

          {/* Right: INTAKE → BIND progress */}
          <div className="flex-1 pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Intake</span>
              <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Bind</span>
            </div>
            <div
              className="relative overflow-hidden rounded-full"
              style={{ height: "8px", background: "#e5e7eb" }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: "62%",
                  background: "linear-gradient(90deg, #5B35E0 0%, #A78BFA 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeveloperMock() {
  const CodeIcon = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M5 4L1 8l4 4" stroke="#5B35E0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 4l4 4-4 4" stroke="#5B35E0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const rows = [
    { title: "API Key Generated",    sub: "your API Key is ready to use" },
    { title: "Sandbox Connected",    sub: "Connected to sandbox environment" },
    { title: "Test Qoute Successful", sub: "Test Quote returned from 40+ carrier" },
  ];

  return (
    <div
      className="absolute -bottom-20  right-52 w-full rounded-t-2xl bg-white z-10"
      style={{
        maxWidth: "420px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-12 pb-6">
        <span
          className="flex shrink-0 items-center justify-center rounded-xl bg-neutral-100"
          style={{ width: "36px", height: "36px" }}
        >
          <CodeIcon size={15} />
        </span>
        <div>
          <p className="text-[14px] font-bold leading-tight text-[#0a143b]">Developers</p>
          <p className="text-[10px] leading-tight text-neutral-400">Built with Coverforce AI</p>
        </div>
      </div>

      {/* ── Tab row ── */}
      <div className="flex items-center gap-2 px-5 pb-4">
        {/* All */}
        <span className="rounded-full px-4 py-2 text-[11px] font-medium text-neutral-500 bg-neutral-100">
          All
        </span>
        {/* Integration (active) */}
        <span
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold text-white"
          style={{ background: "#5B35E0" }}
        >
          <CodeIcon size={11} />
          <span style={{ color: "#fff" }}>Integration</span>
        </span>
        {/* Testing */}
        <span className="rounded-full px-4 py-2 text-[11px] font-medium text-neutral-500 bg-neutral-100">
          Testing
        </span>
      </div>

      {/* ── Rows ── */}
      <div className="border-t border-neutral-100">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-5"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #f3f4f6" : "none" }}
          >
            <div className="flex items-start gap-3">
              {/* code icon in small rounded square */}
              <span
                className="flex shrink-0 items-center justify-center rounded-lg bg-neutral-100 mt-0.5"
                style={{ width: "26px", height: "26px" }}
              >
                <CodeIcon size={11} />
              </span>
              <div>
                <p className="text-[12px] font-bold leading-tight text-[#0a143b]">{row.title}</p>
                <p className="text-[10px] leading-tight text-neutral-400 mt-0.5">{row.sub}</p>
              </div>
            </div>
            {/* Done pill */}
            <span
              className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold"
              style={{ background: "#dcfce7", color: "#16a34a" }}
            >
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5l2.5 2.5 5-5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Done
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ThreeWays = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(122vw,1200px)] overflow-hidden md:h-[min(116vw,1420px)] lg:h-[min(112vw,1700px)]">
        <Image src="/images/Group%201000006214.svg" alt="" fill className="translate-y-10 object-cover object-top md:translate-y-14 lg:translate-y-16" sizes="100vw" aria-hidden />
      </div>

      <Container borderColor="#0A143B1A">
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-10 xl:gap-14">
            <div className="space-y-5 md:space-y-6">
              <p className="flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#797979]">
                <span className="inline-block size-2 shrink-0 rounded-full bg-[#797979]" aria-hidden />
                Built for your role
              </p>
              <h2 className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-4xl lg:leading-[1.1]">
                One platform.<br />Three Ways to Use It.
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#091843BF] md:text-base lg:pt-8 xl:pt-10">
              Whether you&apos;re routing submissions, quoting carriers, or building on our API, CoverForce adapts to your role.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:mt-14">
            <WayCard label="Wholesalers" tagline="Grow distribution efficiently" variant="dark" accent>
              <WholesalerMock />
            </WayCard>

            <WayCard label="Brokers" tagline="One workflow for every producer" variant="light" cardBg="#FFFFFFCC" cardBgImage="/images/secondcardbg.svg">
              <BrokerMock />
            </WayCard>

            <WayCard label="Developers" tagline="Build insurance products on Coverforce APIs" taglinePosition="left" variant="dark" wide cardBg="#8A80DDAB" className="md:col-span-2">
              <DeveloperMock />
            </WayCard>

            <WayCard label="Startups" tagline="One workflow for every producer" variant="light" cardBg="#FFFFFFCC" cardBgImage="/images/secondcardbg.svg">
              <BrokerMock />
            </WayCard>

            <WayCard label="Carriers" tagline="Grow distribution efficiently" variant="dark" accent>
              <WholesalerMock />
            </WayCard>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ThreeWays;