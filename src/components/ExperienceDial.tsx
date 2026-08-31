"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { experience } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/**
 * Experience as a rotating dial.
 *
 * Roles sit on the arc of a large circle whose centre is off-screen to the
 * left. Selecting one rotates the arc until it reaches the reading line, and
 * its detail expands sideways into the panel on the right.
 *
 * Why a dial rather than an accordion: the chapter panel is exactly one
 * viewport tall, and an accordion grows downward — the one direction with no
 * room. Rotation consumes no vertical space at all, and the detail expands
 * into horizontal space the panel already has.
 *
 * Everything is sized from the panel's own height, so the whole component
 * always fits its chapter regardless of how many roles there are.
 */

const RADIUS = 1250; // px — large, so the arc reads as a gentle curve
const STEP = 4.2; // degrees between adjacent roles — small enough that the
// furthest visible role (±3) still lands inside the panel, since vertical
// offset grows as RADIUS·sin(θ) and the panel is only one viewport tall.

export default function ExperienceDial() {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const role = experience[active];

  const go = useCallback((i: number) => {
    setActive(Math.max(0, Math.min(experience.length - 1, i)));
  }, []);

  // Up/Down step the dial while focus is inside it. Left/Right are left alone
  // because the surrounding deck uses them to move between chapters.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); go(active + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); go(active - 1); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [active, go]);

  return (
    <div className="grid h-full w-full grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-[clamp(24px,4vw,72px)]">
      {/* ---------------- dial ---------------- */}
      <div className="relative h-full min-h-0">
        {/* the reading line: where the active role comes to rest */}
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute left-0 top-1/2 z-0 flex w-full -translate-y-1/2 items-center gap-3"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-ink2" />
          <span className="h-px flex-1 bg-hair" />
        </div>

        <div
          ref={listRef}
          role="listbox"
          aria-label="Roles"
          aria-activedescendant={`role-${active}`}
          tabIndex={0}
          className="relative h-full w-full outline-none"
        >
          {experience.map((r, i) => {
            const offset = i - active;
            const angle = offset * STEP;
            const rad = (angle * Math.PI) / 180;
            // Polar placement about a centre far to the left, so items travel
            // along an arc instead of a straight column.
            const dx = RADIUS * Math.cos(rad) - RADIUS;
            const dy = RADIUS * Math.sin(rad);
            const distance = Math.abs(offset);
            const isActive = offset === 0;

            return (
              <motion.button
                key={r.company + r.dates}
                id={`role-${i}`}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => go(i)}
                animate={{ x: dx, y: dy, rotate: angle, opacity: distance > 3 ? 0 : 1 - distance * 0.2 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 190, damping: 26, mass: 0.7 }
                }
                style={{ transformOrigin: "left center" }}
                className="absolute left-0 top-1/2 flex w-full max-w-[38ch] -translate-y-1/2 flex-col items-start gap-0.5 text-left"
              >
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
                    isActive ? "text-ink2" : "text-dim"
                  }`}
                >
                  {r.dates}
                </span>
                <span
                  className={`font-display font-extrabold leading-[1.02] tracking-[-0.03em] transition-colors ${
                    isActive
                      ? "text-[clamp(19px,2.1vw,32px)] text-fg"
                      : "text-[clamp(15px,1.5vw,22px)] text-dim"
                  }`}
                >
                  {r.company}
                </span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.14em] ${
                    isActive ? "text-dim" : "text-dim/60"
                  }`}
                >
                  {r.title}
                </span>
              </motion.button>
            );
          })}
        </div>

        <p
          aria-hidden="true"
          className="absolute bottom-0 left-0 font-mono text-[9px] uppercase tracking-[0.16em] text-dim"
        >
          {String(active + 1).padStart(2, "0")} / {String(experience.length).padStart(2, "0")}
          <span className="ml-3 opacity-60">Select a role</span>
        </p>
      </div>

      {/* ---------------- detail, expanding sideways ---------------- */}
      <div className="relative h-full min-h-0 border-l border-hair pl-[clamp(16px,2.5vw,44px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0, x: -22, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 14 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col justify-center gap-[clamp(8px,1.4vh,16px)]"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
              <span className="text-ink2">{role.dates}</span>
              {role.location && <span>{role.location}</span>}
            </div>

            <h3 className="m-0 font-display text-[clamp(20px,2.4vw,38px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              {role.title}
            </h3>

            <p className="m-0 max-w-[52ch] text-[clamp(12px,1.05vw,15px)] leading-[1.5] text-dim">
              {role.summary}
            </p>

            {/* Only the first few responsibilities — the panel is one viewport
                tall and the CV carries the full record. */}
            <ul className="m-0 grid list-none gap-[clamp(5px,0.9vh,10px)] p-0">
              {role.owned.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[auto_1fr] gap-2.5 text-[clamp(11px,0.95vw,13.5px)] leading-[1.45]"
                >
                  <span aria-hidden="true" className="mt-[0.55em] block h-1 w-1 shrink-0 bg-ink1" />
                  <span className="max-w-[62ch]">{item}</span>
                </li>
              ))}
            </ul>

            {role.impact && (
              <p className="m-0 max-w-[54ch] border-l-2 border-ink2 pl-3 text-[clamp(11px,0.95vw,13.5px)] leading-[1.45]">
                {role.impact}
              </p>
            )}

            <p className="m-0 font-mono text-[9px] uppercase leading-[1.7] tracking-[0.12em] text-dim">
              {role.stack.join(" · ")}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
