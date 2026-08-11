import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import OperatingSystem from '@/components/solutions/brokers/OperatingSystem'
import Workflow from '@/components/solutions/brokers/workflow'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/brokers/Hero'
import PageWrapper from '@/components/PageWrapper'
import PageJsonLd from '@/components/common/PageJsonLd'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata('/solutions/brokers')

const page = () => {
  return (
    <>
    <PageJsonLd path="/solutions/brokers" />
    <PageWrapper>
    <Hero/>
    <OperatingSystem/>
    <Workflow/>
    <WhyCoverforce paddingTop={true}/>
    <Review/>
    <CarrierResults/>
    </PageWrapper>
    </>
  )
}

export default page