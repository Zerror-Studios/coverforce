import Image from "next/image";

export default function StartupRecentActivityCard() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[475px] overflow-visible">
      <Image
        src="/images/threeway/carriers.svg"
        alt="Recent Activity"
        width={420}
        height={420}
        className="h-auto w-full"
      />
    </div>
  );
}