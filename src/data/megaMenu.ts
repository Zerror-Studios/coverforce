import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiArticleLine,
  RiBriefcaseLine,
  RiCalculatorLine,
  RiCodeSSlashLine,
  RiFileList3Line,
  RiInformationLine,
  RiInboxLine,
  RiLineChartLine,
  RiMailLine,
  RiNewspaperLine,
  RiRocketLine,
  RiSearchEyeLine,
  RiShieldLine,
  RiStore2Line,
  RiTeamLine,
  RiUserStarLine,
  RiBuilding2Line,
} from "@remixicon/react";

export type MegaMenuLink = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  icon: RemixiconComponentType;
  multiline?: boolean;
};

export type MegaMenuColumn = {
  title: string;
  links: MegaMenuLink[];
};

export type MegaMenuFeatured = {
  title: string;
  href: string;
  image?: string;
  imageAlt?: string;
  subtitle?: string;
};

export type MegaMenuCta = {
  label: string;
  href: string;
};

export type MegaMenuPromo = {
  title: string;
  href: string;
  tag: string;
  readTime: string;
};

/** Serializable blog fields for the client Header (icons stay in static config). */
export type MegaMenuBlogData = {
  featured: MegaMenuFeatured;
  /** Featured card for the Solutions mega menu (specific post from Webflow). */
  solutionsFeatured?: MegaMenuFeatured;
  latest: Array<{
    label: string;
    href: string;
    description: string;
  }>;
};

export type MegaMenuConfig = {
  featured: MegaMenuFeatured;
  columns: MegaMenuColumn[];
  cta: MegaMenuCta;
  promo?: MegaMenuPromo;
};

export const MEGA_MENUS: Record<string, MegaMenuConfig> = {
  Product: {
    featured: {
      title: "CoverForce Named to the 2025 CB Insights",
      href: "/blog/coverforce-named-to-the-2025-cb-insights-list-of-the-50-most-innovative-insurtech-startups",
      image: "/images/blog/blog3.png",
      imageAlt: "CoverForce Insurtech 50 2025 recognition",
    },
    cta: {
      label: "Explore Product",
      href: "/product/submission-intake",
    },
    columns: [
      {
        title: "BY CAPABILITY",
        links: [
          {
            label: "Submission & Intake",
            href: "/product/submission-intake",
            description: "Capture every submission from email, PDF, or AMS.",
            icon: RiInboxLine,
          },
          {
            label: "Quote & Bind",
            href: "/product/quote-bind",
            description: "Compare carriers and bind policies in one workflow.",
            icon: RiFileList3Line,
          },
          {
            label: "Intelligence",
            href: "/product/intelligence",
            badge: "NEW",
            description: "Turn submission data into underwriting-ready insight.",
            icon: RiLineChartLine,
          },
        ],
      },
      {
        title: "PLATFORM",
        links: [
          {
            label: "Headless API",
            href: "/developers",
            description: "Embed quoting, binding, and policy workflows via API.",
            icon: RiCodeSSlashLine,
          },
          {
            label: "Custom Agency Portals",
            href: "/solutions/brokers",
            description: "White-label workflows for producers and agency teams.",
            icon: RiBriefcaseLine,
          },
          {
            label: "D2C Online Stores",
            href: "/contact",
            description: "Launch consumer-facing quote and bind experiences.",
            icon: RiStore2Line,
          },
        ],
      },
    ],
    promo: {
      title: "Introducing: AI AutoFill",
      href: "/",
      tag: "PRODUCT",
      readTime: "3 MIN READ",
    },
  },
  Solutions: {
    featured: {
      title: "The Anatomy of a Carrier Integration, Part 5: The Integration Stack",
      href: "/blog/the-anatomy-of-a-carrier-integration-part-5-the-integration-stack",
      image: "/images/blog/blog3.png",
      imageAlt: "The Anatomy of a Carrier Integration, Part 5: The Integration Stack",
    },
    cta: {
      label: "Explore Solutions",
      href: "/solutions/startups",
    },
    columns: [
      {
        title: "BY ROLE",
        links: [
          {
            label: "Wholesalers",
            href: "/solutions/wholesalers",
            description: "Grow distribution efficiently across your network.",
            icon: RiBuilding2Line,
          },
          {
            label: "Brokers",
            href: "/solutions/brokers",
            description: "One workflow for every producer on your team.",
            icon: RiBriefcaseLine,
          },
          {
            label: "Carriers",
            href: "/solutions/carrier",
            description: "Receive cleaner submissions at scale.",
            icon: RiShieldLine,
          },
          {
            label: "Startups",
            href: "/solutions/startups",
            description: "Launch insurance products on modern infrastructure.",
            icon: RiRocketLine,
          },
        ],
      },
      {
        title: "TOOLS",
        links: [
          {
            label: "ROI Calculator",
            href: "/calculation",
            description: "Estimate time and cost savings for your agency.",
            icon: RiCalculatorLine,
          },
          {
            label: "Appetite Checker",
            href: "/product/intelligence#appetite",
            description: "Match risks to carrier appetite before you submit.",
            icon: RiSearchEyeLine,
          },
          {
            label: "2026 Carrier API Index",
            href: "/integration#integration",
            description: "Explore carrier API coverage and integration depth.",
            icon: RiCodeSSlashLine,
          },
        ],
      },
    ],
    promo: {
      title: "Compare Quotes Side by Side",
      href: "/",
      tag: "GUIDE",
      readTime: "5 MIN READ",
    },
  },
  Company: {
    featured: {
      title: "CoverForce Named to the 2025 CB Insights",
      href: "/blog/coverforce-named-to-the-2025-cb-insights-list-of-the-50-most-innovative-insurtech-startups",
      image: "/images/blog/blog3.png",
      imageAlt: "CoverForce Insurtech 50 2025 recognition",
    },
    cta: {
      label: "Explore Company",
      href: "/about",
    },
    columns: [
      {
        title: "COMPANY",
        links: [
          {
            label: "About CoverForce",
            href: "/about",
            description: "Our mission to modernize insurance distribution.",
            icon: RiInformationLine,
          },
          {
            label: "Careers",
            href: "/careers",
            description: "Join the team building the distribution platform.",
            icon: RiTeamLine,
          },
          {
            label: "Blog",
            href: "/blog",
            description: "Product updates, guides, and industry perspective.",
            icon: RiArticleLine,
          },
        ],
      },
      {
        title: "Latest Blogs",
        links: [
          {
            label: "Latest insights from CoverForce",
            href: "/blog",
            description: "Product updates, guides, and industry perspective.",
            icon: RiUserStarLine,
            multiline: true,
          },
          {
            label: "More from the CoverForce blog",
            href: "/blog",
            description: "Read the latest commercial insurance articles.",
            icon: RiNewspaperLine,
            multiline: true,
          },
        ],
      },
    ],
    promo: {
      title: "Introducing: Business Pre-Fill",
      href: "/",
      tag: "NEWS",
      readTime: "4 MIN READ",
    },
  },
};

