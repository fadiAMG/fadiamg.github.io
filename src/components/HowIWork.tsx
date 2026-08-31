"use client";

import SectionHeading from "./SectionHeading";
import { useLocale } from "@/lib/locale";


export default function HowIWork() {
  const { t } = useLocale();
  const howIWork = t.howIWork;
  return (
    <section className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(40px,8vh,100px)]">
      <SectionHeading number="02" label="How I work" />
      <div className="mt-[clamp(28px,5vh,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] gap-px border-2 border-fg bg-hair">
        {howIWork.map((panel) => (
          <div key={panel.tag} className="grid content-start gap-3.5 bg-bg p-[clamp(22px,3vw,34px)]">
            <span className="font-mono text-[10px] font-medium uppercase" style={{ color: "var(--ink1)" }}>
              {panel.tag}
            </span>
            <h3 className="m-0 font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              {panel.title}
            </h3>
            <p className="m-0 text-[0.98rem] leading-[1.58] text-dim text-balance">{panel.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
