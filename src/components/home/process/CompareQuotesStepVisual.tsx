"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function CompareQuotesStepVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const phone = phoneRef.current;
      const card = cardRef.current;
      const floatEl = floatRef.current;
      if (!phone || !card || !floatEl) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set(phone, { yPercent: 0 });
        gsap.set(card, { scale: 1, opacity: 1 });
        return;
      }

      gsap.set(phone, { yPercent: 100 });
      gsap.set(card, { scale: 0, opacity: 0 });
      gsap.set(floatEl, { y: 0 });

      const floatTween = gsap.to(floatEl, {
        y: -12,
        duration: 1.05,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });

      tl.to(phone, { yPercent: 0, duration: 0.95, ease: "power3.out" })
        .to(
          card,
          { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" },
          "-=0.15",
        )
        .add(() => {
          floatTween.restart(true);
        })
        .to({}, { duration: 2.8 })
        .add(() => {
          floatTween.pause(0);
          gsap.set(floatEl, { y: 0 });
        })
        .to(card, { scale: 0, opacity: 0, duration: 0.45, ease: "power2.in" })
        .to(phone, { yPercent: 100, duration: 0.8, ease: "power2.in" }, "-=0.1")
        .to({}, { duration: 0.45 });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div ref={phoneRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/process/phonemock.png"
          alt=""
          fill
          className="object-contain object-right"
          aria-hidden
        />
      </div>
      <div className="relative z-10 w-[70%] max-w-[360px] -translate-x-12 -translate-y-11">
        <div
          ref={cardRef}
          className="will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          <div ref={floatRef} className="will-change-transform">
            <Image
              src="/images/process/bind.png"
              alt=""
              width={720}
              height={540}
              className="pointer-events-none h-auto w-full object-contain"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
