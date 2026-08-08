/**
 * Shared environment config — single source for all process.env reads.
 */
export const env = {
  coverforce: {
    apiBaseUrl: process.env.COVERFORCE_API_BASE_URL ?? "",
    apiClientId: process.env.COVERFORCE_API_CLIENT_ID ?? "",
    apiClientSecret: process.env.COVERFORCE_API_CLIENT_SECRET ?? "",
  },
  hubspot: {
    portalId: process.env.HUBSPOT_PORTAL_ID?.trim() ?? "",
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN?.trim() ?? "",
    contactFormId: process.env.HUBSPOT_CONTACT_FORM_ID?.trim() ?? "",
    apiAccessFormId: process.env.HUBSPOT_API_ACCESS_FORM_ID?.trim() ?? "",
  },
  webflow: {
    token: process.env.WEBFLOW_TOKEN ?? "",
    blogCollectionId: process.env.WEBFLOW_BLOG_COLLECTION_ID ?? "",
    tagCollectionId: process.env.WEBFLOW_TAG_COLLECTION_ID ?? "",
    authorCollectionId: process.env.WEBFLOW_AUTHOR_COLLECTION_ID ?? "",
  },
} as const;
