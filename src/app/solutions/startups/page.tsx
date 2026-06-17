import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import Hero from '@/components/solutions/brokers/Hero'
import Explore from '@/components/home/Explore'
import CarrierResults from '@/components/home/CarrierResults'
import WhosFor from '@/components/solutions/startups/WhosFor'
import ProgramOverview from '@/components/solutions/startups/ProgramOverview'
import Launch from '@/components/solutions/startups/Launch'
import Enablement from '@/components/solutions/startups/Enablement'
const page = () => {
  return (
    <>
    <Hero/>
    <WhosFor/>
    <ProgramOverview/>
    <Launch/>
    <Enablement/>
    <WhyCoverforce/>
    <Review/>
    <CarrierResults/>
    <Explore/>
    </>
  )
}

export default page