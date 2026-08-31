import SectionHeading from "./SectionHeading";
import RevealCopy from "./RevealCopy";
import { profile } from "@/data/resume";

export default function AboutReveal() {
  return (
    <section className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(70px,14vh,170px)]">
      <SectionHeading number="01" label="Profile" />
      <RevealCopy
        text={profile.lead}
        className="m-0 mt-[clamp(28px,5vh,56px)] max-w-[24ch] font-display text-[clamp(28px,5.2vw,76px)] font-extrabold leading-[1.02] tracking-[-0.035em]"
      />
      <div className="mt-[clamp(34px,6vh,72px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(20px,4vw,64px)]">
        {profile.paragraphs.map((p) => (
          <RevealCopy
            key={p}
            text={p}
            className="m-0 max-w-[52ch] text-[1.02rem] leading-[1.6] text-dim"
          />
        ))}
      </div>
    </section>
  );
}
