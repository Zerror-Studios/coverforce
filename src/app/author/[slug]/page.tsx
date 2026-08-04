import Hero from "@/components/author/Hero";
import MoreBlogs from "@/components/blogDets/MoreBlogs";
import PageWrapper from "@/components/PageWrapper";
import { getAuthorSeo } from "@/data/authorSeo";
import { createArticleMetadata } from "@/lib/seo";
import {
  getBlogAuthorBySlug,
  getBlogAuthorSlugs,
  getBlogPosts,
} from "@/lib/webflow";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);
  if (!author) notFound();
  const seo = getAuthorSeo(slug);

  return createArticleMetadata({
    title: seo.title || `${author.name} | Author at CoverForce`,
    description:
      seo.description ||
      `Read articles by ${author.name} on commercial insurance distribution, technology, and the future of the P&C industry.`,
    path: `/author/${slug}`,
  });
}

export async function generateStaticParams() {
  const slugs = await getBlogAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

const AuthorPage = async ({ params }: AuthorPageProps) => {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);
  if (!author) notFound();

  const posts = await getBlogPosts();
  const authorPosts = posts.filter(
    (post) => post.authorHref === `/author/${slug}` || post.author === author.name
  );
  const morePosts = authorPosts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: post.title,
    image: post.image,
  }));

  return (
    <PageWrapper>
      <Hero author={author} />
      <MoreBlogs title={`More Insights from ${author.name}`} posts={morePosts} />
    </PageWrapper>
  );
};

export default AuthorPage;
