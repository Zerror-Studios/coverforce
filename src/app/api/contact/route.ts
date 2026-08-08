import { NextResponse } from "next/server";
import { env } from "@/config/env";
import {
  buildContactHubSpotFields,
  getHubSpotContactFormId,
  submitHubSpotForm,
} from "@/lib/hubspot";

interface ContactPayload {
  businessType: string[];
  problems: string;
  bookSize: string;
  fullName: string;
  phoneCode: string;
  countryCode: string;
  phone: string;
  email: string;
  jobTitle: string;
  companyName: string;
  heardAboutUs: string[];
  submittedAt: string;
  pageUri?: string;
  pageName?: string;
  hutk?: string;
}

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? "").trim());

const isValidName = (value: string): boolean =>
  /^[\p{L}][\p{L}\s'.-]{1,49}$/u.test(String(value ?? "").trim());

const isValidPhone = (phoneCode: string, phone: string): boolean => {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  const full = `${String(phoneCode ?? "").trim()}${digits}`;
  return /^\+\d{8,18}$/.test(full);
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const payload: ContactPayload = {
      businessType: Array.isArray(body?.businessType) ? body.businessType.map(String) : [],
      problems: String(body?.problems ?? "").trim(),
      bookSize: String(body?.bookSize ?? "").trim(),
      fullName: String(body?.fullName ?? "").trim(),
      phoneCode: String(body?.phoneCode ?? "").trim(),
      countryCode: String(body?.countryCode ?? "").trim(),
      phone: String(body?.phone ?? "").trim(),
      email: String(body?.email ?? "").trim(),
      jobTitle: String(body?.jobTitle ?? "").trim(),
      companyName: String(body?.companyName ?? "").trim(),
      heardAboutUs: Array.isArray(body?.heardAboutUs)
        ? body.heardAboutUs.map(String)
        : [],
      submittedAt: String(body?.submittedAt ?? "").trim(),
      pageUri: String(body?.pageUri ?? "").trim() || undefined,
      pageName: String(body?.pageName ?? "").trim() || undefined,
      hutk: String(body?.hutk ?? "").trim() || undefined,
    };

    const requiredFields: (keyof ContactPayload)[] = [
      "problems",
      "bookSize",
      "fullName",
      "phone",
      "email",
      "jobTitle",
      "companyName",
    ];

    const missingField = requiredFields.find((field) => !payload[field]);
    if (
      missingField ||
      payload.businessType.length === 0 ||
      payload.heardAboutUs.length === 0
    ) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    if (payload.problems.length < 10) {
      return NextResponse.json(
        { error: "Please describe the problems in a few sentences" },
        { status: 400 },
      );
    }

    if (!isValidName(payload.fullName)) {
      return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!isValidPhone(payload.phoneCode, payload.phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    if (payload.jobTitle.length < 2 || payload.companyName.length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid job title and company name" },
        { status: 400 },
      );
    }

    if (!env.hubspot.portalId) {
      return NextResponse.json({ error: "HubSpot is not configured" }, { status: 500 });
    }

    const hubspotFormId = getHubSpotContactFormId();
    if (!hubspotFormId) {
      return NextResponse.json({ error: "HubSpot form ID is missing" }, { status: 500 });
    }

    const hubspotResult = await submitHubSpotForm({
      formId: hubspotFormId,
      fields: buildContactHubSpotFields(payload),
      pageUri: payload.pageUri || "https://www.coverforce.com/contact",
      pageName: payload.pageName || "Contact",
      hutk: payload.hutk,
    });

    if (!hubspotResult.ok) {
      console.error("HubSpot contact form submit failed:", hubspotResult.status, hubspotResult.error);
      return NextResponse.json(
        { error: "Failed to submit to HubSpot" },
        { status: hubspotResult.status >= 400 && hubspotResult.status < 600 ? hubspotResult.status : 502 },
      );
    }

    return NextResponse.json({ message: "Submitted" }, { status: 200 });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
