import React from 'react'
import Explore from '@/components/home/Explore'
import Review from '@/components/home/Review'
import WhyCoverforce from '@/components/home/WhyCoverforce'
import Hero from '@/components/product/intelligence/Hero'
import IntelligenceWorkFlow from '@/components/product/intelligence/IntelligenceWorkFlow'

const IntelligencePage = () => {
    return (
        <>
            <Hero />
            <IntelligenceWorkFlow />
            <WhyCoverforce paddingTop={true} />
            <Review />
            <Explore />
        </>
    )
}

export default IntelligencePage
