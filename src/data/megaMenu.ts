import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiArticleLine,
  RiBriefcaseLine,
  RiCalculatorLine,
  RiCodeSSlashLine,
  RiFileList3Line,
  RiFileTextLine,
  RiFolderLine,
  RiInformationLine,
  RiInboxLine,
  RiLineChartLine,
  RiMailLine,
  RiNewspaperLine,
  RiRocketLine,
  RiSearchEyeLine,
  RiSendPlaneLine,
  RiShieldLine,
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
};

export type MegaMenuColumn = {
  title: string;
  links: MegaMenuLink[];
};

export type MegaMenuFeatured = {
  title: string;
  href: string;
  image?: string;
  video?: string;
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

export type MegaMenuConfig = {
  featured: MegaMenuFeatured;
  columns: MegaMenuColumn[];
  cta: MegaMenuCta;
  promo?: MegaMenuPromo;
};

export const MEGA_MENUS: Record<string, MegaMenuConfig> = {
  Product: {
    featured: {
      title: "Watch the demo — from intake to bind in minutes",
      href: "/product/submission-intake",
      video: "/videos/demo.mp4",
      imageAlt: "CoverForce platform demo",
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
            label: "ACORD Automation",
            href: "/product/submission-intake",
            description: "Extract and pre-fill ACORD data with high accuracy.",
            icon: RiFileTextLine,
          },
          {
            label: "Carrier Submission",
            href: "/product/quote-bind",
            description: "Submit to appointed carriers from a single application.",
            icon: RiSendPlaneLine,
          },
          {
            label: "Document Center",
            href: "/product/submission-intake",
            description: "Store policies, certificates, and endorsements in one place.",
            icon: RiFolderLine,
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
      title: "Watch the demo — see CoverForce in action",
      href: "/solutions/startups",
      video: "/videos/demo.mp4",
      imageAlt: "CoverForce platform demo",
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
          {
            label: "Developers",
            href: "/solutions/developers",
            description: "Build insurance products on Coverforce APIs.",
            icon: RiCodeSSlashLine,
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
            href: "/product/intelligence",
            description: "Match risks to carrier appetite before you submit.",
            icon: RiSearchEyeLine,
          },
          {
            label: "2026 Carrier API Index",
            href: "/",
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
      title: "Watch the demo — explore the full platform",
      href: "/",
      video: "/videos/demo.mp4",
      imageAlt: "CoverForce platform demo",
    },
    cta: {
      label: "Explore Company",
      href: "/",
    },
    columns: [
      {
        title: "BY TYPE",
        links: [
          {
            label: "Blog",
            href: "/",
            description: "Product updates, guides, and industry perspective.",
            icon: RiArticleLine,
          },
          {
            label: "Customer stories",
            href: "/",
            description: "See how teams run distribution on CoverForce.",
            icon: RiUserStarLine,
          },
          {
            label: "News",
            href: "/",
            description: "Company announcements and press coverage.",
            icon: RiNewspaperLine,
          },
        ],
      },
      {
        title: "COMPANY",
        links: [
          {
            label: "About CoverForce",
            href: "/",
            description: "Our mission to modernize insurance distribution.",
            icon: RiInformationLine,
          },
          {
            label: "Careers",
            href: "/",
            description: "Join the team building the distribution platform.",
            icon: RiTeamLine,
          },
          {
            label: "Contact",
            href: "/",
            description: "Talk with our team about demos and partnerships.",
            icon: RiMailLine,
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
export const MEGA_MENU_FIXED_HEIGHT_REM = MEGA_MENU_COLUMNS_MIN_HEIGHT_REM + 4;
