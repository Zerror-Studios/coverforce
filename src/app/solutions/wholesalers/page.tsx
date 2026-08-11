import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import OperatingSystem from '@/components/solutions/wholesalers/OperatingSystem'
import Workflow from '@/components/solutions/brokers/workflow'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/wholesalers/Hero'
import PageWrapper from '@/components/PageWrapper'
import PageJsonLd from '@/components/common/PageJsonLd'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata('/solutions/wholesalers')
  const page = () => {
  return (
    <>
      <PageJsonLd path="/solutions/wholesalers" />
      <PageWrapper>
        <Hero />
        <OperatingSystem />
        <Workflow coverforceBackground="wholesaler" />
        <WhyCoverforce paddingTop={true} />
        <Review />
        <CarrierResults />
      </PageWrapper>
    </>
  )
}

export default page