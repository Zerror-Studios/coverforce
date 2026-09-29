export type BlogCategory = "Insights" | "Case Study" | "News";

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: string;
  image: string;
  date: string;
  author: string;
  wide?: boolean;
  href?: string;
  publishedAt?: string;
};
