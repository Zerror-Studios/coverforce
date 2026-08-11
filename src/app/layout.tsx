import "../styles/globals.css";
import SiteLayout from "@/components/common/SiteLayout";
import JsonLd from "@/components/common/JsonLd";
import { createRootMetadata } from "@/lib/seo";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/jsonLd";
import { getMegaMenuBlogData } from "@/lib/megaMenuBlogs";
import type { ReactNode } from "react";
import type { Viewport } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

type RootLayoutProps = {
  children: ReactNode;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const megaMenuBlogData = await getMegaMenuBlogData();

  return (
    <ViewTransitions>
      <html lang="en-US" className={cn("font-sans", geist.variable)}>
        <head>
          <Script
            id="cookieyes"
            src="https://cdn-cookieyes.com/client_data/e14d3cac29528160d6d1925ec7368161/script.js"
            strategy="beforeInteractive"
          />
        </head>
        <body suppressHydrationWarning>
          <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{if("scrollRestoration"in history)history.scrollRestoration="manual";if(!window.location.hash){window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;}}catch(e){}})();`,
            }}
          />
          <SiteLayout megaMenuBlogData={megaMenuBlogData}>{children}</SiteLayout>
        </body>
      </html>
    </ViewTransitions>
  );
}

export const metadata = createRootMetadata();
export const revalidate = 3600;
