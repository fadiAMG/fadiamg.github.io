"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import { selectedWork } from "@/data/resume";

export default function SelectedWork() {
  return (
    <section id="work" className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(48px,9vh,110px)]">
      <SectionHeading number="04" label="Selected work" />
      <div className="mt-[clamp(28px,5vh,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(14px,2vw,26px)]">
        {selectedWork.map((project) => (
          <motion.article
            key={project.title}
            className="grid content-start gap-4 border-2 border-fg bg-bg p-[clamp(22px,3vw,34px)] text-fg transition-colors duration-300 hover:bg-ink1 hover:text-on-ink"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="font-mono text-[10px] font-light uppercase opacity-70">{project.tag}</span>
            <h3 className="m-0 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-none tracking-[-0.04em]">
              {project.title}
            </h3>
            <p className="m-0 text-[0.98rem] leading-[1.55] text-balance">{project.body}</p>
            <span className="font-mono text-[10px] font-light uppercase leading-[1.7] opacity-80">
              {project.stack}
            </span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
