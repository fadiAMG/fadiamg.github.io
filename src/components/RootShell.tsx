import Script from "next/script";
import { display, mono, body as bodyFont } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import { LOCALES, type Lang } from "@/data/locales";

/**
 * Shared <html>/<body> shell.
 *
 * Each locale has its own root layout (via route groups) purely so that
 * `<html lang>` is correct in the served HTML rather than patched in after
 * hydration — it drives screen-reader pronunciation and is a language signal
 * for crawlers. Everything else is identical, so it lives here once.
 */
export default function RootShell({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const t = LOCALES[lang];
  return (
    <html
      lang={lang}
      className={`${display.variable} ${mono.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body className="relative overflow-x-hidden bg-bg text-fg">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink1 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-on-ink"
        >
          {t.ui.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
