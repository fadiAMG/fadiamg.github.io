"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { animate, stagger, svg, utils } from "animejs";
import { useEffect } from "react";
import { generate, VIEWBOX, type ShapeName } from "@/lib/shapes";
import { usePrefersReducedMotion } from "@/lib/motion-preference";
import { useChapter } from "@/lib/chapter";

/**
 * Renders one generative pattern as inline SVG.
 *
 * Strokes are drawn on with anime.js `svg.createDrawable`, which animates
 * stroke-dashoffset — so the pattern draws itself into existence instead of
 * fading in. Filled primitives can't be drawn that way, so they scale in.
 *
 * Deterministic by construction (see lib/shapes.ts): identical markup on the
 * server and the client.
 */
export default function ShapeField({
  name,
  seed = 7,
  className = "",
  drift = 0,
  mask = "edges",
}: {
  name: ShapeName;
  seed?: number;
  className?: string;
  /** Parallax distance in px across the chapter's travel; 0 disables it. */
  drift?: number;
  /**
   * Where the pattern is allowed to be solid. Patterns are masked away from
   * the reading area — an unmasked field runs straight through body copy and
   * costs more legibility than it adds atmosphere.
   */
  mask?: "edges" | "right" | "left" | "none";
}) {
  const prims = useMemo(() => generate(name, seed), [name, seed]);
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { active } = useChapter();

  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, drift]);

  useEffect(() => {
    // Redraws whenever the chapter becomes active, so arriving at a chapter
    // draws its pattern on rather than showing one that finished long ago.
    if (reduced || !active) return;
    const el = wrap.current;
    if (!el) return;

    const strokes = el.querySelectorAll<SVGPathElement>("path, circle:not([data-fill])");
    const fills = el.querySelectorAll<SVGElement>("[data-fill]");

    utils.set(fills, { scale: 0, transformOrigin: "center" });

    // Stagger step is derived from the element count so the whole pattern
    // finishes inside a fixed window. A constant step meant the denser
    // generators (isometric emits ~300 paths) were still drawing four seconds
    // after arrival — far longer than anyone waits on a chapter.
    const stepFor = (n: number, windowMs: number) => (n > 1 ? windowMs / n : 0);

    const drawn = animate(svg.createDrawable(strokes), {
      draw: ["0 0", "0 1"],
      duration: 1100,
      delay: stagger(stepFor(strokes.length, 700), { from: "center" }),
      ease: "inOut(2)",
    });

    const popped = animate(fills, {
      scale: [0, 1],
      duration: 700,
      delay: stagger(stepFor(fills.length, 600), { from: "center" }),
      ease: "out(3)",
    });

    return () => {
      drawn.revert();
      popped.revert();
    };
  }, [reduced, active, name, seed]);

  const maskImage =
    mask === "none"
      ? undefined
      : mask === "right"
        ? "linear-gradient(to right, transparent 0%, transparent 38%, #000 88%)"
        : mask === "left"
          ? "linear-gradient(to left, transparent 0%, transparent 38%, #000 88%)"
          : "radial-gradient(ellipse 62% 54% at 50% 50%, transparent 15%, #000 100%)";

  return (
    <motion.div
      ref={wrap}
      aria-hidden="true"
      data-decor
      style={{
        ...(reduced || !drift ? {} : { x }),
        ...(maskImage ? { maskImage, WebkitMaskImage: maskImage } : {}),
      }}
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <svg viewBox={VIEWBOX} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="var(--ink1)" strokeLinecap="round">
          {prims.map((p, i) =>
            p.k === "path" ? (
              <path
                key={i}
                d={p.d}
                strokeWidth={p.w ?? 1.5}
                opacity={p.o ?? 0.4}
                stroke={p.accent ? "var(--ink2)" : "var(--ink1)"}
                {...(p.fill ? { fill: "currentColor", "data-fill": "" } : {})}
              />
            ) : (
              <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                opacity={p.o ?? 0.4}
                strokeWidth={p.fill ? 0 : 1.4}
                stroke={p.fill ? "none" : p.accent ? "var(--ink2)" : "var(--ink1)"}
                fill={p.fill ? (p.accent ? "var(--ink2)" : "var(--ink1)") : "none"}
                {...(p.fill ? { "data-fill": "" } : {})}
              />
            ),
          )}
        </g>
      </svg>
    </motion.div>
  );
}
