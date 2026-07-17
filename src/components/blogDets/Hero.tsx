"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import EyebrowPill from "@/components/common/EyebrowPill";
import HeroReveal from "@/components/common/HeroReveal";

type BlogDetail = {
  category: string;
  breadcrumb: string;
  image: string;
  title: string;
  author: string;
  authorRole: string;
  authorHref: string;
  authorAvatar?: string;
  authorBio: string;
  date: string;
};

const POST: BlogDetail = {
  category: "News",
  breadcrumb: "Insights",
  image: "/images/blog/blog6.png",
  title:
    "CoverForce and Great American Insurance Group Partner to Enable Digital Access to Commercial Insurance Products Across the United States",
  author: "Cyrus Karai",
  authorRole: "CEO & Co-Founder",
  authorHref: "/author/cyrus-karai",
  authorAvatar: "/images/blog/author.png",
  authorBio:
    "Wharton MBA and Chartered Accountant with leadership experience at Credit Suisse and PwC, driving CoverForce's strategy and growth.",
  date: "October 16, 2025",
};

function authorInitials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4" />
      <path d="m8.6 13.5 6.8 4" />
    </svg>
  );
}

const Hero = () => {
  const [authorOpen, setAuthorOpen] = useState(false);
  const authorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authorOpen) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!authorRef.current?.contains(event.target as Node)) {
        setAuthorOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [authorOpen]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: POST.title, url });
      } catch {
        /* user dismissed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="relative z-20 bg-white text-[#0a143b]">
      <Container borderColor="#53535380" borderBottom>
        <HeroReveal className="mx-auto max-w-4xl pb-14 pt-28 md:py-20 lg:py-24">
          <nav className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
            <Link href="/blog" className="transition-colors hover:text-[#413CC0]">
              Blogs
            </Link>
            <span className="text-[#C4C4C4]">/</span>
            <span className="text-[#50617a]">{POST.breadcrumb}</span>
          </nav>

          <div className="relative mt-5 w-full overflow-hidden rounded-md bg-[#F7F7FB]">
            <div className="relative aspect-video w-full">
              <Image
                src={POST.image}
                alt={POST.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 48rem"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <EyebrowPill surface="light" className="!m-0">
              {POST.category}
            </EyebrowPill>
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#6B7280]">
              {POST.date}
            </p>
          </div>

          <h2 className="mt-4 max-w-3xl font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
            {POST.title}
          </h2>

          <div className="relative z-30 mt-5 flex items-center justify-between gap-4">
            <div ref={authorRef} className="group relative">
              <button
                type="button"
                onClick={() => setAuthorOpen((prev) => !prev)}
                aria-expanded={authorOpen}
                className="flex items-center gap-3 text-left transition-opacity hover:opacity-75 focus-visible:outline-none"
              >
                {POST.authorAvatar ? (
                  <Image
                    src={POST.authorAvatar}
                    alt={POST.author}
                    width={48}
                    height={48}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#5D4DDB] to-[#2A2470] font-heading text-sm font-semibold text-white">
                    {authorInitials(POST.author)}
                  </span>
                )}
                <span className="flex flex-col gap-1">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-[#0a143b]">
                    {POST.author}
                  </span>
                  <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[#6B7280]">
                    {POST.authorRole}
                  </span>
                </span>
              </button>

              <div
                className={`absolute left-0 top-full z-30 pt-3 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:opacity-100 ${
                  authorOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <div
                  className={`w-90 max-w-[calc(100vw-3rem)] rounded-md border border-[#EDEDED] bg-white p-4 shadow-[0_16px_40px_-18px_rgba(10,20,59,0.22)] transition-transform duration-200 ease-out group-hover:translate-y-0 ${
                    authorOpen ? "translate-y-0" : "-translate-y-1"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {POST.authorAvatar ? (
                      <Image
                        src={POST.authorAvatar}
                        alt={POST.author}
                        width={64}
                        height={64}
                        className="size-14 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#5D4DDB] to-[#2A2470] font-heading text-lg font-semibold text-white">
                        {authorInitials(POST.author)}
                      </span>
                    )}
                    <div>
                      <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-[#0a143b]">
                        {POST.author}
                      </p>
                      <p className="mt-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[#6B7280]">
                        {POST.authorRole}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-regular font-sans leading-[1.6] text-[#454545]">
                    {POST.authorBio}
                  </p>

                  <Link
                    href={POST.authorHref}
                    className="mt-5 inline-flex items-center justify-center rounded-full border border-[#E6E6E6] bg-white px-4 py-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#5D4DDB] transition-colors hover:border-[#413CC0] hover:text-[#413CC0]"
                  >
                    Read More
                  </Link>
                </div>

                <span
                  className="absolute left-8 top-[5px] size-3.5 rotate-45 border-l border-t border-[#EDEDED] bg-white"
                  aria-hidden
                />
              </div>
            </div>

            <Button
              onClick={handleShare}
              variant="secondary"
              size="sm"
              icon={ShareIcon}
            >
              Share
            </Button>
          </div>
        </HeroReveal>
      </Container>
    </section>
  );
};

export default Hero;
