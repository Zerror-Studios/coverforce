"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import {
    getBottomBorderStyle,
    getTopBorderStyle,
} from "@/components/common/containerStyles";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

const BORDER_COLOR = "#53535333";

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
        <section ref={sectionRef} className="bg-white text-[#0a143b]">
            <Container borderColor={BORDER_COLOR}>
                <div ref={headerRef} className="py-16 md:py-20 lg:py-24">
                    <h2
                        ref={headingRef}
                        className="max-w-md text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#BCC5D6] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
                    >
                        <span data-split>The API toolkit for commercial insurance distribution</span>
                    </h2>

                    <ul className="endpoint-list mt-12 md:mt-16" style={getTopBorderStyle(BORDER_COLOR)}>
                        {ENDPOINTS.map((endpoint) => (
                            <li
                                key={endpoint.name}
                                className="endpoint-row grid grid-cols-1 items-center gap-2 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-8 md:py-6"
                                style={getBottomBorderStyle(BORDER_COLOR)}
                            >
                                <div className="flex items-center gap-3">
                                    {endpoint.badge ? (
                                        <span className="flex h-6 min-w-9 items-center justify-center rounded-full bg-[#0130BE] px-2 font-sans text-xs font-semibold  tracking-[0.08em] text-white">
                                            {endpoint.badge}
                                        </span>
                                    ) : null}
                                    <span className="font-heading text-xl font-normal tracking-tight text-[#4445DA] md:text-2xl">
                                        /
                                        {endpoint.name}
                                    </span>
                                </div>
                                <p className="font-sans text-base font-normal leading-relaxed text-[#49494A]">
                                    {endpoint.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
};

export default Endpoints;
