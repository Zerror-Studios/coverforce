"use client";

import { useState } from "react";
import ButtonText from "./ButtonText";

type AnimatedLinkTextProps = {
  children: string;
  textClip?: string;
  textLine?: string;
  hovered?: boolean;
  className?: string;
};

export default function AnimatedLinkText({
  children,
  textClip = "h-4",
  textLine = "h-4 leading-4",
  hovered: hoveredProp,
  className = "",
}: AnimatedLinkTextProps) {
  const [hoveredLocal, setHoveredLocal] = useState(false);
  const hovered = hoveredProp ?? hoveredLocal;
  const managesHover = hoveredProp === undefined;

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={managesHover ? () => setHoveredLocal(true) : undefined}
      onMouseLeave={managesHover ? () => setHoveredLocal(false) : undefined}
    >
      <ButtonText textClip={textClip} textLine={textLine} hovered={hovered}>
        {children}
      </ButtonText>
    </span>
  );
}
