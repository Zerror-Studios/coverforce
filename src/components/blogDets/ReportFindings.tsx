import Image from "next/image";
import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";

const SECTION_HEADING_CLASS =
  "font-heading text-2xl font-medium leading-[1.15] tracking-tight text-[#0a143b] sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]";

const CARD_TAGLINE_CLASS =
  "font-heading font-medium tracking-tight max-sm:text-lg max-sm:leading-[1.12] text-xl leading-[1.12] sm:text-xl lg:text-[1.625rem] lg:leading-[1.12] text-white";

export type ReportFindingCard = {
  badge: string;
  title: string;
  image: string;
  imageAlt: string;
};

type ReportFindingsProps = {
  title?: string;
  cards: ReportFindingCard[];
};

function FindingCard({ badge, title, image, imageAlt }: ReportFindingCard) {
  return (
    <article className="group relative aspect-[4/3] overflow-hidden rounded-md">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        aria-hidden
      />
      <div className="absolute left-5 top-5 md:left-6 md:top-6">
        <EyebrowPill surface="dark" className="mb-0">
          {badge}
        </EyebrowPill>
      </div>
      <h3 className={`absolute bottom-5 left-5 max-w-[50%] md:bottom-6 md:left-6 ${CARD_TAGLINE_CLASS}`}>
        {title}
      </h3>
    </article>
  );
}

export default function ReportFindings({
  title = "The Big Findings",
  cards,
}: ReportFindingsProps) {
  if (!cards.length) return null;

  return (
    <section className="bg-white text-[#444444]">
      <Container borderColor="#53535380">
        <div className="border-b border-[#E8E8EE] py-16 md:py-20 lg:py-24">
          <h2 className={`text-center ${SECTION_HEADING_CLASS}`}>
            {title}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 md:gap-5">
            {cards.map((card) => (
              <FindingCard key={card.badge} {...card} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
