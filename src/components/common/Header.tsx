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
    <nav className="bg-[#0a143b] text-white">
      <Container>
        <div className="flex items-center justify-between gap-8 py-4 md:py-5">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="CoverForce"
              width={180}
              height={34}
              priority
              className="h-7 w-auto md:h-8"
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            <ul className="flex items-center gap-6 xl:gap-8">
              {navItems.map(({ label, href, hasDropdown }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.12em] text-white/95 transition-colors hover:text-white"
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

            <div className="flex items-center gap-6 xl:gap-8">
              <Link
                href="/"
                className="text-xs font-medium uppercase tracking-[0.12em] text-white/95 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Button href="/" variant="primary" size="sm">
                Book a call
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Header;
