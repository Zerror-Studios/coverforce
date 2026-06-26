import React from 'react'
import Hero from '@/components/developers/Hero'
import CarrierResults from '@/components/home/CarrierResults'
import Review from '@/components/home/Review'
import Explore from '@/components/home/Explore'
import WhyCoverforce from '@/components/home/WhyCoverforce'
import PageWrapper from '@/components/PageWrapper'
import Endpoints from '@/components/developers/Endpoints'
import OperatingSystem from '@/components/solutions/carrier/OperatingSystem'

const DevelopersPage = () => {
    return (
        <>
            <PageWrapper>
                <Hero />
                <Endpoints />
                <OperatingSystem/>
                <WhyCoverforce paddingTop={true} />
                <Review />
                <CarrierResults />
                <Explore />
            </PageWrapper>
        </>
    )
}

export default DevelopersPage