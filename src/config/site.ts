export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  locale: string;
  language: string;
  ogImage: string;
  keywords: string[];
  contact: {
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
};

export type SiteRoute = {
  path: string;
  label: string;
  title: string;
  description: string;
  priority: number;
};

export const siteConfig: SiteConfig = {
  name: "Insurance Distribution Infrastructure Platform | CoverForce",
  description:
    "Generate, compare, and bind commercial insurance quotes with CoverForce. Access leading P&C carriers through one API marketplace and distribution platform built to scale.",
  url: "https://www.coverforce.com",
  locale: "en_US",
  language: "en-US",
  ogImage: "/og.png",
  keywords: ["CoverForce", "Insurance", "Platform", "Management", "Policy", "Creation"],
  contact: {
    phone: "+1-917-905-6508",
    email: "sales@coverforce.com",
  },
  address: {
    street: "485 Madison Ave, Ste 1702",
    city: "New York, NY 10017",
    state: "New York",
    postalCode: "10022",
    country: "US",
  },
  socials: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "https://www.linkedin.com/company/coverforceinc",
  },
};

export const siteRoutes: SiteRoute[] = [
  {
    path: "/",
    label: "Home",
    title: "Insurance Distribution Infrastructure Platform | CoverForce",
    description: siteConfig.description,
    priority: 1,
  },
  {
    path: "/product/submission-intake",
    label: "Submission Intake",
    title: "Commercial Insurance Distribution Platform | CoverForce",
    description:
      "CoverForce connects brokers, networks and wholesalers to leading commercial P&C; carriers through one API for submission, quoting, binding and payment.",
    priority: 0.9,
  },
  {
    path: "/product/quote-bind",
    label: "Quote & Bind",
    title: "Commercial Quote and Bind Software | CoverForce",
    description:
      "Submit once, compare bindable quotes from dozens of carriers side by side, and bind and collect payment without leaving the CoverForce workflow.",
    priority: 0.9,
  },
  {
    path: "/product/intelligence",
    label: "Intelligence",
    title: "Insurance Carrier Appetite Intelligence | CoverForce",
    description:
      "Match risks to the carriers most likely to write them. Appetite data by state, industry and line of business, built from live submission outcomes.",
    priority: 0.9,
  },
  {
    path: "/solutions/carrier",
    label: "Carriers",
    title: "Insurance Carrier Distribution API Platform | CoverForce",
    description:
      "Reach thousands of appointed agents through one integration. Open new distribution, cut submission handling cost and see richer data on every risk.",
    priority: 0.8,
  },
  {
    path: "/solutions/brokers",
    label: "Brokers",
    title: "Insurance Software for Brokers and Agencies | CoverForce",
    description:
      "Quote, compare and bind commercial policies from one platform. Keep your book, keep your commissions, and cut hours of duplicate carrier paperwork.",
    priority: 0.8,
  },
  {
    path: "/solutions/wholesalers",
    label: "Wholesalers",
    title: "Wholesale Insurance Broker Platform and API | CoverForce",
    description:
      "Give retail partners a branded submission and quoting experience, route business to preferred markets, and handle E&S; compliance inside the workflow.",
    priority: 0.8,
  },
  {
    path: "/solutions/startups",
    label: "Startups",
    title: "Insurance Infrastructure for Brokerage Startups | CoverForce",
    description:
      "Launch and scale a modern commercial insurance brokerage on CoverForce infrastructure. Get APIs, carrier access, and workflows built for fast-growing agencies.",
    priority: 0.8,
  },
  {
    path: "/developers",
    label: "Developers",
    title: "Developer APIs for Commercial Insurance | CoverForce",
    description:
      "Embed commercial insurance with open APIs, MCP support, sandbox access, and developer docs. Build quote-to-bind workflows and ship production-ready insurance products faster.",
    priority: 0.8,
  },
  {
    path: "/integration",
    label: "Integrations",
    title: "Insurance Integrations and Carrier Connections | CoverForce",
    description:
      "Connect CoverForce with agency management systems, carriers, and tools your team already uses. Streamline data flow across your commercial insurance distribution stack.",
    priority: 0.7,
  },
  {
    path: "/pricing",
    label: "Pricing",
    title: "Commercial Insurance Platform Pricing | CoverForce",
    description:
      "Simple, transparent pricing for brokerages, wholesalers, and carriers. Compare CoverForce plans and find the right fit for your team size and distribution goals.",
    priority: 0.7,
  },
  {
    path: "/blog",
    label: "Blog",
    title: "Commercial Insurance Blog and Insights | CoverForce",
    description:
      "Read the latest on commercial insurance APIs, digital distribution, insurtech trends, and product updates from the CoverForce team and industry experts.",
    priority: 0.7,
  },
  {
    path: "/about",
    label: "About",
    title: "About CoverForce | Commercial Insurance Platform",
    description:
      "Learn how CoverForce modernizes commercial insurance distribution for brokers, carriers, and wholesalers with APIs, workflows, and infrastructure built to scale.",
    priority: 0.6,
  },
  {
    path: "/careers",
    label: "Careers",
    title: "Careers at CoverForce | Join Our Insurtech Team",
    description:
      "Explore open roles at CoverForce and help build the future of commercial insurance distribution. Join a team innovating APIs, workflows, and data for the P&C industry.",
    priority: 0.6,
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact CoverForce | Request a Commercial Demo",
    description:
      "Talk to the CoverForce team about a platform demo, an API integration or a carrier partnership. Sales, support and partnership routes in one place.",
    priority: 0.6,
  },
  {
    path: "/calculation",
    label: "Calculator",
    title: "Insurance ROI Calculator | CoverForce",
    description:
      "Estimate time and cost savings with the CoverForce insurance distribution calculator. Model submission, quoting, and binding efficiencies for your brokerage or agency.",
    priority: 0.5,
  },
  {
    path: "/terms-of-service",
    label: "Terms",
    title: "Terms of Service | CoverForce",
    description:
      "Read CoverForce Terms of Service for use of our website, platform, APIs, and related services. Review policies governing access, use, and legal responsibilities.",
    priority: 0.3,
  },
  {
    path: "/privacy-policy",
    label: "Privacy",
    title: "Privacy Policy | CoverForce",
    description:
      "Learn how CoverForce collects, uses, shares, and protects personal information across our website, platform, and APIs, including your privacy rights under CCPA.",
    priority: 0.3,
  },
  {
    path: "/security",
    label: "Security",
    title: "Security at CoverForce | Enterprise Insurance Platform",
    description:
      "See how CoverForce secures insurance data with AWS infrastructure, zero trust architecture, SOC 2 compliance, encryption, and continuous monitoring by design.",
    priority: 0.3,
  },
];
