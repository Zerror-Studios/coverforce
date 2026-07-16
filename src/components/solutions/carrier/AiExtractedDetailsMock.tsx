"use client";

import Image from "next/image";
import {
  RiAttachment2,
  RiBuilding2Line,
  RiCalendarLine,
  RiCheckLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
  RiSparkling2Line,
  RiStackLine,
} from "@remixicon/react";

const EXTRACTED_FIELDS = [
  {
    label: "Account name",
    value: "Summit Risk Advisors",
    icon: RiBuilding2Line,
    bg: "#F3F0FF",
    color: "#5B35E0",
  },
  {
    label: "Line of Business",
    value: "Commercial Package",
    icon: RiFileList3Line,
    bg: "#F3F0FF",
    color: "#5B35E0",
  },
  {
    label: "Document Type",
    value: "ACORD 125, loss run",
    icon: RiStackLine,
    bg: "#ECFDF3",
    color: "#7CB518",
  },
  {
    label: "Effective Date",
    value: "02/06/2026",
    icon: RiCalendarLine,
    bg: "#EFF6FF",
    color: "#4683E5",
  },
  {
    label: "Est. Premium",
    value: "$82,450",
    icon: RiMoneyDollarCircleLine,
    bg: "#FEF2F2",
    color: "#EF4444",
  },
  {
    label: "Confidence Score",
    value: "95%+",
    icon: RiCheckLine,
    bg: "#F3F4F6",
    color: "#3C3B3B",
    valueColor: "#7CB518",
  },
] as const;

const ATTACHMENT_FILES = [
  { label: "PDF", icon: "/images/solution/pdf.svg" },
  { label: "DOC", icon: "/images/solution/doc.svg" },
  { label: "XL", icon: "/images/solution/xl.svg" },
] as const;

const AVATARS = [
  "/images/avatar1.png",
  "/images/avatar2.png",
  "/images/avatar1.png",
] as const;

export default function AiExtractedDetailsMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] min-h-[320px] overflow-visible pb-4 md:min-h-[350px] md:pb-6">
      {/* Back card — top-right */}
      <div className="absolute right-0 top-0 z-0 w-[94%] rounded-2xl border border-[#E8EAEF] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-dashed border-[#E5E7EB] pb-3">
          <p className="inline-flex items-center gap-1.5 font-heading text-[0.65rem] font-semibold tracking-wide text-[#3C3B3B] md:text-sm">
            <RiSparkling2Line size={14} className="text-[#5B35E0]" />
            AI EXTRACTED DETAILS
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#EFF6E7] px-2.5 py-1 font-heading text-[0.65rem] font-medium text-[#72AF23] md:text-xs">
            <span className="text-[#FFFFFF] bg-[#72AF23] rounded-full size-3 flex items-center justify-center">
            <RiCheckLine size={8} />
            </span>
            Processed by AI
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 md:mt-4 md:gap-2.5">
          {EXTRACTED_FIELDS.map((field) => {
            const Icon = field.icon;

            return (
              <div
                key={field.label}
                className="flex items-start gap-2 rounded-xl border border-[#EEF0F4] bg-white p-2.5 md:p-3"
              >
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full md:size-8"
                  style={{ backgroundColor: field.bg, color: field.color }}
                >
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[0.6rem] font-semibold text-[#3C3B3B] md:text-[0.65rem]">
                    {field.label}
                  </p>
                  <p
                    className="mt-0.5 truncate font-heading text-[0.55rem] font-normal md:text-[0.6rem]"
                    style={{
                      color: "valueColor" in field ? field.valueColor : "#9CA3AF",
                    }}
                  >
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Front card — bottom-left overlap */}
      <div className="absolute -left-10 top-[8.25rem] z-10 w-[85%] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:top-[13rem] md:w-[80%]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#3C3B3B] md:text-base">
            <RiAttachment2 size={16} className="text-[#5B35E0]" />
            5 Attachments
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="font-heading text-xs font-medium text-[#6B7280] md:text-xs">45+</span>
            <div className="flex -space-x-1.5">
              {AVATARS.map((src,idx) => (
                <span
                  key={idx}
                  className="relative size-6 overflow-hidden rounded-full border-2 border-white md:size-7"
                >
                  <Image src={src} alt="avatar" fill className="object-cover" sizes="28px" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 px-4 py-4 md:gap-3 md:py-5">
          {ATTACHMENT_FILES.map((file) => (
            <span
              key={file.label}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white px-2 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] font-heading text-[0.65rem] font-medium text-[#111827] md:text-xs"
            >
              <Image
                src={file.icon}
                alt="attachment-file"
                width={16}
                height={16}
                className="size-4 shrink-0"
                aria-hidden
              />
              {file.label}
            </span>
          ))}
          <span className="inline-flex items-center justify-center rounded-md bg-[#F3F0FF] px-2 py-3 font-heading text-[0.65rem] font-semibold text-[#5B35E0] md:text-xs">
            2+
          </span>
        </div>
      </div>
    </div>
  );
}
