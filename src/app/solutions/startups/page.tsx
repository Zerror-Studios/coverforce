import React from 'react'
import CarrierResults from '@/components/home/CarrierResults'
import WhosFor from '@/components/solutions/startups/WhosFor'
import ProgramOverview from '@/components/solutions/startups/ProgramOverview'
import Launch from '@/components/solutions/startups/Launch'
import Enablement from '@/components/solutions/startups/Enablement'
import EducationalResources from '@/components/solutions/startups/EducationalResources'
import StartupFaq from '@/components/solutions/startups/StartupFaq'
import StartupTestimonials from '@/components/solutions/startups/StartupTestimonials'
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
        <EducationalResources />
        <StartupFaq />
        <StartupTestimonials />
        <CarrierResults />
      </PageWrapper>
    </>
  )
}

export default page
