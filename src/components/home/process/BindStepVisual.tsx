import Image from "next/image";
import ThankyouIllustration from "@/components/home/ThankyouIllustration";

export default function BindStepVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <Image
        src="/images/process/pop.svg"
        alt=""
        fill
        className="object-cover object-center"
        aria-hidden
      />
      <ThankyouIllustration className="relative z-10 h-full w-full" />
    </div>
  );
}
