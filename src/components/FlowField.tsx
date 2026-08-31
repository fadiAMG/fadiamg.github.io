"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";
import { useChapter } from "@/lib/chapter";

/**
 * Generative flow-field backdrop.
 *
 * Particles are advected through a smoothly-varying vector field derived from
 * seeded value noise, tracing curved paths that accumulate into a soft weave.
 * The field itself never renders — only the trails particles leave in it.
 *
 * Cheap by construction: one canvas, no per-frame allocation, trails dissolve
 * via a destination-out wash rather than a full clear, and the loop parks
 * itself whenever its chapter is not the one in frame, the canvas is off
 * screen, or the tab is hidden.
 */

/** Seeded value noise — deterministic, so the composition is stable per load. */
function makeNoise(seed: number) {
  const p = new Uint8Array(512);
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const fade = (t: number) => t * t * (3 - 2 * t);
  const grad = (h: number, x: number, y: number) => {
    switch (h & 3) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      default: return -x - y;
    }
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];
    const x1 = grad(aa, xf, yf) + u * (grad(ba, xf - 1, yf) - grad(aa, xf, yf));
    const x2 = grad(ab, xf, yf - 1) + u * (grad(bb, xf - 1, yf - 1) - grad(ab, xf, yf - 1));
    return x1 + v * (x2 - x1);
  };
}

type P = { x: number; y: number; px: number; py: number; life: number; hue: number };

const COUNT = 220;
const NOISE_SCALE = 0.0016;
const SPEED = 0.72;
const MAX_LIFE = 380;

export default function FlowField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const { active, inDeck } = useChapter();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const noise = makeNoise(20260828);
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;
    let visible = !inDeck || active;
    const particles: P[] = [];

    // Palette is read from the live CSS custom properties, so the field
    // re-inks itself when the theme flips without re-mounting.
    let inks: string[] = [];
    const readInks = () => {
      const cs = getComputedStyle(document.documentElement);
      inks = [
        cs.getPropertyValue("--ink1").trim() || "#1b34c4",
        cs.getPropertyValue("--ink2").trim() || "#c6300b",
      ];
    };
    // The canvas stays fully transparent. Trails are erased with a
    // destination-out wash rather than painted over with the page colour —
    // filling with --bg would tint everything underneath and shift the palette.
    const readBg = () => {};

    const reset = (p: P, first = false) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.px = p.x;
      p.py = p.y;
      p.life = first ? Math.random() * MAX_LIFE : 0;
      p.hue = Math.random() < 0.78 ? 0 : 1;
    };

    const resize = () => {
      // Capped at 1.5 rather than 2: this is a diffuse texture, so the extra
      // pixels cost fill-rate every frame and buy nothing visible.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readInks();
      ctx.clearRect(0, 0, w, h);
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const p: P = { x: 0, y: 0, px: 0, py: 0, life: 0, hue: 0 };
        reset(p, true);
        particles.push(p);
      }
    };

    const step = (advance: boolean) => {
      // Erase a little of what's already drawn each frame. destination-out
      // subtracts alpha, so old trails dissolve back to transparent instead of
      // being painted over with an opaque colour.
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 0.055;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      ctx.lineWidth = 1;
      for (const p of particles) {
        const angle =
          noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE) * Math.PI * 2 +
          noise(p.y * NOISE_SCALE * 0.6, t * 0.00035) * 1.6;

        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(angle) * SPEED;
        p.y += Math.sin(angle) * SPEED;
        p.life++;

        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20 || p.life > MAX_LIFE) {
          reset(p);
          continue;
        }

        // Fade in and out over the particle's life so trails never pop.
        const fade = Math.min(p.life / 45, 1) * Math.min((MAX_LIFE - p.life) / 90, 1);
        ctx.globalAlpha = 0.085 * fade;
        ctx.strokeStyle = inks[p.hue];
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (advance) t++;
    };

    const loop = () => {
      if (visible) step(true);
      raf = requestAnimationFrame(loop);
    };

    resize();

    if (reduced) {
      // Static composition: run the simulation forward without animating,
      // so the texture is present but nothing moves.
      for (let i = 0; i < 200; i++) step(true);
      return () => {};
    }

    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // In the deck the sticky panel is always technically on screen, so an
    // IntersectionObserver alone would never park the loop — the canvas would
    // repaint for the whole visit. Chapter activity is the real signal there.
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting && (!inDeck || active); },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    // Must re-apply the chapter gate, not just the tab state — otherwise
    // returning to the tab would restart the loop for every chapter at once.
    const onVisibility = () => { visible = !document.hidden && (!inDeck || active); };
    document.addEventListener("visibilitychange", onVisibility);

    const themeObserver = new MutationObserver(() => { readInks(); readBg(); });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, active, inDeck]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-decor
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
