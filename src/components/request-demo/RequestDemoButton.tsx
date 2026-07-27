"use client";

import type { MouseEventHandler, ReactNode } from "react";
import Button, { type ButtonStyleProps } from "@/components/common/Button";

type RequestDemoButtonProps = ButtonStyleProps & {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  href?: string;
};

const RequestDemoButton = ({
  children,
  onClick,
  href = "/contact",
  ...props
}: RequestDemoButtonProps) => {
  return (
    <Button href={href} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default RequestDemoButton;
