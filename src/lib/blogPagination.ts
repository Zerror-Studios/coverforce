export const BLOG_PAGE_SIZE = 9;

/** Page 1 lives at /blog; page 2+ at /blog/page/N */
export function blogPageHref(page: number): string {
  if (page <= 1) return "/blog";
  return `/blog/page/${page}`;
}

export function getBlogTotalPages(postCount: number, pageSize = BLOG_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(postCount / pageSize));
}
