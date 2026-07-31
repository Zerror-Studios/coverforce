import Link from "next/link";
import Container from "@/components/common/Container";

type ContentProps = {
  bodyHtml: string;
  tags?: string[];
};

const Content = ({ bodyHtml, tags = [] }: ContentProps) => {
  return (
    <section className="bg-white text-[#444444]">
      <Container borderColor="#53535380">
        <div className="mx-auto max-w-4xl border-b border-[#E8E8EE] pb-16 md:pb-20 lg:pb-24">
          <article
            className="space-y-4 text-[0.9375rem] leading-[1.75] text-[#444444] [&_a]:text-[#413CC0] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-[#E1E1E1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_figure]:my-8 [&_h2]:pt-6 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-[#444444] [&_h3]:pt-4 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-[#444444] [&_img]:h-auto [&_img]:w-full [&_img]:rounded-md [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-dashed border-[#E1E1E1] pt-8 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
              <span className="text-[#5B35E0] text-sm">Read more about :</span>
              {tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-2 text-sm">
                  {i > 0 && (
                    <span className="text-[#444444] font-sans font-semibold">/</span>
                  )}
                  <Link
                    href="/blog"
                    className="text-[#444444] font-sans font-semibold transition-colors hover:text-[#413CC0]"
                  >
                    {tag}
                  </Link>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
};

export default Content;
