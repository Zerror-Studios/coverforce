"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { ComponentProps, CSSProperties } from "react";
import ButtonArrowIcon from "./ButtonArrowIcon";
import ButtonText from "./ButtonText";
import { PRIMARY_BUTTON_GRADIENT } from "@/data/wayCardStyles";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md";
export type ButtonSurface = "default" | "on-dark";

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  surface?: ButtonSurface;
  balanced?: boolean;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

export type ButtonStyleProps = Omit<BaseButtonProps, "children" | "onClick"> & {
  style?: React.CSSProperties;
};

export type ButtonAsLinkProps = BaseButtonProps &
  Omit<ComponentProps<typeof Link>, "href" | "className" | "children" | "onClick"> & {
    href: string;
  };

export type ButtonAsButtonProps = BaseButtonProps &
  Omit<ComponentProps<"button">, "className" | "children" | "onClick"> & {
    href?: never;
  };

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

const BUTTON_HEIGHT =
  "group box-border inline-flex h-10 min-h-10 max-h-10 w-fit shrink-0 items-center rounded-[5px] font-heading tracking-[0.02em]";

const variantSurfaceStyles: Record<`${ButtonVariant}-${ButtonSurface}`, string> = {
  "primary-default": "border border-transparent text-white",
  "secondary-default":
    "border border-[#121C49] bg-transparent text-[#121C49] transition-colors hover:bg-[#121C49]/[0.06]",
  "outline-default":
    "border border-[#535353]/40 bg-transparent text-[#2E2E2E] transition-colors hover:bg-[#2E2E2E]/[0.04]",

  "primary-on-dark": "border border-transparent bg-white text-[#2E2E2E]",
  "secondary-on-dark":
    "border border-white/40 bg-transparent text-white transition-colors hover:border-white/60 hover:bg-white/[0.08]",
  "outline-on-dark":
    "border border-white/40 bg-transparent text-white transition-colors hover:border-white/60 hover:bg-white/[0.08]",
};

const sizeStyles: Record<
  ButtonSize,
  {
    button: string;
    balanced: string;
    icon: string;
    textClip: string;
    textLine: string;
  }
> = {
  sm: {
    button: "gap-2.5 px-5 text-xs font-medium leading-none",
    balanced: "min-w-[148px] justify-center",
    icon: "h-[6px] w-[9px]",
    textClip: "h-4",
    textLine: "h-4 leading-4",
  },
  md: {
    button: "gap-3 px-6 text-sm font-medium leading-none",
    balanced: "min-w-[168px] justify-center",
    icon: "h-2 w-3",
    textClip: "h-5",
    textLine: "h-5 leading-5",
  },
};

const Button = ({
  href,
  variant = "primary",
  size = "sm",
  surface = "default",
  balanced = false,
  children,
  icon: Icon,
  className = "",
  onClick,
  style,
  ...props
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const ButtonIcon = Icon ?? ButtonArrowIcon;
  const sizes = sizeStyles[size];
  const variantClass = variantSurfaceStyles[`${variant}-${surface}`];
  const buttonClasses = `${BUTTON_HEIGHT} ${variantClass} ${sizes.button} ${balanced ? sizes.balanced : ""} ${className}`;
  const buttonStyle: CSSProperties | undefined =
    variant === "primary" && surface === "default"
      ? { background: PRIMARY_BUTTON_GRADIENT, ...style }
      : style;

  const hoverHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const content = (
    <>
      <span
        className="shrink-0 motion-reduce:animate-none group-hover:animate-[button-arrow-nudge_0.55s_cubic-bezier(0.76,0,0.24,1)_both]"
        aria-hidden
      >
        <ButtonIcon className={sizes.icon} />
      </span>
      <ButtonText
        textClip={sizes.textClip}
        textLine={sizes.textLine}
        hovered={hovered}
      >
        {children}
      </ButtonText>
    </>
  );

  if (href) {
    const linkProps = props as Omit<ComponentProps<typeof Link>, "href" | "className">;

    return (
      <Link
        href={href}
        className={buttonClasses}
        style={buttonStyle}
        onClick={onClick}
        {...hoverHandlers}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
      {...hoverHandlers}
      {...(props as ComponentProps<"button">)}
    >
      {content}
    </button>
  );
};

export default Button;
