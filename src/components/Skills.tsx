"use client";

import SectionHeading from "./SectionHeading";
import { useLocale } from "@/lib/locale";


export default function Skills() {
  const { t } = useLocale();
  const skills = t.skills;
  return (
    <section className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(40px,8vh,100px)]">
      <SectionHeading number="05" label="Skills" />
      <dl className="m-0 mt-[clamp(26px,5vh,52px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(18px,3vw,40px)]">
        {skills.map((group) => (
          <div key={group.label} className="grid gap-2 border-t border-hair pt-3">
            <dt
              className="font-mono text-[10px] font-medium uppercase"
              style={{ color: group.signal ? "var(--ink2)" : "var(--ink1)" }}
            >
              {group.label}
            </dt>
            <dd className="m-0 font-mono text-[11px] font-light leading-[2] text-fg">{group.items}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
