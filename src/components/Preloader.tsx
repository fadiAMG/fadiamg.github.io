"use client";

import { useEffect, useRef, useState } from "react";
import { animate, utils } from "animejs";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/**
 * Entry curtain: a counter runs 0→100 while two panels hold the viewport, then
 * they part vertically to reveal the page.
 *
 * Constraints that matter more than the effect:
 *  - It never blocks content. The page renders underneath immediately; this is
 *    an overlay, so a stalled script can't leave a blank site.
 *  - It runs once per session (sessionStorage), not once per navigation — a
 *    curtain on every visit is charming once and irritating thereafter.
 *  - Skipped entirely under reduced motion.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(true);

  useEffect(() => {
    if (reduced) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro") === "1";
    } catch {
      // Private mode or blocked storage — treat as seen and skip the curtain
      // rather than risk showing it on every single navigation.
      seen = true;
    }
    // Deliberate setState-in-effect. Whether the curtain shows depends on two
    // things that don't exist during SSR — sessionStorage and a media query —
    // so it must render absent on the server and on the hydrating render, then
    // appear once mounted. Deriving it during render would mismatch hydration.
    // Same rationale as the documented disable in Contact.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!seen) setDone(false);
  }, [reduced]);

  useEffect(() => {
    // `reduced` is false on the very first client render (useSyncExternalStore
    // serves getServerSnapshot during hydration) and only flips to true
    // afterwards. So the curtain can already be mounted by the time we learn
    // the user wants reduced motion — in which case tear it down immediately
    // rather than returning early and stranding it on screen forever.
    if (reduced) {
      if (!done) {
        document.documentElement.style.overflow = "";
        try { sessionStorage.setItem("intro", "1"); } catch { /* non-fatal */ }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDone(true);
      }
      return;
    }
    if (done) return;
    const el = root.current;
    const counter = num.current;
    if (!el || !counter) return;

    document.documentElement.style.overflow = "hidden";
    const finish = () => {
      document.documentElement.style.overflow = "";
      try { sessionStorage.setItem("intro", "1"); } catch { /* non-fatal */ }
      setDone(true);
    };

    const value = { n: 0 };
    animate(value, {
      n: 100,
      duration: 1500,
      ease: "inOut(2.4)",
      onUpdate: () => {
        counter.textContent = String(Math.round(value.n)).padStart(3, "0");
      },
      onComplete: () => {
        animate(".intro-panel", {
          scaleY: [1, 0],
          duration: 900,
          delay: utils.stagger(90),
          ease: "inOut(4)",
        });
        animate(".intro-meta", {
          opacity: [1, 0],
          y: [0, -18],
          duration: 420,
          ease: "out(3)",
          onComplete: finish,
        });
      },
    });

    // Safety valve: if anything above throws or is interrupted, never leave the
    // page scroll-locked behind an overlay.
    const bail = window.setTimeout(finish, 4200);
    return () => {
      window.clearTimeout(bail);
      document.documentElement.style.overflow = "";
    };
  }, [done, reduced]);

  if (done) return null;

  return (
    <div ref={root} aria-hidden="true" data-decor className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 flex flex-col">
        <div className="intro-panel h-1/2 origin-top bg-fg" />
        <div className="intro-panel h-1/2 origin-bottom bg-fg" />
      </div>
      <div className="intro-meta absolute inset-0 flex items-end justify-between px-[clamp(18px,5vw,64px)] pb-[clamp(24px,6vh,60px)] font-mono text-[11px] uppercase tracking-[0.18em] text-on-ink">
        <span>Fadi Thomas — Portfolio</span>
        <span ref={num} className="text-[clamp(48px,12vw,140px)] leading-none tracking-tight">
          000
        </span>
      </div>
    </div>
  );
}
