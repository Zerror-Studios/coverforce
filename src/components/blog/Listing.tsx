"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RiArrowUpDownLine,
  RiSearchLine,
} from "@remixicon/react";
import Button from "@/components/common/Button";
import ButtonArrowIcon from "@/components/common/ButtonArrowIcon";
import Container from "@/components/common/Container";
import BlogCard from "@/components/blog/BlogCard";
import { BASE_BLOG_POSTS, type BlogPost } from "@/data/blogPosts";

function ButtonArrowLeftIcon({ className = "" }: { className?: string }) {
  return <ButtonArrowIcon className={`-scale-x-100 ${className}`} />;
}

type Category = BlogPost["category"];

type ListedPost = BlogPost & { listKey: string };

/** Repeat + shuffle so each page of the demo catalog looks different. */
const REPEAT_COUNT = 3;

const DEMO_DATES = [
  "October 16, 2025",
  "September 28, 2025",
  "August 12, 2025",
  "July 3, 2025",
  "June 18, 2025",
  "May 9, 2025",
  "April 22, 2025",
  "March 5, 2025",
] as const;

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const arr = [...items];
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;

  for (let i = arr.length - 1; i > 0; i -= 1) {
    state = (state * 16807) % 2147483647;
    const j = state % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }

  return arr;
}

function buildDemoCatalog(): ListedPost[] {
  return Array.from({ length: REPEAT_COUNT }, (_, copy) => {
    const shuffled = seededShuffle(BASE_BLOG_POSTS, 42 + copy * 97);
    const offset = (copy * 3) % shuffled.length;
    const rotated = [...shuffled.slice(offset), ...shuffled.slice(0, offset)];

    return rotated.map((post, index) => ({
      ...post,
      listKey: `copy${copy + 1}-${post.slug}-${index}`,
      date: DEMO_DATES[(copy * PAGE_SIZE + index) % DEMO_DATES.length]!,
      title:
        copy === 0
          ? post.title
          : `${post.title.replace(/\.\.\.$/, "")} — Vol. ${copy + 1}`,
    }));
  }).flat();
}

const PAGE_SIZE = 8;
const POSTS: ListedPost[] = buildDemoCatalog();
const FILTERS = ["All", "Insights", "Case Study", "News"] as const;
type Filter = (typeof FILTERS)[number];

function getVisiblePages(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
}

function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);
  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <nav className="mt-14 md:mt-16" aria-label="Blog pagination">
      <div className="flex flex-col gap-6 border-t border-[#E8E8EE] pt-8 md:pt-10">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
            Showing{" "}
            <span className="text-[#0a143b]">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of <span className="text-[#0a143b]">{totalItems}</span>
          </p>
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#9AA8BC]">
            Page {String(page).padStart(2, "0")} /{" "}
            {String(totalPages).padStart(2, "0")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={ButtonArrowLeftIcon}
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="Previous page"
          >
            Previous
          </Button>

          <div className="hidden items-center gap-1.5 md:flex">
            {visiblePages.map((item, index) => {
              if (item === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-10 min-w-8 items-center justify-center font-heading text-sm text-[#9AA8BC]"
                    aria-hidden
                  >
                    …
                  </span>
                );
              }

              const isActive = item === page;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChange(item)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-[5px] border px-2.5 font-heading text-xs font-medium transition-colors ${
                    isActive
                      ? "border-[#121C49] bg-[#121C49] text-white"
                      : "border-[#535353]/40 bg-transparent text-[#2E2E2E] hover:bg-[#2E2E2E]/[0.04]"
                  }`}
                >
                  {String(item).padStart(2, "0")}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => {
              const isActive = item === page;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChange(item)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Page ${item}`}
                  className={`h-2.5 rounded-full transition-all ${
                    isActive
                      ? "w-6 bg-[#413CC0]"
                      : "w-2.5 bg-[#D8D8E2] hover:bg-[#B0B0BA]"
                  }`}
                />
              );
            })}
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </div>
    </nav>
  );
}

const Listing = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return POSTS.filter((post) => {
      const matchesFilter =
        activeFilter === "All" || post.category === activeFilter;
      const matchesQuery = post.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [activeFilter, query]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, page]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById("blog-listing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="blog-listing" className="scroll-mt-20 bg-white text-[#0a143b]">
      <Container borderColor="#53535380">
        <div className="border-t border-[#E8E8EE] pb-16 pt-10 md:pb-20 md:pt-14 lg:pb-24 lg:pt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((filter) => {
                const isActive = filter === activeFilter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#413CC0] text-white"
                        : "bg-[#0801140a] text-[#50617a] hover:bg-[#08011412]"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <RiSearchLine
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-full border border-[#E6E6E6] bg-white py-2 pl-9 pr-4 font-heading text-sm text-[#0a143b] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#413CC0]"
                />
              </div>
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#E6E6E6] bg-white text-[#50617a] transition-colors hover:border-[#413CC0] hover:text-[#413CC0]"
                aria-label="Sort"
              >
                <RiArrowUpDownLine className="size-4" />
              </button>
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
                {pagedPosts.map((post) => (
                  <BlogCard key={post.listKey} post={post} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredPosts.length}
                pageSize={PAGE_SIZE}
                onChange={handlePageChange}
              />
            </>
          ) : (
            <p className="mt-16 text-center font-heading text-sm text-[#50617a]">
              No articles found.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Listing;
