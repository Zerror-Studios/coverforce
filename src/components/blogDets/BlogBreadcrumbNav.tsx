import Link from "next/link";

type BlogBreadcrumbNavProps = {
  label: string;
};

export default function BlogBreadcrumbNav({ label }: BlogBreadcrumbNavProps) {
  return (
    <nav
      className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#9AA8BC]"
      aria-label="Breadcrumb"
    >
      <Link href="/blog" className="transition-colors hover:text-[#413CC0]">
        Blogs
      </Link>
      <span className="text-[#C4C4C4]">/</span>
      <span className="text-[#50617a]">{label}</span>
    </nav>
  );
}
