import React from 'react'
import Container from '@/components/common/Container'

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
    return (
        <section className="relative overflow-hidden bg-white 16 text-[#0a143b] ">
            <Container borderColor="#53535333">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 py- md:py-24">
                    {CARDS.map((card) => (
                        <div
                            key={card.title}
                            className="flex h-86 flex-col rounded-md bg-[#F8F8F8] p-6"
                        >
                            <span className="font-heading text-5xl font-regular leading-none tracking-tight text-[#4F4F4F]">
                                {card.value}
                            </span>
                            <div className="mt-auto">
                                <p className="max-w-48 text-xl font-heading font-medium leading-snug text-[#2D3E9D]">
                                    {card.title}
                                </p>
                                <p className="mt-2 text-sm font-mono font-medium uppercase text-[#9A9A9A]">
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
