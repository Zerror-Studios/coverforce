import Container from '@/components/common/Container'
import React from 'react'

const Hero = () => {
  return (
    <section className='bg-[#121C49] text-white h-screen'>
        <Container borderColor="#FFFFFF33" >
            <div className='flex flex-col items-center justify-center h-full'>
                <h1 className='text-4xl font-bold'>Brokers</h1>
            </div>
        </Container>
    </section>
  );
};

export default Hero;