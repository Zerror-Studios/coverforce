import React from "react";

type SectionRadialGlowProps = {
  className?: string;
};

const   SectionRadialGlow = ({ className = "" }: SectionRadialGlowProps) => {
  return (
    <div
      className={`pointer-events-none aspect-square w-[100vw] rounded-full blur-[5rem] opacity-85 ${className}`}
      style={{
        background:
          "radial-gradient(circle, #4541CD 0%, #352D93 55%, rgba(53, 45, 147, 0) 72%)",
      }}
      aria-hidden
    />
  );
};

export default SectionRadialGlow;
