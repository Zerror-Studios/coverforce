"use client";

import LazyVideo from "@/components/common/LazyVideo";

export default function BrokersCardEarth() {
  return (
    <div className="relative h-full w-full"
    >
      <LazyVideo
        className="h-full w-full object-cover"
        src="/videos/globee.mp4"
        aria-hidden
      />
    </div>
  );
}
