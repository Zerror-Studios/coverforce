import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import OperatingSystem from '@/components/solutions/brokers/OperatingSystem'
import Workflow from '@/components/solutions/brokers/workflow'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/brokers/Hero'
import StartupFaq from '@/components/solutions/startups/StartupFaq'
import PageWrapper from '@/components/PageWrapper'
import JsonLd from '@/components/common/JsonLd'
import { BROKERS_FAQS } from '@/data/faqs'
import { createPageMetadata } from '@/lib/seo'
import {
  buildFaqPageJsonLd,
  buildMarketingPageJsonLd,
} from '@/lib/jsonLd'

const PATH = '/solutions/brokers'
export const metadata = createPageMetadata(PATH)

const page = () => {
  return (
    <PageWrapper>
      <JsonLd
        data={[
          ...buildMarketingPageJsonLd(PATH),
          buildFaqPageJsonLd(BROKERS_FAQS),
        ]}
      />
      <Hero />
      <OperatingSystem />
      <Workflow />
      <WhyCoverforce paddingTop={true} />
      <Review />
      <CarrierResults />
      <StartupFaq items={BROKERS_FAQS} />
    </PageWrapper>
  )
}

export default page
