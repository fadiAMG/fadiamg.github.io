"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { selectedWork } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/**
 * Hover-reveal project index.
 *
 * Rows are the primary content; hovering one lifts a floating panel that
 * follows the pointer with spring damping, and pushes the other rows down in
 * opacity. The panel is decorative — everything it shows is also in the row,
 * so nothing is hidden behind a hover state on touch or keyboard.
 */
export default function WorkGallery() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { damping: 26, stiffness: 260, mass: 0.5 });
  const py = useSpring(my, { damping: 26, stiffness: 260, mass: 0.5 });

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <div ref={wrap} onPointerMove={onMove} className="relative">
      <ul className="border-t border-hair">
        {selectedWork.map((project, i) => (
          <li key={project.title}>
            <div
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              className="group relative flex flex-col gap-3 border-b border-hair py-[clamp(22px,4vh,44px)] transition-opacity duration-500 md:flex-row md:items-baseline md:gap-8"
              style={{
                opacity: active === null || active === i ? 1 : 0.32,
              }}
            >
              <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink2">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="flex-1 font-display text-[clamp(26px,5vw,68px)] font-extrabold leading-[0.95] tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:group-hover:translate-x-3">
                {project.title}
              </h3>

              <p className="max-w-[46ch] text-[clamp(14px,1.3vw,17px)] leading-relaxed text-dim md:w-[38%]">
                {project.body}
              </p>

              <span
                aria-hidden="true"
                className="hidden shrink-0 font-mono text-lg text-dim transition-all duration-500 group-hover:translate-x-1 group-hover:text-ink1 md:block"
              >
                ↗
              </span>
            </div>
          </li>
        ))}
      </ul>

      {!reduced && (
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              aria-hidden="true"
              data-decor
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              // translateX/Y live in the same `transform` string Motion writes,
              // so the centring offset has to be declared here — a Tailwind
              // -translate-x-1/2 class would be overwritten and silently lost.
              style={{ x: px, y: py, translateX: "-50%", translateY: "-50%" }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
            >
              <div className="flex h-36 w-56 flex-col justify-between border border-ink1/30 bg-ink1 p-4 text-on-ink shadow-2xl">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-80">
                  {selectedWork[active].tag}
                </span>
                <span className="font-display text-2xl font-extrabold leading-[0.95] tracking-tight">
                  {selectedWork[active].title}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-80">
                  {selectedWork[active].stack.split(" · ")[0]}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
