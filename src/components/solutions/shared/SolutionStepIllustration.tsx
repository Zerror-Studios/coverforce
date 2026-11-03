"use client";

import Image from "next/image";
import type { ComponentType } from "react";

/** Shared max width for Operating System step images (wholesaler / broker / carrier). */
export const SOLUTION_STEP_IMAGE_CLASS =
  "relative mx-auto flex w-full max-w-[920px] items-center justify-center px-1 lg:max-w-[1040px]";

export const SOLUTION_STEP_TRANSFER_TARGET_CLASS =
  "hidden w-full max-w-[920px] min-h-[400px] lg:block lg:max-w-[1040px] lg:min-h-[440px]";

/** Optional overrides for images that aren't the default wide card shape. */
type SolutionStepImageOptions = {
  width?: number;
  height?: number;
  /** Replaces the default image sizing classes (e.g. for a portrait phone mock). */
  imageClassName?: string;
};

type SolutionStepIllustrationProps = {
  src: string;
  alt: string;
} & SolutionStepImageOptions;

const DEFAULT_IMAGE_CLASS =
  "h-auto w-full origin-center object-contain scale-100 sm:scale-[1.06]";

function SolutionStepIllustration({
  src,
  alt,
  width = 1040,
  height = 780,
  imageClassName = DEFAULT_IMAGE_CLASS,
}: SolutionStepIllustrationProps) {
  return (
    <div className={`${SOLUTION_STEP_IMAGE_CLASS} overflow-x-clip`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imageClassName}
        draggable={false}
      />
    </div>
  );
}

export function createSolutionStepMock(
  src: string,
  alt: string,
  options?: SolutionStepImageOptions,
): ComponentType {
  return function SolutionStepMock() {
    return <SolutionStepIllustration src={src} alt={alt} {...options} />;
  };
}
