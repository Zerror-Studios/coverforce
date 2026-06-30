import React from 'react'
import Explore from '@/components/home/Explore'
import PageWrapper from '@/components/PageWrapper'
import Hero from '@/components/integration/Hero'
import CardSection from '@/components/integration/CardSection'
import Integration from '@/components/integration/Integration'

const IntegrationPage = () => {
  return (
    <PageWrapper>
        <Hero/>
        <CardSection/>
        <Integration/>
        <Explore/>
    </PageWrapper>
  )
}

export default IntegrationPage