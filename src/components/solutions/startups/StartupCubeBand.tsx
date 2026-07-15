"use client";

import type { ReactNode } from "react";
import WhosForCubeBg from "@/components/solutions/startups/WhosForCubeBg";

/**
 * Shared sticky cube across WhosFor + ProgramOverview.
 * Cube stays viewport-centered for the full band height.
 */
export default function StartupCubeBand({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-[#121C49] text-white">
      <div className="pointer-events-none relative sticky top-0 z-0 hidden h-svh w-full md:block">
        <WhosForCubeBg />
      </div>
      <div className="relative z-10 md:-mt-[100svh]">{children}</div>
    </div>
  );
}
