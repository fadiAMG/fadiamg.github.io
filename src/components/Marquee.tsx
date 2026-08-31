"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useAnimationFrame, useScroll, useVelocity, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/**
 * Velocity-reactive ticker.
 *
 * The strip drifts continuously, but scroll velocity feeds into its speed and
 * direction — scroll down and it runs faster, scroll up and it reverses. That
 * coupling is what separates a marquee that feels alive from one that just
 * loops.
 *
 * The content is duplicated once and the transform wraps at -50%, so the seam
 * is never visible.
 */
export default function Marquee({
  items,
  baseVelocity = 28,
}: {
  items: string[];
  baseVelocity?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduced = usePrefersReducedMotion();

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  const direction = useRef(1);
  const width = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (track.current) width.current = track.current.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (reduced || !width.current) return;
    const v = smooth.get();
    direction.current = v < -1 ? -1 : v > 1 ? 1 : direction.current;

    // Base drift plus a scroll-velocity boost, framerate-independent.
    const boost = Math.min(Math.abs(v) / 220, 3.4);
    let next = x.get() - ((baseVelocity * (1 + boost)) / 1000) * delta * direction.current;

    // Wrap within one copy's width so the loop is seamless in both directions.
    if (next <= -width.current) next += width.current;
    if (next > 0) next -= width.current;
    x.set(next);
    if (track.current) track.current.style.transform = `translate3d(${next}px,0,0)`;
  });

  const row = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      data-decor
      className="relative overflow-hidden border-y border-hair py-[clamp(14px,2.4vh,26px)]"
    >
      <div ref={track} className="flex w-max will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-[clamp(16px,2.6vw,42px)] font-display text-[clamp(22px,3.4vw,52px)] font-extrabold uppercase tracking-[-0.02em]">
              {item}
            </span>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${i % 2 ? "bg-ink2" : "bg-ink1"}`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
