"use client";

import NetworkBand from "@/components/wheel/NetworkBand";

/**
 * Wheel lab — network band concept (globe + signal flow).
 * Partner cards use CoverForce logo tiles; rest from the design prototype.
 */
export default function WheelSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#151f4d] text-white">
      <NetworkBand />
    </section>
  );
}
