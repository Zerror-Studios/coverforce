"use client";

import Image from "next/image";
import { useRef } from "react";
import { RiLinkedinFill } from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

const LEADER_CARD_BG =
  "linear-gradient(0deg, #5f37e9cc 31.26%, #230098cc 56.47%)";

const FOUNDER_CARD_HEIGHT = "h-[32rem] xl:h-[38rem]";
const ADVISORY_CARD_HEIGHT = "h-[28rem] xl:h-[33rem]";

type Leader = {
  id: string;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
};

const foundersRow: Leader[] = [
  {
    id: "behram-dinshaw",
    name: "Behram Dinshaw",
    role: "Chairman & Co-Founder",
    image: "/images/about/behram.png",
    linkedin: "https://www.linkedin.com/in/behram-m-dinshaw-77760b6/",
  },
  {
    id: "cyrus-karai",
    name: "Cyrus Karai",
    role: "CEO & Co-Founder",
    image: "/images/about/cyrus.png",
    linkedin: "https://www.linkedin.com/in/cyrus-karai/",
  },
  {
    id: "kaivan-wadia",
    name: "Kaivan Wadia",
    role: "CTO & Co-Founder",
    image: "/images/about/kaivan.png",
    linkedin: "https://www.linkedin.com/in/kaivanwadia/",
  },
];

const advisoryRow: Leader[] = [
  {
    id: "bill-bloom",
    name: "Bill Bloom",
    role: "Advisory Board",
    image: "/images/about/bill.png",
    linkedin: "https://www.linkedin.com/in/bill-bloom-ab141aa/",
  },
  {
    id: "patrick-kinney",
    name: "Patrick Kinney",
    role: "Advisory Board",
    image: "/images/about/patrick.png",
    linkedin: "https://www.linkedin.com/in/p-kinney/",
  },
  {
    id: "tj-ryan",
    name: "TJ Ryan",
    role: "Advisory Board",
    image: "/images/about/tj.png",
  },
  {
    id: "brad-brown",
    name: "Brad Brown",
    role: "Advisory Board",
    image: "/images/about/brad.png",
    linkedin: "https://www.linkedin.com/in/bradfordtbrown/",
  },
];

const mobileLeaders = [...foundersRow, ...advisoryRow];

const founderStagger = ["lg:mt-14 xl:mt-16", "lg:mt-0", "lg:mt-14 xl:mt-16"];
const advisoryStagger = [
  "lg:mt-16 xl:mt-20",
  "lg:mt-6 xl:mt-8",
  "lg:mt-0",
  "lg:mt-16 xl:mt-20",
];

const LEADER_PARALLAX_TRAVEL = [
  // Founders (top 3) — stronger / distinct speeds
  { start: -72, end: 88 },
  { start: 56, end: -96 },
  { start: -88, end: 72 },
  // Advisory (bottom 4)
  { start: 64, end: -56 },
  { start: 28, end: -80 },
  { start: -40, end: 68 },
  { start: 52, end: -60 },
] as const;

function toLines(value: string) {
  return value.split(" ").map((part, index) => (
    <span key={`${part}-${index}`} className="block">
      {part}
    </span>
  ));
}

function formatRole(role: string) {
  return role.replace(/ & /g, " ").toUpperCase();
}

