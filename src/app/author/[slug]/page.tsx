import AuthorPosts from "@/components/author/AuthorPosts";
import Hero from "@/components/author/Hero";
import JsonLd from "@/components/common/JsonLd";
import PageWrapper from "@/components/PageWrapper";
import {
  buildAuthorPersonJsonLd,
  getAuthorSeo,
} from "@/data/authorSeo";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonLd";
import { createMetadata } from "@/lib/seo";
import {
  getBlogAuthorBySlug,
  getBlogAuthorSlugs,
  getBlogPosts,
  toListingPost,
} from "@/lib/webflow";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);
  if (!author) notFound();
  const seo = getAuthorSeo(slug);

  const title =
    seo.title || `${author.name} | Author at CoverForce`;
  const description =
    seo.description ||
    `Read articles by ${author.name} on commercial insurance distribution, technology, and the future of the P&C industry.`;

  const meta = createMetadata({
    title,
    description,
    path: `/author/${slug}`,
    image: author.avatar,
  });

  return {
    ...meta,
    title: { absolute: title },
    openGraph: {
      ...meta.openGraph,
      title,
      description,
      type: "profile",
    },
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getBlogAuthorSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

const AuthorPage = async ({ params }: AuthorPageProps) => {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);
  if (!author) notFound();

  const profile = getAuthorSeo(slug);
  const posts = await getBlogPosts();
  const authorPosts = posts
    .filter(
      (post) =>
        post.authorHref === `/author/${slug}` || post.author === author.name
    )
    .map(toListingPost);

  const path = `/author/${slug}`;
  const title = profile.title || `${author.name} | Author at CoverForce`;
  const description =
    profile.description ||
    `Read articles by ${author.name} on commercial insurance distribution, technology, and the future of the P&C industry.`;

  return (
    <PageWrapper>
      <JsonLd
        data={[
          buildAuthorPersonJsonLd(author, profile),
          buildWebPageJsonLd({ path, title, description }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: author.name, path },
          ]),
        ]}
      />
      <Hero author={author} profile={profile} />
      <AuthorPosts authorName={author.name} posts={authorPosts} />
    </PageWrapper>
  );
};

export default AuthorPage;
