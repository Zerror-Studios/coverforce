import React, { forwardRef, type ReactNode } from "react";
import {
  containerPadding,
  DEFAULT_BORDER_COLOR,
  getBottomBorderStyle,
  getLeftBorderStyle,
  getRightBorderStyle,
} from "./containerStyles";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Dotted side borders (hex e.g. #e5e7eb). Omit to hide; uses DEFAULT_BORDER_COLOR if empty. */
  borderColor?: string;
  /** Dotted bottom border using the same color as the sides. */
  borderBottom?: boolean;
  /** Fades dotted side borders without affecting children. */
  borderOpacity?: number;
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  {
    children,
    className = "",
    borderColor,
    borderBottom = false,
    borderOpacity = 1,
  },
  ref,
) {
  const resolvedColor = borderColor ?? DEFAULT_BORDER_COLOR;

  return (
    <div
      ref={ref}
      className={`relative z-10 mx-auto w-full max-w-7xl ${containerPadding} ${className}`}
    >
      {borderColor !== undefined ? (
        <>
          <span
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 hidden w-0 md:block"
            style={getLeftBorderStyle(resolvedColor, borderOpacity)}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 hidden w-0 md:block"
            style={getRightBorderStyle(resolvedColor, borderOpacity)}
            aria-hidden
          />
        </>
      ) : null}
      {borderBottom && borderColor !== undefined ? (
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 block h-0"
          style={getBottomBorderStyle(resolvedColor)}
          aria-hidden
        />
      ) : null}
      {children}
    </div>
  );
});

export default Container;
