import type { SelectOption } from "@/components/common/SearchableSelect";

let industryOptionsPromise: Promise<SelectOption[]> | null = null;

function stripNaicsCodePrefix(text: string): string {
  return text
    .trim()
    .replace(/^\d{2,6}(?:\.\d+)?\s*[-–—:]\s*/, "")
    .trim();
}

function formatIndustryLabel(label: string): string {
  const description = stripNaicsCodePrefix(String(label ?? ""));
  if (!description) return "";
  if (/[a-z]/.test(description)) return description;

  return description
    .toLowerCase()
    .replace(
      /(^|[\s\-/(])([a-z])/g,
      (_, prefix: string, char: string) => prefix + char.toUpperCase()
    );
}

function dedupeIndustryOptions(options: SelectOption[]): SelectOption[] {
  const seen = new Set<string>();
  const deduped: SelectOption[] = [];

  for (const option of options) {
    if (seen.has(option.value)) continue;
    seen.add(option.value);
    deduped.push(option);
  }

  return deduped;
}

export async function loadIndustryOptions() {
  if (industryOptionsPromise) {
    const cached = await industryOptionsPromise;
    if (cached.length) return cached;
    industryOptionsPromise = null;
  }

  industryOptionsPromise = fetch("/api/industry-codes?v=4", {
    cache: "no-store",
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Industry code request failed: ${response.status}`);
      }
      const payload = (await response.json()) as {
        industries?: SelectOption[];
      };
      return dedupeIndustryOptions(
        (payload.industries ?? [])
          .filter((option) => option?.value && option?.label)
          .map((option) => ({
            value: String(option.value),
            label: formatIndustryLabel(option.label),
          }))
          .filter((option) => option.label)
      );
    })
    .catch((error) => {
      industryOptionsPromise = null;
      throw error;
    });

  const options = await industryOptionsPromise;
  if (!options.length) {
    industryOptionsPromise = null;
  }
  return options;
}

export const POLICY_TYPE_OPTIONS = [
  { value: "BOP", label: "Business Owner's Policy" },
  { value: "CGL", label: "Commercial General Liability" },
  { value: "CYBER", label: "Cyber" },
  { value: "WC", label: "Worker's Compensation" },
] as const satisfies readonly SelectOption[];

export const STATE_OPTIONS = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
] as const satisfies readonly SelectOption[];
