"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

/**
 * Magnetic hover: the child drifts toward the pointer while it's nearby, then
 * springs back on exit. Pure transform, so it never triggers layout.
 *
 * The element keeps its real hit area — only the paint moves — so clicking
 * still works exactly where the browser says it does.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  radius = 90,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (dist < reach) {
        const falloff = 1 - dist / reach;
        tx = dx * strength * falloff;
        ty = dy * strength * falloff;
      } else {
        tx = 0;
        ty = 0;
      }
    };
    const onLeave = () => { tx = 0; ty = 0; };

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform =
        Math.abs(cx) < 0.01 && Math.abs(cy) < 0.01
          ? ""
          : `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [reduced, strength, radius]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
