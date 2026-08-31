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

  const totalSpan = chapters.reduce((n, c) => n + (c.span ?? 1), 0);
  const reduced = usePrefersReducedMotion();
  const desktop = useDesktop();
  const horizontal = desktop && !reduced;

  // Derived, not stored: zeroing the measured distance via setState inside the
  // measure effect would be a cascading render for no gain.
  const effectiveDistance = horizontal ? distance : 0;

  const { scrollYProgress } = useScroll({ target: outer });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -effectiveDistance]);
  const x = useSpring(rawX, { stiffness: 260, damping: 42, mass: 0.4 });

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

  const goTo = useCallback(
    (i: number) => {
      const el = outer.current;
      if (!el) return;
      if (!horizontal) {
        document.getElementById(chapters[i].id)?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      const top = el.offsetTop;
      const travel = el.offsetHeight - window.innerHeight;
      const before = chapters.slice(0, i).reduce((n, c) => n + (c.span ?? 1), 0);
      const frac = totalSpan > 1 ? before / (totalSpan - 1) : 0;
      window.scrollTo({ top: top + Math.min(frac, 1) * travel, behavior: "smooth" });
    },
    [horizontal, chapters, totalSpan],
  );

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
      <div ref={outer} style={{ height: `${totalSpan * 105}vh` }} className="relative">
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
