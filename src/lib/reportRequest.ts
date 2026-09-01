const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ReportRequestPayload = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  blogSlug: string;
};

export function parseReportRequestBody(body: unknown): ReportRequestPayload {
  return {
    firstName: String((body as { firstName?: unknown })?.firstName ?? "").trim(),
    lastName: String((body as { lastName?: unknown })?.lastName ?? "").trim(),
    email: String(
      (body as { email?: unknown })?.email ??
        (body as { companyEmail?: unknown })?.companyEmail ??
        "",
    ).trim(),
    companyName: String((body as { companyName?: unknown })?.companyName ?? "").trim(),
    blogSlug: String(
      (body as { blogSlug?: unknown })?.blogSlug ??
        (body as { slug?: unknown })?.slug ??
        "",
    ).trim(),
  };
}

export function validateReportRequestPayload(
  payload: ReportRequestPayload,
): string | null {
  if (!payload.firstName || !payload.lastName || !payload.email || !payload.companyName) {
    return "First name, last name, email, and company name are required.";
  }

  if (!payload.blogSlug) {
    return "Report slug is required.";
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    return "Please enter a valid email address.";
  }

  return null;
}
