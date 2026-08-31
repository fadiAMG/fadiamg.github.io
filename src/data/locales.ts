import type { Content } from "./types";
import { en } from "./content.en";
import { de } from "./content.de";

export type Lang = "en" | "de";

/**
 * Plain data, deliberately outside the client boundary: server files
 * (layouts, metadata) need these too, and importing them from a "use client"
 * module drags a React context definition into the server graph.
 */
export const LOCALES: Record<Lang, Content> = { en, de };

/** Site-root-relative path for a locale. English is the canonical root. */
export const pathFor = (lang: Lang) => (lang === "en" ? "/" : "/de/");
