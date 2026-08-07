"use client";

import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

gsap.registerPlugin(ScrollTrigger);
import dynamic from "next/dynamic";

import Container from "../common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import WayCardModal from "./WayCardModal";
import { WayCardHoverProvider } from "./WayCardHoverContext";
import { WAY_CARD_MODALS } from "@/data/wayCardModals";
import { CARD_BACKGROUND_STYLES, type CardBackground } from "@/data/wayCardStyles";
import StartupRecentActivityCard from "@/components/solutions/startups/StartupRecentActivityCard";
import AiAppetiteEngineMock from "@/components/solutions/wholesalers/AiAppetiteEngineMock";

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
  loading: () => <MockPlaceholder className="max-w-[min(100%,340px)] sm:max-w-[420px]" />,
});
const DeveloperTerminalBg = dynamic(() => import("./DeveloperTerminalBg"), {
  ssr: false,
  loading: () => null,
});
const WayCardDotGridScene = dynamic(() => import("./WayCardDotGridScene"), {
  ssr: false,
  loading: () => null,
});
const BrokersCardEarth = dynamic(() => import("@/components/home/BrokersCardEarth"), {
  ssr: false,
  loading: () => null,
});
const GlobeScene = dynamic(() => import("@/components/home/GlobeScene"), {
  ssr: false,
  loading: () => null,
});

