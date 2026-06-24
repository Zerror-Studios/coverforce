"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import Container from "../common/Container";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

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

const Marquee = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useGSAP(
        () => {
            const heading = headingRef.current;
            if (!heading) return;

            return animateSplitTextReveal(heading);
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className="relative overflow-hidden bg-white">
            <Container borderColor="#53535380" borderBottom>
                <div className="relative z-10 py-16 md:py-20 lg:py-24">
                    <h2
                        ref={headingRef}
                        className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                    >
                        <span data-split className="font-medium">
                            Commercial insurance distribution that gets smarter with every transaction
                        </span>
                    </h2>
                </div>
                <div className="relative z-10 space-y-8 pb-16 md:space-y-10 md:pb-20 lg:pb-24">
                    <MarqueeRow />
                    <MarqueeRow reverse offset />
                </div>
            </Container>
        </section>
    );
};

export default Marquee;
