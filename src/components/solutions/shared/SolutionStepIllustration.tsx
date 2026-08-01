"use client";

import Image from "next/image";
import type { ComponentType } from "react";

/** Shared max width for Operating System step images (wholesaler / broker / carrier). */
export const SOLUTION_STEP_IMAGE_CLASS =
  "relative mx-auto flex w-full max-w-[920px] items-center justify-center px-1 lg:max-w-[1040px]";

export const SOLUTION_STEP_TRANSFER_TARGET_CLASS =
  "hidden w-full max-w-[920px] min-h-[400px] lg:block lg:max-w-[1040px] lg:min-h-[440px]";

type SolutionStepIllustrationProps = {
  src: string;
  alt: string;
};

function SolutionStepIllustration({ src, alt }: SolutionStepIllustrationProps) {
  return (
    <div className={SOLUTION_STEP_IMAGE_CLASS}>
      <Image
        src={src}
        alt={alt}
        width={1040}
        height={780}
        className="h-auto w-full origin-center object-contain scale-[1.06]"
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