function MockPlaceholder({ className = "max-w-[250px] sm:max-w-[290px]" }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-[240px] w-full animate-pulse rounded-2xl bg-white/10 sm:h-[280px] md:h-[260px] ${className}`}
      aria-hidden
    />
  );
}

function WayCardDotGrid({
  variant,
  active,
  inView,
}: {
  variant: "dark" | "light";
  active: boolean;
  inView: boolean;
}) {
  if (!inView) return null;

  return <WayCardDotGridScene variant={variant} active={active} />;
}

// Remove label, lightStrip from WayCardProps
type WayCardProps = {
  tagline: ReactNode;
  taglinePosition?: "left" | "right";
  variant: "dark" | "light";
  children: ReactNode;
  className?: string;
  wide?: boolean;
  compact?: boolean;
  background?: CardBackground;
  mockAlign?: "center" | "bottom";
  mockShiftDown?: boolean;
  hideMock?: boolean;
  /** Mobile-only scale for the inner mock (desktop unchanged). */
  mobileMockScale?: number;
  backgroundScene?: ReactNode;
  backgroundInteractive?: boolean;
  backgroundSceneBlendScreen?: boolean;
  dotGrid?: boolean;
  onOpen: () => void;
};

// Remove label, lightStrip from WayCardConfig
type WayCardConfig = Omit<WayCardProps, "children" | "onOpen"> & {
  label: string; // keep for modal lookup only
  mock: ReactNode;
  modalPreview: ReactNode;
  modalPreviewAlign?: "center" | "right";
};

// Updated WAY_CARDS - remove lightStrip entries
const WAY_CARDS: WayCardConfig[] = [
  {
    label: "Wholesalers",
    tagline: "Grow distribution efficiently",
    variant: "dark",
    background: "wholesaler",
    dotGrid: true,
    mockShiftDown: true,
    mobileMockScale: 0.6,
    mock: <WholesalerMock />,
    modalPreview: <WholesalerMock />,
  },
  {
    label: "Brokers",
    tagline: "One workflow for every producer",
    variant: "dark",
    compact: true,
    background: "broker",
    backgroundScene: <BrokersCardEarth />,
    backgroundSceneBlendScreen: true,
    mobileMockScale: 0.64,
    mock: <BrokerMockWithCardHover />,
    modalPreview: <BrokerMock />,
  },
  {
    label: "Developers",
    tagline: (
      <>
        Build insurance products
        <br className="md:hidden" />
        <span className="hidden md:inline"> </span>
        on Coverforce APIs
      </>
    ),
    taglinePosition: "left",
    variant: "dark",
    wide: true,
    background: "developer",
    className: "md:col-span-2",
    mockAlign: "bottom",
    mobileMockScale: 0.7,
    backgroundScene: <DeveloperTerminalBg />,
    mock: <DeveloperMock />,
    modalPreview: <DeveloperMock align="modal" />,
    modalPreviewAlign: "right",
  },
  {
    label: "Startups",
    tagline: "Launch your brokerage faster",
    variant: "dark",
    compact: true,
    background: "startup",
    backgroundInteractive: true,
    mockShiftDown: true,
    mobileMockScale: 0.7,
    mock: (
      <div className="w-full max-md:mt-6 max-md:sm:mt-8">
        <AiAppetiteEngineMock />
      </div>
    ),
    modalPreview: <AiAppetiteEngineMock />,
    backgroundScene: <GlobeScene interactive transparent tone="white" />,
  },
  {
    label: "Carriers",
    tagline: "Be present at the moment agents quote",
    variant: "dark",
    compact: true,
    background: "carrier",
    dotGrid: true,
    mockShiftDown: true,
    mobileMockScale: 0.7,
    mock: (
      <div className="w-full max-md:mt-6 max-md:sm:mt-8">
        <StartupRecentActivityCard />
      </div>
    ),
    modalPreview: <StartupRecentActivityCard />,
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

function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}

const WayCard = memo(function WayCard({
  label,
  tagline,
  taglinePosition = "right",
  variant,
  children,
  className = "",
  wide = false,
  background,
  mockAlign = "center",
  mockShiftDown = false,
  hideMock = false,
  mobileMockScale,
  backgroundScene,
  backgroundInteractive = false,
  backgroundSceneBlendScreen = false,
  dotGrid = false,
  onOpen,
}: Omit<WayCardProps, "lightStrip"> & { label: string }) {
  const [hovered, setHovered] = useState(false);
  const interactiveTapRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const { ref: cardRef, visible: inView } = useLazyInView<HTMLElement>();
  const isMobile = useIsMobile();
  const isDark = variant === "dark";
  const enableScene = !isMobile;
  const enableInteractive = backgroundInteractive && !isMobile;
  const resolvedMobileScale =
    mobileMockScale ??
    (mockAlign === "bottom" || mockShiftDown ? 0.72 : 0.82);
  const textClass =
    background === "developer" && !backgroundScene
      ? "text-[#0a143b]"
      : background === "accent" || background === "carrier" || isDark
        ? "text-white"
        : "text-[#0a143b]";

  const handleOpen = () => {
    onOpen();
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
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        onMouseEnter={isMobile ? undefined : () => setHovered(true)}
        onMouseLeave={isMobile ? undefined : () => setHovered(false)}
        aria-label={`Open details`}
        className={`way-card-shell relative cursor-pointer [content-visibility:auto] max-md:aspect-square max-md:[contain-intrinsic-size:auto_100%] max-md:min-h-0 [contain-intrinsic-size:auto_530px] md:min-h-[22rem] ${wide ? "md:aspect-[1179/530]" : "md:aspect-[580/530]"} ${hovered ? "way-card-shell--hovered" : ""} ${textClass} ${className}`}
      >
        <div
          className="way-card-body absolute inset-0 flex flex-col overflow-hidden p-4 sm:p-5 md:p-8"
          style={
            background ? { background: CARD_BACKGROUND_STYLES[background] } : undefined
          }
        >
          {dotGrid && enableScene ? <WayCardDotGrid variant={variant} active={hovered} inView={inView} /> : null}
          {backgroundScene && inView && enableScene ? (
            <div
              style={
                backgroundSceneBlendScreen
                  ? { mixBlendMode: "screen" }
                  : undefined
              }
              className={`absolute inset-0 z-[1] overflow-hidden ${enableInteractive ? "pointer-events-auto" : "pointer-events-none"}`}
              aria-hidden={!enableInteractive}
              onPointerDownCapture={
                enableInteractive
                  ? (e) => {
                    interactiveTapRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
                  }
                  : undefined
              }
              onPointerUpCapture={
                enableInteractive
                  ? (e) => {
                    const start = interactiveTapRef.current;
                    interactiveTapRef.current = null;
                    if (!start) return;

                    const dx = e.clientX - start.x;
                    const dy = e.clientY - start.y;
                    const dist = Math.hypot(dx, dy);
                    const dt = Date.now() - start.t;

                    // Allow interaction (drag), but treat a short, small movement as a tap-to-open.
                    if (dist <= 8 && dt <= 350) handleOpen();
                  }
                  : undefined
              }
              onClick={enableInteractive ? (e) => e.stopPropagation() : undefined}
            >
              {backgroundScene}
            </div>
          ) : null}
        </div>
        <div
          className={`way-card-mock pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${hideMock ? "opacity-0" : "opacity-100"} ${
            mockAlign === "bottom"
              ? "max-md:flex max-md:items-center max-md:justify-center max-md:px-2 max-md:pt-16 max-md:pb-3 max-md:sm:pt-20 px-0 pt-4 sm:pt-5 md:block md:pt-6 md:pb-0"
              : "max-md:flex max-md:items-center max-md:justify-center max-md:p-3 max-md:pt-[4.25rem] max-md:sm:p-5 max-md:sm:pt-20 p-4 sm:p-5 md:p-6 md:flex md:items-center md:justify-center"
          } ${mockShiftDown ? "md:pt-28 lg:pt-32" : ""}`}
        >
          <div
            className={`${
              mockAlign === "bottom"
                ? "relative flex h-full w-full min-w-0 flex-col justify-end max-md:h-auto max-md:items-center max-md:justify-center max-md:overflow-visible md:overflow-hidden"
                : mockShiftDown
                  ? "relative mx-auto flex h-full w-full min-w-0 max-w-full items-center justify-center max-md:overflow-visible md:overflow-hidden"
                  : "relative flex h-full w-full min-w-0 items-center justify-center max-md:overflow-visible md:overflow-hidden"
            } max-md:origin-center md:origin-center`}
            style={
              isMobile
                ? { transform: `scale(${resolvedMobileScale})` }
                : undefined
            }
          >
            {inView ? children : <MockPlaceholder />}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 max-md:px-5 max-md:pt-5 max-md:sm:px-6 max-md:sm:pt-6 p-4 sm:p-5 md:p-8">
          <div className="flex items-start justify-between max-md:gap-3 gap-4">
            <div
              className={
                taglinePosition === "left"
                  ? "max-md:max-w-[12.5rem] max-w-[13rem] sm:max-w-xs"
                  : "max-md:max-w-[12.5rem] max-w-[12rem] sm:max-w-[16rem]"
              }
            >
              <EyebrowPill surface="dark" className="mb-0">
                {label}
              </EyebrowPill>
              <p
                className={`max-md:line-clamp-2 text-left font-heading font-medium tracking-tight max-md:text-lg max-md:leading-[1.12] max-md:sm:text-xl text-[1.7rem] leading-[1.08] sm:text-3xl md:text-4xl lg:text-[1.625rem] lg:leading-[1.12] ${variant == "light" ? "text-[#424242]" : "text-white"}`}
              >
                {tagline}
              </p>
            </div>
            <span
              className="way-card-expand-btn pointer-events-auto relative flex max-md:size-8 size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm"
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
  }, []);

  const openModal = useCallback((label: string) => {
    setActiveCard(label);
  }, []);

  return (
    <section ref={sectionRef} data-threeways className="relative overflow-hidden bg-white">
      <Container borderColor="#53535380">
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div ref={headerRef} className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5 md:space-y-6">
              <h2
                ref={headingRef}
                className="max-w-xl text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
              >
                <span data-split>One platform.</span>
                <br />
                <span data-split>Five customer types it serves.</span>
              </h2>
            </div>
            <p
              ref={descRef}
              className="max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem] lg:text-left"
            >
              Wholesalers, brokers, carriers, startups, and builders - CoverForce
              adapts to how each team works, without changing the platform underneath.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 md:gap-2 lg:mt-14">
            {WAY_CARDS.map(({ mock, modalPreview, modalPreviewAlign, ...card }) => (
              <WayCard
                key={card.label}
                {...card}
                hideMock={card.hideMock ?? false}
                onOpen={() => openModal(card.label)}
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
        label={activeConfig?.label}
        background={activeConfig?.background}
        variant={activeConfig?.variant ?? "light"}
        dotGrid={activeConfig?.dotGrid}
        backgroundScene={activeConfig?.backgroundScene}
        backgroundSceneBlendScreen={activeConfig?.backgroundSceneBlendScreen}
        previewAlign={activeConfig?.modalPreviewAlign ?? "center"}
        onClose={closeModal}
      />
    </section>
  );
}
