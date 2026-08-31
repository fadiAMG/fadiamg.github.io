"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/** Thin progress rail pinned to the top of the viewport. */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 340,
    damping: 40,
    restDelta: 0.001,
  });
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      data-decor
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-ink2"
    />
  );
}
