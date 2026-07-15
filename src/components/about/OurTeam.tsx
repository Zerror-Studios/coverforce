"use client";

import Container from "@/components/common/Container";
import EyebrowPill from "@/components/common/EyebrowPill";
import { MarqueeRow } from "@/components/solutions/wholesalers/MarqueeLine";

const OurTeam = () => {
  return (
    <section className="relative overflow-hidden bg-[#151f4d] text-white">
      <Container borderColor="#FFFFFF33">
        <div className="py-16 md:py-20 lg:py-24">
          <EyebrowPill surface="dark" className="mb-0">
            Our Team Comes From
          </EyebrowPill>

          <div className="mt-8 md:mt-12 lg:mt-14">
            <MarqueeRow tone="light" size="large" />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurTeam;
