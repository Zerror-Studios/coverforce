"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LenisScroll from "@/components/common/LenisScroll";
import SiteGuideBorders from "@/components/common/SiteGuideBorders";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { ViewTransitions } from "next-view-transitions";

gsap.registerPlugin(ScrollTrigger);

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
      window.lenis?.resize();
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <ViewTransitions>
      <LenisScroll>
        <div className="relative w-full">
          <header className="relative z-30 w-full">
            <Header />
          </header>

          <div className="relative w-full flex-1">
            <SiteGuideBorders />

            <main className="relative z-10 w-full">{children}</main>

            <footer className="relative z-10 w-full">
              <Footer />
            </footer>
          </div>
        </div>
      </LenisScroll>
    </ViewTransitions>
  );
}
