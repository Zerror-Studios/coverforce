"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { rectFromDOM, type WayModalRect } from "@/lib/wayModalMotion";
import dynamic from "next/dynamic";

import Container from "../common/Container";
import WayCardModal from "./WayCardModal";
import { WayCardHoverProvider } from "./WayCardHoverContext";
import { WAY_CARD_MODALS } from "@/data/wayCardModals";

type CardBackground = "accent" | "light" | "developer";

const CARD_BACKGROUNDS: Record<CardBackground, string> = {
  accent: "bg-[linear-gradient(135deg,#2C33BB_0%,#6B5FD4_45%,#9F7CFF_100%)]",
  light: "bg-[linear-gradient(135deg,#DADEF5_0%,#F8F0FC_55%,#FFFFFF_100%)]",
  developer: "bg-[linear-gradient(135deg,#8A80DD_0%,#ACA8D7_50%,#8A80DD_100%)]",
};

const WholesalerMock = dynamic(() => import("./WholesalerMock"), {
  loading: () => <MockPlaceholder />,
});
const BrokerMockWithCardHover = dynamic(
  () => import("./BrokerMock").then((m) => ({ default: m.BrokerMockWithCardHover })),
  { loading: () => <MockPlaceholder /> },
);
const BrokerMock = dynamic(() => import("./BrokerMock"), {
  loading: () => <MockPlaceholder />,
});
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
  background?: CardBackground;
  lightStrip?: boolean;
  mockAlign?: "center" | "bottom";
  hideMock?: boolean;
  onOpen: (originRect: WayModalRect | null) => void;
};

type WayCardConfig = Omit<WayCardProps, "children" | "onOpen"> & {
  mock: ReactNode;
  modalPreview: ReactNode;
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
  background,
  lightStrip = false,
  mockAlign = "center",
  hideMock = false,
  onOpen,
}: WayCardProps) {
  const [hovered, setHovered] = useState(false);
  const mockRef = useRef<HTMLDivElement>(null);
  const isDark = variant === "dark";
  const textClass =
    background === "developer"
      ? "text-[#0a143b]"
      : background === "accent" || isDark
        ? "text-white"
        : "text-[#0a143b]";

  const handleOpen = () => {
    const rect = mockRef.current?.getBoundingClientRect();
    onOpen(rect ? rectFromDOM(rect) : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <WayCardHoverProvider hovered={hovered}>
      <article
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Open ${label} details`}
        className={`way-card-shell relative cursor-pointer ${wide ? "aspect-[1179/530]" : "aspect-[580/530]"} ${textClass} ${className}`}
      >
      <div className={`way-card-body absolute inset-0 overflow-hidden rounded-sm flex flex-col p-5 md:p-6 ${background ? CARD_BACKGROUNDS[background] : ""}`}>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className={`flex items-start gap-4 ${lightStrip ? "justify-end" : "justify-between"}`}>
            {!lightStrip && (
              <p className="flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#FFFFFF]">
                <span className="inline-block size-2 shrink-0 rounded-full bg-[#FFFFFF]" aria-hidden />
                {label}
              </p>
            )}
            <span className="way-card-expand-btn flex size-9 shrink-0 items-center justify-center rounded-sm">
              <svg
                className="way-card-expand-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  className="way-card-expand-tr"
                  d="M13.75 6.75L10.25 6.75L10.25 5L15.5 5L15.5 10.25L13.75 10.25L13.75 6.75Z"
                />
                <path
                  className="way-card-expand-bl"
                  d="M6.75 10.25L5 10.25L5 15.5L10.25 15.5L10.25 13.75L6.75 13.75L6.75 10.25Z"
                />
              </svg>
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
        className={`way-card-mock pointer-events-none absolute inset-0 z-20 p-5 transition-opacity duration-300 md:p-6 ${hideMock ? "opacity-0" : "opacity-100"} ${mockAlign === "center" ? "flex items-center justify-center" : ""}`}
      >
        <div
          ref={mockRef}
          className={
            mockAlign === "bottom"
              ? "relative h-full w-full"
              : "relative flex w-full items-center justify-center"
          }
        >
          {children}
        </div>
      </div>
    </article>
    </WayCardHoverProvider>
  );
}

const WAY_CARDS: WayCardConfig[] = [
  {
    label: "Wholesalers",
    tagline: "Grow distribution efficiently",
    variant: "dark",
    background: "accent",
    mock: <WholesalerMock />,
    modalPreview: <WholesalerMock />,
  },
  {
    label: "Brokers",
    tagline: "One workflow for every producer",
    variant: "light",
    background: "light",
    lightStrip: true,
    mock: <BrokerMockWithCardHover />,
    modalPreview: <BrokerMock />,
  },
  {
    label: "Developers",
    tagline: "Build insurance products on Coverforce APIs",
    taglinePosition: "left",
    variant: "dark",
    wide: true,
    background: "developer",
    className: "md:col-span-2",
    mockAlign: "bottom",
    mock: <DeveloperMock />,
    modalPreview: <DeveloperMock />,
  },
  {
    label: "Startups",
    tagline: "One workflow for every producer",
    variant: "light",
    background: "light",
    lightStrip: true,
    mock: <BrokerMockWithCardHover />,
    modalPreview: <BrokerMock />,
  },
  {
    label: "Carriers",
    tagline: "Grow distribution efficiently",
    variant: "dark",
    background: "accent",
    mock: <WholesalerMock />,
    modalPreview: <WholesalerMock />,
  },
];

export default function ThreeWays() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<WayModalRect | null>(null);

  const activeConfig = WAY_CARDS.find((c) => c.label === activeCard) ?? null;
  const modalContent = activeCard ? WAY_CARD_MODALS[activeCard] : null;

  const closeModal = useCallback(() => {
    setActiveCard(null);
    setOriginRect(null);
  }, []);

  const openModal = useCallback((label: string, rect: WayModalRect | null) => {
    setOriginRect(rect);
    setActiveCard(label);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      <Container borderColor="#0A143B1A">
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="flex items-start justify-between">
            <div className="space-y-5 md:space-y-6">
              <h2 className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
                One platform.
                <br />
                Three Ways to Use It.
              </h2>
            </div>
            <p className="max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]">
              Whether you&apos;re routing submissions, quoting carriers, or building on our API, CoverForce adapts to your role.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:mt-14">
            {WAY_CARDS.map(({ mock, modalPreview, ...card }) => (
              <WayCard
                key={card.label}
                {...card}
                hideMock={activeCard === card.label}
                onOpen={(rect) => openModal(card.label, rect)}
              >
                {mock}
              </WayCard>
            ))}
          </div>
        </div>
      </Container>

      <WayCardModal
        open={activeCard !== null}
        content={modalContent}
        preview={activeConfig?.modalPreview}
        originRect={originRect}
        onClose={closeModal}
      />
    </section>
  );
}
