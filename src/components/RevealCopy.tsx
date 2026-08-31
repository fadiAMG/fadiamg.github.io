"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/**
 * Word-by-word reading reveal.
 *
 * Triggered by entering the viewport, not by scroll position.
 *
 * The scroll-linked version this replaces mapped the paragraph's own
 * scrollYProgress to word opacity, which works in a normally-scrolling page
 * and fails completely inside the horizontal deck: the chapter panel is
 * sticky, so it never moves vertically, the progress value never advances, and
 * the words freeze part-way through the reveal forever.
 *
 * An in-view trigger has no such dependency — it behaves the same in the deck
 * and in the vertical fallback.
 *
 * Every word is a real word separated by a real space, so the text stays
 * selectable and screen readers get the sentence, not a stream of fragments.
 */
export default function RevealCopy({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  // `once` so the copy never re-dims after it has been read — re-running the
  // reveal on every re-entry reads as a glitch.
  const inView = useInView(ref, { once: true, amount: 0.25 });

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0.14, y: "0.14em" }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.14, y: "0.14em" }}
            transition={{
              duration: 0.5,
              delay: i * 0.022,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </p>
  );
}
