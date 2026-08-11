import NotFoundPage from "@/components/common/NotFoundPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Page not found | CoverForce" },
  description:
    "This page isn't on our map. Head back home or browse popular CoverForce articles.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}
