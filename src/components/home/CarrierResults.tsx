"use client";
import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import Threads from "@/components/Threads";

type CarrierResult = {
  id: string;
  logo: string;
  logoAlt: string;
  title: string;
  description: string;
};

const carrierResults: CarrierResult[] = [
  {
    id: "employers",
    logo: "/images/Employers.svg",
    logoAlt: "Employers",
    title: "0% Error Rate",
    description:
      "Only integration partner to achieve 0% API error rate on submission data.",
  },
  {
    id: "nationwide",
    logo: "/images/Nationwide.svg",
    logoAlt: "Nationwide",
    title: "Live in 12 Weeks",
    description:
      "BOP integration: under 12 weeks, less than 10 hours carrier eng time.",
  },
  {
    id: "chubb",
    logo: "/images/chubb.svg",
    logoAlt: "Chubb",
    title: "Trust & Quality",
    description:
      "Submission quality → first wholesale partner appointed in 2+ years.",
  },
  {
    id: "liberty",
    logo: "/images/liverty.svg",
    logoAlt: "Liberty Mutual",
    title: "5-Point Bind Advantage",
    description:
      "Only integration partner to achieve 0% API error rate on submission data.",
  },
];

function CarrierLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-8 w-[112px] max-w-full md:h-9 md:w-[128px]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-left"
        sizes="(max-width: 768px) 112px, 128px"
      />
    </div>
  );
}



function CarrierCard({ result }: { result: CarrierResult }) {
  return (
    <article className="flex flex-col gap-10 lg:gap-12 lg:px-8 xl:px-10 first:lg:pl-0 last:lg:pr-0">
      <div className="min-h-[2.25rem]">
        <CarrierLogo src={result.logo} alt={result.logoAlt} />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-heading font-regular text-white md:text-xl tracking-tight">
          {result.title}
        </h3>
        <p className="max-w-[240px] text-sm font-sans font-regular text-[#D1D1D1]text-sm leading-relaxed text-white/55">
          {result.description}
        </p>
      </div>
    </article>
  );
}

const CarrierResults = () => {
  return (
    <section className="bg-[#121C49] text-white">
      <Container borderColor="#FFFFFF1A" className="border-t border-b border-[#FFFFFF1A]">
        <div
          className="absolute left-0 -top-20 z-0  w-full lg:h-full opacity-75"
          aria-hidden
        >
          <video
            src="/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
          {/* <Threads
            color={[0.004, 0.188, 0.745]}
            amplitude={2.5}
            distance={0}
            enableMouseInteraction={true}
          /> */}
        </div>
        <div className="relative py-16 md:py-20 lg:py-24 pointer-events-none">
          {/* Wave — 130% width, anchored left top inside container */}


          <div className="relative z-10 flex flex-col gap-62">
            {/* Header */}
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-12">
              <div className="flex flex-col justify-end space-y-5">
                <h2 className="max-w-md text-3xl font-heading font-regular leading-tight tracking-tight md:text-4xl lg:text-3xl lg:leading-[1.15]">
                  Carrier results that speak for themselves
                </h2>
                <Button href="/" variant="primary">
                  Explore Carrier
                </Button>
              </div>

              <div className="flex max-w-md flex-col items-start justify-end gap-6 text-left lg:ml-auto">
                <p className="font-sans font-regular text-sm leading-[1.4] md:text-[1.125rem] text-[#D1D1D1]">
                  Named outcomes provide clear, organized quote comparisons from
                  appointed carriers, helping agents from production carrier
                  partnerships.
                </p>
              
              </div>
            </div>


            {/* Carrier columns */}
            <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {carrierResults.map((result) => (
                <CarrierCard key={result.id} result={result} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CarrierResults;
