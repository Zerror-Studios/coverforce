"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import Container from "./Container";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import MegaMenu, {
  CLIP_CLOSE_MS,
  CLIP_DURATION_MS,
  MEGA_MENU_CLIP_CLOSED,
  MEGA_MENU_CLIP_OPEN,
} from "./MegaMenu";
import AnimatedLinkText from "./AnimatedLinkText";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "@remixicon/react";
import Hamburger from "hamburger-react";
import { MEGA_MENUS, type MegaMenuLink } from "@/data/megaMenu";
import { DEMO_VIDEO_SRC, DEMO_VIDEO_TITLE } from "@/data/demoVideo";
import { HOME_INTRO_NAV_MS, useHomeIntro } from "@/contexts/HomeIntroContext";
import { useVideoModal } from "@/contexts/VideoModalContext";
import { pageAnimation, setPageTransitionBg, setPendingPathname, subscribePendingPathname } from "@/lib/pageTransition";
import { scrollToHashWhenReady } from "@/lib/scrollToTop";
import { useTransitionRouter } from "next-view-transitions";

type NavItem = {
  label: string;
  href: string;
  hasDropdown: boolean;
};

const navItems: NavItem[] = [
  { label: "Product", href: "/product/submission-intake", hasDropdown: true },
  { label: "Solutions", href: "/solutions/wholesalers", hasDropdown: true },
  { label: "Developers", href: "/developers", hasDropdown: false },
  { label: "Integration", href: "/integration", hasDropdown: false },
  { label: "Pricing", href: "/pricing", hasDropdown: false },
  { label: "Company", href: "/about", hasDropdown: true },
];

const NAV_PATH_PREFIXES: Record<string, string[]> = {
  Product: ["/product"],
  Solutions: ["/solutions"],
  Developers: ["/developers"],
  Integration: ["/integration"],
  Pricing: ["/pricing", "/calculation"],
  Company: ["/about", "/careers", "/contact", "/blog", "/terms", "/privacy", "/security"],
};

function isNavItemCurrentPage(label: string, pathname: string) {
  const prefixes = NAV_PATH_PREFIXES[label];
  if (!prefixes) return false;

  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const HOVER_CLOSE_DELAY = 120;

type HeaderTheme = "dark" | "light";

function getHeaderTheme(pathname: string): HeaderTheme {
  if (
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/calculation") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/author")
  ) {
    return "light";
  }
  return "dark";
}

const SCROLL_GLASS_THRESHOLD_RATIO = 0.2;

function parseCssRgb(color: string): { r: number; g: number; b: number; a: number } | null {
  const match = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
  );
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function isDarkSurfaceUnderHeader(navHeight: number): boolean {
  const x = Math.min(Math.floor(window.innerWidth / 2), window.innerWidth - 1);
  const y = Math.min(
    Math.max(Math.floor(navHeight + 12), 8),
    window.innerHeight - 1,
  );
  const stack = document.elementsFromPoint(x, y);

  for (const el of stack) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.closest("[data-site-nav]") || el.closest("header.site-view-header")) continue;

    const surfaceHost = el.closest("[data-header-surface]");
    if (surfaceHost instanceof HTMLElement) {
      const surface = surfaceHost.dataset.headerSurface;
      if (surface === "dark") return true;
      if (surface === "light") return false;
    }

    let node: HTMLElement | null = el;
    while (node && node !== document.documentElement) {
      const className = typeof node.className === "string" ? node.className : "";
      if (
        /bg-\[#(151f4d|151F4D|121[Cc]49|0a143b|080808|080114)\b/i.test(className) ||
        /\bbg-black\b|\bbg-zinc-9|\bbg-neutral-9|\bbg-slate-9/.test(className)
      ) {
        return true;
      }
      if (
        /\bbg-white\b|\bbg-\[#FBFCFF\]|\bbg-\[#FAFAFA\]|\bbg-\[#F4F5F7\]/.test(className)
      ) {
        return false;
      }

      const rgba = parseCssRgb(getComputedStyle(node).backgroundColor);
      // Image overlays (e.g. milestones) often sit around 0.7 opacity.
      if (rgba && rgba.a >= 0.65) {
        const luminance = (0.299 * rgba.r + 0.587 * rgba.g + 0.114 * rgba.b) / 255;
        return luminance < 0.55;
      }
      node = node.parentElement;
    }
  }

  return true;
}

