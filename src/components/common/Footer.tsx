"use client";

import { type ReactNode } from "react";
import Container from "./Container";
import Button from "./Button";
import RequestDemoButton from "@/components/request-demo/RequestDemoButton";
import Link from "next/link";
import Image from "next/image";

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
      { label: "Submission and Intake", href: "/product/submission-intake" },
      { label: "Quotes and Bind", href: "/product/quote-bind" },
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
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blogs and Insights", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "ROI Calculator", href: "/calculation" },
      { label: "Appetite Checker", href: "/product/intelligence#appetite" },
      { label: "2026 Carrier API Index", href: "/integration#integration" },
    ],
  },
];

const standaloneLinks: FooterLinkData[] = [
  { label: "Integration", href: "/integration" },
  { label: "Developers", href: "/developers" },
  { label: "Pricing", href: "/pricing" },
];

const legalLinks: LegalLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Security", href: "/security" },
];

const footerContactLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/coverforceinc",
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: "Email CoverForce",
    href: "mailto:sales@coverforce.com?subject=Coverforce%20Website%20Inquiry",
    icon: EmailIcon,
    external: false,
  },
  {
    label: "Call CoverForce",
    href: "tel:+1(917)9056508",
    icon: PhoneIcon,
    external: false,
  },
] as const;

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function FooterBullet({ className = "" }: { className?: string }) {
  return (
    <span
      className={`size-1.5 shrink-0 rounded-full bg-[#3D3D3D] ${className}`}
      aria-hidden
    />
  );
}

function FooterHoverBullet() {
  return (
    <span
      className="absolute left-0 top-1/2 size-2 -translate-y-1/2 origin-left scale-0 rounded-full bg-[#151F4D] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
      aria-hidden
    />
  );
}

const footerLinkColor = "text-[#797979]";
const footerLinkHoverColor = "hover:text-[#3D3D3D]";

const footerLinkHover =
  `transition-[padding-left,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:pl-3.5`;

type FooterLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function FooterSubLink({ href, children, className = "" }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex pl-0 font-heading text-sm font-medium leading-snug ${footerLinkColor} ${footerLinkHoverColor} ${footerLinkHover} ${className}`}
    >
      <FooterHoverBullet />
      {children}
    </Link>
  );
}

function FooterTopLink({
  href,
  children,
  className = "",
  showBullet = true,
}: FooterLinkProps & { showBullet?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center font-heading text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${footerLinkColor} transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${footerLinkHoverColor} ${showBullet ? "gap-2" : ""} ${className}`}
    >
      {showBullet ? (
        <FooterBullet className="transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 group-hover:bg-[#151F4D]" />
      ) : null}
      {children}
    </Link>
  );
}

function FooterLegalLink({ href, children, className = "" }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex pl-0 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.12em] ${footerLinkColor} ${footerLinkHoverColor} ${footerLinkHover} ${className}`}
    >
      <FooterHoverBullet />
      {children}
    </Link>
  );
}

type FooterColumnProps = FooterColumnData;

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-heading text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#3D3D3D]">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <FooterSubLink href={href}>{label}</FooterSubLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  const scrollToTop = () => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-[#F9F8FF] text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="relative z-10 pt-12 md:pt-16 lg:pt-20">

          {/* ── Top: CTA banner ── */}
          <div className="relative min-h-[22rem] overflow-hidden border-b border-neutral-200 md:min-h-[26rem] lg:min-h-[30rem]">
            <Image
              src="/images/footer.avif"
              alt="footer-banner"
              fill
              className="object-cover object-top md:object-center"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-black/75 via-black/40 to-black/10 md:from-black/60 md:via-black/25 md:to-transparent"
              aria-hidden
            />

            <div className="relative z-10 flex min-h-[inherit] items-start px-6 pt-10 pb-12 md:items-center md:px-10 md:pt-20 md:pb-16 lg:px-12 lg:pt-24 lg:pb-20">
              <div className="max-w-xl text-left lg:max-w-2xl">

                <h2 className="mt-5 text-2xl font-heading font-regular leading-[1.12] tracking-tight text-white md:mt-6 md:text-3xl lg:text-4xl lg:leading-[1.1]">
                  One submission is all it takes. Compare multiple carriers and bind
                  the right policy quickly with CoverForce.
                </h2>

                <div className="mt-8 flex w-full max-w-[21rem] flex-row items-center gap-2.5 sm:mt-10 sm:max-w-none sm:gap-4">
                  <RequestDemoButton balanced surface="on-dark" className="!min-w-0 !px-3.5 sm:!min-w-[148px] sm:!px-5">
                    Request demo
                  </RequestDemoButton>
                  <Button href="/contact" balanced variant="secondary" surface="on-dark" className="!min-w-0 !px-3.5 sm:!min-w-[148px] sm:!px-5">
                    Book a call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Nav columns + social icons ── */}
          <div className="border-b border-neutral-200 pt-10 pb-8 md:pt-12 md:pb-10 lg:pt-14 lg:pb-12">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10">
              {footerColumns.map((column) => (
                <FooterColumn key={column.title} {...column} />
              ))}

              <div>
                <ul className="space-y-4">
                  {standaloneLinks.map(({ label, href }) => (
                    <li key={label}>
                      <FooterTopLink href={href} showBullet={false}>
                        {label}
                      </FooterTopLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sm:hidden">
                <ul className="space-y-4">
                  {legalLinks.map(({ label, href }) => (
                    <li key={label}>
                      <FooterTopLink href={href} showBullet={false}>
                        {label}
                      </FooterTopLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-5 md:mt-12">
              {footerContactLinks.map(({ label, href, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={label}
                  className={`${footerLinkColor} transition-colors ${footerLinkHoverColor}`}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="relative flex flex-col items-center gap-5 py-6 font-heading md:flex-row md:justify-between md:py-8">
            <ul className="hidden flex-wrap justify-center gap-5 sm:flex sm:gap-8 md:justify-start">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <FooterLegalLink href={href}>{label}</FooterLegalLink>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={scrollToTop}
              className={`group relative inline-flex pl-0 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.12em] ${footerLinkColor} ${footerLinkHoverColor} ${footerLinkHover} md:absolute md:left-1/2 md:-translate-x-1/2`}
            >
              <FooterHoverBullet />
              Back to Top
            </button>

            <p className="text-center font-heading text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[#3D3D3D] md:text-right">
              CoverForce, Inc. All Rights Reserved, {new Date().getFullYear()}.
            </p>
          </div>

        </div>
      </Container>
    </footer>
  );
};

export default Footer;