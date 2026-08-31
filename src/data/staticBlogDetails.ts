import type { BlogPost } from "@/data/blogPosts";
import type {
  ContentSection,
  ContentStat,
} from "@/components/blogDets/StaticBlogContent";
import type { ReportHeroData } from "@/components/blogDets/ReportHero";
import type { ReportContextData } from "@/components/blogDets/ReportContext";
import type { ReportFindingCard } from "@/components/blogDets/ReportFindings";

export type ReportMilestoneSlide = {
  tabLabel: string;
  description: string;
  src: string;
  alt: string;
};

export type ReportMilestonesData = {
  sectionTitle: string;
  slides: ReportMilestoneSlide[];
};

export type HeroMetaField = {
  label: string;
  value: string;
};

type StaticBlogDetailBase = {
  path: string;
  slug: string;
  category: string;
  breadcrumb: string;
  image: string;
  title: string;
  summary: string;
  author: string;
  authorRole?: string;
  date: string;
  publishedAt: string;
};

export type CaseStudyStaticBlogDetail = StaticBlogDetailBase & {
  template: "case-study";
  tags: string[];
  heroMeta: HeroMetaField[];
  stickyStats: ContentStat[];
  contentSections: ContentSection[];
};

export type ReportStaticBlogDetail = StaticBlogDetailBase & {
  template: "report";
  reportHero: ReportHeroData;
  context: ReportContextData;
  reportMilestones: ReportMilestonesData;
  findings: ReportFindingCard[];
};

export type StaticBlogDetail =
  | CaseStudyStaticBlogDetail
  | ReportStaticBlogDetail;

export const CASE_STUDY_THUMBNAIL = "/images/casestudy.png";
export const CASE_STUDY_RESULT_IMAGE = "/images/result.png";

export const CASE_STUDY_STICKY_STATS: ContentStat[] = [
  { value: "60+", label: "Carrier Integrations" },
  { value: "15,000+", label: "Agencies on Platform" },
  { value: "110,000+", label: "Submissions" },
  { value: "350,000+", label: "AI-Labeled Interactions" },
];

export const CASE_STUDY_CONTENT_SECTIONS: ContentSection[] = [
  {
    id: "challenge",
    title: "The Challenge",
    intro:
      "The brokerage needed to move faster across more carriers without adding headcount or forcing producers into separate portal workflows for every submission.",
    eyebrow: "Highlighting problem",
    bullets: [
      "Manual re-entry across carrier portals slowed quote turnaround",
      "Limited appetite visibility led to wasted effort on unbindable risks",
      "Producer time was consumed by admin instead of client-facing work",
    ],
  },
  {
    id: "solution",
    title: "The Solution",
    intro:
      "CoverForce unified intake, appetite matching, and multi-carrier quoting so the team could place business from one workflow.",
    eyebrow: "What CoverForce delivered",
    items: [
      {
        title: "Intelligent Intake",
        description:
          "Submissions were structured once and routed through a single intake layer, reducing duplicate data entry across downstream carrier workflows.",
      },
      {
        title: "Multi-Carrier Quoting",
        description:
          "One application reached connected carriers in parallel, giving producers faster market visibility without logging into separate portals.",
      },
      {
        title: "Workflow Automation",
        description:
          "Appetite matching and quoting steps were orchestrated inside CoverForce, freeing the team to focus on placement quality and bind rates.",
      },
    ],
  },
  {
    id: "results",
    title: "Key Results",
    paragraphs: [
      "With CoverForce in place, the brokerage reduced time spent on manual carrier workflows and improved how quickly producers could evaluate real bindable options.",
      "Teams gained more capacity to work higher-value accounts while keeping submission quality consistent across connected carriers.",
      "The result was a scalable distribution workflow built for faster quoting, better carrier fit, and stronger placement outcomes over time.",
    ],
    image: CASE_STUDY_RESULT_IMAGE,
    imageAlt: "CoverForce case study results",
  },
];

export const CASE_STUDY_DETAIL: CaseStudyStaticBlogDetail = {
  template: "case-study",
  path: "/blog/case-study",
  slug: "case-study",
  category: "Case Study",
  breadcrumb: "Case Study",
  image: CASE_STUDY_THUMBNAIL,
  title:
    "How a regional brokerage scaled multi-carrier quoting with CoverForce",
  summary:
    "A regional brokerage replaced manual portal workflows with CoverForce to quote across carriers faster, improve bind rates, and free producer time for higher-value client work.",
  author: "CoverForce",
  authorRole: "Customer Success",
  date: "August 15, 2026",
  publishedAt: "2026-08-15",
  tags: ["Case Study", "Brokers", "Quote & Bind"],
  heroMeta: [
    { label: "Client Name", value: "Herman Page" },
    { label: "Industry", value: "Commercial Insurance" },
    { label: "Solution", value: "CoverForce Platform" },
    { label: "Focus", value: "Distribution" },
  ],
  stickyStats: CASE_STUDY_STICKY_STATS,
  contentSections: CASE_STUDY_CONTENT_SECTIONS,
};

