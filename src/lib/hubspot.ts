import { env } from "@/config/env";

export type HubSpotField = {
  objectTypeId?: string;
  name: string;
  value: string;
};

type HubSpotSubmitInput = {
  formId: string;
  fields: HubSpotField[];
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

function splitFullName(fullName: string): { firstname: string; lastname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstname: "", lastname: "" };
  if (parts.length === 1) return { firstname: parts[0]!, lastname: parts[0]! };
  return {
    firstname: parts[0]!,
    lastname: parts.slice(1).join(" "),
  };
}

function field(
  name: string,
  value: string,
  objectTypeId: "0-1" | "0-2" = "0-1",
): HubSpotField | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return { objectTypeId, name, value: trimmed };
}

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
  const { firstname } = splitFullName(payload.fullName);
  const phone = `${payload.phoneCode}${payload.phone.replace(/\D/g, "")}`;

  return [
    field("firstname", firstname),
    field("email", payload.email),
    field("phone", phone),
    field("jobtitle", payload.jobTitle),
    field("company", payload.companyName),
    field("company_business_type", payload.businessType.join("; ")),
    field(
      "which_coverforce_capabilities_are_most_relevant_to_your_needs_",
      payload.problems,
    ),
    field(
      "how_big_is_your_existing_commercial_book_of_business____in_gwp__",
      payload.bookSize,
    ),
    field("how_did_you_hear_about_us_form", payload.heardAboutUs.join("; "), "0-2"),
  ].filter((item): item is HubSpotField => Boolean(item));
}

export function buildStartupHubSpotFields(payload: {
  fullName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  businessType: string[];
  isDigitalBrokerageStartup: string;
  startupType: string;
  fundraisingStage: string;
  hasActiveBook: string;
  existingBookGwp: string;
  pcLicense: string;
  hasDirectAppointments: string;
  appointedCarriers: string;
  interestedLobs: string[];
  marketAccessPartners: string;
  heardAboutUsSingle: string;
  problems: string;
}): HubSpotField[] {
  const { firstname } = splitFullName(payload.fullName);
  const phone = `${payload.phoneCode}${payload.phone.replace(/\D/g, "")}`;
  const hasActiveBook =
    payload.hasActiveBook === "Yes"
      ? "true"
      : payload.hasActiveBook === "No"
        ? "false"
        : "";

  return [
    field("firstname", firstname || payload.fullName),
    field("lastname", payload.lastName),
    field("email", payload.email),
    field("phone", phone),
    field("company", payload.companyName),
    field("jobtitle", payload.jobTitle),
    field("startup__api_form_yn", payload.isDigitalBrokerageStartup),
    field("startup_type", payload.startupType),
    field("startup_fundraising_stage", payload.fundraisingStage),
    field("startup__existing_agency_with_an_active_book", hasActiveBook),
    field("startup_existing_book_in_gwp", payload.existingBookGwp),
    field("startup_insurance_licenses", payload.pcLicense),
    field("startup_direct_carrier_appointments", payload.hasDirectAppointments),
    field("startup_carriers_appointed_with", payload.appointedCarriers),
    field("startup_lobs", payload.interestedLobs.join(";")),
    field("startup_market_acccess", payload.marketAccessPartners),
    field("company_business_type", payload.businessType.join("; ")),
    field(
      "which_coverforce_capabilities_are_most_relevant_to_your_needs_",
      payload.problems,
    ),
    field(
      "how_big_is_your_existing_commercial_book_of_business____in_gwp__",
      payload.existingBookGwp,
    ),
    field("how_did_you_hear_about_us_form", payload.heardAboutUsSingle, "0-2"),
  ].filter((item): item is HubSpotField => Boolean(item));
}

export async function submitHubSpotForm({
  formId,
  fields,
  pageUri,
  pageName,
  hutk,
}: HubSpotSubmitInput): Promise<
  | { ok: true; status: number; body: string }
  | { ok: false; status: number; error: string; body: string }
> {
  const portalId = env.hubspot.portalId || "44742739";
  if (!formId) {
    return { ok: false, status: 500, error: "HubSpot form ID is missing", body: "" };
  }

  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  const body = {
    fields,
    context: {
      ...(pageUri ? { pageUri } : {}),
      ...(pageName ? { pageName } : {}),
      ...(hutk ? { hutk } : {}),
    },
  };

  console.log("[HubSpot] submit payload", {
    endpoint,
    formId,
    portalId,
    body,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseText = await response.text().catch(() => "");
  console.log("[HubSpot] submit response", {
    status: response.status,
    ok: response.ok,
    body: responseText,
  });

  if (response.ok) {
    return { ok: true, status: response.status, body: responseText };
  }

  return {
    ok: false,
    status: response.status,
    error: responseText || `HubSpot submit failed (${response.status})`,
    body: responseText,
  };
}

export function getHubSpotContactFormId(): string {
  return env.hubspot.contactFormId || "a8899fe8-45b1-4022-872e-d79aa4e238ea";
}

export function getHubSpotApiAccessFormId(): string {
  return env.hubspot.apiAccessFormId || "a46f0b5e-bfd8-4b7a-9e6b-2a1e0d351415";
}
