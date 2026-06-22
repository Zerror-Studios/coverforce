"use client";

import Image from "next/image";
import {
  RiArrowRightSLine,
  RiCheckLine,
  RiFileCheckLine,
  RiFileTextLine,
  RiMailLine,
  RiShieldCheckLine,
  RiStackLine,
  RiTimeLine,
} from "@remixicon/react";

const STATUS_TAGS = [
  { label: "Email Parsed", icon: RiMailLine, bg: "#EDE9FC", color: "#5B35E0" },
  { label: "ACORD read", icon: RiFileTextLine, bg: "#FFF4F4", color: "#F92020" },
  { label: "COI ready", icon: RiShieldCheckLine, bg: "#E3EDFD", color: "#1B78FB" },
] as const;

const FILE_TYPES = [
  { label: "PDF", icon: "/images/solution/pdf.svg" },
  { label: "DOC", icon: "/images/solution/doc.svg" },
  { label: "XLS", icon: "/images/solution/xl.svg" },
] as const;

export default function AiDocumentReaderMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[300px] overflow-visible pb-2 md:min-h-[320px] md:pb-4">
      {/* Back card — top-right */}
      <div className="absolute right-0 top-0 z-0 w-[88%] rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-4 ">
        <div className="border-b border-dashed border-[#E5E7EB] pb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1">
            <span className="flex size-8 shrink-0 items-center justify-center text-[#B87AFF]">
              <RiStackLine size={14} />
            </span>
            <p className="truncate font-heading text-sm font-semibold text-[#3C3B3B] md:text-sm">
              AI Document Reader
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#EFF6E7] px-2.5 py-1 font-heading text-[0.65rem] font-medium text-[#72AF23] md:text-xs">
            <span className="text-[#FFFFFF] bg-[#72AF23] rounded-full size-3 flex items-center justify-center">
            <RiCheckLine size={8} />
            </span>
            95%+ Accuracy
          </span>
        </div>

        <div className="mt-5 md:mt-6">
          <p className="font-heading text-2xl font-semibold leading-tight text-[#3C3B3B] md:text-base">
            12 Docs Processed
          </p>
          <p className="mt-1 font-sans text-xs font-normal text-[#111827]/60 md:text-xs">
            Submission packet converted
          </p>
        </div>

        <div className="mt-5 flex justify-between gap-2 items-center md:mt-6">
          {STATUS_TAGS.map((tag) => {
            const Icon = tag.icon;

            return (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 rounded-md px-4 py-3 font-heading text-[0.65rem] font-medium md:text-xs"
                style={{ backgroundColor: tag.bg, color: tag.color }}
              >
                <Icon size={12} />
                {tag.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Front card — bottom-left overlap, top sits on status row */}
      <div className="absolute -left-8 top-[10rem] z-10 w-[86%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:-left-10 md:top-[11rem] md:w-[85%]">
        <div className="flex items-center justify-between gap-3 px-4 py-5">
          <p className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-[#3C3B3B] md:text-sm">
            Latest Result
            <RiTimeLine size={14} className="text-[#9CA3AF]" />
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 font-heading text-[0.65rem] font-medium text-[#5B35E0] md:text-xs"
          >
            See all Plan
            <RiArrowRightSLine size={14} />
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-4 md:py-5">
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#EFF6E7] text-[#72AF23] md:size-10">
            <RiFileCheckLine size={16} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-semibold text-[#3C3B3B] md:text-xs">
              Commercial Property App
            </p>
            <p className="mt-0.5 font-sans text-[0.65rem] font-normal text-[#111827]/60 md:text-xs">
              Auto-filled • Auto-filled
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="font-sans text-[0.65rem] font-normal text-[#111827]/60 md:text-xs">
              +5
            </span>
            <div className="flex -space-x-1.5">
              {FILE_TYPES.map((file) => (
                <span
                  key={file.label}
                  className="flex size-6 items-center justify-center rounded-full border border-[#E8EAEF] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:size-7"
                  title={file.label}
                >
                  <Image
                    src={file.icon}
                    alt=""
                    width={14}
                    height={14}
                    className="size-3.5 md:size-4"
                    aria-hidden
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
