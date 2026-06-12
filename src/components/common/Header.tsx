"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Container from "./Container";
import Button from "./Button";
import MegaMenu from "./MegaMenu";
import Link from "next/link";
import Image from "next/image";
import { RiArrowDownSLine } from "@remixicon/react";
import { MEGA_MENUS } from "@/data/megaMenu";
import { HOME_INTRO_NAV_MS, useHomeIntro } from "@/contexts/HomeIntroContext";

type NavItem = {
  label: string;
  href: string;
  hasDropdown: boolean;
};

const navItems: NavItem[] = [
  { label: "Product", href: "/", hasDropdown: true },
  { label: "Solutions", href: "/", hasDropdown: true },
  { label: "Developers", href: "/", hasDropdown: false },
  { label: "Pricing", href: "/", hasDropdown: false },
  { label: "Company", href: "/", hasDropdown: true },
];

const HOVER_CLOSE_DELAY = 120;

function NavLinkLabel({ label }: { label: string }) {
  return (
    <span className="inline-block h-4 overflow-hidden leading-none">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform motion-reduce:transition-none group-hover:-translate-y-4">
        <span className="block h-4 leading-4 whitespace-nowrap">{label}</span>
        <span className="block h-4 leading-4 whitespace-nowrap">{label}</span>
      </span>
    </span>
  );
}

const Header = () => {
  const { enabled: introEnabled, phase: introPhase } = useHomeIntro();
  const navBarRef = useRef<HTMLDivElement>(null);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renderedMenu, setRenderedMenu] = useState<string | null>(null);
  const [clipOpen, setClipOpen] = useState(false);
  const [enterKey, setEnterKey] = useState(0);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchingToRef = useRef<string | null>(null);
  const activeMenuRef = useRef<string | null>(null);
  const renderedMenuRef = useRef<string | null>(null);

  activeMenuRef.current = activeMenu;
  renderedMenuRef.current = renderedMenu;

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

    gsap.set(navBar, { yPercent: -100, opacity: 0 });
  }, [introEnabled]);

  useEffect(() => {
    const navBar = navBarRef.current;
    if (!navBar || !introEnabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(navBar, { clearProps: "all" });
      return;
    }

    if (introPhase === "nav") {
      gsap.to(navBar, {
        yPercent: 0,
        opacity: 1,
        duration: HOME_INTRO_NAV_MS / 1000,
        ease: "power3.out",
      });
    }
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

      if (renderedMenuRef.current === label && !switchingToRef.current) {
        return;
      }

      if (renderedMenuRef.current && renderedMenuRef.current !== label) {
        switchingToRef.current = label;
        setClipOpen(false);
        return;
      }

      switchingToRef.current = null;
      setRenderedMenu(label);
      revealClip();
    },
    [clearCloseTimer, revealClip],
  );

  const closeMenu = useCallback(() => {
    switchingToRef.current = null;
    setActiveMenu(null);
    setClipOpen(false);
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(closeMenu, HOVER_CLOSE_DELAY);
  }, [clearCloseTimer, closeMenu]);

  const handleClipClosed = useCallback(() => {
    const nextMenu = switchingToRef.current;

    if (nextMenu) {
      switchingToRef.current = null;
      setRenderedMenu(nextMenu);
      revealClip();
      return;
    }

    if (!activeMenuRef.current) {
      setRenderedMenu(null);
    }
  }, [revealClip]);

  const renderedConfig = renderedMenu ? MEGA_MENUS[renderedMenu] : null;

  return (
    <nav className="relative w-full text-white">
      <div onMouseLeave={scheduleClose}>
        <div
          ref={navBarRef}
          className="overflow-hidden border-b border-[#FFFFFF1A] bg-[#121C49] will-change-transform"
        >
          <Container>
            <div className="relative flex items-center justify-between py-4">
          <Link href="/" className="relative z-10 shrink-0">
            <Image
              src="/logo.svg"
              alt="CoverForce"
              width={180}
              height={34}
              priority
              className="h-7 w-auto md:h-8"
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
                      <Link
                        href={href}
                        className={`group flex items-center gap-1 font-heading text-xs font-regular tracking-[0.12em] transition-colors ${
                          isActive ? "text-white" : "text-white/80 hover:text-white"
                        }`}
                        aria-expanded={hasDropdown ? isActive : undefined}
                        aria-haspopup={hasDropdown ? "true" : undefined}
                      >
                        <NavLinkLabel label={label} />
                        {hasDropdown ? (
                          <RiArrowDownSLine
                            className={`size-4 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                              isActive ? "rotate-180 opacity-100" : "opacity-80 group-hover:rotate-180"
                            }`}
                            aria-hidden
                          />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="relative z-10 hidden items-center gap-6 lg:flex xl:gap-8">
            <Link
              href="/"
              className="group font-heading text-xs font-medium tracking-[0.12em] text-white/95 transition-colors hover:text-white"
            >
              <NavLinkLabel label="Login" />
            </Link>
            <Button href="/" variant="primary" size="sm">
              Book a call
            </Button>
          </div>
            </div>
          </Container>
        </div>

        {renderedConfig ? (
          <MegaMenu
            open={clipOpen}
            enterKey={enterKey}
            config={renderedConfig}
            onMouseEnter={clearCloseTimer}
            onClipClosed={handleClipClosed}
          />
        ) : null}
      </div>
    </nav>
  );
};

export default Header;
