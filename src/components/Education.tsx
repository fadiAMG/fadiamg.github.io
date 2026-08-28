import SectionHeading from "./SectionHeading";
import { certifications, education, languages } from "@/data/resume";

export default function Education() {
  return (
    <section className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(40px,8vh,100px)]">
      <SectionHeading number="06" label="Education & recognition" />
      <div className="mt-[clamp(26px,5vh,52px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(20px,4vw,56px)]">
        <div className="grid content-start gap-[22px]">
          {education.map((edu) => (
            <div key={edu.title} className="grid gap-1.5">
              <span className="font-mono text-[10px] font-light uppercase" style={{ color: "var(--ink2)" }}>
                {edu.dates}
              </span>
              <h3 className="m-0 font-display text-[clamp(1.2rem,2vw,1.5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                {edu.title}
              </h3>
              <span className="text-[0.98rem] text-dim">{edu.place}</span>
            </div>
          ))}
        </div>
        <div className="grid content-start gap-[18px]">
          <div className="grid gap-2">
            <span className="font-mono text-[10px] font-medium uppercase" style={{ color: "var(--ink1)" }}>
              Certifications
            </span>
            <p className="m-0 font-mono text-[11px] font-light leading-[2] text-fg">{certifications}</p>
          </div>
          <div className="grid gap-2">
            <span className="font-mono text-[10px] font-medium uppercase" style={{ color: "var(--ink1)" }}>
              Languages
            </span>
            <p className="m-0 font-mono text-[11px] font-light leading-[2] text-fg">{languages}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