function LeaderCard({
  leader,
  height = FOUNDER_CARD_HEIGHT,
}: {
  leader: Leader;
  height?: string;
}) {
  return (
    <article className="leader-member">
      <div
        className={`relative ${height} flex w-full flex-col overflow-hidden rounded-full text-center text-white`}
        style={{ backgroundImage: LEADER_CARD_BG }}
      >
        <div className="shrink-0 px-4 pb-2 pt-7 md:px-5 md:pt-8">
          <p className="font-heading text-[0.6875rem] font-semibold uppercase leading-[1.45] tracking-[0.08em] text-white/90 md:text-[0.75rem]">
            {toLines(formatRole(leader.role))}
          </p>
          <h3 className="mt-4 font-heading text-[1.375rem] font-medium leading-[1.15] tracking-tight text-white sm:text-[1.5rem] lg:text-[1.625rem] xl:text-[1.75rem] md:mt-5">
            {toLines(leader.name)}
          </h3>
        </div>

        <div className="relative mt-auto min-h-0 w-full flex-1">
          <Image
            src={leader.image}
            alt={leader.name}
            width={248}
            height={366}
            className="absolute inset-x-0 bottom-0 h-auto w-full"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          {leader.linkedin ? (
            <a
              href={leader.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${leader.name} on LinkedIn`}
              className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white transition-opacity hover:opacity-80"
            >
              <RiLinkedinFill className="size-5" aria-hidden />
            </a>
          ) : (
            <span
              className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white"
              aria-hidden
            >
              <RiLinkedinFill className="size-5" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

const Leaderships = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadersGridRef = useRef<HTMLDivElement>(null);

  useSectionHeaderReveal({
    scopeRef: sectionRef,
    headerRef,
    headingRef,
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const grid = leadersGridRef.current;
      if (!section || !grid) return;

      const members = gsap.utils.toArray<HTMLElement>(".leader-member", grid);
      if (!members.length) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(members, { opacity: 1 });
        gsap.set(".leader-parallax-card", { y: 0, clearProps: "transform" });
        return;
      }

      gsap.set(members, { opacity: 0 });

      members.forEach((member) => {
        gsap.to(member, {
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: member,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      const parallaxCards = gsap.utils.toArray<HTMLElement>(
        ".leader-parallax-card",
        grid,
      );
      const parallaxCleanups: Array<() => void> = [];
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;

      if (!reducedMotion && !isMobile) {
        parallaxCards.forEach((card, index) => {
          const travel =
            LEADER_PARALLAX_TRAVEL[index] ?? LEADER_PARALLAX_TRAVEL[0];

          gsap.set(card, { y: travel.start, force3D: true });

          const tween = gsap.to(card, {
            y: travel.end,
            ease: "none",
            force3D: true,
            overwrite: "auto",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          parallaxCleanups.push(() => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
        });
      }

      const lenis = window.lenis;
      let scrollPending = false;
      const onLenisScroll = () => {
        if (scrollPending) return;
        scrollPending = true;
        requestAnimationFrame(() => {
          ScrollTrigger.update();
          scrollPending = false;
        });
      };
      lenis?.on("scroll", onLenisScroll);

      ScrollTrigger.refresh();

      return () => {
        lenis?.off("scroll", onLenisScroll);
        parallaxCleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom>
        <div className="py-20 md:py-24 lg:py-28">
          <div
            ref={headerRef}
            className="flex max-w-xl flex-col items-start justify-end space-y-5"
          >
            <EyebrowPill surface="light" className="mb-0">
              Leaderships
            </EyebrowPill>

            <h2
              ref={headingRef}
              className="max-w-md text-2xl font-heading font-medium leading-[1.15] tracking-tight text-[#9AA8BC] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]"
            >
              <span data-split>A blend of insurance and</span>
              <br />
              <span data-split>engineering expertise</span>
            </h2>
          </div>

          <div ref={leadersGridRef} className="mt-12 lg:mt-16">
            <div className="hidden flex-col gap-8 lg:flex xl:gap-10">
              <div className="mx-auto grid w-full max-w-4xl grid-cols-3 gap-10 xl:max-w-5xl xl:gap-14">
                {foundersRow.map((leader, index) => (
                  <div
                    key={leader.id}
                    className={`leader-parallax-card ${founderStagger[index]}`}
                  >
                    <LeaderCard leader={leader} />
                  </div>
                ))}
              </div>

              <div className="mx-auto grid w-full max-w-5xl grid-cols-4 gap-6 xl:max-w-6xl xl:gap-8">
                {advisoryRow.map((leader, index) => (
                  <div
                    key={leader.id}
                    className={`leader-parallax-card ${advisoryStagger[index]}`}
                  >
                    <LeaderCard leader={leader} height={ADVISORY_CARD_HEIGHT} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:hidden">
              {mobileLeaders.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Leaderships;
