import React from 'react'
import WhyCoverforce from '@/components/home/WhyCoverforce'
import Hero from '@/components/product/intelligence/Hero'
import IntelligenceWorkFlow from '@/components/product/intelligence/IntelligenceWorkFlow'
import ExplorePlatform from '@/components/product/intelligence/ExplorePlatform'
import CommingSoon from '@/components/product/intelligence/CommingSoon'
import PageWrapper from '@/components/PageWrapper'
import { createPageMetadata } from '@/lib/seo'
import CarrierMatch from '@/components/product/quote/CarrierMatch'

export const metadata = createPageMetadata('/product/intelligence')



const IntelligencePage = () => {
    return (
        <>
            <PageWrapper>
                <Hero />
                <IntelligenceWorkFlow />
                <CarrierMatch eyepilllabel="Appetite Checker" />
                <ExplorePlatform />
                <WhyCoverforce paddingTop={true} />
                <CommingSoon />
            </PageWrapper>
        </>
    )
}

export default IntelligencePage
