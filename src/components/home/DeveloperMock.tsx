import Image from "next/image";

type DeveloperMockProps = {
  /** Modal preview is smaller and right-aligned; card uses absolute right layout. */
  align?: "card" | "modal";
};

export default function DeveloperMock({ align = "card" }: DeveloperMockProps) {
  const isModal = align === "modal";

  return (
    <div
      className={
        isModal
          ? "absolute top-1/2 right-0 z-10 w-[min(72%,420px)] -translate-y-1/2 sm:w-[480px] md:w-[520px]"
          : "relative z-10 mx-auto w-full max-md:max-w-none md:absolute md:top-1/2 md:right-0 md:mx-0 md:max-w-[600px] md:-translate-y-1/2"
      }
    >
      <Image
        src="/images/threeway/developers.svg"
        alt="Developers"
        width={520}
        height={520}
        className={isModal ? "h-auto w-full" : "mx-auto h-auto w-full"}
      />
    </div>
  );
}
