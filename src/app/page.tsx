import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Education from "@/components/Education";
import ExperienceDial from "@/components/ExperienceDial";
import GrainOverlay from "@/components/GrainOverlay";
import Header from "@/components/Header";
import HorizontalDeck, { type Chapter } from "@/components/HorizontalDeck";
import HowIWork from "@/components/HowIWork";
import KineticHero from "@/components/KineticHero";
import Preloader from "@/components/Preloader";
import RevealCopy from "@/components/RevealCopy";
import ScrollRail from "@/components/ScrollRail";
import SectionHeading from "@/components/SectionHeading";
import ShapeField from "@/components/ShapeField";
import Skills from "@/components/Skills";
import WorkGallery from "@/components/WorkGallery";
import { profile } from "@/data/resume";

/**
 * Chapter content sits in a fixed-height panel, so the section components'
 * own vertical padding would double-count against the viewport and push
 * content under the chapter index. Neutralised here rather than in each
 * component, which still needs its padding in the vertical fallback layout.
 */
const PANEL = "relative z-10 mx-auto w-full max-w-[1300px] [&_section]:py-0 [&_section]:my-0";

/**
 * Each chapter carries its own generative motif, so the shape language changes
 * as you travel and your position in the deck is legible from the pattern alone.
 */
const CHAPTERS: Chapter[] = [
  { id: "intro", label: "Intro", node: <KineticHero /> },
  {
    id: "profile",
    label: "Profile",
    node: (
      <>
        <ShapeField name="phyllotaxis" seed={11} className="opacity-[0.55]" drift={-60} mask="right" />
        <div className={PANEL}>
          <SectionHeading number="01" label="Profile" />
          <RevealCopy
            text={profile.lead}
            className="m-0 mt-[clamp(18px,3vh,36px)] max-w-[26ch] font-display text-[clamp(24px,3.2vw,50px)] font-extrabold leading-[1.05] tracking-[-0.035em]"
          />
          <div className="mt-[clamp(18px,3vh,36px)] grid gap-[clamp(18px,3vw,48px)] md:grid-cols-2">
            {profile.paragraphs.map((p) => (
              <RevealCopy
                key={p}
                text={p}
                className="m-0 max-w-[46ch] text-[0.95rem] leading-[1.6] text-dim"
              />
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    id: "approach",
    label: "Approach",
    node: (
      <>
        <ShapeField name="truchet" seed={23} className="opacity-[0.4]" drift={70} mask="edges" />
        <div className={PANEL}><HowIWork /></div>
      </>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    node: (
      <>
        <ShapeField name="isometric" seed={5} className="opacity-[0.4]" drift={-80} mask="edges" />
        <div className={`${PANEL} flex h-full min-h-0 flex-col`}>
          <SectionHeading number="03" label="Experience" />
          <div className="mt-[clamp(10px,1.6vh,24px)] min-h-0 flex-1">
            <ExperienceDial />
          </div>
        </div>
      </>
    ),
  },
  {
    id: "work",
    label: "Work",
    node: (
      <>
        <ShapeField name="mesh" seed={17} className="opacity-[0.45]" drift={64} mask="edges" />
        <div className={PANEL}>
          <SectionHeading number="04" label="Selected work" />
          <div className="mt-[clamp(14px,2vh,28px)]"><WorkGallery /></div>
        </div>
      </>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    node: (
      <>
        <ShapeField name="interference" seed={31} className="opacity-[0.34]" drift={-56} mask="edges" />
        <div className={PANEL}><Skills /></div>
      </>
    ),
  },
  {
    id: "education",
    label: "Education",
    node: (
      <>
        <ShapeField name="phyllotaxis" seed={47} className="opacity-[0.45]" drift={58} mask="left" />
        <div className={PANEL}><Education /></div>
      </>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    node: (
      <>
        <ShapeField name="lissajous" seed={3} className="opacity-[0.5]" drift={50} mask="right" />
        <div className={PANEL}><Contact /></div>
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollRail />
      <Cursor />
      <GrainOverlay />
      <Header />
      <main id="main">
        <HorizontalDeck chapters={CHAPTERS} />
      </main>
    </>
  );
}
