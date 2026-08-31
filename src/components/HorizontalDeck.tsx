"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/**
 * Horizontal chapter spine.
 *
 * A tall spacer provides the scroll distance; a sticky viewport inside it holds
 * the track, and vertical scroll progress is mapped to horizontal translation.
 * Wheel, trackpad, scrollbar, keyboard and touch all keep working because the
 * page is still, mechanically, scrolling down — nothing is hijacked.
 *
 * Falls back to ordinary vertical stacking when the viewport is narrow, the
 * pointer is coarse, or reduced motion is requested. Horizontal scroll is
 * actively hostile on phones and to anyone navigating by keyboard alone, so the
 * fallback is the default and the spine is the enhancement.
 */

const DESKTOP = "(min-width: 1024px) and (pointer: fine)";

/**
 * Vertical scroll distance, in vh, spent crossing one chapter. Lower means
 * less scrolling per chapter; too low and the travel feels twitchy. This is
 * the single knob for how laborious the deck feels.
 */
const TRAVEL_VH = 82;

/** How close to a chapter counts as "arrived" and needs no snap, in progress units. */
const SNAP_EPSILON = 0.02;

function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => false, // server: assume the safe, vertical layout
  );
}

export type Chapter = {
  id: string;
  label: string;
  node: React.ReactNode;
  /**
   * How many viewports wide this chapter is. Dense chapters get 2 so their
   * content can breathe instead of being clipped by the panel height.
   */
  span?: 1 | 2;
};

