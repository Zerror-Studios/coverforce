import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import Container from "../common/Container";
import WayCardGradFlow, { type GradFlowVariant } from "./WayCardGradFlow";

const WholesalerMock = dynamic(() => import("./WholesalerMock"), {
  loading: () => <MockPlaceholder />,
});
const BrokerMockWithCardHover = dynamic(
  () => import("./BrokerMock").then((m) => ({ default: m.BrokerMockWithCardHover })),
  { loading: () => <MockPlaceholder /> },
);
const DeveloperMock = dynamic(() => import("./DeveloperMock"), {
  loading: () => <MockPlaceholder className="max-w-[420px]" />,
});

function MockPlaceholder({ className = "max-w-[290px]" }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-[260px] w-full animate-pulse rounded-2xl bg-white/10 ${className}`}
      aria-hidden
    />
  );
}

type WayCardProps = {
  label: string;
  tagline: string;
  taglinePosition?: "left" | "right";
  variant: "dark" | "light";
  children: ReactNode;
  className?: string;
  wide?: boolean;
  gradFlow?: GradFlowVariant;
  lightStrip?: boolean;
  mockAlign?: "center" | "bottom";
};

type WayCardConfig = Omit<WayCardProps, "children"> & {
  mock: ReactNode;
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
      <p className="max-w-48 shrink-0 text-right text-lg font-heading font-medium leading-tight tracking-tight text-[#545353]">
        {tagline}
      </p>
    </div>
  );
}

function WayCard({
  label,
  tagline,
  taglinePosition = "right",
  variant,
  children,
  className = "",
  wide = false,
  gradFlow,
  lightStrip = false,
  mockAlign = "center",
}: WayCardProps) {
  const isDark = variant === "dark";
  const textClass =
    gradFlow === "developer"
      ? "text-[#0a143b]"
      : gradFlow === "accent" || isDark
        ? "text-white"
        : "text-[#0a143b]";

  return (
    <article
      className={`way-card-shell relative cursor-pointer overflow-hidden rounded-sm ${wide ? "aspect-[1179/530]" : "aspect-[580/530]"} ${textClass} ${className}`}
    >
      <div className="way-card-body absolute inset-0 flex flex-col p-5 md:p-6">
        {gradFlow && <WayCardGradFlow variant={gradFlow} />}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className={`flex items-start gap-4 ${lightStrip ? "justify-end" : "justify-between"}`}>
            {!lightStrip && (
              <p className="flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#FFFFFF]">
                <span className="inline-block size-2 shrink-0 rounded-full bg-[#FFFFFF]" aria-hidden />
                {label}
              </p>
            )}
            <span className="way-card-expand-btn flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Image
                src="/images/expandicon.svg"
                alt=""
                width={20}
                height={20}
                className="way-card-expand-icon size-5"
                aria-hidden
              />
            </span>
          </div>
          <div className="min-h-0 flex-1" aria-hidden />
          {lightStrip ? (
            <CardBottomStrip label={label} tagline={tagline} />
          ) : (
            <div className={`flex w-full items-center ${taglinePosition === "left" ? "justify-start" : "justify-end"}`}>
              <p
                className={`text-lg font-heading font-medium leading-tight tracking-tight text-white ${taglinePosition === "left" ? "max-w-xs text-left" : "max-w-48 text-right"}`}
              >
                {tagline}
              </p>
            </div>
          )}
        </div>
      </div>
      <div
        className={`way-card-mock pointer-events-none absolute inset-0 z-20 p-5 md:p-6 ${mockAlign === "center" ? "flex items-center justify-center" : ""}`}
      >
        <div
          className={
            mockAlign === "bottom"
              ? "pointer-events-auto relative h-full w-full"
              : "pointer-events-auto relative flex w-full items-center justify-center"
          }
        >
          {children}
        </div>
      </div>
    </article>
  );
}

const WAY_CARDS: WayCardConfig[] = [
  {
    label: "Wholesalers",
    tagline: "Grow distribution efficiently",
    variant: "dark",
    gradFlow: "accent",
    mock: <WholesalerMock />,
  },
  {
    label: "Brokers",
    tagline: "One workflow for every producer",
    variant: "light",
    gradFlow: "light",
    lightStrip: true,
    mock: <BrokerMockWithCardHover />,
  },
  {
    label: "Developers",
    tagline: "Build insurance products on Coverforce APIs",
    taglinePosition: "left",
    variant: "dark",
    wide: true,
    gradFlow: "developer",
    className: "md:col-span-2",
    mockAlign: "bottom",
    mock: <DeveloperMock />,
  },
  {
    label: "Startups",
    tagline: "One workflow for every producer",
    variant: "light",
    gradFlow: "light",
    lightStrip: true,
    mock: <BrokerMockWithCardHover />,
  },
  {
    label: "Carriers",
    tagline: "Grow distribution efficiently",
    variant: "dark",
    gradFlow: "accent",
    mock: <WholesalerMock />,
  },
];

export default function ThreeWays() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Container borderColor="#0A143B1A">
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-10 xl:gap-14">
            <div className="space-y-5 md:space-y-6">
              <p className="flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#797979]">
                <span className="inline-block size-2 shrink-0 rounded-full bg-[#797979]" aria-hidden />
                Built for your role
              </p>
              <h2 className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-3xl lg:leading-[1.1]">
                One platform.
                <br />
                Three Ways to Use It.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#091843BF] md:text-sm lg:pt-8 xl:pt-10">
              Whether you&apos;re routing submissions, quoting carriers, or building on our API, CoverForce adapts to your role.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:mt-14">
            {WAY_CARDS.map(({ mock, ...card }) => (
              <WayCard key={card.label} {...card}>
                {mock}
              </WayCard>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
