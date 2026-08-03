type HubSpotField = {
  objectTypeId?: string;
  name: string;
  value: string;
};

type HubSpotSubmitInput = {
  formId: string;
  fields: HubSpotField[] | Record<string, string | string[] | undefined | null>;
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

function requireEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

function splitFullName(fullName: string): { firstname: string; lastname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstname: "", lastname: "" };
  if (parts.length === 1) return { firstname: parts[0]!, lastname: parts[0]! };
  return {
    firstname: parts[0]!,
    lastname: parts.slice(1).join(" "),
  };
}

function toFieldValue(value: string | string[] | undefined | null): string {
  if (Array.isArray(value)) return value.filter(Boolean).join("; ");
  return String(value ?? "").trim();
}

/**
 * HubSpot contact form internal names (portal form a8899fe8-…).
 * Company-scoped properties use objectTypeId "0-2".
 */
export const HUBSPOT_CONTACT_FIELD_MAP = {
  email: { name: "email", objectTypeId: "0-1" },
  firstname: { name: "firstname", objectTypeId: "0-1" },
  lastname: { name: "lastname", objectTypeId: "0-1" },
  phone: { name: "phone", objectTypeId: "0-1" },
  company: { name: "company", objectTypeId: "0-1" },
  jobtitle: { name: "jobtitle", objectTypeId: "0-1" },
  businessType: { name: "company_business_type", objectTypeId: "0-1" },
  bookSize: {
    name: "how_big_is_your_existing_commercial_book_of_business____in_gwp__",
    objectTypeId: "0-1",
  },
  problems: {
    name: "which_coverforce_capabilities_are_most_relevant_to_your_needs_",
    objectTypeId: "0-1",
  },
  heardAboutUs: {
    name: "how_did_you_hear_about_us_form",
    objectTypeId: "0-2",
  },
} as const;

export function buildContactHubSpotFields(payload: {
  fullName: string;
  email: string;
  phoneCode: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  businessType: string[];
  bookSize: string;
  problems: string;
  heardAboutUs: string[];
}): HubSpotField[] {
  const { firstname, lastname } = splitFullName(payload.fullName);
  const phone = `${payload.phoneCode}${payload.phone.replace(/\D/g, "")}`;

  const entries: Array<{
    key: keyof typeof HUBSPOT_CONTACT_FIELD_MAP;
    value: string;
  }> = [
    { key: "email", value: payload.email },
    { key: "firstname", value: firstname },
    { key: "lastname", value: lastname },
    { key: "phone", value: phone },
    { key: "company", value: payload.companyName },
    { key: "jobtitle", value: payload.jobTitle },
    { key: "businessType", value: payload.businessType.join("; ") },
    { key: "bookSize", value: payload.bookSize },
    { key: "problems", value: payload.problems },
    { key: "heardAboutUs", value: payload.heardAboutUs.join("; ") },
  ];

  return entries
    .map(({ key, value }) => {
      const field = HUBSPOT_CONTACT_FIELD_MAP[key];
      return {
        objectTypeId: field.objectTypeId,
        name: field.name,
        value: toFieldValue(value),
      };
    })
    .filter((field) => field.value.length > 0);
}

export async function submitHubSpotForm({
  formId,
  fields,
  pageUri,
  pageName,
  hutk,
}: HubSpotSubmitInput): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const portalId = requireEnv("HUBSPOT_PORTAL_ID");
  if (!portalId) {
    return { ok: false, status: 500, error: "HUBSPOT_PORTAL_ID is not configured" };
  }
  if (!formId) {
    return { ok: false, status: 500, error: "HubSpot form ID is missing" };
  }

  const accessToken = requireEnv("HUBSPOT_ACCESS_TOKEN");
  const endpoint = accessToken
    ? `https://api.hsforms.com/submissions/v3/integration/secure/submit/${portalId}/${formId}`
    : `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  const hsFields: HubSpotField[] = Array.isArray(fields)
    ? fields.filter((field) => field.value.trim().length > 0)
    : Object.entries(fields)
        .map(([name, value]) => ({
          objectTypeId: "0-1",
          name,
          value: toFieldValue(value),
        }))
        .filter((field) => field.value.length > 0);

  const body = {
    fields: hsFields,
    context: {
      ...(pageUri ? { pageUri } : {}),
      ...(pageName ? { pageName } : {}),
      ...(hutk ? { hutk } : {}),
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    return { ok: true };
  }

  const errorText = await response.text().catch(() => "");
  return {
    ok: false,
    status: response.status,
    error: errorText || `HubSpot submit failed (${response.status})`,
  };
}

export function getHubSpotContactFormId(): string | null {
  return (
    requireEnv("HUBSPOT_CONTACT_FORM_ID") ||
    "a8899fe8-45b1-4022-872e-d79aa4e238ea"
  );
}

export function getHubSpotApiAccessFormId(): string | null {
  return (
    requireEnv("HUBSPOT_API_ACCESS_FORM_ID") ||
    "a46f0b5e-bfd8-4b7a-9e6b-2a1e0d351415"
  );
}