export default function HorizontalDeck({ chapters }: { chapters: Chapter[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  // True while we are driving the scroll ourselves, so the settle handler
  // doesn't fight its own smooth-scroll.
  const snapping = useRef(false);

  const totalSpan = chapters.reduce((n, c) => n + (c.span ?? 1), 0);
  const reduced = usePrefersReducedMotion();
  const desktop = useDesktop();
  const horizontal = desktop && !reduced;

  // Derived, not stored: zeroing the measured distance via setState inside the
  // measure effect would be a cascading render for no gain.
  const effectiveDistance = horizontal ? distance : 0;

  const { scrollYProgress } = useScroll({ target: outer });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -effectiveDistance]);
  // Stiffer and lighter than before: the old spring kept drifting for a beat
  // after the wheel stopped, which read as the page still deciding where it
  // wanted to be.
  const x = useSpring(rawX, { stiffness: 420, damping: 46, mass: 0.28 });

  // Measure how far the track has to travel: its full width minus one viewport.
  useEffect(() => {
    if (!horizontal) return;
    const measure = () => {
      const t = track.current;
      if (!t) return;
      setDistance(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [horizontal, chapters.length]);

  useEffect(() => {
    if (!horizontal) return;
    const unsub = scrollYProgress.on("change", (p) => {
      // Chapters are unevenly wide, so map progress through cumulative span
      // rather than dividing the track into equal slices.
      const travelled = p * (totalSpan - 1);
      let acc = 0;
      let idx = 0;
      for (let i = 0; i < chapters.length; i++) {
        const w = chapters[i].span ?? 1;
        if (travelled < acc + w - 0.5) { idx = i; break; }
        acc += w;
        idx = i;
      }
      setActive(idx);
    });
    return unsub;
  }, [horizontal, scrollYProgress, chapters, totalSpan]);

  /** Document scroll position at which chapter `i` is exactly in frame. */
  const scrollTopFor = useCallback(
    (i: number) => {
      const el = outer.current;
      if (!el) return 0;
      const travel = el.offsetHeight - window.innerHeight;
      const before = chapters.slice(0, i).reduce((n, c) => n + (c.span ?? 1), 0);
      const frac = totalSpan > 1 ? before / (totalSpan - 1) : 0;
      return el.offsetTop + Math.min(frac, 1) * travel;
    },
    [chapters, totalSpan],
  );

  const goTo = useCallback(
    (i: number) => {
      if (!outer.current) return;
      if (!horizontal) {
        document.getElementById(chapters[i].id)?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      snapping.current = true;
      window.scrollTo({ top: scrollTopFor(i), behavior: "smooth" });
      window.setTimeout(() => { snapping.current = false; }, 700);
    },
    [horizontal, chapters, scrollTopFor],
  );

  /**
   * Settle onto the nearest chapter once scrolling stops.
   *
   * Without this you can come to rest halfway between two chapters, looking at
   * the tail of one and the head of the next with dead space between them —
   * and every chapter costs a full screen of scrolling to cross, so most
   * scrolling is spent in that in-between state.
   *
   * Done in JS rather than CSS scroll-snap deliberately: `scroll-snap-type:
   * mandatory` on the scroll root fights the sticky viewport this deck is
   * built on, and `proximity` fires too inconsistently to rely on. Snapping
   * only after scrolling has stopped never interrupts an active gesture.
   */
  useEffect(() => {
    if (!horizontal) return;
    let timer = 0;

    const settle = () => {
      if (snapping.current) return;
      const p = scrollYProgress.get();
      const travelled = p * (totalSpan - 1);

      // Nearest chapter by cumulative span.
      let best = 0;
      let bestDist = Infinity;
      let acc = 0;
      for (let i = 0; i < chapters.length; i++) {
        const d = Math.abs(travelled - acc);
        if (d < bestDist) { bestDist = d; best = i; }
        acc += chapters[i].span ?? 1;
      }

      const target = scrollTopFor(best);
      if (Math.abs(window.scrollY - target) < window.innerHeight * SNAP_EPSILON) return;

      snapping.current = true;
      window.scrollTo({ top: target, behavior: "smooth" });
      window.setTimeout(() => { snapping.current = false; }, 700);
    };

    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [horizontal, scrollYProgress, chapters, totalSpan, scrollTopFor]);

  // Arrow keys step between chapters, but only when focus isn't in a control —
  // otherwise we'd steal arrow keys from anything interactive.
  useEffect(() => {
    if (!horizontal) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(Math.min(active + 1, chapters.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(Math.max(active - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [horizontal, active, chapters.length, goTo]);

  if (!horizontal) {
    return (
      <>
        {chapters.map((c) => (
          <section key={c.id} id={c.id}>
            {c.node}
          </section>
        ))}
      </>
    );
  }

  return (
    <>
      <div ref={outer} style={{ height: `${totalSpan * TRAVEL_VH}vh` }} className="relative">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex h-full w-max will-change-transform">
            {chapters.map((c) => (
              <section
                key={c.id}
                id={c.id}
                style={{ width: `${(c.span ?? 1) * 100}vw` }}
                className="relative flex h-full shrink-0 flex-col justify-center overflow-hidden px-[clamp(24px,5vw,80px)] pb-[clamp(90px,12vh,130px)] pt-[clamp(70px,10vh,110px)]"
              >
                {c.node}
              </section>
            ))}
          </motion.div>
        </div>
      </div>

      <ChapterIndex chapters={chapters} active={active} onSelect={goTo} />
    </>
  );
}

function ChapterIndex({
  chapters,
  active,
  onSelect,
}: {
  chapters: Chapter[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav
      aria-label="Chapters"
      className="fixed bottom-[clamp(20px,4vh,44px)] left-1/2 z-[70] hidden -translate-x-1/2 items-center gap-1 border border-hair bg-bg/80 px-2 py-2 backdrop-blur lg:flex"
    >
      {chapters.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-current={i === active ? "true" : undefined}
          className={`group relative flex min-h-11 items-center gap-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
            i === active ? "text-fg" : "text-dim hover:text-ink2"
          }`}
        >
          <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <span className={i === active ? "opacity-100" : "opacity-0 lg:opacity-70"}>
            {c.label}
          </span>
          {i === active && (
            <motion.span
              layoutId="chapter-underline"
              className="absolute inset-x-2 bottom-1 h-px bg-ink2"
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
