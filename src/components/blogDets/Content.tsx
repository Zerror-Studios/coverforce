import Link from "next/link";
import Container from "@/components/common/Container";

const TAGS = [
  "Insurtech",
  "Commercial Insurance",
  "APIs",
  "AI",
  "Automation",
  "Brokers",
  "Careers",
  "Industry News",
];

const Content = () => {
  return (
    <section className="bg-white text-[#444444]">
      <Container borderColor="#53535380" >
        <div className="mx-auto max-w-4xl border-b border-[#E8E8EE] pb-16 md:pb-20 lg:pb-24">
          <article className="space-y-4 text-[0.9375rem] leading-[1.75] text-[#444444] [&_a]:text-[#413CC0] [&_a]:underline [&_a]:underline-offset-2">
            <p>
              Today, CoverForce, the first independent API to deliver instant
              quotes and one-click binding from the leading insurance carriers,
              announced a partnership with insurance veteran, Great American
              Insurance Group, to give appointed agents and brokers nationwide
              digital access to their commercial insurance products. With this
              partnership, CoverForce is the first company to provide digital
              access to Great American&apos;s workers&apos; compensation,
              business owner&apos;s policy (BOP) and other commercial products.
            </p>

            <p>
              &ldquo;CoverForce brings market-leading one-click convenience,
              simplicity and error-free processing to the way retail and
              independent agents, brokers, wholesalers and carriers interact,
              while also providing them with the tools to manage those
              interactions,&rdquo; said Cyrus Karai, CEO and Co-Founder of
              CoverForce. &ldquo;We are proud to be one of Great American&apos;s
              largest alternative distribution partners, demonstrating that our
              solutions, built in lock-step with carriers, are developed for
              large wholesalers, brokerages and fintech groups at scale.&rdquo;
            </p>

            <p>
              Great American customers now have access to CoverForce&apos;s
              feature suite which also includes both its quote &amp; bind Agent
              Portal and Management Portal that syncs directly into top agency
              management systems. With CoverForce, agents and brokers can apply
              for appointments with Great American, while wholesalers can track
              submissions across all retail agencies from start to finish.
            </p>

            <p>
              Visit{" "}
              <a href="https://www.coverforce.com" target="_blank" rel="noreferrer">
                www.coverforce.com
              </a>{" "}
              or send an email to{" "}
              <a href="mailto:hello@coverforce.com">hello@coverforce.com</a>.
            </p>

            <h2 className="pt-6 font-heading text-xl font-medium tracking-tight text-[#444444]">
              About CoverForce
            </h2>
            <p>
              CoverForce has built a foundational, easy-to-integrate API that
              digitally connects agencies and corporate customers with insurance
              carriers. For agents, the company&apos;s core infrastructure and
              customized software enable instant quotes from top, best-fit
              carriers and one-click bind and pay. For carriers, the company
              unlocks new distribution channels and faster underwriting and
              sales, guaranteeing control over access and providing access
              through its customized enterprise software for agencies and robust
              APIs. CoverForce has integrations with leading insurance
              companies&nbsp;&mdash;&nbsp;Travelers, Liberty Mutual, Chubb and
              more&nbsp;&mdash;&nbsp;across all major commercial insurance lines,
              including general liability, BOP, workers&apos; compensation and
              cyber products.
            </p>
            <p>
              A product of the University of Pennsylvania&apos;s Innovation Fund,
              CoverForce has more than 3,500 users on its platform&nbsp;&mdash;&nbsp;thanks
              in part to investors and advisors from Nyca Partners, Nlari
              Capital, QED Investors, Microsoft and Uber. For more information,
              visit{" "}
              <a href="https://www.coverforce.com" target="_blank" rel="noreferrer">
                www.coverforce.com
              </a>
              .
            </p>

            <h2 className="pt-6 font-heading text-xl font-medium tracking-tight text-[#444444]">
              About Great American
            </h2>
            <p>
              For more than 150 years, customers have trusted us to protect what
              matters most to them. Great American Insurance Group&apos;s roots
              go back to 1872 with the founding of its flagship company, Great
              American Insurance Company. Our innovative and specialized
              insurance solutions are designed to serve niche marketplaces that
              we know well. With our deep expertise and financial strength, we
              have laid a foundation of success that has stood the test of time.
              Based in Cincinnati, Ohio, the operations of Great American
              Insurance Group are engaged in property and casualty insurance.
              With more than 30 specialty property and casualty insurance
              businesses, we&apos;re well-positioned to offer tailored insurance
              solutions to meet businesses&apos; unique needs. Great American
              Insurance Company has received an &ldquo;A&rdquo; (Excellent) or
              higher rating from the AM Best Company for 115 years (most recent
              rating evaluation of &ldquo;A+&rdquo; (Superior) affirmed December
              16, 2022).
            </p>

            <div className="pt-6 text-[#444444]">
              <p>CoverForce Media Relations:</p>
              <p>Caliber Corporate Advisers</p>
              <p>
                <a href="mailto:coverforcepr@calibercorporateadvisers.com">
                  coverforcepr@calibercorporateadvisers.com
                </a>
              </p>
            </div>
          </article>

          <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-dashed border-[#E1E1E1] pt-8 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
            <span className="text-[#5B35E0] text-sm">Read more about :</span>
            {TAGS.map((tag, i) => (
              <span key={tag} className="flex items-center gap-2 text-sm">
                {i > 0 && <span className="text-[#444444] font-sans font-semibold">/</span>}
                <Link
                  href="/blog"
                  className="text-[#444444] font-sans font-semibold transition-colors hover:text-[#413CC0]"
                >
                  {tag}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Content;
