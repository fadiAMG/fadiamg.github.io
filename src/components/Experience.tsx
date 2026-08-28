"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { svg as animeSvg, type DrawableSVGGeometry } from "animejs";
import SectionHeading from "./SectionHeading";
import ExperienceNode from "./ExperienceNode";
import { usePrefersReducedMotion } from "@/lib/motion-preference";
import { experience } from "@/data/resume";

const SPINE_PATH =
  "M60 4 L30 46 L88 86 L26 128 L94 170 L34 210 L82 250 L40 290 C 50 336 72 356 58 398 C 46 440 68 460 60 500 C 54 540 62 556 60 596 L60 1000";

export default function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const drawableRef = useRef<DrawableSVGGeometry | null>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.82", "end 0.82"],
  });

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    if (reduced) {
      drawableRef.current = null;
      pathEl.setAttribute("stroke-dasharray", "none");
      pathEl.setAttribute("stroke-dashoffset", "0");
      return;
    }

    const [drawable] = animeSvg.createDrawable(pathEl, 0, 0);
    drawableRef.current = drawable;
  }, [reduced]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const drawable = drawableRef.current;
    if (!drawable) return;
    const clamped = Math.max(0, Math.min(1, value));
    drawable.setAttribute("draw", `0 ${clamped}`);
  });

  return (
    <section id="experience" className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(48px,9vh,110px)]">
      <SectionHeading
        number="03"
        label="Experience"
        trailing={
          <span data-print-hide className="ml-auto text-dim">
            Tap a role to expand
          </span>
        }
      />

      <div
        ref={wrapRef}
        className="relative mt-[clamp(32px,6vh,72px)] grid grid-cols-[clamp(34px,6vw,92px)_1fr] gap-x-[clamp(14px,3vw,44px)]"
      >
        <svg
          data-decor
          aria-hidden="true"
          viewBox="0 0 120 1000"
          preserveAspectRatio="none"
          className="absolute left-0 top-0 h-full w-[clamp(34px,6vw,92px)]"
        >
          <path
            ref={pathRef}
            d={SPINE_PATH}
            fill="none"
            stroke="var(--ink1)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {experience.map((role, i) => (
          <ExperienceNode key={role.company + role.dates} role={role} isLast={i === experience.length - 1} />
        ))}
      </div>
    </section>
  );
}