const MEGA_MENU_LINK_ROW_HEIGHT_REM = 2.75;
const MEGA_MENU_COLUMN_TITLE_HEIGHT_REM = 1.25;

export const MEGA_MENU_MAX_COLUMN_LINKS = Math.max(
  ...Object.values(MEGA_MENUS).flatMap((menu) =>
    menu.columns.map((column) => column.links.length),
  ),
);

export const MEGA_MENU_COLUMNS_MIN_HEIGHT_REM =
  MEGA_MENU_MAX_COLUMN_LINKS * MEGA_MENU_LINK_ROW_HEIGHT_REM +
  MEGA_MENU_COLUMN_TITLE_HEIGHT_REM;

export const MEGA_MENU_LEFT_MIN_HEIGHT_REM = MEGA_MENU_COLUMNS_MIN_HEIGHT_REM;
export const MEGA_MENU_FIXED_HEIGHT_REM = MEGA_MENU_COLUMNS_MIN_HEIGHT_REM + 7;

export function applyMegaMenuBlogData(
  menus: Record<string, MegaMenuConfig>,
  blogData: MegaMenuBlogData | null | undefined,
): Record<string, MegaMenuConfig> {
  if (!blogData) return menus;

  const next: Record<string, MegaMenuConfig> = {};

  for (const [key, menu] of Object.entries(menus)) {
    const columns = menu.columns.map((column) => {
      if (column.title !== "Latest Blogs") return column;

      return {
        ...column,
        links: column.links.map((link, index) => {
          const post = blogData.latest[index];
          if (!post) return link;
          return {
            ...link,
            label: post.label,
            href: post.href,
            description: post.description,
            multiline: true,
          };
        }),
      };
    });

    next[key] = {
      ...menu,
      featured:
        key === "Solutions"
          ? (blogData.solutionsFeatured ?? menu.featured)
          : blogData.featured,
      columns,
    };
  }

  return next;
}
