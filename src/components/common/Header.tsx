import Container from "./Container";
import Button from "./Button";
import Link from "next/link";
import Image from "next/image";
import { RiArrowDownSLine } from "@remixicon/react";

type NavItem = {
  label: string;
  href: string;
  hasDropdown: boolean;
  subItems?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: "Product", href: "/", hasDropdown: true,
    subItems: [
      { label: "Submission & Intake", href: "/", hasDropdown: false },
      { label: "Quote & Bind", href: "/", hasDropdown: false },
      { label: "Intelligence", href: "/", hasDropdown: false },

    ],
  },
  {
    label: "Solutions", href: "/", hasDropdown: true,
    subItems: [
      { label: "ROI Calculator", href: "/", hasDropdown: false },
      { label: "Appetite Checker", href: "/", hasDropdown: false },
      { label: "2026 Carrier API Index", href: "/", hasDropdown: false },
      { label: "Wholesalers", href: "/", hasDropdown: false },
      { label: "Brokers", href: "/", hasDropdown: false },
      { label: "Carriers", href: "/", hasDropdown: false },
      { label: "Startups", href: "/", hasDropdown: false },
      { label: "Developers", href: "/", hasDropdown: false },
    ],
  },
  { label: "Developers", href: "/", hasDropdown: false },
  { label: "Pricing", href: "/", hasDropdown: false },
  {
    label: "Company", href: "/", hasDropdown: true,
    subItems: [
      { label: "About CoverForce", href: "/", hasDropdown: false },
      { label: "Blogs and news", href: "/", hasDropdown: false },
      { label: "Career", href: "/", hasDropdown: false },
      { label: "Contact", href: "/", hasDropdown: false },
    ],
  },
];

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
  return (
    <nav className="w-full bg-[#121C49] text-white border-b border-[#FFFFFF1A]">
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

          <div className="pointer-events-none  absolute inset-0 hidden items-center justify-center lg:flex">
            <div className="relative h-full flex items-center">
              <ul className="pointer-events-auto flex items-center gap-6 xl:gap-8">
                {navItems.map(({ label, href, hasDropdown }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-center gap-1 font-heading text-xs font-regular tracking-[0.12em] text-white/95 transition-colors hover:text-white"
                    >
                      <NavLinkLabel label={label} />
                      {hasDropdown && (

                        <RiArrowDownSLine
                          className="size-4 opacity-80 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:rotate-180"
                          aria-hidden
                        />
                      )}
                    </Link>
                  </li>
                ))}
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
    </nav>
  );
};

export default Header;
