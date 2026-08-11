import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/utils/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // OpenAI, ChatGPT browsing and training
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      // OpenAI, ChatGPT search
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      // Anthropic, Claude
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      // Perplexity
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      // Gemini and AI Overviews
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      // Apple Intelligence
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
      // Common Crawl
      {
        userAgent: "CCBot",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