function usesTransparentHeaderUntilScroll(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/product") ||
    pathname.startsWith("/developers") ||
    pathname.startsWith("/integration") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/careers") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/blog")
  );
}

const headerThemes = {
  dark: {
    bar: "border-b border-[#FFFFFF1A] bg-[#151f4d]",
    logo: "/Coverforce_logo_white.svg",
    linkActive: "text-white",
    linkIdle: "text-white/80 hover:text-white",
    login: "text-white/95 hover:text-white",
  },
  light: {
    bar: "border-b border-[#E8ECF0] bg-white",
    logo: "/Coverforce_logo_blue.svg",
    linkActive: "text-[#3D3D3D]",
    linkIdle: "text-[#3D3D3D] hover:text-[#151F4D]",
    login: "text-[#3D3D3D] hover:text-[#151F4D]",
  },
} satisfies Record<
  HeaderTheme,
  {
    bar: string;
    logo: string;
    linkActive: string;
    linkIdle: string;
    login: string;
  }
>;

const headerGlass = {
  dark: "border-b border-white/10 bg-[#151f4d]/35 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(10,20,59,0.08)]",
  light:
    "border-b border-[#E8ECF0]/50 bg-transparent backdrop-blur-xl backdrop-saturate-150",
} satisfies Record<HeaderTheme, string>;

