"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import Container from "./Container";
import Button from "./Button";
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
  RiCloseLine,
  RiMenuLine,
} from "@remixicon/react";
import { MEGA_MENUS, type MegaMenuLink } from "@/data/megaMenu";
import { HOME_INTRO_NAV_MS, useHomeIntro } from "@/contexts/HomeIntroContext";
import { pageAnimation, setPageTransitionBg } from "@/lib/pageTransition";
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
  { label: "Company", href: "/", hasDropdown: true },
];

const HOVER_CLOSE_DELAY = 120;

type HeaderTheme = "dark" | "light";

function getHeaderTheme(pathname: string): HeaderTheme {
  if (
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/calculation")
  ) {
    return "light";
  }
  return "dark";
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
    linkActive: "text-[#0a143b]",
    linkIdle: "text-[#0a143b]/75 hover:text-[#0a143b]",
    login: "text-[#0a143b]/90 hover:text-[#0a143b]",
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

function HeaderNavLink({
  label,
  href,
  hasDropdown,
  isActive,
  linkActiveClass,
  linkIdleClass,
  onNavigate,
}: {
  label: string;
  href: string;
  hasDropdown: boolean;
  isActive: boolean;
  linkActiveClass: string;
  linkIdleClass: string;
  onNavigate: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex items-center gap-1 font-heading text-[0.9375rem] font-regular leading-none transition-colors ${
        isActive ? linkActiveClass : linkIdleClass
      }`}
      aria-expanded={hasDropdown ? isActive : undefined}
      aria-haspopup={hasDropdown ? "true" : undefined}
    >
      <AnimatedLinkText
        hovered={hovered}
        textClip="h-[0.9375rem]"
        textLine="h-[0.9375rem] leading-none"
      >
        {label}
      </AnimatedLinkText>
      {hasDropdown ? (
        <RiArrowDownSLine
          className={`size-4 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isActive ? "rotate-180 opacity-100" : "opacity-80 group-hover:rotate-180"
          }`}
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

function LoginLink({
  href,
  onNavigate,
  className,
}: {
  href: string;
  onNavigate: (href: string) => void;
  className: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
    >
      <AnimatedLinkText
        hovered={hovered}
        textClip="h-[0.9375rem]"
        textLine="h-[0.9375rem] leading-none"
      >
        Login
      </AnimatedLinkText>
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
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-[#E8ECF0] px-6 py-5 text-left font-heading text-[1.125rem] font-regular leading-none text-[#0a143b]"
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
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center text-[#3556FF]">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 font-heading text-[1.125rem] font-regular leading-tight text-[#0a143b]">
          {link.label}
        </span>
      </span>
      <RiArrowRightLine className="size-5 shrink-0 text-[#0a143b]" aria-hidden />
    </button>
  );
}

const Header = () => {
  const pathname = usePathname();
  const theme = getHeaderTheme(pathname);
  const styles = headerThemes[theme];
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
  const [navBarHeight, setNavBarHeight] = useState(0);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeMenuRef = useRef<string | null>(null);
  const renderedMenuRef = useRef<string | null>(null);
  const clipOpenRef = useRef(false);

  activeMenuRef.current = activeMenu;
  renderedMenuRef.current = renderedMenu;
  clipOpenRef.current = clipOpen;

  useLayoutEffect(() => {
    const navBar = navBarRef.current;
    if (!navBar) return;

    if (!introEnabled) {
      gsap.set(navBar, { clearProps: "all" });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(navBar, { clearProps: "all" });
      return;
    }

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
      if (pathname === href) return;

      if (typeof document !== "undefined" && "startViewTransition" in document) {
        setPageTransitionBg(href);
        router.push(href, { onTransitionReady: pageAnimation });
        return;
      }

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
  const mobileBarStyles = mobileMenuOpen ? headerThemes.light : styles;

  return (
    <nav className={`relative w-full ${theme === "light" ? "text-[#0a143b]" : "text-white"}`}>
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
          className={`relative z-20 overflow-hidden will-change-transform ${mobileBarStyles.bar}`}
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
                <Image
                  src={mobileMenuOpen ? headerThemes.light.logo : styles.logo}
                  alt="CoverForce"
                  width={180}
                  height={34}
                  priority
                  className="h-5 w-auto md:h-6"
                />
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (mobileMenuOpen) closeMobileMenu();
                  else openMobileMenu();
                }}
                className={`relative z-10 flex size-10 items-center justify-center lg:hidden ${
                  mobileMenuOpen
                    ? "text-[#0a143b]"
                    : theme === "dark"
                      ? "text-white"
                      : "text-[#0a143b]"
                }`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <RiCloseLine className="size-6" aria-hidden />
                ) : (
                  <RiMenuLine className="size-6" aria-hidden />
                )}
              </button>

              <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
                <div className="relative flex h-full items-center">
                  <ul className="pointer-events-auto flex items-center gap-6 xl:gap-8">
                    {navItems.map(({ label, href, hasDropdown }) => {
                      const isActive = activeMenu === label;

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
                            isActive={isActive}
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

              <div className="relative z-10 hidden items-center gap-6 lg:flex xl:gap-8">
                <LoginLink
                  href="/"
                  onNavigate={handleNavigate}
                  className={`group font-heading text-[0.9375rem] font-regular leading-none transition-colors ${styles.login}`}
                />
                <Button href="/" surface={theme === "dark" ? "on-dark" : "default"}>
                  Request demo
                </Button>
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
            className="fixed inset-x-0 z-[119] overflow-hidden border-t border-[#E8ECF0] bg-white text-[#0a143b] shadow-[0_24px_48px_-12px_rgba(10,20,59,0.1)] will-change-[clip-path] motion-reduce:transition-none lg:hidden"
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
                  }`}
                  style={{
                    transitionDuration: `${MOBILE_PANEL_MS}ms`,
                    transitionTimingFunction: MOBILE_PANEL_EASE,
                  }}
                >
                  <div
                    className={`flex-1 overflow-y-auto ${
                      mobileContentEnter && !mobileActiveMenu ? "mega-menu-enter" : ""
                    }`}
                  >
                    <div>
                      {navItems.map(({ label, href, hasDropdown }, index) => (
                        <MobileMenuReveal
                          key={label}
                          enterKey={mobileEnterKey}
                          delay={MOBILE_CONTENT_BASE_DELAY + MOBILE_CONTENT_STAG * index}
                        >
                          <MobileMenuLinkRow
                            label={label}
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
                  </div>

                  <MobileMenuReveal
                    enterKey={mobileEnterKey}
                    delay={
                      MOBILE_CONTENT_BASE_DELAY + MOBILE_CONTENT_STAG * (navItems.length + 1)
                    }
                    className="shrink-0"
                  >
                    <div className="border-t border-[#E8ECF0] px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Button href="/" className="flex-1 justify-center">
                          Request demo
                        </Button>
                        <Button href="/" variant="secondary" className="flex-1 justify-center">
                          Login
                        </Button>
                      </div>
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
                      <MobileMenuReveal enterKey={mobileEnterKey} delay={MOBILE_CONTENT_BASE_DELAY}>
                        <button
                          type="button"
                          onClick={backToMobileMain}
                          className="mb-6 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[#0a143b]"
                        >
                          <RiArrowLeftLine className="size-4" aria-hidden />
                          <span>Back</span>
                        </button>
                      </MobileMenuReveal>

                      <div className="space-y-8">
                        {activeMobileConfig.columns.map((column, columnIndex) => {
                          const columnDelay =
                            MOBILE_CONTENT_BASE_DELAY +
                            MOBILE_CONTENT_STAG * (columnIndex + 1);

                          return (
                            <div
                              key={column.title}
                              className="border-t border-[#E8ECF0] pt-4 first:border-t-0 first:pt-0"
                            >
                              <MobileMenuReveal enterKey={mobileEnterKey} delay={columnDelay}>
                                <p className="mb-2 font-mono text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#7C8798]">
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
