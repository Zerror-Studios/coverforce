import { NextResponse } from "next/server";
import {
  buildReportHubSpotFields,
  getHubSpotReportFormId,
  submitHubSpotForm,
} from "@/lib/hubspot";
import { sendReportDownloadEmail } from "@/lib/mail";
import {
  parseReportRequestBody,
  validateReportRequestPayload,
} from "@/lib/reportRequest";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";
import { getReportPdfBySlug } from "@/lib/webflow";

const IP_RATE_LIMIT = { windowMs: 60 * 60 * 1000, maxRequests: 10 };
const EMAIL_RATE_LIMIT = { windowMs: 60 * 60 * 1000, maxRequests: 5 };

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const payload = parseReportRequestBody(body);

    console.log("[Request Report API] incoming body", body);
    console.log("[Request Report API] parsed payload", payload);

    const validationError = validateReportRequestPayload(payload);
    if (validationError) {
      console.warn("[Request Report API] validation failed", {
        validationError,
        payload,
      });
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    const emailKey = payload.email.toLowerCase();

    if (
      isRateLimited(`request-report:ip:${clientIp}`, IP_RATE_LIMIT) ||
      isRateLimited(`request-report:email:${emailKey}`, EMAIL_RATE_LIMIT)
    ) {
      console.warn("[Request Report API] rate limited", {
        clientIp,
        email: emailKey,
      });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const reportAsset = await getReportPdfBySlug(payload.blogSlug);
    console.log("[Request Report API] report asset", {
      blogSlug: payload.blogSlug,
      reportAsset,
    });

    if (!reportAsset) {
      return NextResponse.json(
        { error: "Report not found or PDF is unavailable." },
        { status: 404 },
      );
    }

    const formId = getHubSpotReportFormId();
    const fields = buildReportHubSpotFields(payload);
    const hubspotPayload = {
      formId,
      fields,
      pageUri:
        String(body?.pageUri ?? "").trim() ||
        `https://www.coverforce.com/blog/${payload.blogSlug}`,
      pageName: String(body?.pageName ?? "").trim() || "Report Downloads",
      hutk: String(body?.hutk ?? "").trim() || undefined,
    };

    console.log("[Request Report API] HubSpot payload", hubspotPayload);

    const hubspotResult = await submitHubSpotForm(hubspotPayload);

    console.log("[Request Report API] HubSpot response", {
      ok: hubspotResult.ok,
      status: hubspotResult.status,
      body: hubspotResult.body,
      error: hubspotResult.ok ? undefined : hubspotResult.error,
    });

    if (!hubspotResult.ok) {
      return NextResponse.json(
        { error: "Failed to submit report request", details: hubspotResult.error },
        {
          status:
            hubspotResult.status >= 400 && hubspotResult.status < 600
              ? hubspotResult.status
              : 502,
        },
      );
    }

    const mailInput = {
      to: payload.email,
      firstName: payload.firstName,
      reportTitle: reportAsset.title,
      pdfUrl: reportAsset.pdfUrl,
    };

    console.log("[Request Report API] mail input", mailInput);

    const mailResult = await sendReportDownloadEmail(mailInput);

    console.log("[Request Report API] mail response", mailResult);

    if (!mailResult.sent) {
      console.warn("[Request Report API] email not sent", {
        error: mailResult.error,
        mailInput,
      });
    }

    return NextResponse.json(
      {
        message: "Submitted",
        emailSent: mailResult.sent,
        ...(mailResult.sent ? {} : { emailError: mailResult.error }),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Request Report API] unexpected error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
