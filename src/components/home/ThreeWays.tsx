"use client";

import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rectFromDOM, type WayModalRect } from "@/lib/wayModalMotion";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

gsap.registerPlugin(ScrollTrigger);
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
const DeveloperTerminalBg = dynamic(() => import("./DeveloperTerminalBg"), {
  ssr: false,
  loading: () => null,
});
const GlobeScene = dynamic(() => import("@/components/home/GlobeScene"), {
  ssr: false,
  loading: () => null,
});

function BrokersGlobeVideo() {
  return (
    <div className="h-full w-full overflow-hidden bg-[#E8E4F8]">
      <video
        className="block h-full w-full min-h-full min-w-full scale-[1.04] object-cover object-center"
        src="/videos/globevideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />
    </div>
  );
}

function MockPlaceholder({ className = "max-w-[290px]" }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-[260px] w-full animate-pulse rounded-2xl bg-white/10 ${className}`}
      aria-hidden
    />
  );
}

function WayCardDotGrid({
  variant,
  active,
}: {
  variant: "dark" | "light";
  active: boolean;
}) {
  return (
    <div
      aria-hidden
      className={[
        "way-card-dot-grid",
        variant === "dark" ? "way-card-dot-grid--dark" : "way-card-dot-grid--light",
        active ? "way-card-dot-grid--active" : "",
      ].join(" ")}
    />
  );
}

// Remove label, lightStrip from WayCardProps
type WayCardProps = {
  tagline: string;
  taglinePosition?: "left" | "right";
  variant: "dark" | "light";
  children: ReactNode;
  className?: string;
  wide?: boolean;
  background?: CardBackground;
  mockAlign?: "center" | "bottom";
  hideMock?: boolean;
  backgroundScene?: ReactNode;
  backgroundInteractive?: boolean;
  dotGrid?: boolean;
  onOpen: (originRect: WayModalRect | null) => void;
};

// Remove label, lightStrip from WayCardConfig
type WayCardConfig = Omit<WayCardProps, "children" | "onOpen"> & {
  label: string; // keep for modal lookup only
  mock: ReactNode;
  modalPreview: ReactNode;
};

// Updated WAY_CARDS — remove lightStrip entries
const WAY_CARDS: WayCardConfig[] = [
  {
    label: "Wholesalers",
    tagline: "Grow distribution efficiently",
    variant: "dark",
    background: "accent",
    dotGrid: true,
    mock: <WholesalerMock />,
    modalPreview: <WholesalerMock />,
  },
  {
    label: "Brokers",
    tagline: "One workflow for every producer",
    variant: "light",
    background: "light",
    backgroundScene: <BrokersGlobeVideo />,
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
    backgroundScene: <DeveloperTerminalBg />,
    mock: <DeveloperMock />,
    modalPreview: <DeveloperMock />,
  },
  {
    label: "Startups",
    tagline: "One workflow for every producer",
    variant: "light",
    background: "light",
    backgroundInteractive: true,
    mock: <BrokerMockWithCardHover />,
    modalPreview: <BrokerMock />,
    backgroundScene: <GlobeScene interactive />,
  },
  {
    label: "Carriers",
    tagline: "Grow distribution efficiently",
    variant: "dark",
    background: "accent",
    dotGrid: true,
    mock: <WholesalerMock />,
    modalPreview: <WholesalerMock />,
  },
];

function useLazyInView<T extends HTMLElement>(rootMargin = "240px 0px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return { ref, visible };
}

const WayCard = memo(function WayCard({
  tagline,
  taglinePosition = "right",
  variant,
  children,
  className = "",
  wide = false,
  background,
  mockAlign = "center",
  hideMock = false,
  backgroundScene,
  backgroundInteractive = false,
  dotGrid = false,
  onOpen,
}: Omit<WayCardProps, "label" | "lightStrip">) {
  const [hovered, setHovered] = useState(false);
  const mockRef = useRef<HTMLDivElement>(null);
  const { ref: cardRef, visible: inView } = useLazyInView<HTMLElement>();
  const isDark = variant === "dark";
  const textClass =
    background === "developer" && !backgroundScene
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
        ref={cardRef}
        role="button"
        tabIndex={0}
        onClick={backgroundInteractive ? undefined : handleOpen}
        onKeyDown={backgroundInteractive ? undefined : handleKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Open details`}
        className={`way-card-shell relative cursor-pointer [content-visibility:auto] [contain-intrinsic-size:auto_530px] ${wide ? "aspect-[1179/530]" : "aspect-[580/530]"} ${hovered ? "way-card-shell--hovered" : ""} ${textClass} ${className}`}
      >
        <div
          className={`way-card-body absolute inset-0 overflow-hidden flex flex-col p-5 md:p-8 ${background ? CARD_BACKGROUNDS[background] : ""}`}
        >
          {dotGrid ? <WayCardDotGrid variant={variant} active={hovered} /> : null}
          {backgroundScene && inView ? (
            <div
              className={`absolute inset-0 z-[1] overflow-hidden ${backgroundInteractive ? "pointer-events-auto" : "pointer-events-none"}`}
              aria-hidden={!backgroundInteractive}
              onPointerDown={backgroundInteractive ? (e) => e.stopPropagation() : undefined}
              onClick={backgroundInteractive ? (e) => e.stopPropagation() : undefined}
            >
              {backgroundScene}
            </div>
          ) : null}
        </div>
        <div
          className={`way-card-mock pointer-events-none absolute inset-0 z-10 p-5 transition-opacity duration-300 md:p-6 ${hideMock ? "opacity-0" : "opacity-100"} ${mockAlign === "center" ? "flex items-center justify-center" : ""}`}
        >
          <div
            ref={mockRef}
            className={
              mockAlign === "bottom"
                ? "relative h-full w-full"
                : "relative flex w-full items-center justify-center"
            }
          >
            {inView ? children : <MockPlaceholder />}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-5 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <p
              className={`${taglinePosition === "left" ? "max-w-xs" : "max-w-[16rem]"} text-3xl font-heading font-medium leading-[1.12] tracking-tight ${variant == "light" ? "text-[#424242]" : "text-white"} md:text-4xl lg:text-[1.625rem] lg:leading-[1.12] text-left`}
            >
              {tagline}
            </p>
            <span
              className="way-card-expand-btn pointer-events-auto relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpen();
                }
              }}
            >
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
                  d="M6.25 10.25L5 10.25L5 15.5L10.25 15.5L10.25 13.75L6.75 13.75L6.75 10.25Z"
                />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </WayCardHoverProvider>
  );
});

