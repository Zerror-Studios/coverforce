"use client";

import Image from "next/image";
import type { ComponentType } from "react";

/** Shared max width for Operating System step images (wholesaler / broker / carrier). */
export const SOLUTION_STEP_IMAGE_CLASS =
  "relative mx-auto flex w-full max-w-[820px] items-center justify-center px-2 lg:max-w-[880px]";

export const SOLUTION_STEP_TRANSFER_TARGET_CLASS =
  "hidden w-full max-w-[820px] min-h-[360px] lg:block lg:max-w-[880px] lg:min-h-[400px]";

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
        width={880}
        height={660}
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
