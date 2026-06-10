import Container from "./Container";
import Button from "./Button";
import Link from "next/link";
import Image from "next/image";
import { RiArrowDownSLine } from "@remixicon/react";

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

          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
            <ul className="pointer-events-auto flex items-center gap-6 xl:gap-8">
              {navItems.map(({ label, href, hasDropdown }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-1 font-mono text-xs font-regular uppercase tracking-[0.12em] text-white/95 transition-colors hover:text-white"
                  >
                    {label}
                    {hasDropdown && (
                      <RiArrowDownSLine
                        className="size-4 opacity-80"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 hidden items-center gap-6 lg:flex xl:gap-8">
            <Link
              href="/"
              className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-white/95 transition-colors hover:text-white"
            >
              Login
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