export default function ThreeWays() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<WayModalRect | null>(null);

  const activeConfig = WAY_CARDS.find((c) => c.label === activeCard) ?? null;
  const modalContent = activeCard ? WAY_CARD_MODALS[activeCard] : null;

  useGSAP(
    () => {
      const header = headerRef.current;
      const heading = headingRef.current;
      const desc = descRef.current;
      if (!header || !heading) return;

      const cleanups: (() => void)[] = [];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cleanups.push(animateSplitTextReveal(heading, { trigger: header }));

      if (desc) {
        if (reducedMotion) {
          gsap.set(desc, { opacity: 1 });
        } else {
          gsap.set(desc, { opacity: 0 });

          const fadeTl = gsap.timeline({
            scrollTrigger: {
              trigger: header,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          });

          fadeTl.to(desc, { opacity: 1, duration: 0.8, ease: "power2.out" });

          const lenis = window.lenis;
          let scrollPending = false;
          const onLenisScroll = () => {
            if (scrollPending) return;
            scrollPending = true;
            requestAnimationFrame(() => {
              ScrollTrigger.update();
              scrollPending = false;
            });
          };
          lenis?.on("scroll", onLenisScroll);

          cleanups.push(() => {
            lenis?.off("scroll", onLenisScroll);
            fadeTl.scrollTrigger?.kill();
            fadeTl.kill();
          });
        }
      }

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef },
  );

  const closeModal = useCallback(() => {
    setActiveCard(null);
    setOriginRect(null);
  }, []);

  const openModal = useCallback((label: string, rect: WayModalRect | null) => {
    setOriginRect(rect);
    setActiveCard(label);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      <Container borderColor="#53535380">
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div ref={headerRef} className="flex items-start justify-between">
            <div className="space-y-5 md:space-y-6">
              <h2
                ref={headingRef}
                className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>One platform.</span>
                <br />
                <span data-split>Three Ways to Use It.</span>
              </h2>
            </div>
            <p
              ref={descRef}
              className="max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]"
            >
              Whether you&apos;re routing submissions, quoting carriers, or building on our API, CoverForce adapts to your role.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:mt-14">
            {WAY_CARDS.map(({ mock, modalPreview, ...card }) => (
              <WayCard
                key={card.label}
                {...card}
                hideMock={(card.hideMock ?? false) || activeCard === card.label}
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
