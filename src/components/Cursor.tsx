"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";

const FINE = "(pointer: fine)";

/**
 * Subscribed as an external store rather than mirrored into state, so `enabled`
 * is derived during render. That avoids setState-in-effect entirely and keeps
 * the server snapshot (false) authoritative through hydration.
 */
function useFinePointer() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(FINE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(FINE).matches,
    () => false,
  );
}

/**
 * Custom cursor: a small dot that tracks the pointer exactly, plus a ring that
 * trails it with spring-like damping and swells over interactive elements.
 *
 * Deliberately additive — the real cursor stays visible. Hiding it is a common
 * awwwards trick and a common accessibility failure; if the JS stalls or a
 * pointer style is missed, the user is left with no cursor at all.
 *
 * Only mounts for devices with a fine pointer (mouse/trackpad), and never when
 * reduced motion is requested.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  // Both inputs are subscribed stores, so this recomputes on its own when the
  // user changes either preference — no effect, no stale mounted cursor.
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      const el = (e.target as HTMLElement)?.closest?.("a, button, [data-cursor]");
      targetScale = el ? 2.4 : 1;
      r.dataset.active = el ? "true" : "false";
    };

    const loop = () => {
      // Critically-damped follow — the ring lags the dot just enough to read
      // as weight without feeling laggy.
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;
      r.style.transform =
        `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => { d.style.opacity = "0"; r.style.opacity = "0"; };
    const onEnter = () => { d.style.opacity = "1"; r.style.opacity = "1"; };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" data-decor className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-ink2 transition-opacity duration-200"
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border border-fg/40 transition-[opacity,background-color,border-color] duration-200 data-[active=true]:border-ink1/70 data-[active=true]:bg-ink1/10"
      />
    </div>
  );
}
