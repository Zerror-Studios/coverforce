"use client";

import Image from "next/image";
import type { ComponentType } from "react";

type SolutionStepIllustrationProps = {
  src: string;
  alt: string;
};

function SolutionStepIllustration({ src, alt }: SolutionStepIllustrationProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[680px] scale-150 items-center justify-center px-2 lg:max-w-[720px]">
      <Image
        src={src}
        alt={alt}
        width={720}
        height={540}
        className="h-auto w-full object-contain"
        draggable={false}
      />
    </div>
  );
}

export function createSolutionStepMock(src: string, alt: string): ComponentType {
  return function SolutionStepMock() {
    return <SolutionStepIllustration src={src} alt={alt} />;
  };
}
