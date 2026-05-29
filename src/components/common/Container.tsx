import React, { type ReactNode } from "react";
import {
  containerPadding,
  DEFAULT_BORDER_COLOR,
  getSideBorderStyle,
} from "./containerStyles";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Dotted side borders (hex e.g. #e5e7eb). Omit to hide; uses DEFAULT_BORDER_COLOR if empty. */
  borderColor?: string;
};

const Container = ({
  children,
  className = "",
  borderColor,
}: ContainerProps) => {
  const resolvedColor = borderColor ?? DEFAULT_BORDER_COLOR;

  return (
    <div
      className={`relative z-10 mx-auto w-full max-w-7xl ${containerPadding} ${className}`}
      style={
        borderColor !== undefined ? getSideBorderStyle(resolvedColor) : undefined
      }
    >
      {children}
    </div>
  );
};

export default Container;
