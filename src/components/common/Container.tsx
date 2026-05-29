import React, { type ReactNode } from "react";
import { containerPadding } from "./containerStyles";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div
      className={`relative z-10 mx-auto w-full max-w-7xl ${containerPadding} ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
