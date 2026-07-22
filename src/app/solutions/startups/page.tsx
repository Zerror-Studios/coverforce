import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import CarrierResults from '@/components/home/CarrierResults'
import WhosFor from '@/components/solutions/startups/WhosFor'
import ProgramOverview from '@/components/solutions/startups/ProgramOverview'
import Launch from '@/components/solutions/startups/Launch'
import Enablement from '@/components/solutions/startups/Enablement'
import Hero from '@/components/solutions/startups/Hero'
import PageWrapper from '@/components/PageWrapper'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata('/solutions/startups')
const page = () => {
  return (
    <>
      <PageWrapper>
        <Hero />
        <WhosFor />
        <ProgramOverview />
        <Launch />
        <Enablement />
        <WhyCoverforce paddingTop={true} />
        <Review />
        <CarrierResults />
      </PageWrapper>
    </>
  )
}

export default page
