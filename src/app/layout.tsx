import type { Metadata } from "next";
import Script from "next/script";
import { display, mono, body } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// Swap this for a custom domain later if you add one in GitHub Pages settings.
const siteUrl = "https://fadiamg.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fadi Thomas — Product Engineer · AI-Powered Products",
  description:
    "Product Engineer working at the intersection of product, AI and engineering. Frankfurt am Main, Germany. Open to product- and AI-focused engineering roles in Germany and the EU.",
  openGraph: {
    type: "profile",
    title: "Fadi Thomas — Product Engineer · AI-Powered Products",
    description: "I build the parts of a product where the business logic is messiest.",
    url: siteUrl,
    siteName: "Fadi Thomas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fadi Thomas — Product Engineer · AI-Powered Products",
    description: "I build the parts of a product where the business logic is messiest.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="relative overflow-x-hidden bg-bg text-fg">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink1 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-on-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
