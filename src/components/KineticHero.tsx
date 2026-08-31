"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, splitText, stagger, utils } from "animejs";
import { motion, useScroll, useTransform } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/motion-preference";
import FlowField from "./FlowField";
import Magnetic from "./Magnetic";
import { useLocale } from "@/lib/locale";

/**
 * Hero: masked per-character type reveal over a generative flow field, with the
 * whole block drifting on scroll.
 *
 * anime.js `splitText` with `chars: { wrap: true }` emits an overflow-clipped
 * wrapper per character, which is what makes the line-reveal read as type
 * rising out of the baseline rather than fading in place. `accessible: true`
 * keeps the original string exposed to assistive tech — split text is otherwise
 * read character by character.
 */
export default function KineticHero() {
  const { t } = useLocale();
  const identity = t.identity;
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end start"],
  });
  const driftY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    const splits = [
      splitText(el.querySelectorAll<HTMLElement>("[data-split-chars]"), {
        words: false,
        chars: { wrap: true },
        accessible: true,
      }),
      splitText(el.querySelectorAll<HTMLElement>("[data-split-words]"), {
        words: { wrap: true },
        chars: false,
        accessible: true,
      }),
    ];

    const chars = splits[0].chars;
    const words = splits[1].words;

    utils.set(chars, { y: "110%", opacity: 0 });
    utils.set(words, { y: "120%" });
    utils.set(el.querySelectorAll("[data-rise]"), { y: 26, opacity: 0 });

    const tl = createTimeline({ defaults: { ease: "out(3)" } })
      .add(chars, {
        y: ["110%", "0%"],
        opacity: [0, 1],
        duration: 1150,
        ease: "out(4)",
        delay: stagger(26, { from: "first" }),
      })
      .add(
        words,
        { y: ["120%", "0%"], duration: 900, delay: stagger(38) },
        "-=750",
      )
      .add(
        el.querySelectorAll("[data-rise]"),
        { y: [26, 0], opacity: [0, 1], duration: 750, delay: stagger(90) },
        "-=600",
      );

    return () => {
      tl.revert();
      splits.forEach((s) => s.revert());
    };
  }, [reduced]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-[clamp(18px,5vw,64px)] pt-[clamp(80px,14vh,140px)] pb-[clamp(40px,8vh,90px)]"
    >
      <FlowField className="opacity-[0.55]" />

      <motion.div
        style={reduced ? undefined : { y: driftY, opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-[1500px]"
      >
        <p
          data-split-words
          className="font-mono text-[clamp(10px,1.1vw,13px)] uppercase tracking-[0.22em] text-dim"
        >
          {identity.positioning}
        </p>

        <h1 className="mt-[clamp(18px,3vh,34px)] font-display text-[clamp(60px,13.5vw,230px)] font-extrabold leading-[0.84] tracking-[-0.045em]">
          <span data-split-chars className="block">Fadi</span>
          <span data-split-chars className="block text-ink1">
            Thomas<span className="text-ink2">.</span>
          </span>
        </h1>

        <div className="mt-[clamp(26px,5vh,52px)] h-px w-full bg-fg/70" />

        <div className="mt-[clamp(20px,3.5vh,36px)] flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p
            data-split-words
            className="max-w-[26ch] text-[clamp(19px,2.1vw,30px)] leading-[1.25]"
          >
            {identity.hook}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                data-rise
                href={t.cvPath}
                download={t.cvFilename}
                className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden bg-ink1 px-6 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-on-ink no-underline"
              >
                <span className="relative z-10">{t.ui.downloadCv}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink2 transition-transform duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
              </a>
            </Magnetic>

            <Magnetic>
              <a
                data-rise
                href="#contact"
                className="group relative inline-flex min-h-12 items-center overflow-hidden border-2 border-fg px-6 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.14em] !text-fg no-underline"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-on-ink">
                  {t.ui.getInTouch}
                </span>
                <span className="absolute inset-0 origin-left scale-x-0 bg-fg transition-transform duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
              </a>
            </Magnetic>

            <span
              data-rise
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim"
            >
              {identity.locationShort}
            </span>
          </div>
        </div>
      </motion.div>

      <ScrollCue reduced={reduced} label={t.ui.scroll} />
    </section>
  );
}

function ScrollCue({ reduced, label }: { reduced: boolean; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current?.querySelector("[data-cue-line]");
    if (!el) return;
    const a = animate(el, {
      scaleY: [0, 1],
      transformOrigin: ["50% 0%", "50% 0%"],
      duration: 1100,
      ease: "inOut(3)",
      loop: true,
      alternate: true,
    });
    return () => { a.revert(); };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-decor
      className="pointer-events-none absolute bottom-[clamp(20px,4vh,44px)] left-[clamp(18px,5vw,64px)] z-10 flex items-center gap-3"
    >
      <span data-cue-line className="block h-10 w-px bg-fg/50" />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">{label}</span>
    </div>
  );
}
