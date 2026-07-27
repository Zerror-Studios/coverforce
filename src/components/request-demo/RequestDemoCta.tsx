"use client";

import Button, { type ButtonStyleProps } from "@/components/common/Button";
import { isRequestDemoLabel } from "@/lib/requestDemo";

type RequestDemoCtaProps = {
  label: string;
  href: string;
} & ButtonStyleProps;

export default function RequestDemoCta({ label, href, ...props }: RequestDemoCtaProps) {
  const destination = isRequestDemoLabel(label) ? "/contact" : href;

  return (
    <Button href={destination} {...props}>
      {label}
    </Button>
  );
}
