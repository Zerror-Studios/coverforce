import Review from '@/components/home/Review'
import React from 'react'
import OperatingSystem from '@/components/solutions/carrier/OperatingSystem'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/carrier/Hero'
import Stat from '@/components/solutions/carrier/Stat'
import StartupFaq from '@/components/solutions/startups/StartupFaq'
import PageWrapper from '@/components/PageWrapper'
import JsonLd from '@/components/common/JsonLd'
import { STARTUP_FAQS } from '@/data/startupFaqs'
import { createPageMetadata } from '@/lib/seo'
import {
  buildFaqPageJsonLd,
  buildMarketingPageJsonLd,
} from '@/lib/jsonLd'

const PATH = '/solutions/carrier'
export const metadata = createPageMetadata(PATH)

const page = () => {
  return (
    <PageWrapper>
      <JsonLd
        data={[
          ...buildMarketingPageJsonLd(PATH),
          buildFaqPageJsonLd(STARTUP_FAQS),
        ]}
      />
      <Hero />
      <OperatingSystem />
      <Stat />
      <Review />
      <CarrierResults />
      <StartupFaq />
    </PageWrapper>
  )
}

export default page
