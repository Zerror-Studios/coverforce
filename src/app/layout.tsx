import "../styles/globals.css";
import SiteLayout from "@/components/common/SiteLayout";
import { createRootMetadata } from "@/lib/seo";
import { getMegaMenuBlogData } from "@/lib/megaMenuBlogs";
import type { ReactNode } from "react";
import type { Viewport } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";

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
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body suppressHydrationWarning>
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
