import Hero from '@/components/developers/Hero'
import CarrierResults from '@/components/home/CarrierResults'
import Review from '@/components/home/Review'
import Explore from '@/components/home/Explore'
import WhyCoverforce from '@/components/home/WhyCoverforce'
import React from 'react'
import PageWrapper from '@/components/PageWrapper'

const DevelopersPage = () => {
    return (
        <>
            <PageWrapper>
                <Hero />
                <WhyCoverforce paddingTop={true} />
                <Review />
                <CarrierResults />
                <Explore />
            </PageWrapper>
        </>
    )
}

export default DevelopersPage