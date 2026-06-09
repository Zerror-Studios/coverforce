import React from "react";
import Container from "../common/Container";
import Button from "../common/Button";

const DistributionFlow = () => {
  return (
    <section className="bg-white">
      <Container borderColor="#53535340">
        <div className="relative z-10 pt-16 md:pt-20 lg:pt-24 lg:pt-24">
          <div className="flex justify-between">
           <div>
           <h2 className="mt-5 text-3xl font-heading font-medium leading-[1.12] tracking-tight text-[#424242] md:text-4xl lg:text-[1.625rem] lg:leading-[1.12]">
              Built to streamline <br /> commercial insurance workflows
            </h2>
            <Button
                  href="/"
                  variant="primary"
                  className="!bg-[#5B35E0] text-white mt-6"
                >
                  start a quote
                </Button>
           </div>
            <p className="mt-4 max-w-md font-sans font-regular text-sm leading-[1.4] text-[#50617a] md:text-[1.125rem]">
              Upload emails and documents to instantly extract insurance-ready
              data with AI.
            </p>
          </div>
        </div>
      </Container>

    </section>
  );
};

export default DistributionFlow;
