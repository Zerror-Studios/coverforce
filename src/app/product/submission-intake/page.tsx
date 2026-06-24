import React from 'react'
import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import Explore from '@/components/home/Explore'
import Hero from '@/components/product/submission/Hero'
import RealWorkflow from '@/components/product/submission/RealWorkflow'
import LiveDemo from '@/components/product/submission/LiveDemo'
import DemoSteps from '@/components/product/submission/DemoSteps'
import PageWrapper from '@/components/PageWrapper'

const SubmissionIntakePage = () => {
    return (
        <>
            <PageWrapper>
                <Hero />
                <RealWorkflow />
                <LiveDemo />
                <DemoSteps />
                <WhyCoverforce paddingTop={true} />
                <Review />
                <Explore />
            </PageWrapper>
        </>
    )
}

export default SubmissionIntakePage