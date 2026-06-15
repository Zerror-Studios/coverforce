import React from "react";
import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md";

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

const HOVER_EASE = "duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]";

const variantStyles: Record<
  ButtonVariant,
  { root: string; label: string; iconWrap: string; iconIncoming: string; iconOutgoing: string }
> = {
  primary: {
    root: `border border-white transition-colors ${HOVER_EASE} group-hover:border-white`,
    label: `bg-white text-black transition-colors ${HOVER_EASE} group-hover:bg-[#121C49] group-hover:text-white`,
    iconWrap: `border-l border-white transition-colors ${HOVER_EASE} group-hover:border-white`,
    iconIncoming: `bg-transparent text-transparent transition-colors ${HOVER_EASE} group-hover:bg-[#3834A4] group-hover:text-white`,
    iconOutgoing: "bg-white text-black",
  },
  secondary: {
    root: `border border-white transition-colors ${HOVER_EASE} group-hover:border-white`,
    label: `bg-transparent text-white transition-colors ${HOVER_EASE} group-hover:bg-[#3834A4] group-hover:text-white`,
    iconWrap: `border-l border-white transition-colors ${HOVER_EASE} group-hover:border-white`,
    iconIncoming: `bg-transparent text-transparent transition-colors ${HOVER_EASE} group-hover:bg-white group-hover:text-[#121C49]`,
    iconOutgoing: "bg-transparent text-white",
  },
  outline: {
    root: "border border-[#121C49]",
    label: `bg-transparent text-black transition-colors ${HOVER_EASE} group-hover:bg-[#121C49] group-hover:text-white`,
    iconWrap: "border-l border-[#121C49]",
    iconIncoming: `bg-transparent text-transparent transition-colors ${HOVER_EASE} group-hover:bg-white group-hover:text-[#121C49]`,
    iconOutgoing: "bg-[#3834A4] text-white",
  },
};

const sizeStyles: Record<
  ButtonSize,
  {
    label: string;
    icon: string;
    arrow: string;
    textClip: string;
    textLine: string;
    textShift: string;
    iconShift: string;
  }
> = {
  sm: {
    label: "h-9 px-5 font-heading text-xs font-semibold tracking-[0.06em]",
    icon: "size-9",
    arrow: "size-4",
    textClip: "h-4",
    textLine: "h-4 leading-4",
    textShift: "-translate-y-4 group-hover:translate-y-0",
    iconShift: "-translate-x-9 group-hover:translate-x-0",
  },
  md: {
    label: "h-11 px-6 font-heading text-sm font-semibold tracking-[0.04em]",
    icon: "size-11",
    arrow: "size-[18px]",
    textClip: "h-5",
    textLine: "h-5 leading-5",
    textShift: "-translate-y-5 group-hover:translate-y-0",
    iconShift: "-translate-x-11 group-hover:translate-x-0",
  },
};

const Button = ({
  href,
  variant = "primary",
  size = "sm",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];

  return (
    <Link
      href={href}
      className={`group inline-flex w-fit items-stretch overflow-hidden leading-none ${styles.root} ${className}`}
      {...props}
    >
      <span className={`flex items-center ${styles.label} ${sizes.label}`}>
        <span className={`block overflow-hidden ${sizes.textClip}`}>
          <span
            className={`block transition-transform will-change-transform motion-reduce:transition-none ${HOVER_EASE} ${sizes.textShift}`}
          >
            <span className={`block whitespace-nowrap ${sizes.textLine}`}>{children}</span>
            <span className={`block whitespace-nowrap ${sizes.textLine}`}>{children}</span>
          </span>
        </span>
      </span>
      <span
        className={`relative shrink-0 overflow-hidden ${sizes.icon} ${styles.iconWrap}`}
        aria-hidden
      >
        <span
          className={`flex h-full backface-hidden transition-transform will-change-transform motion-reduce:transition-none ${HOVER_EASE} ${sizes.iconShift}`}
        >
          <span
            className={`flex shrink-0 items-center justify-center ${sizes.icon} ${styles.iconIncoming}`}
          >
            <RiArrowRightLine className={sizes.arrow} />
          </span>
          <span
            className={`flex shrink-0 items-center justify-center ${sizes.icon} ${styles.iconOutgoing}`}
          >
            <RiArrowRightLine className={sizes.arrow} />
          </span>
        </span>
      </span>
    </Link>
  );
};

export default Button;
