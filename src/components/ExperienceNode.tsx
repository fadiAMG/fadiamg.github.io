"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion-preference";
import type { Role } from "@/data/resume";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const dotVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.12 } },
};

export default function ExperienceNode({ role, isLast }: { role: Role; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const [ignited, setIgnited] = useState(false);
  const reduced = usePrefersReducedMotion();

  const hasDetail = Boolean(role.context || role.owned.length || role.impact || role.stack.length);
  const detailId = `role-detail-${role.company.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <>
      <div className="col-start-1 flex justify-center pt-2.5" data-node>
        <motion.span
          initial={reduced ? false : "hidden"}
          animate={ignited || reduced ? "show" : "hidden"}
          variants={dotVariants}
          className="block h-3 w-3 border-2 transition-colors duration-[400ms] ease-linear"
          style={{
            borderColor: ignited || reduced ? "var(--ink2)" : "var(--hair)",
            background: ignited || reduced ? "var(--ink2)" : "var(--bg)",
          }}
        />
      </div>
      <motion.div
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        animate={reduced ? "show" : undefined}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -15% 0px" }}
        onViewportEnter={() => setIgnited(true)}
        variants={contentVariants}
        data-body-wrap
        className={`col-start-2 ${
          isLast ? "" : "mb-[clamp(28px,4vh,48px)] border-b border-hair pb-[clamp(28px,4vh,48px)]"
        }`}
      >
          <button
            type="button"
            onClick={() => hasDetail && setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={hasDetail ? detailId : undefined}
            className="grid w-full box-border cursor-pointer gap-2 border-0 bg-transparent p-0 text-left"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 font-mono text-[10px] font-light uppercase text-dim">
              <span style={{ color: "var(--ink2)" }}>{role.dates}</span>
              {role.location && <span>{role.location}</span>}
            </div>
            <h3 className="m-0 flex items-baseline justify-between gap-3.5 font-display text-[clamp(1.5rem,3.4vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              <span>
                {role.company} — {role.title}
              </span>
              {hasDetail && (
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="inline-block font-mono text-sm font-light"
                  style={{ color: "var(--ink1)" }}
                >
                  +
                </motion.span>
              )}
            </h3>
            <p className="m-0 max-w-[60ch] text-[1.02rem] leading-[1.55] text-dim text-balance">{role.summary}</p>
          </button>

          {hasDetail && (
            <motion.div
              initial={false}
              animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
              style={{ overflow: "hidden" }}
              data-body
              id={detailId}
            >
              <div className="grid gap-5 pt-6">
                {role.context && (
                  <div className="grid gap-2">
                    <span className="font-mono text-[10px] font-medium uppercase" style={{ color: "var(--ink1)" }}>
                      Context
                    </span>
                    <p className="m-0 max-w-[64ch] text-base leading-[1.6] text-dim text-balance">{role.context}</p>
                  </div>
                )}
                {role.owned.length > 0 && (
                  <div className="grid gap-2.5">
                    <span className="font-mono text-[10px] font-medium uppercase" style={{ color: "var(--ink1)" }}>
                      What I owned
                    </span>
                    <ul className="m-0 grid max-w-[66ch] list-disc gap-2.5 pl-[18px] text-base leading-[1.55] text-fg">
                      {role.owned.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {role.impact && (
                  <div className="grid gap-2">
                    <span className="font-mono text-[10px] font-medium uppercase" style={{ color: "var(--ink2)" }}>
                      Impact
                    </span>
                    <p className="m-0 max-w-[60ch] text-[1.02rem] leading-[1.55]">{role.impact}</p>
                  </div>
                )}
                {role.stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {role.stack.map((tech) => (
                      <span
                        key={tech}
                        className="border border-hair px-2.5 py-[7px] font-mono text-[10px] font-light uppercase text-dim"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
      </motion.div>
    </>
  );
}
