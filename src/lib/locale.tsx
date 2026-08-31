"use client";

import { createContext, useContext } from "react";
import type { Content } from "@/data/types";
import { LOCALES, type Lang } from "@/data/locales";

export { pathFor } from "@/data/locales";
export type { Lang };

type Ctx = { lang: Lang; t: Content };

// Defaults to English so a component rendered outside a provider still has
// content rather than throwing — the site never renders blank because of a
// missing wrapper.
const LocaleContext = createContext<Ctx>({ lang: "en", t: LOCALES.en });

export function LocaleProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  // Constant for the lifetime of a statically-rendered page — each locale is
  // its own build output — so there is nothing to memoise.
  return (
    <LocaleContext.Provider value={{ lang, t: LOCALES[lang] }}>{children}</LocaleContext.Provider>
  );
}

/** All content and UI strings for the current locale. */
export function useLocale() {
  return useContext(LocaleContext);
}
