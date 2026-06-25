"use client";

export default function BrokersCardEarth() {
  return (
    <div className="relative h-full w-full"
    >
      <video
        className="h-full w-full object-cover"
        src="/videos/globee.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
    </div>
  );
}
