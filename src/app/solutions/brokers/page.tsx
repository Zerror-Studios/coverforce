import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import Explore from '@/components/home/Explore'
import OperatingSystem from '@/components/solutions/brokers/OperatingSystem'
import Workflow from '@/components/solutions/brokers/workflow'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/brokers/Hero'
import PageWrapper from '@/components/PageWrapper'

const page = () => {
  return (
    <>
    <PageWrapper>
    <Hero/>
    <OperatingSystem/>
    <Workflow/>
    <WhyCoverforce paddingTop={true}/>
    <Review/>
    <CarrierResults/>
    <Explore/>
    </PageWrapper>
    </>
  )
}

export default page