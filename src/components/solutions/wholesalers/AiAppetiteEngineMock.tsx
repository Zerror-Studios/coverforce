"use client";

import Image from "next/image";

export default function AiAppetiteEngineMock() {
  return (
    <div className="relative mx-auto w-full max-w-[400px] overflow-visible sm:max-w-[440px]">
      <Image
        src="/images/threeway/startups.svg"
        alt="AI Appetite Engine"
        width={420}
        height={420}
        className="h-auto w-full"
        priority
      />
    </div>
  );
}