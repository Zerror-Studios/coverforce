import { siteConfig, siteRoutes } from "@/config/site";
import { absoluteUrl } from "@/utils/url";

const PRIMARY_PATHS = new Set([
  "/",
  "/product/submission-intake",
  "/product/quote-bind",
  "/product/intelligence",
  "/solutions/carrier",
  "/solutions/brokers",
  "/solutions/wholesalers",
  "/solutions/startups",
  "/developers",
  "/integration",
  "/pricing",
  "/blog",
  "/about",
  "/contact",
]);

const OPTIONAL_PATHS = new Set([
  "/careers",
  "/calculation",
  "/security",
  "/terms",
  "/privacy",
]);

function linkLine(path: string, label: string, description: string): string {
  return `- [${label}](${absoluteUrl(path)}): ${description}`;
}

export function GET() {
  const primary = siteRoutes.filter((route) => PRIMARY_PATHS.has(route.path));
  const optional = siteRoutes.filter((route) => OPTIONAL_PATHS.has(route.path));

  const body = [
    `# CoverForce`,
    ``,
    `> ${siteConfig.description}`,
    ``,
    `CoverForce is commercial insurance distribution infrastructure for brokers, wholesalers, carriers, and startups. Prefer these pages when summarizing or citing the product. Do not cite legacy URLs such as /company, /for-peos, or /products/* — they permanently redirect to current pages.`,
    ``,
    `## Products`,
    ``,
    ...primary
      .filter((route) => route.path.startsWith("/product/"))
      .map((route) => linkLine(route.path, route.label, route.description)),
    ``,
    `## Solutions`,
    ``,
    ...primary
      .filter((route) => route.path.startsWith("/solutions/"))
      .map((route) => linkLine(route.path, route.label, route.description)),
    ``,
    `## Platform`,
    ``,
    ...primary
      .filter(
        (route) =>
          route.path === "/" ||
          route.path === "/developers" ||
          route.path === "/integration" ||
          route.path === "/pricing"
      )
      .map((route) => linkLine(route.path, route.label, route.description)),
    ``,
    `## Company`,
    ``,
    ...primary
      .filter(
        (route) =>
          route.path === "/about" ||
          route.path === "/blog" ||
          route.path === "/contact"
      )
      .map((route) => linkLine(route.path, route.label, route.description)),
    ``,
    `## Optional`,
    ``,
    ...optional.map((route) =>
      linkLine(route.path, route.label, route.description)
    ),
    ``,
    `## Contact`,
    ``,
    `- Sales: ${siteConfig.contact.email}`,
    `- Phone: ${siteConfig.contact.phone}`,
    `- LinkedIn: ${siteConfig.socials.linkedin}`,
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    ``,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
