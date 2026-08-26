import WhyCoverforce from '@/components/home/WhyCoverforce'
import Review from '@/components/home/Review'
import React from 'react'
import OperatingSystem from '@/components/solutions/wholesalers/OperatingSystem'
import Workflow from '@/components/solutions/brokers/workflow'
import CarrierResults from '@/components/home/CarrierResults'
import Hero from '@/components/solutions/wholesalers/Hero'
import StartupFaq from '@/components/solutions/startups/StartupFaq'
import PageWrapper from '@/components/PageWrapper'
import JsonLd from '@/components/common/JsonLd'
import { WHOLESALERS_FAQS } from '@/data/faqs'
import { createPageMetadata } from '@/lib/seo'
import {
  buildFaqPageJsonLd,
  buildMarketingPageJsonLd,
} from '@/lib/jsonLd'

const PATH = '/solutions/wholesalers'
export const metadata = createPageMetadata(PATH)

const page = () => {
  return (
    <PageWrapper>
      <JsonLd
        data={[
          ...buildMarketingPageJsonLd(PATH),
          buildFaqPageJsonLd(WHOLESALERS_FAQS),
        ]}
      />
      <Hero />
      <OperatingSystem />
      <Workflow coverforceBackground="wholesaler" />
      <WhyCoverforce paddingTop={true} />
      <Review />
      <CarrierResults />
      <StartupFaq items={WHOLESALERS_FAQS} />
    </PageWrapper>
  )
}

export default page
