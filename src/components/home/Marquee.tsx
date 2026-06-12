"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import Container from "../common/Container";
import { animateSplitTextReveal } from "@/lib/animateSplitTextReveal";

const LOGOS = [
    { src: "/images/logos/logo1.svg", alt: "RT Specialty" },
    { src: "/images/logos/logo2.svg", alt: "First Connect" },
    { src: "/images/logos/logo3.svg", alt: "Amwins" },
    { src: "/images/logos/logo4.svg", alt: "Jencap" },
] as const;

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
                            width={207}
                            height={74}
                            className="h-7 w-auto object-contain grayscale contrast-200 brightness-0 md:h-9 lg:h-14"
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
                        className="max-w-xl text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                    >
                        <span data-split className="font-medium text-[#424242]">
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
