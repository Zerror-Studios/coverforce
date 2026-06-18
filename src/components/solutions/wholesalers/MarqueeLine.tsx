"use client";

import Image from "next/image";

import Container from "@/components/common/Container";

const LOGOS = Array.from({ length: 15 }, (_, index) => ({
  src: `/images/marquee/logo (${index + 1}).png`,
  alt: `Partner logo ${index + 1}`,
}));

type MarqueeRowProps = {
  reverse?: boolean;
  offset?: boolean;
};

function MarqueeRow({ reverse = false, offset = false }: MarqueeRowProps) {
  const items = [...LOGOS, ...LOGOS];

  return (
    <div
      className={`logo-marquee-viewport ${offset ? "logo-marquee-viewport--offset" : ""}`}
      aria-hidden
    >
      <div className={`logo-marquee-track ${reverse ? "logo-marquee-track--reverse" : ""}`}>
        {items.map((logo, index) => (
          <div key={`${logo.src}-${index}`} className="logo-marquee-item">
            <Image
              src={logo.src}
              alt=""
              width={120}
              height={40}
              className="h-5 w-auto max-h-5 object-contain opacity-90 grayscale contrast-200 brightness-0 md:h-6 md:max-h-6 lg:h-7 lg:max-h-7"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const MarqueeLine = () => {
  return (
    <section className="relative overflow-hidden">
      <Container borderColor="#53535380" borderBottom>
        <div className="relative z-10 py-16 md:py-20 lg:py-46">
          <MarqueeRow />
        </div>
      </Container>
    </section>
  );
};

export default MarqueeLine;
