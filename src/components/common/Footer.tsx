"use client";

import { useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Container from "./Container";
import Button from "./Button";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WayCardDotGridScene = dynamic(() => import("../home/WayCardDotGridScene"), {
  ssr: false,
  loading: () => null,
});

type FooterColumnData = {
  title: string;
  links: string[];
};

type LegalLink = {
  label: string;
  href: string;
};

const footerColumns: FooterColumnData[] = [
  {
    title: "Products",
    links: ["Submission and intake", "Quotes and bind", "Intelligence"],
  },
  {
    title: "Solutions",
    links: ["Wholesalers", "Brokers", "Carriers", "Startups", "Developers"],
  },
  {
    title: "Company",
    links: ["About us", "Blogs and insights", "Career", "Contact"],
  },
  {
    title: "Tools",
    links: ["ROI calculator", "Appetite checker", "2024 carrier API index"],
  },
];

const standaloneLinks = ["Integration", "Developers", "Pricing"];

const legalLinks: LegalLink[] = [
  { label: "Terms of use", href: "/" },
  { label: "Privacy", href: "/" },
  { label: "Security", href: "/" },
];

function FooterBullet() {
  return (
    <span
      className="absolute left-0 top-1/2 size-2 -translate-y-1/2 origin-left scale-0 rounded-full bg-[#5B35E0] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
      aria-hidden
    />
  );
}

type FooterLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function FooterLink({ href, children, className = "" }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex pl-0 font-heading text-xs font-medium leading-none  text-[#3F3F3F] transition-[padding-left,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:pl-3.5 hover:text-[#5B35E0] ${className}`}
    >
      <FooterBullet />
      {children}
    </Link>
  );
}

type FooterColumnProps = FooterColumnData;

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="mb-3 font-heading text-xs font-medium  text-[#5B35E0]">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((label) => (
          <li key={label}>
            <FooterLink href="/">{label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;

      if (!section || !content) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(content, { yPercent: 0, opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.set(content, {
        yPercent: -20,
        opacity: 0.95,
        willChange: "transform, opacity",
        force3D: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top 60%",
          scrub: 2,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.to(content, { yPercent: 0, opacity: 1, force3D: true });

      const lenis = (window as any).lenis;
      const onLenisScroll = ScrollTrigger.update;
      lenis?.on("scroll", onLenisScroll);

      return () => {
        lenis?.off("scroll", onLenisScroll);
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-[#0a143b]"
    >
      {/* Dot-grid bulge background (matches ThreeWays cards) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.6]">
        <WayCardDotGridScene variant="light" tone="blueLight" track="window" active />
      </div>

      <Container borderColor="#53535380">
        <div ref={contentRef} className="relative z-10 will-change-transform">

          {/* ── Top: tagline (mirrors "Global Organization and Leadership Advisory") ── */}
          <div className="border-b border-neutral-200 pt-12 pb-8 md:pt-14 lg:pt-16">
            <p className="max-w-2xl font-heading text-2xl font-semibold leading-snug tracking-tight text-[#0a143b] md:text-3xl lg:text-4xl">
              Smarter insurance distribution,
              <br />
              one connected workflow.
            </p>
          </div>

          {/* ── Nav columns + Get a demo pill (mirrors Lumena nav + JOIN THE NEWSLETTER) ── */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-neutral-200 pt-8 pb-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8 lg:pt-10 lg:pb-14">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}

            {/* Standalone links column */}
            <div>
              <h3 className="mb-3 font-heading text-xs font-medium text-[#5B35E0]">
                More
              </h3>
              <ul className="space-y-2.5">
                {standaloneLinks.map((label) => (
                  <li key={label}>
                    <FooterLink href="/">
                      {label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get a demo pill — mirrors "JOIN THE NEWSLETTER" button */}
            <div className="">
              <Button href="/" variant="outline">
                Get a demo
              </Button>
            </div>
          </div>

          {/* ── Large logo row (mirrors Lumena icon + "Lumena" wordmark) ── */}
          <div className="flex items-center gap-6 pt-8 pb-2 lg:pt-10">
            <Image
              src="/ft-logo.svg"
              alt="CoverForce"
              width={250}
              height={50}
              className="h-16 w-auto md:h-20 lg:h-24"
            />
          </div>

          {/* ── Bottom bar (mirrors Lumena bottom bar) ── */}
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 py-6 font-heading text-xs font-medium tracking-wider text-[#3F3F3F] md:py-8">
            {/* Left: copyright */}
            <p>© {new Date().getFullYear()} — Copyright Insuredge Technologies</p>

            {/* Center: back to top */}
            <Link
              href="#"
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-[#3F3F3F]/60 transition-colors hover:text-[#5B35E0] sm:inline-flex"
            >
              Back to Top ↑
            </Link>

            {/* Right: legal links */}
            <ul className="flex flex-wrap gap-4 sm:gap-6">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Container>
    </footer>
  );
};

export default Footer;