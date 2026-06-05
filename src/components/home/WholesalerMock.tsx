import { RiAttachmentLine, RiFileTextFill, RiLineChartLine, RiMailFill } from "@remixicon/react";
import Image from "next/image";

const LIMIT_ROWS = [
  { label: "General Liability", value: "$1,000,000" },
  { label: "Automobile Liability", value: "$500,000" },
  { label: "Umbrella Liability", value: "$5,000,000" },
] as const;

const ACORD_INFO_ROW = [
  { label: "Insured", value: "Construction LLC" },
  { label: "Policy Number", value: "GL-2024-98765" },
  { label: "Coverage", value: "5 coverages" },
] as const;

const AVATARS = [
  { label: "A", className: "bg-amber-400", image: "/images/avatar1.png" },
  { label: "B", className: "bg-blue-400", image: "/images/avatar2.png" },
] as const;

function AcordInfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-0.5 flex items-start gap-1">
      <span className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-[#F9FAFB]">
        <RiLineChartLine className="text-[#6B7280] size-2" />
      </span>
      <div>
        <p className="text-[0.40rem] font-sans font-normal uppercase leading-tight tracking-wider text-[#9CA3AF]">
          {label}
        </p>
        <p className="text-[0.50rem] tracking-wide font-heading font-medium text-[#111827]">{value}</p>
      </div>
    </div>
  );
}

export default function WholesalerMock() {
  return (
    <div className="relative -ml-32 w-full max-w-[290px]">
      <div className="absolute top-0 -right-32 z-20 w-full">
        <div className="w-full rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3 border-b border-dashed border-[#CCCCCC] px-4 py-2.5">
            <span className="flex size-[23px] shrink-0 items-center justify-center border border-[#F3F4F6] rounded-full bg-[#F9FAFB]">
              <RiMailFill color="#6F6F6F" size={11} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-heading font-medium leading-tight text-[#3C3B3B]">
                Email Intake
              </p>
              <p className="truncate text-[0.60rem] font-heading font-normal leading-tight text-[#3C3B3B]">
                submissions@coverforce.com
              </p>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-start justify-between gap-1">
              <p className="text-xs font-sans font-medium leading-[1.4] text-[#111827]">
                New submission from
                <br />
                Summit Risk Advisors
              </p>
              <span className="shrink-0 pt-0.5 text-[10px] font-sans font-normal leading-[1.4] text-[#9CA3AF]">
                9:14 AM
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-[#CCCCCC] px-3 py-3">
            <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
              <RiAttachmentLine className="text-[#6B7280] size-2 rotate-90" />
              5 attachments
            </div>
            <div className="flex items-center">
              <div className="flex -space-x-1.5 -mr-1.5">
                {AVATARS.map((avatar) => (
                  <span
                    key={avatar.label}
                    className={`flex size-[23px] items-center justify-center overflow-hidden rounded-full border border-[#AFAFAF] ${avatar.className}`}
                  >
                    <Image
                      className="object-cover w-full h-full"
                      src={avatar.image}
                      alt={avatar.label}
                      width={20}
                      height={20}
                    />
                  </span>
                ))}
              </div>
              <span className="flex size-[23px] items-center justify-center rounded-full bg-[#EEF2FF] border border-[#AFAFAF] text-[7px] font-bold text-[#4B5563]">
                +2
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[72px] w-full">
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-2 border-b border-[#CCCCCC] px-4 py-3">
            <span className="flex size-[23px] shrink-0 items-center justify-center border border-[#F3F4F6] rounded-full bg-[#F9FAFB]">
              <RiFileTextFill color="#6F6F6F" size={11} />
            </span>
            <span className="text-xs font-heading font-medium leading-tight text-[#3C3B3B]">ACORD 25</span>
          </div>

          <div className="px-3">
            {[0, 1].map((rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-3 gap-x-2 border-b border-dashed border-[#CCCCCC] py-2"
              >
                {ACORD_INFO_ROW.map((field) => (
                  <AcordInfoField
                    key={`${rowIndex}-${field.label}`}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
            <p className="text-[0.60rem] font-heading font-medium text-[#3C3B3B]">Limits Summary</p>
            <span className="text-[9px] font-sans text-[#4683E5]">View All</span>
          </div>

          <div className="divide-y divide-neutral-100 px-4">
            {LIMIT_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2">
                <span className="text-[0.60rem] font-heading font-medium text-[#3C3B3B]">{row.label}</span>
                <span className="text-xs font-heading font-medium leading-tight text-[#3C3B3B]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#CCCCCC] px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-blue-100">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path
                    d="M1 3l2 2 4-4"
                    stroke="#4683E5"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-[0.55rem] font-sans uppercase leading-tight tracking-wide text-[#4683E5]">
                  Verified
                </p>
                <p className="truncate text-[0.60rem] font-heading font-normal leading-tight text-[#9CA3AF]">
                  This certificate is valid.
                </p>
              </div>
            </div>
            <span className="truncate text-[0.60rem] font-heading font-normal leading-tight text-[#9CA3AF]">
              ACORD 25 Standard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
