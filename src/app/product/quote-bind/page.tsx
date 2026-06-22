import React from 'react'
import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import Explore from '@/components/home/Explore'
import Hero from '@/components/product/quote/Hero'

const QuoteBindPage = () => {
    return (
        <>
            <Hero />
            <WhyCoverforce paddingTop={true} />
            <Review />
            <Explore />
        </>
    )
}

export default QuoteBindPage