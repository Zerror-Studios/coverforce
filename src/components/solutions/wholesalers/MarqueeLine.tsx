"use client";

import Image from "next/image";

import Container from "@/components/common/Container";

const DEFAULT_LOGOS = Array.from({ length: 15 }, (_, index) => ({
  src: `/images/marquee/logo (${index + 1}).png`,
  alt: `Partner logo ${index + 1}`,
}));

export type MarqueeLogo = {
  src: string;
  alt: string;
};

type MarqueeRowProps = {
  reverse?: boolean;
  offset?: boolean;
  logos?: readonly MarqueeLogo[];
  size?: "default" | "large";
  /** "dark" = black logos on light bg; "light" = white logos on dark/colored bg */
  tone?: "dark" | "light";
};

const LOGO_SLOT_CLASS = {
  default:
    "flex h-7 w-[7.5rem] shrink-0 items-center justify-center sm:h-8 sm:w-36 md:h-8 md:w-40 lg:h-9 lg:w-44",
  large:
    "flex h-8 w-36 shrink-0 items-center justify-center sm:h-9 sm:w-40 md:h-9 md:w-44 lg:h-10 lg:w-48",
} as const;

const LOGO_IMAGE_CLASS =
  "h-full w-full max-h-full max-w-full object-contain object-center opacity-90 grayscale contrast-200";

const LOGO_TONE_CLASS = {
  dark: "brightness-0",
  light: "brightness-0 invert",
} as const;

export function MarqueeRow({
  reverse = false,
  offset = false,
  logos = DEFAULT_LOGOS,
  size = "default",
  tone = "dark",
}: MarqueeRowProps) {
  const items = [...logos, ...logos];

  return (
    <div
      className={`logo-marquee-viewport ${offset ? "logo-marquee-viewport--offset" : ""}`}
      aria-hidden
    >
      <div className={`logo-marquee-track ${reverse ? "logo-marquee-track--reverse" : ""}`}>
        {items.map((logo, index) => (
          <div key={`${logo.src}-${index}`} className="logo-marquee-item">
            <div className={LOGO_SLOT_CLASS[size]}>
              <Image
                src={logo.src}
                alt="partner-logo"
                width={size === "large" ? 192 : 176}
                height={size === "large" ? 40 : 36}
                className={`${LOGO_IMAGE_CLASS} ${LOGO_TONE_CLASS[tone]}`}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MarqueeLine = ({ className }: { className?: string }) => {
  return (
    <section className="relative overflow-hidden">
      <Container borderColor="#53535380" borderBottom>
        <div className={`relative z-10 py-16 md:py-20 lg:py-46 ${className}`}>
          <MarqueeRow />
        </div>
      </Container>
    </section>
  );
};

export default MarqueeLine;
