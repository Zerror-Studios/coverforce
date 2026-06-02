import React from "react";
import Link from "next/link";
import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md";

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-[#0a143b] hover:opacity-90",
  secondary:
    "border border-white/40 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 font-mono text-xs font-medium tracking-[0.08em]",
  md: "px-6 py-2.5 font-mono text-xs font-medium tracking-[0.08em]",
};

const Button = ({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-semibold uppercase transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default Button;
