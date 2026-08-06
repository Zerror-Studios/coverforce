"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import AnimatedLinkText from "@/components/common/AnimatedLinkText";
import {
    getBottomBorderStyle,
    getTopBorderStyle,
} from "@/components/common/containerStyles";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

const BORDER_COLOR = "#53535380";

type Endpoint = {
    name: string;
    description: string;
    badge?: string;
};

const ENDPOINTS: Endpoint[] = [
    {
        name: "Document AI",
        description: "Extract structured data from ACORD forms, policies, loss runs, proposals.",
        badge: "All",
    },
    {
        name: "Appetite",
        description: "Real-time carrier eligibility by policy type, state, and NAICS.",
        badge: "All",
    },
    {
        name: "Quote",
        description: "Submit once, get quotes from 40+ carriers. Question logic server-side.",
    },
    {
        name: "Bind",
        description: "Bind policy and process payment in one call. Returns policy docs.",
    },
    {
        name: "Renewals",
        description: "Pre-filled from prior policies. Reduces complexity for recurring business.",
    },
    {
        name: "Status",
        description: "Real-time application and quote status. Webhook support for async workflows.",
    },
    {
        name: "Analytics",
        description: "Usage metrics, bind ratios, performance data.",
    },
    {
        name: "Documents",
        description: "Retrieve policy docs, ACORDs, proposals.",
    },
];

const WAVE_MS = 650;
const ROW_STAGGER = 0.09;

function EndpointRow({
    endpoint,
    index,
}: {
    endpoint: Endpoint;
    index: number;
}) {
    const rowRef = useRef<HTMLLIElement>(null);
    const [hovered, setHovered] = useState(false);
    const [wave, setWave] = useState(false);

    useGSAP(() => {
        const row = rowRef.current;
        if (!row) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let resetTimer: ReturnType<typeof setTimeout> | null = null;

        const st = ScrollTrigger.create({
            trigger: row,
            start: "top 88%",
            once: true,
            onEnter: () => {
                const delay = index * ROW_STAGGER * 1000;
                window.setTimeout(() => {
                    setWave(true);
                    resetTimer = setTimeout(() => setWave(false), WAVE_MS);
                }, delay);
            },
        });

        return () => {
            st.kill();
            if (resetTimer) clearTimeout(resetTimer);
        };
    }, [index]);

    return (
        <li
            ref={rowRef}
            className="endpoint-row group"
            style={getBottomBorderStyle(BORDER_COLOR)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="grid grid-cols-1 items-center gap-2 py-5 transition-transform duration-300 ease-out group-hover:translate-x-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-8 md:py-6">
                <div className="flex items-center gap-3">
                
                    <span className="font-heading text-xl font-normal tracking-tight text-[#151f4d] md:text-2xl">
                        <AnimatedLinkText
                            hovered={hovered || wave}
                            textClip="h-[1.25rem] md:h-6"
                            textLine="h-[1.25rem] leading-none md:h-6 md:leading-none"
                        >
                            {`/${endpoint.name}`}
                        </AnimatedLinkText>
                    </span>
                </div>
                <p className="font-sans text-base font-normal leading-relaxed text-[#49494A]">
                    {endpoint.description}
                </p>
            </div>
        </li>
    );
}

const Endpoints = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useSectionHeaderReveal({
        scopeRef: sectionRef,
        headerRef,
        headingRef,
        theme: "light",
    });

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const rows = gsap.utils.toArray<HTMLElement>(".endpoint-row");
            gsap.set(rows, { opacity: 0, y: 28 });

            gsap.to(rows, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.09,
                scrollTrigger: {
                    trigger: ".endpoint-list",
                    start: "top 80%",
                    toggleActions: "play none none none",
                    once: true,
                },
            });

            const lenis = window.lenis;
            let scrollPending = false;
            const onLenisScroll = () => {
                if (scrollPending) return;
                scrollPending = true;
                requestAnimationFrame(() => {
                    ScrollTrigger.update();
                    scrollPending = false;
                });
            };
            lenis?.on("scroll", onLenisScroll);

            ScrollTrigger.refresh();

            return () => {
                lenis?.off("scroll", onLenisScroll);
            };
        },
        { scope: sectionRef },
    );

    return (
        <section id="endpoints" ref={sectionRef} className="bg-white text-[#0a143b]">
            <Container borderColor={BORDER_COLOR}>
                <div ref={headerRef} className="py-16 md:py-20 lg:py-24">
                    <h2
                        ref={headingRef}
                        className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#BCC5D6] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                    >
                        <span data-split>The API toolkit for commercial insurance distribution</span>
                    </h2>

                    <ul className="endpoint-list mt-12 md:mt-16" style={getTopBorderStyle(BORDER_COLOR)}>
                        {ENDPOINTS.map((endpoint, index) => (
                            <EndpointRow
                                key={endpoint.name}
                                endpoint={endpoint}
                                index={index}
                            />
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
};

export default Endpoints;
