"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { RiLinkedinFill } from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import SectionRadialGlow from "@/components/common/SectionRadialGlow";
import { useSectionHeaderReveal } from "@/hooks/useSectionHeaderReveal";

gsap.registerPlugin(ScrollTrigger);

const LEADER_CARD_BG = "#151f4d";

type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageClassName?: string;
  linkedin?: string;
};

const foundersRow: Leader[] = [
  {
    id: "behram-dinshaw",
    name: "Behram Dinshaw",
    role: "Chairman & Co-Founder",
    bio: "Former Travelers executive with 25+ years in insurance leadership.",
    image: "/images/about/behram.png",
    linkedin: "https://www.linkedin.com/in/behram-m-dinshaw-77760b6/",
  },
  {
    id: "cyrus-karai",
    name: "Cyrus Karai",
    role: "CEO & Co-Founder",
    bio: "Former Credit Suisse and PwC leader with a Wharton MBA.",
    image: "/images/about/cyrus.png",
    linkedin: "https://www.linkedin.com/in/cyrus-karai/",
  },
  {
    id: "kaivan-wadia",
    name: "Kaivan Wadia",
    role: "CTO & Co-Founder",
    bio: "Former Amazon engineering leader experienced in scaling platforms.",
    image: "/images/about/kaivan.png",
    linkedin: "https://www.linkedin.com/in/kaivanwadia/",
  },
];

const advisoryRow: Leader[] = [
  {
    id: "bill-bloom",
    name: "Bill Bloom",
    role: "Advisory Board",
    bio: "Former technology executive at The Hartford and Travelers.",
    image: "/images/about/bill.webp",
    linkedin: "https://www.linkedin.com/in/bill-bloom-ab141aa/",
  },
  {
    id: "patrick-kinney",
    name: "Patrick Kinney",
    role: "Advisory Board",
    bio: "Former Travelers executive and Keystone CEO.",
    image: "/images/about/patrick.webp",
    linkedin: "https://www.linkedin.com/in/p-kinney/",
  },
  {
    id: "tj-ryan",
    name: "TJ Ryan",
    role: "Advisory Board",
    bio: "Insurance advisor modernizing commercial distribution.",
    image: "/images/about/tj.webp",
    imageClassName: "scale-[1.3] origin-bottom object-bottom",
  },
  {
    id: "brad-brown",
    name: "Brad Brown",
    role: "Advisory Board",
    bio: "McKinsey Senior Partner Emeritus and former FinTech leader.",
    image: "/images/about/brad.webp",
    linkedin: "https://www.linkedin.com/in/bradfordtbrown/",
  },
];

const leaders = [
  ...foundersRow,
  ...advisoryRow.filter((leader) => leader.id !== "tj-ryan"),
  advisoryRow.find((leader) => leader.id === "tj-ryan")!,
];

function chunkMembers<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <article className="leader-member h-full">
      <div
        className="leader-image-shell way-card-shell relative aspect-[248/366] w-full overflow-hidden rounded-md text-white"
        style={{ background: LEADER_CARD_BG }}
      >
        <SectionRadialGlow className="absolute left-1/2 top-1/2 z-0 !w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-75" />
        <div className="way-card-body absolute inset-0 z-10 flex items-end overflow-hidden">
          <Image
            src={leader.image}
            alt={leader.name}
            width={248}
            height={366}
            className={`relative h-auto w-full object-cover ${leader.imageClassName ?? ""}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        {leader.linkedin ? (
          <a
            href={leader.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${leader.name} on LinkedIn`}
            className="absolute bottom-3 right-3 z-20 text-white transition-opacity hover:opacity-80"
          >
            <RiLinkedinFill className="size-5" aria-hidden />
          </a>
        ) : null}
      </div>

      <h3 className="mt-5 font-heading text-xl font-medium leading-tight tracking-tight text-[#000000] md:text-2xl">
        {leader.name}
      </h3>
      <p className="mt-1 font-mono text-[0.6875rem] font-medium uppercase text-[#3A3A3A] md:text-sm">
        {leader.role}
      </p>
      <p className="mt-4 font-sans text-sm font-normal leading-[1.65] text-[#3A3A3A] md:leading-[1.7]">
        {leader.bio}
      </p>
    </article>
  );
}

function EmptyLeaderCard() {
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleTilt = (event: PointerEvent<HTMLDivElement>) => {
    const card = tiltRef.current;
    if (!card || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: y * -12,
      rotateY: x * 12,
      scale: 1.025,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 900,
      overwrite: "auto",
    });
  };

  const resetTilt = () => {
    const card = tiltRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <article className="leader-member h-full">
      <div
        ref={tiltRef}
        onPointerMove={handleTilt}
        onPointerLeave={resetTilt}
        onBlur={resetTilt}
        className="relative block aspect-[248/366] w-full overflow-hidden rounded-md transform-gpu will-change-transform"
        style={{ background: LEADER_CARD_BG }}
      >
        <SectionRadialGlow className="absolute left-1/2 top-1/2 !w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-75" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-6">
          <h3 className="font-heading text-[1.3rem] font-medium leading-[1.1] tracking-tight lg:text-[1.75rem] xl:text-[2rem]">
            Join a team of industry experts
          </h3>
          <p className="mt-3 sm:mt-6 max-w-xs font-sans text-sm leading-snug text-white/90">
            Join us in creating great work. Share your resume.
          </p>
          <Button href="/careers" surface="on-dark" size="sm" className="mt-6">
            Join Now
          </Button>
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
        gsap.set(members, { opacity: 1, y: 0, clearProps: "transform" });
        return;
      }

      gsap.set(members, { opacity: 0, y: 28 });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isTwoColumns: "(max-width: 767px)",
          isFourColumns: "(min-width: 768px)",
        },
        (context) => {
          const columns = context.conditions?.isFourColumns ? 4 : 2;
          const rows = chunkMembers(members, columns);

          rows.forEach((rowMembers) => {
            gsap.to(rowMembers, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.14,
              clearProps: "transform",
              scrollTrigger: {
                trigger: rowMembers[0],
                start: "top 88%",
                toggleActions: "play none none none",
                once: true,
              },
            });
          });
        },
      );

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
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white text-[#0a143b]">
      <style>{`
        .leader-image-shell.way-card-shell {
          --way-card-hover-scale: 1.03;
          clip-path: inset(0);
        }

        .leader-image-shell .way-card-body {
          transition: transform 800ms cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: translate3d(0, 0, 0) scale(1);
        }
      `}</style>
      <Container borderColor="#53535380">
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
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-6 lg:gap-y-12 xl:gap-x-8">
              {leaders.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
              <EmptyLeaderCard />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Leaderships;
