import { NextResponse } from "next/server";
import {
  buildContactHubSpotFields,
  buildStartupHubSpotFields,
  getHubSpotApiAccessFormId,
  getHubSpotContactFormId,
  submitHubSpotForm,
} from "@/lib/hubspot";

type ContactFlow = "contact" | "startup";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const flow: ContactFlow = body?.flow === "startup" ? "startup" : "contact";

    // console.log("[Contact API] incoming request", {
    //   flow,
    //   body,
    // });

    if (flow === "startup") {
      const payload = {
        firstName: String(body?.firstName ?? "").trim(),
        fullName: String(body?.fullName ?? "").trim(),
        lastName: String(body?.lastName ?? "").trim(),
        email: String(body?.email ?? "").trim(),
        phoneCode: String(body?.phoneCode ?? "").trim(),
        phone: String(body?.phone ?? "").trim(),
        companyName: String(body?.companyName ?? "").trim(),
        jobTitle: String(body?.jobTitle ?? "").trim(),
        businessType: Array.isArray(body?.businessType)
          ? body.businessType.map(String)
          : [],
        isDigitalBrokerageStartup: String(body?.isDigitalBrokerageStartup ?? "").trim(),
        startupType: String(body?.startupType ?? "").trim(),
        fundraisingStage: String(body?.fundraisingStage ?? "").trim(),
        hasActiveBook: String(body?.hasActiveBook ?? "").trim(),
        existingBookGwp: String(body?.existingBookGwp ?? "").trim(),
        pcLicense: String(body?.pcLicense ?? "").trim(),
        hasDirectAppointments: String(body?.hasDirectAppointments ?? "").trim(),
        appointedCarriers: String(body?.appointedCarriers ?? "").trim(),
        interestedLobs: Array.isArray(body?.interestedLobs)
          ? body.interestedLobs.map(String)
          : [],
        marketAccessPartners: String(body?.marketAccessPartners ?? "").trim(),
        heardAboutUsSingle: String(body?.heardAboutUsSingle ?? "").trim(),
        problems: String(body?.problems ?? "").trim(),
      };

      const formId = getHubSpotApiAccessFormId();
      const fields = buildStartupHubSpotFields(payload);
      const hubspotPayload = {
        formId,
        fields,
        pageUri: String(body?.pageUri ?? "").trim() || "https://www.coverforce.com/contact",
        pageName: String(body?.pageName ?? "").trim() || "API Access",
        hutk: String(body?.hutk ?? "").trim() || undefined,
      };

      // console.log("[Contact API] startup HubSpot payload", hubspotPayload);

      const result = await submitHubSpotForm(hubspotPayload);
      // console.log("[Contact API] startup HubSpot result", result);

      if (!result.ok) {
        return NextResponse.json(
          { error: "Failed to submit startup form", details: result.error },
          { status: result.status >= 400 && result.status < 600 ? result.status : 502 },
        );
      }

      return NextResponse.json({ message: "Submitted", flow, response: result.body }, { status: 200 });
    }

    const payload = {
      fullName: String(body?.fullName ?? "").trim(),
      email: String(body?.email ?? "").trim(),
      phoneCode: String(body?.phoneCode ?? "").trim(),
      phone: String(body?.phone ?? "").trim(),
      companyName: String(body?.companyName ?? "").trim(),
      jobTitle: String(body?.jobTitle ?? "").trim(),
      businessType: Array.isArray(body?.businessType) ? body.businessType.map(String) : [],
      bookSize: String(body?.bookSize ?? "").trim(),
      problems: String(body?.problems ?? "").trim(),
      heardAboutUs: Array.isArray(body?.heardAboutUs) ? body.heardAboutUs.map(String) : [],
    };

    const formId = getHubSpotContactFormId();
    const fields = buildContactHubSpotFields(payload);
    const hubspotPayload = {
      formId,
      fields,
      pageUri: String(body?.pageUri ?? "").trim() || "https://www.coverforce.com/contact",
      pageName: String(body?.pageName ?? "").trim() || "Contact Us",
      hutk: String(body?.hutk ?? "").trim() || undefined,
    };

    // console.log("[Contact API] contact HubSpot payload", hubspotPayload);

    const result = await submitHubSpotForm(hubspotPayload);
    // console.log("[Contact API] contact HubSpot result", result);

    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to submit contact form", details: result.error },
        { status: result.status >= 400 && result.status < 600 ? result.status : 502 },
      );
    }

    return NextResponse.json({ message: "Submitted", flow, response: result.body }, { status: 200 });
  } catch (error) {
    console.error("[Contact API] unexpected error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
