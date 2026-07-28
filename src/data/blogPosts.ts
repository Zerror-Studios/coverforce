export type BlogCategory = "Insights" | "Case Study" | "News";

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: string;
  image: string;
  date: string;
  author: string;
  wide?: boolean;
};

export const BASE_BLOG_POSTS: BlogPost[] = [
  {
    slug: "wholesalers-embrace-apis",
    category: "Insights",
    title: "Wholesalers Must Embrace APIs to Stay Competitive",
    image: "/images/blog/blog1.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
  },
  {
    slug: "hidden-costs-slow-submission-workflows",
    category: "Insights",
    title: "The Hidden Costs of Slow Submission Workflows in Commercial Insurance",
    image: "/images/blog/blog2.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
  },
  {
    slug: "coverforce-cb-insights-2025",
    category: "Insights",
    title: "CoverForce Named to the 2025 CB Insights’ List of the 50 Most Innovative Insurtech Startups",
    image: "/images/blog/blog3.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
  },
  {
    slug: "broker-codes-extended",
    category: "Case Study",
    title: "Broker Codes, Extended: Building a More Flexible Insurance Ecosystem",
    image: "/images/blog/blog4.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
    wide: true,
  },
  {
    slug: "venbrook-brooks-alliance",
    category: "News",
    title:
      "Venbrook Wholesaler, Brooks Insurance, Strikes Alliance with CoverForce for On-Demand Quoting",
    image: "/images/blog/blog5.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
    wide: true,
  },
  {
    slug: "coverforce-cb-insights-2025",
    category: "News",
    title:
      "CoverForce Named to the 2025 CB Insights' List of the 50 Most Innovative Insurtech Startups",
    image: "/images/blog/blog6.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
  },
  {
    slug: "coverforce-nowcerts-instant-cois",
    category: "News",
    title: "CoverForce Partners With NowCerts to Launch Instant COIs",
    image: "/images/blog/blog7.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
  },
  {
    slug: "coverforce-series-a-funding",
    category: "News",
    title: "CoverForce Secures $13 Million in Series A Funding Led by...",
    image: "/images/blog/blog8.png",
    date: "October 16, 2025",
    author: "Cyrus Karai",
  },
];
