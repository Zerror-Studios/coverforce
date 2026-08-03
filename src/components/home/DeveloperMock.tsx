import Image from "next/image";

export default function DeveloperMock() {
  return (
    <div className="relative z-10 mx-auto w-full max-md:max-w-none md:absolute md:top-1/2 md:-translate-y-1/2 md:right-0 md:mx-0 md:max-w-[600px]">
      <Image
        src="/images/threeway/developers.svg"
        alt="Developers"
        width={420}
        height={420}
        className="h-auto w-full"
      />
    </div>
  );
}