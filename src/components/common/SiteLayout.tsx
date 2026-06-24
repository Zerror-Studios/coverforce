"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LenisScroll from "@/components/common/LenisScroll";
import HomePageLoader from "@/components/home/HomePageLoader";
import {
  HomeIntroProvider,
  isPreNavIntroPhase,
  useHomeIntro,
} from "@/contexts/HomeIntroContext";
import { scrollToTop } from "@/lib/scrollToTop";
import { PAGE_TRANSITION_MS } from "@/lib/pageTransition";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SiteLayoutProps = {
  children: ReactNode;
};

function SiteLayoutInner({ children }: { children: ReactNode }) {
  const { enabled: introEnabled, phase } = useHomeIntro();
  const hideChrome = introEnabled && isPreNavIntroPhase(phase);

  useEffect(() => {
    if (!introEnabled || phase !== "done") return;

    const id = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.lenis?.resize();
      scrollToTop();
    });

    return () => window.cancelAnimationFrame(id);
  }, [introEnabled, phase]);

  return (
    <div className="relative w-full">
      <HomePageLoader />

      {!hideChrome ? (
        <header className="fixed top-0 z-50 w-full">
          <Header />
        </header>
      ) : null}

      <div className="relative w-full flex-1">
        <main className="relative z-10 w-full">{children}</main>

        {!hideChrome ? (
          <footer className="relative z-10 w-full">
            <Footer />
          </footer>
        ) : null}
      </div>
    </div>
  );
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
      window.lenis?.resize();
      scrollToTop();
    }, PAGE_TRANSITION_MS + 50);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <LenisScroll>
      <HomeIntroProvider enabled={isHome}>
        <SiteLayoutInner>{children}</SiteLayoutInner>
      </HomeIntroProvider>
    </LenisScroll>
  );
}
