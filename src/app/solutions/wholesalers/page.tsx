import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import Explore from '@/components/home/Explore'
import OperatingSystem from '@/components/solutions/brokers/OperatingSystem'
import Workflow from '@/components/solutions/brokers/workflow'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/wholesalers/Hero'
import MarqueeLine from '@/components/solutions/wholesalers/MarqueeLine'
const page = () => {
  return (
    <>
    <Hero/>
    <MarqueeLine/>
    <Workflow/>
    <OperatingSystem/>
    <WhyCoverforce paddingTop={true}/>
    <Review/>
    <CarrierResults/>
    <Explore/>
    </>
  )
}

export default page