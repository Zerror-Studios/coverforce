import type { ReactNode } from "react";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";

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
      className="absolute left-0 top-1/2 size-2 -translate-y-1/2 origin-left scale-0 rounded-full bg-[#5B35E0] transition-transform duration-200 ease-out group-hover:scale-100"
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
      className={`group relative inline-flex pl-0 font-heading text-xs leading-0 font-medium  tracking-wider text-[#3F3F3F] transition-[padding-left,color] duration-200 ease-out hover:pl-3.5 hover:text-[#5B35E0] ${className}`}
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
      <h3 className="mb-5 flex items-center gap-2.5 font-heading text-xs font-medium  tracking-[0.14em] text-[#5B35E0]">
        {title}
      </h3>
      <ul className="space-y-3.5">
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
  return (
    <footer className="relative overflow-hidden bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="relative z-10">
          <div className="flex flex-col gap-6 border-b border-neutral-200 pt-12 pb-5 md:flex-row md:items-start md:justify-between md:gap-8 md:pt-14 md:pb-6 lg:pt-16 lg:pb-7">
            <Link href="/" className="shrink-0">
              <Image
                src="/footer-logo.svg"
                alt="CoverForce"
                width={240}
                height={45}
                className="h-10 w-auto md:h-12 lg:h-12"
              />
            </Link>
            <p className="max-w-xs font-heading font-regular text-sm leading-relaxed text-neutral-600 md:text-left">
              CoverForce brings smarter insurance distribution into one
              connected workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-neutral-200 pt-8 pb-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8 lg:pt-10 lg:pb-14">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}

            <div className="gap-7 flex flex-col">
              {standaloneLinks.map((label) => (
                <FooterLink
                  key={label}
                  href="/"
                  className="tracking-[0.14em]"
                >
                  {label}
                </FooterLink>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 py-8 font-heading text-xs font-medium  tracking-wider text-[#3F3F3F] sm:flex-row sm:items-center sm:justify-between md:py-10">
            <ul className="flex flex-wrap gap-6 sm:gap-8">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
            <p className="font-heading text-xs font-medium text-[#3F3F3F] sm:text-right">
              © {new Date().getFullYear()} — Copyright Insuredge Technologies
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
