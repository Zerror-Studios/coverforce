"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
};

function formatDropdownLabel(option: string) {
  const text = String(option ?? "").trim();
  // Drop leading NAICS codes if present: "722511 - Full-Service Restaurants"
  const withoutCode = text
    .replace(/^\d{2,6}(?:\.\d+)?\s*[-–—:]\s*/, "")
    .trim();

  if (!withoutCode) return text;

  // Keep mixed-case labels (policy types, states) as-is.
  if (/[a-z]/.test(withoutCode)) return withoutCode;

  // Title-case all-caps labels (e.g. NAICS industry names).
  return withoutCode
    .toLowerCase()
    .replace(/(^|[\s\-/(])([a-z])/g, (_, prefix: string, char: string) => prefix + char.toUpperCase());
}

function normalizeOption(option: string | SelectOption): SelectOption {
  if (typeof option === "string") {
    return {
      value: option,
      label: formatDropdownLabel(option),
    };
  }
  return {
    value: option.value,
    label: formatDropdownLabel(option.label),
  };
}

type SearchableSelectProps = {
  id: string;
  label: string;
  value: string;
  options: readonly (string | SelectOption)[];
  onChange: (value: string) => void;
  placeholder?: string; // add this
};

export default function SearchableSelect({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Start typing to search...",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = `${id}-listbox`;
  const normalizedOptions = options.map(normalizeOption);
  const selected = normalizedOptions.find((option) => option.value === value);
  const selectedLabel = selected?.label ?? "";
  const search = query.trim().toLowerCase();
  const filteredOptions = search
    ? normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(search)
      )
    : normalizedOptions;

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative block min-w-0 flex-1">
      <span
        id={`${id}-label`}
        className="mb-2 block font-mono text-sm font-medium uppercase text-[#2A297C]"
      >
        {label}
      </span>
      <div
        className={`box-border flex h-10 min-h-10 max-h-10 w-full items-center rounded-lg border bg-white px-4 transition-colors ${
          open
            ? "border-[#5B35E0] ring-1 ring-[#5B35E0]/20"
            : "border-[#E4E7EC] hover:border-[#5B35E0]/40"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-labelledby={`${id}-label`}
          autoComplete="off"
          placeholder={placeholder}
          value={open ? query : selectedLabel}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            if (value) onChange("");
          }}
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
          className="min-w-0 flex-1 bg-transparent font-heading text-sm font-medium leading-none text-[#1A1A1A] outline-none placeholder:text-[#9AA8BC]"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Toggle ${label} options`}
          onClick={() => {
            if (open) {
              close();
            } else {
              setOpen(true);
              setQuery("");
              inputRef.current?.focus();
            }
          }}
          className="ml-2 shrink-0 text-[#9AA8BC]"
        >
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
      </div>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          data-lenis-prevent
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-y-auto rounded-xl border border-[#E8ECF0] bg-white py-1 shadow-[0_12px_32px_rgba(10,20,59,0.1)]"
        >
          {filteredOptions.length ? (
            filteredOptions.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onChange(option.value);
                      close();
                    }}
                    className={`flex w-full items-center px-4 py-3.5 text-left font-heading text-xs font-medium transition-colors md:text-sm ${
                      index > 0 ? "border-t border-[#EEF1F5]" : ""
                    } ${
                      isSelected
                        ? "bg-[#F5F3FF] text-[#2A297C]"
                        : "text-[#111110] hover:bg-[#F7F8FA]"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-3.5 font-heading text-xs font-medium text-[#9AA8BC] md:text-sm">
              No matches
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
