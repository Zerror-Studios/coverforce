"use client";

import { forwardRef } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import type { ComponentProps } from "react";

const HOVER_EASE = "duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]";

type ArrowNavTone = "light" | "dark";

type ArrowNavButtonProps = {
  direction: "prev" | "next";
  tone: ArrowNavTone;
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

const navStyles: Record<
  ArrowNavTone,
  Record<
    "prev" | "next",
    { root: string; incoming: string; outgoing: string; iconShift: string }
  >
> = {
  light: {
    prev: {
      root: "border border-black",
      incoming: "bg-[#121C49] text-white",
      outgoing: "bg-transparent text-black",
      iconShift:
        "translate-x-px group-hover:-translate-x-[calc(2.25rem-2px)]",
    },
    next: {
      root: "border border-black",
      incoming: "bg-white text-[#121C49]",
      outgoing: "bg-[#121C49] text-white",
      iconShift: "-translate-x-1/2 group-hover:translate-x-0",
    },
  },
  dark: {
    prev: {
      root: "border border-white",
      incoming: "bg-white text-[#121C49]",
      outgoing: "bg-transparent text-white",
      iconShift:
        "translate-x-px group-hover:-translate-x-[calc(2.25rem-2px)]",
    },
    next: {
      root: "",
      incoming: "bg-[#121C49] text-white",
      outgoing: "bg-white text-[#0a143b]",
      iconShift: "-translate-x-1/2 group-hover:translate-x-0",
    },
  },
};

const ArrowNavButton = forwardRef<HTMLButtonElement, ArrowNavButtonProps>(
  function ArrowNavButton(
    { direction, tone, className = "", type = "button", ...props },
    ref,
  ) {
    const styles = navStyles[tone][direction];
    const Icon = direction === "prev" ? RiArrowLeftLine : RiArrowRightLine;

    return (
      <button
        ref={ref}
        type={type}
        className={`group relative size-9 shrink-0 leading-none ${styles.root} ${className}`}
        {...props}
      >
        <span className="absolute inset-0 overflow-hidden">
          <span
            className={`flex h-full w-[200%] backface-hidden transition-transform will-change-transform motion-reduce:transition-none ${HOVER_EASE} ${styles.iconShift}`}
          >
          {direction === "prev" ? (
            <>
              <span
                className={`flex h-full w-1/2 shrink-0 items-center justify-center ${styles.outgoing}`}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span
                className={`flex h-full w-1/2 shrink-0 items-center justify-center ${styles.incoming}`}
              >
                <Icon className="size-4" aria-hidden />
              </span>
            </>
          ) : (
            <>
              <span
                className={`flex h-full w-1/2 shrink-0 items-center justify-center ${styles.incoming}`}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span
                className={`flex h-full w-1/2 shrink-0 items-center justify-center ${styles.outgoing}`}
              >
                <Icon className="size-4" aria-hidden />
              </span>
            </>
          )}
          </span>
        </span>
      </button>
    );
  },
);

export default ArrowNavButton;
