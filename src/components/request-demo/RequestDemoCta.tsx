"use client";

import Button, { type ButtonStyleProps } from "@/components/common/Button";
import { isRequestDemoLabel } from "@/lib/requestDemo";

type RequestDemoCtaProps = {
  label: string;
  href: string;
} & ButtonStyleProps;

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function RequestDemoCta({ label, href, ...props }: RequestDemoCtaProps) {
  const destination = isRequestDemoLabel(label) ? "/contact" : href;
  const external = isExternalHref(destination);

  return (
    <Button
      href={destination}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...props}
    >
      {label}
    </Button>
  );
}
