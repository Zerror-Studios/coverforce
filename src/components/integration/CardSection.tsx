"use client";

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '@/components/common/Container'

gsap.registerPlugin(ScrollTrigger)

type StatCard = {
    value: string
    title: string
    tag: string
}

const CARDS: StatCard[] = [
    { value: '20', title: 'Direct API integrations', tag: 'Carriers' },
    { value: '6', title: 'Agency management sync', tag: 'AMS' },
    { value: '3', title: 'Payment & compliance', tag: 'Finance' },
    { value: '3', title: 'Intelligence layer Nationwide:', tag: 'AI & Cloud' },
]

const CardSection = () => {
    const gridRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
            const cards = gsap.utils.toArray<HTMLElement>('[data-stat-card]')
            if (!cards.length) return

            gsap.set(cards, { rotateY: 90, opacity: 0, transformOrigin: 'left center' })

            ScrollTrigger.batch(cards, {
                start: 'top 85%',
                onEnter: (batch) =>
                    gsap.to(batch, {
                        rotateY: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        stagger: 0.12,
                        overwrite: true,
                    }),
            })
        },
        { scope: gridRef },
    )

    return (
        <section className="relative overflow-hidden bg-white text-[#0a143b]">
            <Container borderColor="#53535333">
                <div
                    ref={gridRef}
                    className="grid grid-cols-2 gap-2 py-12 sm:gap-3 md:py-20 lg:grid-cols-4 lg:gap-3 lg:py-24"
                    style={{ perspective: '1200px' }}
                >
                    {CARDS.map((card) => (
                        <div
                            key={card.title}
                            data-stat-card
                            className="flex min-h-[10.5rem] flex-col rounded-md bg-[#F8F8F8] p-4 transform-3d will-change-transform sm:min-h-[11.5rem] lg:h-86 lg:p-6"
                        >
                            <span className="font-heading text-3xl font-regular leading-none tracking-tight text-[#4F4F4F] lg:text-5xl">
                                {card.value}
                            </span>
                            <div className="mt-auto">
                                <p className="max-w-48 text-sm font-heading font-medium leading-snug text-[#2D3E9D] lg:text-xl">
                                    {card.title}
                                </p>
                                <p className="mt-1.5 text-[0.65rem] font-mono font-medium uppercase text-[#9A9A9A] lg:mt-2 lg:text-sm">
                                    {card.tag}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}

export default CardSection
