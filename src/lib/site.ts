import type { Metadata } from "next";
import { LOCALES, type Lang } from "@/data/locales";

/** Swap for a custom domain later if one is added in GitHub Pages settings. */
export const SITE_URL = "https://fadiamg.github.io";

const TITLES: Record<Lang, string> = {
  en: "Fadi Thomas — Product Engineer · AI-Powered Products",
  de: "Fadi Thomas — Product Engineer · KI-gestützte Produkte",
};

/**
 * Per-locale metadata.
 *
 * `alternates.languages` emits the hreflang pair that tells search engines the
 * two URLs are translations of one another rather than duplicates — without it
 * they compete instead of complementing each other. `x-default` points at the
 * English root for visitors whose language matches neither.
 */
export function metadataFor(lang: Lang): Metadata {
  const t = LOCALES[lang];
  const url = lang === "en" ? SITE_URL : `${SITE_URL}/de`;
  return {
    metadataBase: new URL(SITE_URL),
    title: TITLES[lang],
    description: t.ui.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        en: SITE_URL,
        de: `${SITE_URL}/de`,
        "x-default": SITE_URL,
      },
    },
    openGraph: {
      type: "profile",
      title: TITLES[lang],
      description: t.identity.hook,
      url,
      siteName: "Fadi Thomas",
      locale: lang === "de" ? "de_DE" : "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: TITLES[lang],
      description: t.identity.hook,
    },
  };
}

export const viewport = { width: "device-width", initialScale: 1 };
