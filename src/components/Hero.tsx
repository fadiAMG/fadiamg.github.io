"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, createSeededRandom } from "animejs";
import { identity } from "@/data/resume";

const COLS = 13;
const ROWS = 7;
const COUNT = COLS * ROWS;
const LOOP_SECONDS = 12;

type Particle = {
  x: number;
  y: number;
  gx: number;
  gy: number;
  ax: number;
  ay: number;
  px: number;
  py: number;
  sp: number;
  o: number;
  el: SVGRectElement;
};

export default function Hero() {
  const fieldRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = fieldRef.current;
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const NS = "http://www.w3.org/2000/svg";
    let timeline: ReturnType<typeof animate> | null = null;

    const scope = createScope({ root: svg }).add(() => {
      const rand = createSeededRandom(Date.now() % 2147483647);
      const particles: Particle[] = [];
      const group = document.createElementNS(NS, "g");

      for (let i = 0; i < COUNT; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS) % ROWS;
        const el = document.createElementNS(NS, "rect") as SVGRectElement;
        el.setAttribute("width", "3");
        el.setAttribute("height", "3");
        const accent = rand(0, 1, 2) > 0.78;
        el.setAttribute("fill", accent ? "var(--ink2)" : "var(--ink1)");
        const o = 0.14 + rand(0, 1, 3) * 0.26;
        el.setAttribute("opacity", String(o));
        group.appendChild(el);
        particles.push({
          x: rand(0, 1, 3) * 1200,
          y: rand(0, 1, 3) * 800,
          gx: 100 + col * (1000 / (COLS - 1)),
          gy: 110 + row * (580 / (ROWS - 1)),
          ax: 10 + rand(0, 1, 3) * 26,
          ay: 8 + rand(0, 1, 3) * 20,
          px: rand(0, 1, 3) * 6.28,
          py: rand(0, 1, 3) * 6.28,
          sp: 0.1 + rand(0, 1, 3) * 0.26,
          o,
          el,
        });
      }

      const lineGroup = document.createElementNS(NS, "g");
      lineGroup.setAttribute("opacity", "0");
      for (let r = 0; r < ROWS; r++) {
        const line = document.createElementNS(NS, "line");
        const y = 110 + r * (580 / (ROWS - 1));
        line.setAttribute("x1", "100");
        line.setAttribute("x2", "1100");
        line.setAttribute("y1", String(y));
        line.setAttribute("y2", String(y));
        line.setAttribute("stroke", "var(--ink1)");
        line.setAttribute("stroke-width", ".6");
        lineGroup.appendChild(line);
      }

      svg.appendChild(lineGroup);
      svg.appendChild(group);

      const driver = { t: 0 };
      timeline = animate(driver, {
        t: LOOP_SECONDS,
        duration: LOOP_SECONDS * 1000,
        ease: "linear",
        loop: true,
        onUpdate: () => {
          const t = driver.t;
          let snap = 0;
          if (t > 5.5 && t <= 7) {
            const u = (t - 5.5) / 1.5;
            snap = u * u * (3 - 2 * u);
          } else if (t > 7 && t <= 8.4) {
            snap = 1;
          } else if (t > 8.4 && t <= 10.4) {
            const u = 1 - (t - 8.4) / 2;
            snap = u * u;
          }
          for (const p of particles) {
            const dx = p.x + Math.sin(t * p.sp + p.px) * p.ax;
            const dy = p.y + Math.cos(t * p.sp * 1.3 + p.py) * p.ay;
            const x = dx + (p.gx - dx) * snap;
            const y = dy + (p.gy - dy) * snap;
            p.el.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`);
            p.el.setAttribute("opacity", (p.o * (1 + snap * 1.2)).toFixed(3));
          }
          lineGroup.setAttribute("opacity", (snap * 0.1).toFixed(3));
        },
      });
    });

    const onVisibility = () => {
      if (!timeline) return;
      if (document.hidden) timeline.pause();
      else timeline.play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      scope.revert();
    };
  }, []);

  return (
    <section className="relative grid min-h-[88svh] content-center gap-[clamp(22px,4vh,40px)] px-[clamp(18px,5vw,64px)] py-[clamp(40px,8vh,90px)] pb-[clamp(48px,8vh,80px)] max-w-[1500px] mx-auto w-full">
      <svg
        ref={fieldRef}
        data-decor
        aria-hidden="true"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      <div className="relative z-10 grid gap-[clamp(20px,3.5vh,36px)]">
        <span className="font-mono text-[clamp(9px,1vw,11px)] font-light uppercase text-dim">
          {identity.positioning}
        </span>
        <h1 className="m-0 font-display text-[clamp(3.2rem,12vw,11rem)] font-extrabold leading-[0.85] tracking-[-0.045em]">
          Fadi
          <br />
          <span style={{ color: "var(--ink1)" }}>Thomas</span>
          <span style={{ color: "var(--ink2)" }}>.</span>
        </h1>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-end gap-[clamp(20px,4vw,64px)] border-t-2 border-fg pt-5">
          <p className="m-0 max-w-[26ch] text-[clamp(1.05rem,1.8vw,1.45rem)] leading-[1.4] text-balance">
            {identity.hook}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/cv/fadi-thomas-cv.pdf"
              download="Fadi-Thomas-CV.pdf"
              className="inline-flex min-h-12 items-center gap-2 bg-ink1 px-5 py-4 font-mono text-[10px] font-medium uppercase text-on-ink no-underline transition-colors hover:bg-ink2"
            >
              Download CV ↓
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center border-2 border-fg px-5 py-[15px] font-mono text-[10px] font-medium uppercase text-fg no-underline transition-colors hover:bg-fg hover:text-bg"
            >
              Get in touch
            </a>
            <span className="pl-1.5 font-mono text-[10px] font-light uppercase text-dim">
              {identity.locationShort}
            </span>
          </div>
        </div>
      </div>
      <div
        data-decor
        aria-hidden="true"
        className="relative z-10 flex items-center gap-2 font-mono text-[10px] font-light uppercase text-dim"
      >
        <span className="animate-cue">↓</span> Scroll
      </div>
    </section>
  );
}
