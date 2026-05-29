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
      className="inline-block size-2 rounded-full shrink-0 bg-[#5B35E0]"
      aria-hidden
    />
  );
}

type FooterColumnProps = FooterColumnData;

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="mb-5 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a143b]">
        <FooterBullet />
        {title}
      </h3>
      <ul className="space-y-3.5">
        {links.map((label) => (
          <li key={label}>
            <Link
              href="/"
              className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-800 transition-colors hover:text-[#0a143b]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-white text-[#0a143b]">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-[60%] opacity-90"
        aria-hidden
      >
        <Image
          src="/footer-decoration.svg"
          alt=""
          fill
          sizes="60vw"
          className="object-cover object-left"
        />
      </div>

      <Container borderColor="#5353531A">
        <div className="relative z-10">
          <div className="flex flex-col gap-6 border-b border-neutral-200 pt-12 pb-5 md:flex-row md:items-start md:justify-between md:gap-8 md:pt-14 md:pb-6 lg:pt-16 lg:pb-7">
            <Link href="/" className="shrink-0">
              <Image
                src="/footer-logo.svg"
                alt="CoverForce"
                width={240}
                height={45}
                className="h-10 w-auto md:h-12 lg:h-14"
              />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600 md:text-right">
              CoverForce brings smarter insurance distribution into one
              connected workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-neutral-200 pt-8 pb-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8 lg:pt-10 lg:pb-14">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}

            <div className="space-y-5">
              {standaloneLinks.map((label) => (
                <Link
                  key={label}
                  href="/"
                  className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a143b] transition-opacity hover:opacity-80"
                >
                  <FooterBullet />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 py-8 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-700 sm:flex-row sm:items-center sm:justify-between md:py-10">
            <ul className="flex flex-wrap gap-6 sm:gap-8">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-[#0a143b]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-neutral-500 sm:text-right">
              © 2024 — Copyright Insuredge Technologies
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
