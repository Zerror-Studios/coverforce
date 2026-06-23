import Hero from '@/components/developers/Hero'
import CarrierResults from '@/components/home/CarrierResults'
import Review from '@/components/home/Review'
import Explore from '@/components/home/Explore'
import WhyCoverforce from '@/components/home/WhyCoverforce'
import React from 'react'

const DevelopersPage = () => {
    return (
        <>
            <Hero />
            <WhyCoverforce paddingTop={true} />
            <Review />
            <CarrierResults />
            <Explore />
        </>
    )
}

export default DevelopersPage