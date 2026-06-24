import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import Explore from '@/components/home/Explore'
import CarrierResults from '@/components/home/CarrierResults'
import WhosFor from '@/components/solutions/startups/WhosFor'
import ProgramOverview from '@/components/solutions/startups/ProgramOverview'
import Launch from '@/components/solutions/startups/Launch'
import Enablement from '@/components/solutions/startups/Enablement'
import Hero from '@/components/solutions/startups/Hero'
import PageWrapper from '@/components/PageWrapper'
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
        <Explore />
      </PageWrapper>
    </>
  )
}

export default page