function HeaderNavLink({
  label,
  href,
  hasDropdown,
  isMenuOpen,
  isCurrentPage,
  linkActiveClass,
  linkIdleClass,
  onNavigate,
}: {
  label: string;
  href: string;
  hasDropdown: boolean;
  isMenuOpen: boolean;
  isCurrentPage: boolean;
  linkActiveClass: string;
  linkIdleClass: string;
  onNavigate: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isHighlighted = isMenuOpen || isCurrentPage;

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex items-center gap-1 font-heading text-[0.9375rem] font-regular leading-none transition-colors duration-150 ${
        isHighlighted ? linkActiveClass : linkIdleClass
      }`}
      aria-current={isCurrentPage ? "page" : undefined}
      aria-expanded={hasDropdown ? isMenuOpen : undefined}
      aria-haspopup={hasDropdown ? "true" : undefined}
    >
      <span
        className={`relative inline-flex flex-col items-stretch ${
          isCurrentPage
            ? "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-current after:content-['']"
            : ""
        }`}
      >
        <AnimatedLinkText
          hovered={hovered}
          textClip="h-[0.9375rem]"
          textLine="h-[0.9375rem] leading-none"
        >
          {label}
        </AnimatedLinkText>
      </span>
      {hasDropdown ? (
        <RiArrowDownSLine
          className={`size-4 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isMenuOpen ? "rotate-180 opacity-100" : "opacity-80 group-hover:rotate-180"
          }`}
          aria-hidden
        />
      ) : null}
    </Link>
  );
}



const CLIP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const CLIP_CLOSE_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const MOBILE_CONTENT_BASE_DELAY = 100;
const MOBILE_CONTENT_STAG = 45;
const MOBILE_PANEL_MS = 320;
const MOBILE_PANEL_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

function MobileMenuReveal({
  enterKey,
  delay,
  children,
  className = "",
}: {
  enterKey: number;
  delay: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mega-menu-reveal-slot ${className}`}>
      <div
        key={`${enterKey}-${delay}`}
        className="mega-menu-reveal"
        style={{ "--mega-menu-stagger": `${delay}ms` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

function MobileMenuLinkRow({
  label,
  onClick,
  isCurrentPage,
}: {
  label: string;
  onClick: () => void;
  isCurrentPage?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isCurrentPage ? "page" : undefined}
      className={`flex w-full items-center justify-between border-b px-6 py-5 text-left font-heading text-[1.125rem] font-regular leading-none transition-colors hover:text-[#151F4D] ${
        isCurrentPage
          ? "border-[#E8ECF0] text-[#151F4D]"
          : "border-[#E8ECF0] text-[#3D3D3D]"
      }`}
    >
      <span>{label}</span>
      <RiArrowRightLine className="size-5" aria-hidden />
    </button>
  );
}

function MobileMenuSubLink({
  link,
  onNavigate,
}: {
  link: MegaMenuLink;
  onNavigate: (href: string) => void;
}) {
  const Icon = link.icon;

  return (
    <button
      type="button"
      onClick={() => onNavigate(link.href)}
      className={`flex w-full justify-between gap-4 py-4 text-left text-[#3D3D3D] transition-colors hover:text-[#151F4D] ${
        link.multiline ? "items-start" : "items-center"
      }`}
    >
      <span className={`flex min-w-0 flex-1 gap-3 ${link.multiline ? "items-start" : "items-center"}`}>
        <span className="flex size-6 shrink-0 items-center justify-center text-current">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 font-heading text-[1.125rem] font-regular leading-snug text-current">
          {link.label}
        </span>
      </span>
      <RiArrowRightLine className={`size-5 shrink-0 text-current ${link.multiline ? "mt-1" : ""}`} aria-hidden />
    </button>
  );
}

const Header = () => {
  const pathname = usePathname();
  const [displayPathname, setDisplayPathname] = useState(pathname);
  const baseTheme = getHeaderTheme(displayPathname);
  const { enabled: introEnabled, phase: introPhase } = useHomeIntro();
  const navBarRef = useRef<HTMLDivElement>(null);
  const navRevealedRef = useRef(false);
  const router = useTransitionRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renderedMenu, setRenderedMenu] = useState<string | null>(null);
  const [clipOpen, setClipOpen] = useState(false);
  const [enterKey, setEnterKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuRendered, setMobileMenuRendered] = useState(false);
  const [mobileClipOpen, setMobileClipOpen] = useState(false);
  const [mobileContentEnter, setMobileContentEnter] = useState(false);
  const [mobileEnterKey, setMobileEnterKey] = useState(0);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
  const [renderedMobileSubMenu, setRenderedMobileSubMenu] = useState<string | null>(null);
  const { open: openVideoModal } = useVideoModal();
  const [navBarHeight, setNavBarHeight] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [glassOverDark, setGlassOverDark] = useState(true);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glassOverDarkRef = useRef(true);
  const headerScrolledRef = useRef(false);
  const activeMenuRef = useRef<string | null>(null);
  const renderedMenuRef = useRef<string | null>(null);
  const clipOpenRef = useRef(false);

  activeMenuRef.current = activeMenu;
  renderedMenuRef.current = renderedMenu;
  clipOpenRef.current = clipOpen;

  useEffect(() => {
    setDisplayPathname(pathname);
  }, [pathname]);

  useEffect(() => {
    return subscribePendingPathname((nextPath) => {
      setDisplayPathname(nextPath);
      if (usesTransparentHeaderUntilScroll(nextPath)) {
        headerScrolledRef.current = false;
        glassOverDarkRef.current = true;
        setHeaderScrolled(false);
        setGlassOverDark(true);
      }
    });
  }, []);

  useLayoutEffect(() => {
    const navBar = navBarRef.current;
    if (!navBar) return;

    if (!introEnabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(navBar, { clearProps: "all" });
      return;
    }

    navRevealedRef.current = false;
    gsap.set(navBar, { yPercent: -100, autoAlpha: 0 });
  }, [introEnabled]);

  useLayoutEffect(() => {
    const navBar = navBarRef.current;
    if (!navBar || !introEnabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(navBar, { clearProps: "all" });
      return;
    }

    if (introPhase !== "nav" || navRevealedRef.current) return;

    navRevealedRef.current = true;
    gsap.to(navBar, {
      yPercent: 0,
      autoAlpha: 1,
      duration: HOME_INTRO_NAV_MS / 1000,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [introEnabled, introPhase]);

  // Slide the header in from the top on every non-home route change.
  useEffect(() => {
    if (introEnabled) return;

    const navBar = navBarRef.current;
    if (!navBar) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(navBar, { clearProps: "all" });
      return;
    }

    gsap.fromTo(
      navBar,
      { yPercent: -100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: HOME_INTRO_NAV_MS / 1000,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
  }, [pathname, introEnabled]);

  useLayoutEffect(() => {
    const navBar = navBarRef.current;
    if (!navBar) return;

    const updateHeight = () => setNavBarHeight(navBar.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(navBar);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const transparentUntilScroll = usesTransparentHeaderUntilScroll(displayPathname);
  const showGlass = transparentUntilScroll && headerScrolled;
  // Most heroes are dark → white logo while transparent.
  // Blog (and similar light pages) keep the light treatment until glass.
  // Glass blur: white content over dark sections, black over light.
  const lightOverHero =
    displayPathname.startsWith("/blog") || displayPathname.startsWith("/author");
  const theme = transparentUntilScroll
    ? showGlass
      ? glassOverDark
        ? "dark"
        : "light"
      : lightOverHero
        ? "light"
        : "dark"
    : baseTheme;
  const styles = headerThemes[theme];
  const isTransparentHeader = transparentUntilScroll && !showGlass;
  const isGlassHeader = showGlass;

  useEffect(() => {
    if (!transparentUntilScroll) {
      headerScrolledRef.current = false;
      glassOverDarkRef.current = true;
      setHeaderScrolled(false);
      setGlassOverDark(true);
      return;
    }

    const updateSurface = () => {
      const height = navBarRef.current?.offsetHeight || navBarHeight || 72;
      const overDark = isDarkSurfaceUnderHeader(height);
      if (overDark === glassOverDarkRef.current) return;
      glassOverDarkRef.current = overDark;
      setGlassOverDark(overDark);
    };

    const update = () => {
      const scrollY = window.lenis?.scroll ?? window.scrollY;
      const scrolled =
        scrollY >= window.innerHeight * SCROLL_GLASS_THRESHOLD_RATIO;

      if (scrolled !== headerScrolledRef.current) {
        headerScrolledRef.current = scrolled;
        setHeaderScrolled(scrolled);
      }

      if (scrolled) {
        updateSurface();
      } else if (!glassOverDarkRef.current) {
        glassOverDarkRef.current = true;
        setGlassOverDark(true);
      }
    };

    update();

    const lenis = window.lenis;
    lenis?.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      lenis?.off("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [transparentUntilScroll, navBarHeight]);

  const openMobileMenu = useCallback(() => {
    setMobileActiveMenu(null);
    setRenderedMobileSubMenu(null);
    setMobileEnterKey((key) => key + 1);
    setMobileMenuRendered(true);
    setMobileMenuOpen(true);
    setMobileClipOpen(false);
    setMobileContentEnter(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMobileClipOpen(true));
    });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileClipOpen(false);
    setMobileContentEnter(false);
    setMobileActiveMenu(null);
    setRenderedMobileSubMenu(null);
  }, []);

  useEffect(() => {
    if (mobileActiveMenu) {
      setRenderedMobileSubMenu(mobileActiveMenu);
      return;
    }

    const timer = window.setTimeout(() => setRenderedMobileSubMenu(null), MOBILE_PANEL_MS);
    return () => window.clearTimeout(timer);
  }, [mobileActiveMenu]);

  useEffect(() => {
    if (mobileMenuOpen || !mobileMenuRendered) return;
    const timer = window.setTimeout(() => setMobileMenuRendered(false), CLIP_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [mobileMenuOpen, mobileMenuRendered]);

  useEffect(() => {
    if (!mobileMenuOpen || !mobileClipOpen) return;
    const timer = window.setTimeout(() => setMobileContentEnter(true), 100);
    return () => window.clearTimeout(timer);
  }, [mobileMenuOpen, mobileClipOpen, mobileEnterKey]);

  const openMobileSubMenu = useCallback((label: string) => {
    if (!MEGA_MENUS[label]) return;
    setMobileActiveMenu(label);
  }, []);

  const backToMobileMain = useCallback(() => {
    setMobileActiveMenu(null);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const revealClip = useCallback(() => {
    setEnterKey((key) => key + 1);
    setClipOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setClipOpen(true));
    });
  }, []);

  const openMenu = useCallback(
    (label: string) => {
      clearCloseTimer();
      if (!MEGA_MENUS[label]) return;

      setActiveMenu(label);

      if (renderedMenuRef.current === label) {
        if (!clipOpenRef.current) {
          revealClip();
        }
        return;
      }

      if (clipOpenRef.current && renderedMenuRef.current) {
        setRenderedMenu(label);
        return;
      }

      setRenderedMenu(label);
      revealClip();
    },
    [clearCloseTimer, revealClip],
  );

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
    setClipOpen(false);
  }, []);

  const closeMenuImmediately = useCallback(() => {
    clearCloseTimer();
    setActiveMenu(null);
    setClipOpen(false);
    setRenderedMenu(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(closeMenu, HOVER_CLOSE_DELAY);
  }, [clearCloseTimer, closeMenu]);

  const handleClipClosed = useCallback(() => {
    if (!activeMenuRef.current) {
      setRenderedMenu(null);
    }
  }, []);

  const handleNavigate = useCallback(
    (href: string) => {
      closeMenuImmediately();
      closeMobileMenu();

      const hashIndex = href.indexOf("#");
      const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
      const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";

      if (pathname === path && hash) {
        window.history.pushState(null, "", href);
        scrollToHashWhenReady(hash);
        return;
      }

      if (pathname === href || (pathname === path && !hash)) return;

      if (typeof document !== "undefined" && "startViewTransition" in document) {
        setPageTransitionBg(path || href);
        setPendingPathname(path || href);
        router.push(href, { onTransitionReady: pageAnimation });
        return;
      }

      setPendingPathname(path || href);
      router.push(href);
    },
    [closeMenuImmediately, closeMobileMenu, pathname, router],
  );

  useEffect(() => {
    closeMenuImmediately();
    closeMobileMenu();
  }, [pathname, closeMenuImmediately, closeMobileMenu]);

  const renderedConfig = renderedMenu ? MEGA_MENUS[renderedMenu] : null;
  const menuVisible = clipOpen && Boolean(renderedConfig);

  useEffect(() => {
    if (!menuVisible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuVisible]);

  useEffect(() => {
    if (!mobileMenuRendered) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuRendered]);

  const activeMobileConfig = renderedMobileSubMenu ? MEGA_MENUS[renderedMobileSubMenu] : null;
  const navBarClass = mobileMenuOpen
    ? headerThemes.light.bar
    : isTransparentHeader
      ? "border-b border-transparent bg-transparent"
      : isGlassHeader
        ? headerGlass[theme]
        : styles.bar;
  const activeLogo = mobileMenuOpen ? headerThemes.light.logo : styles.logo;
  const navBarMotionClass = isGlassHeader
    ? "transition-[background-color,border-color,color,box-shadow,backdrop-filter] duration-150 ease-out"
    : "transition-[background-color,border-color,color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
  const logoMotionClass = isGlassHeader
    ? "transition-opacity duration-150 ease-out"
    : "transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
  return (
    <nav className={`relative w-full ${theme === "light" ? "text-[#3D3D3D]" : "text-white"}`}>
      {menuVisible ? (
        <button
          type="button"
          className="fixed inset-0 z-0 bg-[#0a143b]/50 motion-reduce:transition-none"
          aria-label="Close menu"
          onClick={closeMenuImmediately}
        />
      ) : null}

      <div className="relative z-10" onMouseLeave={scheduleClose}>
        <div
          ref={navBarRef}
          data-site-nav
          className={`relative z-20 overflow-hidden will-change-[transform,backdrop-filter] ${navBarMotionClass} ${navBarClass}`}
        >
          <Container>
            <div className="relative flex items-center justify-between py-4">
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/");
                }}
                className="relative z-10 shrink-0"
              >
                <span className="relative block h-5 w-[148px] md:h-6 md:w-[170px]">
                  <Image
                    src={headerThemes.dark.logo}
                    alt="CoverForce"
                    width={180}
                    height={34}
                    priority
                    className={`absolute left-0 top-1/2 h-7 w-auto -translate-y-1/2 ${logoMotionClass} md:h-8 ${
                      activeLogo === headerThemes.dark.logo ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Image
                    src={headerThemes.light.logo}
                    alt="CoverForce"
                    width={180}
                    height={34}
                    priority
                    className={`absolute left-0 top-1/2 h-7 w-auto -translate-y-1/2 grayscale brightness-0 ${logoMotionClass} md:h-8 ${
                      activeLogo === headerThemes.light.logo ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </span>
              </Link>

              <div
                className="relative z-10 size-12 shrink-0 lg:hidden"
                aria-expanded={mobileMenuOpen}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {mobileMenuOpen && mobileActiveMenu ? (
                    <button
                      type="button"
                      onClick={backToMobileMain}
                      className="flex size-full items-center justify-center text-[#3D3D3D] transition-colors hover:text-[#151F4D]"
                      aria-label="Back to main menu"
                    >
                      <RiArrowLeftLine className="size-5" aria-hidden />
                    </button>
                  ) : (
                    <Hamburger
                      toggled={mobileMenuOpen}
                      duration={0.8}
                      size={20}
                      color={
                        mobileMenuOpen
                          ? "#3D3D3D"
                          : theme === "dark"
                            ? "#ffffff"
                            : "#3D3D3D"
                      }
                      label={mobileMenuOpen ? "Close menu" : "Open menu"}
                      onToggle={(toggled) => {
                        if (toggled) openMobileMenu();
                        else closeMobileMenu();
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
                <div className="relative flex h-full items-center">
                  <ul className="pointer-events-auto flex items-center gap-6 xl:gap-8">
                    {navItems.map(({ label, href, hasDropdown }) => {
                      const isMenuOpen = activeMenu === label;
                      const isCurrentPage = isNavItemCurrentPage(label, pathname);

                      return (
                        <li
                          key={label}
                          onMouseEnter={() => {
                            if (hasDropdown) openMenu(label);
                            else {
                              clearCloseTimer();
                              closeMenu();
                            }
                          }}
                        >
                          <HeaderNavLink
                            label={label}
                            href={href}
                            hasDropdown={hasDropdown}
                            isMenuOpen={isMenuOpen}
                            isCurrentPage={isCurrentPage}
                            linkActiveClass={styles.linkActive}
                            linkIdleClass={styles.linkIdle}
                            onNavigate={handleNavigate}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="relative z-10 hidden items-center lg:flex">
                <RequestDemoButton surface={theme === "dark" ? "on-dark" : "default"}>
                  Request demo
                </RequestDemoButton>
              </div>
            </div>
          </Container>
        </div>

        {renderedConfig && renderedMenu ? (
          <MegaMenu
            open={clipOpen}
            enterKey={enterKey}
            menuKey={renderedMenu}
            config={renderedConfig}
            onMouseEnter={clearCloseTimer}
            onClipClosed={handleClipClosed}
            onClose={closeMenuImmediately}
            onNavigate={handleNavigate}
          />
        ) : null}
      </div>

      {mobileMenuRendered ? (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 z-[118] bg-[#0a143b]/50 motion-reduce:transition-none lg:hidden"
            style={{ top: navBarHeight }}
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />

          <div
            className="fixed inset-x-0 z-[119] overflow-hidden border-t border-[#E8ECF0] bg-white text-[#3D3D3D] shadow-[0_24px_48px_-12px_rgba(10,20,59,0.1)] will-change-[clip-path] motion-reduce:transition-none lg:hidden"
            style={{
              top: navBarHeight,
              bottom: 0,
              clipPath: mobileClipOpen ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
              WebkitClipPath: mobileClipOpen ? MEGA_MENU_CLIP_OPEN : MEGA_MENU_CLIP_CLOSED,
              transition: mobileMenuOpen
                ? `clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}, -webkit-clip-path ${CLIP_DURATION_MS}ms ${CLIP_EASE}`
                : `clip-path ${CLIP_CLOSE_MS}ms ${CLIP_CLOSE_EASE}, -webkit-clip-path ${CLIP_CLOSE_MS}ms ${CLIP_CLOSE_EASE}`,
              pointerEvents: mobileMenuOpen ? "auto" : "none",
            }}
          >
            <div
              className="flex h-full flex-col"
              style={{
                opacity: mobileClipOpen ? 1 : 0,
                transition: mobileMenuOpen
                  ? "opacity 300ms cubic-bezier(0.76, 0, 0.24, 1)"
                  : "opacity 380ms cubic-bezier(0.33, 1, 0.68, 1)",
              }}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <div
                  className={`absolute inset-0 flex flex-col transition-transform motion-reduce:transition-none ${
                    mobileActiveMenu ? "-translate-x-full" : "translate-x-0"
                  } ${mobileContentEnter && !mobileActiveMenu ? "mega-menu-enter" : ""}`}
                  style={{
                    transitionDuration: `${MOBILE_PANEL_MS}ms`,
                    transitionTimingFunction: MOBILE_PANEL_EASE,
                  }}
                >
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    {navItems.map(({ label, href, hasDropdown }, index) => (
                      <MobileMenuReveal
                        key={label}
                        enterKey={mobileEnterKey}
                        delay={MOBILE_CONTENT_BASE_DELAY + MOBILE_CONTENT_STAG * index}
                      >
                        <MobileMenuLinkRow
                          label={label}
                          isCurrentPage={isNavItemCurrentPage(label, pathname)}
                          onClick={() => {
                            if (hasDropdown && MEGA_MENUS[label]) {
                              openMobileSubMenu(label);
                              return;
                            }
                            handleNavigate(href);
                          }}
                        />
                      </MobileMenuReveal>
                    ))}
                  </div>

                  <MobileMenuReveal
                    enterKey={mobileEnterKey}
                    delay={
                      MOBILE_CONTENT_BASE_DELAY + MOBILE_CONTENT_STAG * navItems.length
                    }
                    className="shrink-0"
                  >
                    <div className="px-6 pb-4 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          openVideoModal({
                            src: DEMO_VIDEO_SRC,
                            title: DEMO_VIDEO_TITLE,
                          });
                          closeMobileMenu();
                        }}
                        className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-3 text-left transition-colors duration-200 hover:bg-[#FAFAFA]"
                      >
                        <div className="h-[10rem] shrink-0 overflow-hidden rounded-lg bg-[#0a143b]">
                          <video
                            src={DEMO_VIDEO_SRC}
                            className="pointer-events-none h-full w-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-hidden
                          />
                        </div>
                        <p className="mt-3 px-0.5 font-heading text-sm font-regular leading-snug text-[#3D3D3D]">
                          {DEMO_VIDEO_TITLE}
                        </p>
                      </button>
                    </div>
                  </MobileMenuReveal>
                </div>

                <div
                  className={`absolute inset-0 overflow-y-auto transition-transform motion-reduce:transition-none ${
                    mobileActiveMenu ? "translate-x-0" : "translate-x-full"
                  }`}
                  style={{
                    transitionDuration: `${MOBILE_PANEL_MS}ms`,
                    transitionTimingFunction: MOBILE_PANEL_EASE,
                  }}
                >
                  {activeMobileConfig ? (
                    <div key={renderedMobileSubMenu} className="mega-menu-enter px-6 pb-6 pt-4">
                      <div className="space-y-8">
                        {activeMobileConfig.columns.map((column, columnIndex) => {
                          const columnDelay =
                            MOBILE_CONTENT_BASE_DELAY +
                            MOBILE_CONTENT_STAG * columnIndex;

                          return (
                            <div
                              key={column.title}
                              className="border-t border-[#E8ECF0] pt-4 first:border-t-0 first:pt-0"
                            >
                              <MobileMenuReveal enterKey={mobileEnterKey} delay={columnDelay}>
                                <p className="mb-2 max-w-[12rem] font-mono text-[0.75rem] font-medium uppercase leading-snug tracking-[0.12em] text-[#3D3D3D] whitespace-normal">
                                  {column.title}
                                </p>
                              </MobileMenuReveal>
                              <div className="divide-y divide-[#E8ECF0]">
                                {column.links.map((link, linkIndex) => (
                                  <MobileMenuReveal
                                    key={link.label}
                                    enterKey={mobileEnterKey}
                                    delay={columnDelay + MOBILE_CONTENT_STAG * (linkIndex + 1)}
                                  >
                                    <MobileMenuSubLink
                                      link={link}
                                      onNavigate={handleNavigate}
                                    />
                                  </MobileMenuReveal>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
};

export default Header;
