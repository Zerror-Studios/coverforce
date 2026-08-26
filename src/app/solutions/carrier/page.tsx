import Review from '@/components/home/Review'
import React from 'react'
import OperatingSystem from '@/components/solutions/carrier/OperatingSystem'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/carrier/Hero'
import Stat from '@/components/solutions/carrier/Stat'
import StartupFaq from '@/components/solutions/startups/StartupFaq'
import PageWrapper from '@/components/PageWrapper'
import JsonLd from '@/components/common/JsonLd'
import { CARRIER_FAQS } from '@/data/faqs'
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
          buildFaqPageJsonLd(CARRIER_FAQS),
        ]}
      />
      <Hero />
      <OperatingSystem />
      <Stat />
      <Review />
      <CarrierResults />
      <StartupFaq items={CARRIER_FAQS} />
    </PageWrapper>
  )
}

export default page
