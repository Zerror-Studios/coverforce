/**
 * Shared environment config — single source for all process.env reads.
 */
export const env = {
  coverforce: {
    apiBaseUrl: process.env.NEXT_PUBLIC_COVERFORCE_API_BASE_URL ?? "",
    apiClientId: process.env.NEXT_PUBLIC_COVERFORCE_API_CLIENT_ID ?? "",
    apiClientSecret: process.env.NEXT_PUBLIC_COVERFORCE_API_CLIENT_SECRET ?? "",
  },
  hubspot: {
    portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID?.trim() ?? "",
    contactFormId: process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID?.trim() ?? "",
    apiAccessFormId: process.env.NEXT_PUBLIC_HUBSPOT_API_ACCESS_FORM_ID?.trim() ?? "",
    reportFormId: process.env.NEXT_PUBLIC_HUBSPOT_REPORT_FORM_ID?.trim() ?? "",
  },
  webflow: {
    token: process.env.NEXT_PUBLIC_WEBFLOW_TOKEN ?? "",
    blogCollectionId: process.env.NEXT_PUBLIC_WEBFLOW_BLOG_COLLECTION_ID ?? "",
    caseStudyCollectionId:
      process.env.NEXT_PUBLIC_WEBFLOW_CASE_STUDY_COLLECTION_ID ?? "",
    reportCollectionId:
      process.env.NEXT_PUBLIC_WEBFLOW_REPORT_COLLECTION_ID ?? "",
    tagCollectionId: process.env.NEXT_PUBLIC_WEBFLOW_TAG_COLLECTION_ID ?? "",
    authorCollectionId: process.env.NEXT_PUBLIC_WEBFLOW_AUTHOR_COLLECTION_ID ?? "",
  },
  mail: {
    from: process.env.NEXT_PUBLIC_MAIL_FROM?.trim() ?? "",
    pass: process.env.NEXT_PUBLIC_MAIL_PASS?.trim() ?? "",
  },
} as const;