export const REPORT_DETAIL: ReportStaticBlogDetail = {
  template: "report",
  path: "/blog/report",
  slug: "report",
  category: "News",
  breadcrumb: "Report",
  image: CASE_STUDY_THUMBNAIL,
  title: "2026 Commercial Insurance API Index: Carrier connectivity trends",
  summary:
    "CoverForce’s annual report summarizes carrier API adoption, bindability trends, and where commercial distributors are investing in automation across intake, quoting, and binding.",
  author: "CoverForce",
  authorRole: "Research",
  date: "August 20, 2026",
  publishedAt: "2026-08-20",
  reportHero: {
    breadcrumbLabel: "Research Report",
    year: "2026",
    title: "The Future of Leadership: Building Organisations for Sustainable Growth",
    summary:
      "CoverForce’s annual report summarizes carrier API adoption, bindability trends, and where commercial distributors are investing in automation across intake, quoting, and binding.",
    ctaLabel: "Download the full report",
    ctaHref: "/contact",
    downloadModal: {
      title: "Download the Full Report for More Insights",
      bullets: [
        "Why over a quarter of underwriting effort is spent on unwinnable deals",
        "How misaligned submissions impact reinsurance costs and win rates",
        "What gaps in data, tools, and portfolio visibility are costing you",
        "How teams are using AI to outperform their competition",
      ],
      formTitle:
        "Go Beyond the Headlines and Discover the Latest Insights into Underwriting",
      consentLabel: "I agree to receive other communications from CoverForce.",
      consentFinePrint:
        "By clicking submit below, you consent to allow CoverForce to store and process the personal information submitted above to provide you the content requested.",
      submitLabel: "Submit message",
    },
    meta: [
      { label: "Published", value: "August 2026" },
      { label: "Documents", value: "42 pages" },
      { label: "Report", value: "Commercial insurance" },
    ],
  },
  context: {
    title: "The Context Behind the Research",
    paragraphs: [
      "The 2026 Commercial Insurance API Index explores how carrier connectivity is evolving, balancing real-time bindability with the long-term infrastructure distributors need to scale placement.",
      "By analyzing carrier API coverage, integration maturity, and distributor workflow trends, we identified the capabilities that distinguish high-performing commercial insurance teams from those still relying on fragmented portal workflows.",
    ],
    stats: [
      {
        label: "Organizations 250+",
        value: "68%",
        barColor: "#5348E0",
      },
      {
        label: "Industries 8",
        value: "43%",
        barColor: "#FC9B4D",
      },
      {
        label: "Senior Leaders 75",
        value: "75%",
        barColor: "#46FAC7",
      },
      {
        label: "Global Market 5",
        value: "52%",
        barColor: "#ECED79",
      },
    ],
  },
  reportMilestones: {
    sectionTitle: "Why This Research Matters",
    slides: [
      {
        tabLabel: "The Challenge",
        description:
          "Organizations today are navigating rapid technological change, evolving workforce expectations, and growing environmental pressures. As complexity increases, traditional leadership approaches are no longer enough to drive sustainable growth.",
        src: "/images/about/mil1.webp",
        alt: "Research challenge slide",
      },
      {
        tabLabel: "The Shift",
        description:
          "Commercial distributors are moving from fragmented portal workflows toward unified API connectivity—prioritizing real-time bindability, producer enablement, and carrier integration maturity across admitted and E&S lines.",
        src: "/images/about/mil2.webp",
        alt: "Research shift slide",
      },
      {
        tabLabel: "The Opportunity",
        description:
          "Teams that invest in connected quoting and binding infrastructure are placing faster, scaling producer capacity, and building durable advantages as carrier API coverage expands across the market.",
        src: "/images/about/mil3.webp",
        alt: "Research opportunity slide",
      },
    ],
  },
  findings: [
    {
      badge: "Empathetic Tech",
      title: "The Rise of the Empathetic Technologist",
      image: "/images/tech.png",
      imageAlt: "Empathetic technologist report finding",
    },
    {
      badge: "Trust vs Velocity",
      title: "Building Confidence Through Trust",
      image: "/images/velocity.png",
      imageAlt: "Trust and velocity report finding",
    },
  ],
};

export const STATIC_MORE_BLOGS: Pick<
  BlogPost,
  "slug" | "title" | "image" | "date" | "author"
>[] = [
  {
    slug: "case-study",
    title:
      "How a regional brokerage scaled multi-carrier quoting with CoverForce",
    image: CASE_STUDY_THUMBNAIL,
    date: "August 15, 2026",
    author: "CoverForce",
  },
  {
    slug: "report",
    title: "2026 Commercial Insurance API Index: Carrier connectivity trends",
    image: CASE_STUDY_THUMBNAIL,
    date: "August 20, 2026",
    author: "CoverForce",
  },
  {
    slug: "commercial-insurance-api-guide",
    title: "What is a commercial insurance API—and why distributors adopt one",
    image: CASE_STUDY_THUMBNAIL,
    date: "July 28, 2026",
    author: "CoverForce",
  },
  {
    slug: "broker-automation-roi",
    title: "How brokers measure ROI from quote-and-bind automation",
    image: CASE_STUDY_THUMBNAIL,
    date: "July 10, 2026",
    author: "CoverForce",
  },
];

export function getStaticMoreBlogs(currentSlug: string) {
  return STATIC_MORE_BLOGS.filter((post) => post.slug !== currentSlug).slice(
    0,
    3,
  );
}
