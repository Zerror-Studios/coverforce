"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Container from "./Container";
import Button from "./Button";
import MegaMenu from "./MegaMenu";
import AnimatedLinkText from "./AnimatedLinkText";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { RiArrowDownSLine } from "@remixicon/react";
import { MEGA_MENUS } from "@/data/megaMenu";
import { HOME_INTRO_NAV_MS, useHomeIntro } from "@/contexts/HomeIntroContext";
import { pageAnimation } from "@/lib/pageTransition";
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
  { label: "Pricing", href: "/pricing", hasDropdown: false },
  { label: "Company", href: "/", hasDropdown: true },
];

const HOVER_CLOSE_DELAY = 120;

type HeaderTheme = "dark" | "light";

function getHeaderTheme(pathname: string): HeaderTheme {
  if (pathname.startsWith("/solutions")) {
    return "light";
  }
  return "dark";
}

const headerThemes = {
  dark: {
    bar: "border-b border-[#FFFFFF1A] bg-[#121C49]",
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
      className={`group flex items-center gap-1 font-heading text-xs font-regular tracking-[0.12em] transition-colors ${
        isActive ? linkActiveClass : linkIdleClass
      }`}
      aria-expanded={hasDropdown ? isActive : undefined}
      aria-haspopup={hasDropdown ? "true" : undefined}
    >
      <AnimatedLinkText hovered={hovered}>{label}</AnimatedLinkText>
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
      <AnimatedLinkText hovered={hovered}>Login</AnimatedLinkText>
    </Link>
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
      if (pathname === href) return;

      if (typeof document !== "undefined" && "startViewTransition" in document) {
        router.push(href, { onTransitionReady: pageAnimation });
        return;
      }

      router.push(href);
    },
    [closeMenuImmediately, pathname, router],
  );

  useEffect(() => {
    closeMenuImmediately();
  }, [pathname, closeMenuImmediately]);

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
          className={`overflow-hidden will-change-transform ${styles.bar}`}
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
                  src={styles.logo}
                  alt="CoverForce"
                  width={180}
                  height={34}
                  priority
                  className="h-5 w-auto md:h-6"
                />
              </Link>

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
                  className={`group font-heading text-xs font-medium tracking-[0.12em] transition-colors ${styles.login}`}
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
    </nav>
  );
};

export default Header;
