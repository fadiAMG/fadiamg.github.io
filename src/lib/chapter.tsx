"use client";

import { createContext, useContext } from "react";

/**
 * Per-chapter activity signal.
 *
 * Every chapter in the deck mounts at page load, so anything that animates on
 * mount fires immediately — all eight at once, long before the visitor reaches
 * chapter six. Scrolling to a chapter then shows it already finished, and only
 * a reload makes it move.
 *
 * Chapters subscribe to this instead, and replay their entry animation each
 * time they become the active one.
 *
 * `inDeck` distinguishes the horizontal deck from the vertical fallback: in the
 * fallback there is no arrival event, so entry animations stay one-shot on
 * scroll-into-view.
 */
type ChapterCtx = {
  index: number;
  /** True while this chapter is the one in frame. */
  active: boolean;
  /** False in the vertical fallback layout. */
  inDeck: boolean;
};

// Defaults describe the fallback: always "active", not in a deck. A component
// used outside any chapter therefore behaves exactly as it did before.
const Ctx = createContext<ChapterCtx>({ index: 0, active: true, inDeck: false });

export function ChapterProvider({
  index,
  active,
  inDeck,
  children,
}: ChapterCtx & { children: React.ReactNode }) {
  return <Ctx.Provider value={{ index, active, inDeck }}>{children}</Ctx.Provider>;
}

export function useChapter() {
  return useContext(Ctx);
}
