"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  /** Replay text/arrow animation on an interval (ms). Also still animates on hover. */
  autoAnimateMs?: number;
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

const ARROW_NUDGE_CLASS =
  "animate-[button-arrow-nudge_0.55s_cubic-bezier(0.76,0,0.24,1)_both]";

const ATTENTION_BOB_CLASS =
  "inline-flex motion-reduce:animate-none animate-[button-attention-bob_0.75s_cubic-bezier(0.34,1.56,0.64,1)_both]";

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
  autoAnimateMs,
  children,
  icon: Icon,
  className = "",
  onClick,
  style,
  ...props
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [bobKey, setBobKey] = useState(0);
  const ButtonIcon = Icon ?? ButtonArrowIcon;
  const sizes = sizeStyles[size];
  const variantClass = variantSurfaceStyles[`${variant}-${surface}`];
  const buttonClasses = `${BUTTON_HEIGHT} ${variantClass} ${sizes.button} ${balanced ? sizes.balanced : ""} ${className}`;
  const buttonStyle: CSSProperties | undefined =
    variant === "primary" && surface === "default"
      ? { background: PRIMARY_BUTTON_GRADIENT, ...style }
      : style;

  const replay = useCallback((withBob = false) => {
    setPlayKey((k) => k + 1);
    if (withBob) setBobKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!autoAnimateMs || autoAnimateMs <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    replay(true);
    const id = window.setInterval(() => replay(true), autoAnimateMs);
    return () => window.clearInterval(id);
  }, [autoAnimateMs, replay]);

  const hoverHandlers = {
    onMouseEnter: () => {
      setHovered(true);
      replay(false);
    },
    onMouseLeave: () => setHovered(false),
  };

  const content = (
    <>
      <span
        key={autoAnimateMs ? playKey : "arrow"}
        className={`shrink-0 motion-reduce:animate-none ${
          autoAnimateMs
            ? playKey > 0
              ? ARROW_NUDGE_CLASS
              : ""
            : "group-hover:animate-[button-arrow-nudge_0.55s_cubic-bezier(0.76,0,0.24,1)_both]"
        }`}
        aria-hidden
      >
        <ButtonIcon className={sizes.icon} />
      </span>
      <ButtonText
        textClip={sizes.textClip}
        textLine={sizes.textLine}
        hovered={hovered}
        playKey={playKey}
      >
        {children}
      </ButtonText>
    </>
  );

  const control = href ? (
    <Link
      href={href}
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
      {...hoverHandlers}
      {...(props as Omit<ComponentProps<typeof Link>, "href" | "className">)}
    >
      {content}
    </Link>
  ) : (
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

  if (!autoAnimateMs) return control;

  return (
    <span
      key={bobKey}
      className={bobKey > 0 ? ATTENTION_BOB_CLASS : "inline-flex"}
    >
      {control}
    </span>
  );
};

export default Button;
