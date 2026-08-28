import SectionHeading from "./SectionHeading";
import { profile } from "@/data/resume";

export default function About() {
  return (
    <section className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(56px,10vh,120px)]">
      <SectionHeading number="01" label="Profile" />
      <p className="m-0 mt-[clamp(28px,5vh,56px)] max-w-[44ch] text-[clamp(1.15rem,2.2vw,1.75rem)] leading-[1.42] text-balance">
        {profile.lead}
      </p>
      <div className="mt-[clamp(28px,5vh,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(20px,4vw,64px)]">
        {profile.paragraphs.map((p) => (
          <p key={p} className="m-0 max-w-[52ch] text-[1.02rem] leading-[1.6] text-dim text-balance">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
