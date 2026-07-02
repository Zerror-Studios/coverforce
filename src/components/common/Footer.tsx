"use client";

import { useRef, type ReactNode } from "react";
import Container from "./Container";
import Button from "./Button";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FooterLinkData = {
  label: string;
  href: string;
};

type FooterColumnData = {
  title: string;
  links: FooterLinkData[];
};

type LegalLink = {
  label: string;
  href: string;
};

const footerColumns: FooterColumnData[] = [
  {
    title: "Products",
    links: [
      { label: "Submission and intake", href: "/product/submission-intake" },
      { label: "Quotes and bind", href: "/product/quote-bind" },
      { label: "Intelligence", href: "/product/intelligence" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Wholesalers", href: "/solutions/wholesalers" },
      { label: "Brokers", href: "/solutions/brokers" },
      { label: "Carriers", href: "/solutions/carrier" },
      { label: "Startups", href: "/solutions/startups" },
      { label: "Developers", href: "/solutions/developers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/" },
      { label: "Blogs and insights", href: "/" },
      { label: "Career", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "ROI calculator", href: "/calculation" },
      { label: "Appetite checker", href: "/product/intelligence" },
      { label: "2024 carrier API index", href: "/" },
    ],
  },
];

const standaloneLinks: FooterLinkData[] = [
  { label: "Integration", href: "/integration" },
  { label: "Developers", href: "/developers" },
  { label: "Pricing", href: "/pricing" },
];

const legalLinks: LegalLink[] = [
  { label: "Terms of use", href: "/" },
  { label: "Privacy", href: "/" },
  { label: "Security", href: "/" },
];

function FooterBullet() {
  return (
    <span
      className="absolute left-0 top-1/2 size-2 -translate-y-1/2 origin-left scale-0 rounded-full bg-[#151f4d] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
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
      className={`group relative inline-flex pl-0 font-heading text-xs font-medium leading-none  text-[#3F3F3F] transition-[padding-left,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:pl-3.5 hover:text-[#151f4d] ${className}`}
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
      <h3 className="mb-3 font-heading text-xs font-medium  text-[#151f4d]">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <FooterLink href={href}>{label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;

      if (!section || !content) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(content, { yPercent: 0, opacity: 1, clearProps: "transform" });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        gsap.set(content, { yPercent: 0, opacity: 1, clearProps: "transform" });
      });

      mm.add("(min-width: 768px)", () => {
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
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-[#0a143b]"
    >
      <Container borderColor="#53535380">
        <div ref={contentRef} className="relative z-10 will-change-transform max-md:will-change-auto">

          {/* ── Top: logo left, tagline right ── */}
          <div className="border-b border-neutral-200 pt-12 pb-8 md:pt-14 lg:pt-16">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <Link href="/" className="shrink-0">
                <Image
                  src="/Coverforce_logo_blue.svg"
                  alt="CoverForce"
                  width={180}
                  height={34}
                  className="h-7 w-auto md:h-8"
                />
              </Link>
              <p className="max-w-xl font-heading text-xl font-semibold leading-snug tracking-tight text-[#0a143b] sm:text-right md:text-2xl lg:max-w-2xl lg:text-3xl">
                Smarter insurance distribution,
                <br />
                one connected workflow.
              </p>
            </div>
          </div>

          {/* ── Nav columns + Get a demo pill (mirrors Lumena nav + JOIN THE NEWSLETTER) ── */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-neutral-200 pt-8 pb-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8 lg:pt-10 lg:pb-14">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}

            {/* Standalone links column */}
            <div>
              <h3 className="mb-3 font-heading text-xs font-medium text-[#151f4d]">
                More
              </h3>
              <ul className="space-y-2.5">
                {standaloneLinks.map(({ label, href }) => (
                  <li key={label}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get a demo — desktop only */}
            <div className="hidden justify-end lg:flex">
              <Button href="/">Get a demo</Button>
            </div>
          </div>

          {/* ── Bottom bar (mirrors Lumena bottom bar) ── */}
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 py-6 font-heading text-xs font-medium tracking-wider text-[#3F3F3F] md:py-8">
            {/* Left: copyright */}
            <p>CoverForce, Inc. All Rights Reserved, {new Date().getFullYear()}.</p>
            {/* Center: back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-[#3F3F3F]/60 transition-colors hover:text-[#151f4d] sm:inline-flex"
            >
              Back to Top ↑
            </button>

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